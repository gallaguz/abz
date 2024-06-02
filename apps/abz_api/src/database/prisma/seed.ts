import { writeFile } from 'fs/promises';
import { join } from 'path';
import * as process from 'process';

import { fakerUK } from '@faker-js/faker';
import { Positions, Prisma, PrismaClient, User } from '@prisma/client';
import { createCanvas } from 'canvas';
import { ensureDir } from 'fs-extra';
import { v4 as uuidv4 } from 'uuid';

const wait = (ms: number): Promise<void> => new Promise(r => setTimeout(r, ms));

fakerUK.seed(Number(process.env.API_FAKER_SEED_FACTOR) || 42);

const prisma = new PrismaClient();

const POSITIONS = [
    { name: 'Lawyer' },
    { name: 'Content manager' },
    { name: 'Security' },
    { name: 'Designer' },
];

const USERS_COUNT = Number(process.env.API_SEED_USERS_COUNT);

const uploadDir = process.env.API_UPLOAD_FOLDER_PATH;

function getRandomNumber(min: number, max: number): number {
    return Math.random() * (max - min) + min;
}

async function generateFace(number: number): Promise<string> {
    await wait(200);

    const width = 70;
    const height = 70;
    const canvas = createCanvas(width, height);
    const context = canvas.getContext('2d');

    // Background (random skin color)
    const skinColors = ['#f0eada', '#e0c9b5', '#d4aa89'];
    context.fillStyle =
        skinColors[Math.floor(Math.random() * skinColors.length)];
    context.fillRect(0, 0, width, height);

    // Draw face (random size and position)
    const centerX = width / 2;
    const centerY = height / 2;
    const faceRadius = getRandomNumber(20, 25); // Smaller face radius
    context.fillStyle = '#ffe0bd'; // Face color
    context.beginPath();
    context.arc(centerX, centerY, faceRadius, 0, 2 * Math.PI);
    context.fill();

    // Draw eyes (random size and position)
    const eyeRadius = getRandomNumber(3, 7); // Smaller eye radius
    const eyeOffsetX = getRandomNumber(-8, 8); // Reduced offset range
    const eyeOffsetY = getRandomNumber(-8, 8); // Reduced offset range
    context.fillStyle = '#000000'; // Eye color
    context.beginPath();
    context.arc(
        centerX - 12 + eyeOffsetX,
        centerY - 12 + eyeOffsetY,
        eyeRadius,
        0,
        2 * Math.PI,
    );
    context.arc(
        centerX + 12 + eyeOffsetX,
        centerY - 12 + eyeOffsetY,
        eyeRadius,
        0,
        2 * Math.PI,
    );
    context.fill();

    // Draw mouth (random shape and position)
    const mouthWidth = getRandomNumber(14, 24); // Smaller mouth width
    const mouthHeight = getRandomNumber(5, 10); // Smaller mouth height
    const mouthOffsetY = getRandomNumber(10, 15); // Adjusted offset
    context.beginPath();
    context.moveTo(centerX - mouthWidth / 2, centerY + mouthOffsetY);
    context.quadraticCurveTo(
        centerX,
        centerY + mouthHeight + mouthOffsetY,
        centerX + mouthWidth / 2,
        centerY + mouthOffsetY,
    );
    context.stroke();

    // Draw index text
    context.fillStyle = '#000000';
    context.font = '10px Arial'; // Smaller font size
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(number.toString(), width / 2, height / 2);

    if (!uploadDir) throw new Error('API_UPLOAD_FOLDER_PATH not set');

    // Save image
    const filename = `${uuidv4()}.jpeg`;
    const filePath = join(uploadDir, filename);
    await ensureDir(uploadDir);
    const buffer = canvas.toBuffer('image/jpeg');
    await writeFile(filePath, buffer);

    return filename;
}

const getPositions = async (): Promise<Array<{ id: Positions['id'] }>> => {
    let positions: Array<{ id: Positions['id'] }> = [];

    positions = [
        ...(await prisma.positions.createManyAndReturn({
            data: POSITIONS,
            select: { id: true },
            skipDuplicates: true,
        })),
    ];

    if (!positions.length) {
        positions = [
            ...(await prisma.positions.findMany({
                select: {
                    id: true,
                },
            })),
        ];
    }

    return positions;
};

const createUsers = async (
    positions: Array<{ id: User['id'] }>,
): Promise<Prisma.BatchPayload> => {
    const data = [];
    for (let index = 1; index <= USERS_COUNT; index++) {
        const photo = await generateFace(index);
        const created_at = new Date();
        const updated_at = new Date();
        const userData = {
            name: fakerUK.person.firstName(),
            email: fakerUK.internet.email(),
            phone: fakerUK.helpers.fromRegExp('+380[0-9]{9}'),
            photo,
            position_id: fakerUK.helpers.arrayElement(positions).id,
            created_at,
            updated_at,
        };
        console.log(index, userData);
        data.push(userData);
    }

    return prisma.user.createMany({
        data: data,
        skipDuplicates: true,
    });
};

async function main(): Promise<void> {
    const positionsCount = await prisma.positions.count();
    const usersCount = await prisma.user.count();

    if (usersCount >= USERS_COUNT && positionsCount > 0) {
        console.log('--- DB already seeded');
        return;
    }

    const positions: Array<{ id: Positions['id'] }> = await getPositions();
    await createUsers(positions);
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
