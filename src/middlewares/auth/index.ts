import {injectable} from 'tsyringe';
import {verify} from 'jsonwebtoken';
import {NextFunction, Request, Response} from 'express';
import ErrorHandler from '@utils/error-handler';

@injectable()
export class AuthMiddleware {
    constructor() {}
    public isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
        const accessToken: string | undefined = req.header('Authorization')?.replace('Bearer ', '');
        if (!accessToken) {
            return next(new ErrorHandler('Unauthenticated user', 401, true));
        }
        const token = verify(accessToken, process.env.ACCESS_TOKEN_JWT_PRIVATE_KEY!) as any;
        if (!token) {
            return next(new ErrorHandler('Unauthenticated user', 401, true));
        }
        req.user = token;
        next();
    };
    public isAdmin = (req: Request, res: Response, next: NextFunction) => {
        if (req.user?.role == 'admin') {
            next();
        } else {
            return next(new ErrorHandler('User dont have correct access rights', 403, true));
        }
    };
}
