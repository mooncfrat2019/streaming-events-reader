import env from 'dotenv';

env.config();

export const config = {
    PORT: process.env.BACKEND_PORT || 6001,
    INSTANCES: process.env.INSTANCES,
    DB_NAME: process.env.DB_NAME || 'test',
    DB_PASS: process.env.DB_PASS || '123',
    DB_HOST: process.env.DB_HOST || 'localhost',
    DB_USER_NAME: process.env.DB_USER_NAME || 'test',
    SERVICE_KEY: process.env.SERVICE_KEY || ''
}