import {injectable} from 'tsyringe';
import ErrorHandler from '../utils/error-handler';
import UserModel from '../models/user-model';

@injectable()
class UserDAO {
    public getUserByUserId = async (userId: string) => {
        try {
            const user = await UserModel.findOne({_id: userId, isActive: true});
            if (!user) {
                throw new ErrorHandler('Invalid user id or user not found', 404, true);
            }
            return {
                user,
            };
        } catch (error) {
            throw new ErrorHandler('Something went wrong while getting user', 400, true);
        }
    };
    public getAllUsers = async (page: number = 1, limit: number = 10, onlyActiveUsers = false) => {
        try {
            const skip = (page - 1) * limit;
            const query = onlyActiveUsers ? {isActive: true} : {};
            const totalUsers = await UserModel.countDocuments(); // Total count of users in the database
            const users = await UserModel.find(query).limit(limit).skip(skip);

            return {
                users,
                totalUsers,
                currentPage: page,
            };
        } catch (error) {
            throw new ErrorHandler('Something went wrong while getting users', 400, true);
        }
    };
    public createUser = async (userData: any) => {
        try {
            const isAlreadyExists = await UserModel.findOne({email: userData.email});
            if (isAlreadyExists && !isAlreadyExists.isActive) {
                const hashedPassword = await isAlreadyExists.hashPassword(userData.password);
                const user = await UserModel.findByIdAndUpdate(isAlreadyExists._id, {isActive: true, password: hashedPassword}, {new: true});
                if (!user) {
                    throw new ErrorHandler('Something went wrong while sign in', 400, true);
                }
                return {user};
            }
            const user = await UserModel.create(userData);
            return {
                user,
            };
        } catch (error: any) {
            throw error;
        }
    };
    public updateUser = async (userId: string, updationData: any) => {
        try {
            const user = await UserModel.findByIdAndUpdate(userId, updationData, {new: true});
            if (!user) {
                throw new ErrorHandler('Invalid user id. User not found', 404, true);
            }
            return {
                isUpdated: !!user,
            };
        } catch (error) {
            throw new ErrorHandler('Something went wrong while deleteing user', 400, true);
        }
    };
    public deleteUser = async (userId: string) => {
        try {
            const isDeleted = await UserModel.findByIdAndUpdate(userId, {isActive: false}, {new: true});
            return {isDeleted: !!isDeleted};
        } catch (error) {
            throw new ErrorHandler('Something went wrong while deleteing user', 400, true);
        }
    };
    public loginUser = async (email: string, user_entered_password: string) => {
        try {
            const user = await UserModel.findOne({email, isActive: true}).select('+password');
            if (!user || !(await user.comparePasswordHash(user_entered_password, user.password))) {
                throw new ErrorHandler('Invalid email or password', 400, true);
            }
            return {
                user,
            };
        } catch (error) {
            throw error;
        }
    };
}

export default UserDAO;
