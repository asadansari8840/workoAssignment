export default class ErrorHandler extends Error {
    public statusCode: number;
    public message: string;
    public notify: boolean;
    constructor(message: string, statusCode: number, notify = false) {
        super(message);
        this.message = message;
        this.statusCode = statusCode;
        this.notify = notify;
    }
}
