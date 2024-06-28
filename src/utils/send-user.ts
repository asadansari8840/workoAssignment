import {UserDocument} from '@models/user-model';
import {Response} from 'express';

/**
 * This is the utility function for sending `user details` , `access-refresh tokens` and `setting the cookie` on the client side.
 * @param user User object which contains all the necessary details of the user.
 * @param res Express response object passed to this utility function.
 * @param resMessage Any response message want to send to the client
 * @param notify Notification boolean to notify user on the client side.
 */
export const sendUser = (user: UserDocument, res: Response, resMessage: string, notify: boolean = false, withoutCookie = false) => {
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    const cookieOptions = {
        expires: new Date(Date.now() + Number(process.env.COOKIE_EXPIRE) * 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production' ? true : false,
    };

    const {name, email, age, city, zipCode, googleId, provider, id, phone, isVerified, _id} = user;
    const userData = {
        _id,
        name,
        email,
        age,
        city,
        zipCode,
        googleId,
        provider,
        id,
        phone,
        isVerified,
    };

    if (withoutCookie) {
        return res.status(200).json({
            success: true,
            message: resMessage,
            data: {
                user: userData,
            },
        });
    }

    return res
        .cookie('refresh_token', refreshToken, cookieOptions)
        .status(200)
        .json({
            success: true,
            message: resMessage,
            data: {
                user: userData,
                accessToken,
            },
            notify,
        });
};
