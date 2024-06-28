import ErrorHandler from '@utils/error-handler';
import {Request, Response, NextFunction} from 'express';

type errorTP = {
    statusCode: number;
    message: string;
    name?: string;
    code?: Number;
    path?: String;
    keyValue?: object | undefined;
    notify?: boolean;
};

const errorMiddleware = async (err: errorTP, req: Request, res: Response, next: NextFunction) => {
    err.message = err.message || 'Internal Server Error';
    err.statusCode = err.statusCode || 500;
    err.notify = err.notify || false;

    //Wrong mongo db id error
    if (err.name === 'CastError') {
        const message = `Resource not found. Invalid : ${err.path}`;
        err = new ErrorHandler(message, 400);
    }

    //Mongoose Duplicate key error
    if (err.code === 11000 && err.keyValue !== undefined) {
        const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
        err = new ErrorHandler(message, 400);
    }

    //Wrong JWT error
    if (err.name === 'JsonWebTokenError') {
        const message = `Unauthenticated user.`;
        err = new ErrorHandler(message, 401);
    }

    //Jwt exxpire error
    if (err.name === 'TokenExpiredError') {
        const message = `Unauthenticated user.`;
        err = new ErrorHandler(message, 401);
    }

    return res.status(err.statusCode).json({
        success: false,
        message: err.message,
        notify: err.notify,
    });
};

export default errorMiddleware;
