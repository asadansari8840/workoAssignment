import {Router} from 'express';
import {injectable} from 'tsyringe';
import {UserController} from '../controller/user-controller';
import {AuthMiddleware} from '../middlewares/auth';

@injectable()
export default class UserRouter {
    private router: Router;
    constructor(private userController: UserController, private middlewares: AuthMiddleware) {
        this.router = Router();
        this.init();
    }
    public getRouter(): Router {
        return this.router;
    }
    private init = () => {
        this.router.get('/list', this.middlewares.isAuthenticated, this.middlewares.isAdmin, this.userController.getAllUsers);
        this.router.put('/update/:userId', this.middlewares.isAuthenticated, this.userController.updateUser);
        this.router.delete('/delete/:userId', this.middlewares.isAuthenticated, this.userController.deleteUser);
        this.router.post('/login', this.userController.loginUser);
        this.router.post('/create', this.userController.createUser);
        this.router.get('/logout', this.userController.logOutUser);
        this.router.get('/:userId', this.middlewares.isAuthenticated, this.userController.getUserByUserId);
    };
}
