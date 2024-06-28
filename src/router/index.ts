import {Router} from 'express';
import {injectable} from 'tsyringe';
import UserRouter from './user-router';

@injectable()
export default class AppRouter {
    private router: Router;
    constructor(private userRouter: UserRouter) {
        this.router = Router();
        this.init();
    }
    getRouter(): Router {
        return this.router;
    }
    private init = () => {
        this.router.use('/user', this.userRouter.getRouter());
    };
}
