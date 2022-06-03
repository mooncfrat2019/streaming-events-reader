import {App} from "./app";

export const init = () => {
    App.use(async (ctx) => {
        ctx.body = 'Hello World';
    });
}