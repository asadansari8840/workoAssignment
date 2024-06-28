import UserDAO from '@dao/user-dao';
import {validateUpdateUserData, validateUser} from '@schemas/user-schema';
import catchAsyncError from '@utils/catch-async-errors';
import ErrorHandler from '@utils/error-handler';
import {sendUser} from '@utils/send-user';
import {injectable} from 'tsyringe';

@injectable()
export class UserController {
    constructor(private userDao: UserDAO) {}
    public getAllUsers = catchAsyncError(async (req, res) => {
        const page = (req.query.page as string) || '1';
        const onlyActiveUser = req.query.onlyActive;
        const limit = req.query.limit;

        const {totalUsers, users, currentPage} = await this.userDao.getAllUsers(Number(page), Number(limit), !!onlyActiveUser);

        res.status(200).json({
            success: true,
            data: {
                users,
                totalUsers,
                currentPage,
            },
            message: 'Users',
            notify: true,
        });
    });
    public getUserByUserId = catchAsyncError(async (req, res, next) => {
        const userId = req.params.userId;
        if (!userId) {
            return next(new ErrorHandler('User id missing', 404, true));
        }
        const {user} = await this.userDao.getUserByUserId(userId);
        return res.status(200).json({
            success: true,
            data: {
                user,
            },
            message: 'User details fetced successfully',
        });
    });
    public createUser = catchAsyncError(async (req, res, next) => {
        const {userData} = req.body;
        const validUserData = await validateUser(userData);
        const {user} = await this.userDao.createUser(validUserData);
        sendUser(user, res, 'User created successfully');
    });

    public updateUser = catchAsyncError(async (req, res, next) => {
        const userId = req.params.userId;
        if (!userId) {
            return next(new ErrorHandler('User id is missing', 404, true));
        }
        const {updateData} = req.body;
        const validatedData = await validateUpdateUserData(updateData);
        const {isUpdated} = await this.userDao.updateUser(userId, validatedData);

        return res.status(200).json({
            success: true,
            message: 'User updated successfully',
            data: {
                isUpdated,
            },
            notify: true,
        });
    });

    public loginUser = catchAsyncError(async (req, res, next) => {
        const {email, password} = req.body;
        if (!email || !password) {
            return next(new ErrorHandler('Please enter a valid email and password', 401, true));
        }
        const {user} = await this.userDao.loginUser(email, password);
        sendUser(user, res, 'Logged in successfully.');
    });

    public logOutUser = catchAsyncError(async (req, res, next) => {
        const {refresh_token} = req.cookies;
        if (!refresh_token) {
            return next(new ErrorHandler('Something went wrong while loggin out', 400));
        }

        return res.clearCookie('refresh_token').status(200).json({
            success: false,
            message: 'Logged out successfully.',
        });
    });

    public deleteUser = catchAsyncError(async (req, res, next) => {
        const userId = req.params.userId;
        if (!userId) {
            return next(new ErrorHandler('User id is missing', 404, true));
        }
        const {isDeleted} = await this.userDao.deleteUser(userId);
        return res.status(200).json({
            success: true,
            message: 'User deleted successfully',
            data: {
                isDeleted,
            },
            notify: true,
        });
    });
}
