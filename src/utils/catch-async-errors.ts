import {Request, Response, NextFunction} from 'express';

type asyncFuncTP = (req: Request, res: Response, next: NextFunction) => {};

const catchAsyncError = (asyncFunction: asyncFuncTP) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(asyncFunction(req, res, next)).catch(next);
};

export default catchAsyncError;
