import {App} from "./app";
// @ts-ignore
import cors from '@koa/cors';

export const logger = () => {
    App.use(cors());
    App.use(async (ctx, next) => {
        await next();
        const rt = ctx.response.get('X-Response-Time');
        console.log(`${ctx.method} ${ctx.url} - ${rt}:: ${new Date()}`);
    });
    App.on('error', (err, ctx) => {
        console.error('server error', err, ctx)
    });
}