declare global {
    namespace NodeJS {
        interface ProcessEnv {
            NODE_ENV: 'development' | 'staging' | 'production';
            PORT?: string;
            MONGO_URI: string;
            ACCESS_TOKEN_SECRET: string;
            REFRESH_TOKEN_SECRET: string;
            JWT_REFRESH_TOKEN_EXPIRE: string;
            JWT_ACCESS_TOKEN_EXPIRE: string;
            COOKIE_EXPIRE: string;
            CORS_ORIGINS: string; //JSON objects in string format
        }
    }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export { }