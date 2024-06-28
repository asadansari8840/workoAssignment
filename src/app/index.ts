import express, {Express, NextFunction, Request, Response} from 'express';
import {singleton} from 'tsyringe';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import errorMiddleware from '@middlewares/error-middleware';
import AppRouter from '@router';

@singleton()
class ExpressApp {
    private app: Express;
    constructor(private appRouter: AppRouter) {
        this.appRouter = appRouter;
        this.app = express();
    }
    public runApp() {
        this.applyMiddlewares();
        this.app.get('/worko/check', async (req, res) => {
            res.status(200).json({
                success: true,
                message: 'Server is working',
                data: {data: 'Check server value....'},
                notify: true,
            });
            return;
        });
        this.app.use('/worko', this.appRouter.getRouter());
        this.app.use(errorMiddleware);
        this.app.listen(process.env.PORT, () => {
            console.log(`Server is running on port ${process.env.PORT}`);
        });
        return this.app;
    }
    private applyMiddlewares() {
        const corsOptions: any = {
            origin: JSON.parse(process.env.CORS_ORIGINS!),
            optionsSuccessStatus: 200,
            credentials: true,
        };
        this.app.use((req: Request, res: Response, next: NextFunction) => {
            console.log(`[${new Date().toUTCString()}] ${req.method} ${req.originalUrl}`);
            console.log(JSON?.stringify(req?.body ?? {}, null, 2));
            next();
        });
        this.app.use(cors(corsOptions));
        this.app.use(cookieParser());
        this.app.use(bodyParser.json({limit: '50mb'}));
        this.app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
    }
}

export default ExpressApp;
