import {App} from "./app";
import {Utils} from "./utils";
import {init_databse} from "./db";

export const context = async () => {
    await init_databse();
    const { path } = Utils;
    App.use(async (ctx, next) => {
        await next();
        console.log('ctx.request.path', ctx.request.path)
        const [fisrt, second] = path(ctx.request.path);
        console.log('first',fisrt);
        console.log('second',second);
        console.log("Context:");
        console.log(ctx.state);
    });
}