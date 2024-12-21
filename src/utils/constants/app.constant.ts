// src/utils/constants/app.constants.ts
export const APP_NAME = 'Hono API';
export const API_VERSION = 'v1.0.0';
export const DEFAULT_PAGE_SIZE = 10;
export const DEFAULT_PAGE = 1;
export const DEFAULT_SEEDER_VALUE = 100;
export const ACCESS_TOKEN_DURATION = 1 * 1 * 60 * 60 // Token expires in 1 hour
export const REFRESH_TOKEN_DURATION = 30 * 24 * 60 * 60 // Token expires in 30 days
export const ACCESS_TOKEN_SECRET_KEY = Bun.env.ACCESS_TOKEN_SECRET_KEY
export const REFRESH_TOKEN_SECRET_KEY = Bun.env.REFRESH_TOKEN_SECRET_KEY