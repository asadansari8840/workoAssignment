declare global {
    namespace Express {
        interface Request {
            user?: {
                _id: string;
                email: string;
                role?: 'admin';
                iat: number;
                exp: number;
            };
        }
    }
}

export {};
