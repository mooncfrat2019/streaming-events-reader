import Application from "koa";
import {App} from "./app";
import {Utils} from "./utils";
import {CustomError} from "./errors";
import {DATA} from "./db";

export type Context = Application.ParameterizedContext<Application.DefaultState, Application.DefaultContext, any>;

export interface GenericObject {
    [key: string]: any
}

interface Router extends GenericObject {
    test: (ctx: Context) => void
}

interface StreamingEvent {
    id: number,
    event: JSON,
}

const Router: Router = {
    test: () => 'Test complete',
    getAll: async ({ limit, offset }: { limit: number, offset: number }) => {
        const evnets = await DATA.findAll({ limit, offset });
        // @ts-ignore
        return evnets.map((evnt: StreamingEvent) => ({ id: evnt.id, event: JSON.parse(evnt.event) }));
    }
}

export const router = () => {
    App.use(async (ctx) => {
        const { path } = Utils;
        const [first] = path(ctx.request.path);
        const { limit, offset } = ctx.request.query;

        console.log({ limit, offset })

        if (Router[first]) {
            return ctx.body = await Router[first]({ limit: Number(limit), offset: Number(offset) });
            // console.log('ctx.body');
            // console.log(ctx.body);
        }

        return new CustomError({ numberOfError: 1 }).ersponse(ctx)

    });
}