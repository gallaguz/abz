const express = require('express');
const app = express();
const port = Number(process.env.MOCK_SERVER_PORT) || 3333;

app.get('/api/v1/healthcheck', (req, res) => {
    res.status(200).json({ health: true });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

