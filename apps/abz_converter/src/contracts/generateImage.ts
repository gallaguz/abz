import { IsString } from 'class-validator';

export namespace GenerateImage {
  export class Request {
    @IsString()
    image: string;
  }

  export class Response {
    image: string;
  }
}
