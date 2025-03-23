import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export const config = {
  baseUrl: process.env.BASE_URL || 'https://opensource-demo.orangehrmlive.com',
  credentials: {
    username: process.env.DEFAULT_USERNAME || 'Admin',
    password: process.env.DEFAULT_PASSWORD || 'admin123'
  },
  timeout: {
    short: 5000,
    medium: 10000,
    long: 30000
  },
  environment: process.env.TEST_ENV || 'demo'
};
