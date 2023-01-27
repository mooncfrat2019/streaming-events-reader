import Application from "koa";
import KOABody from 'koa-body';
import {App} from "./app";
import {Utils} from "./utils";
import {CustomError} from "./errors";
import {DATA} from "./db";
// @ts-ignore
import { VKStreamingAPI } from 'vkflow';
import {config} from "./config";

export interface Rule { tag: string, value: string }

export type Context = Application.ParameterizedContext<Application.DefaultState, Application.DefaultContext, any>;

export interface AuthResult { endpoint: string, key: string }
export interface RemoveRuleProps  extends AuthResult { tag: Rule['tag'] }

interface Credintails { service_token: string }
interface Setups { limit: number, offset: number }
export interface Rules { code: number, rules: Rule[]}
interface RulesSetterProps extends AuthResult { rule: Rule }

type Authorize = (props: Credintails) => Promise<AuthResult|string>
export type EventsGetter = (props: Setups) => Promise<any>
type RulesGetter = (props: AuthResult) => Promise<Rules>
type RuleRemover = (props: RemoveRuleProps) => Promise<any>
type RulesSetter = (props: RulesSetterProps) => Promise<any>

export interface GenericObject {
    [key: string]: any
}

interface Router extends GenericObject {
    authorize: Authorize,
    getAllEvents: EventsGetter,
    getRules: RulesGetter,
    removeRule: RuleRemover,
    removeAllRules: RulesSetter,
    postRule: RulesSetter,
}

interface StreamingEvent {
    id: number,
    event: JSON,
}


const Router: Router = {
    test: () => "test",
    getAllEvents: async ({ limit, offset }: { limit: number, offset: number }) => {
        const evnets = await DATA.findAll({ limit, offset });
        // @ts-ignore
        return evnets.map((evnt: StreamingEvent) => ({ id: evnt.id, event: JSON.parse(evnt.event) }));
    },
    authorize: async ({ service_token }) => {
        // return service_token
       return await VKStreamingAPI.authWithToken((service_token.length) ? service_token : config.SERVICE_KEY);
       //  const { data } = await axios.get(`${url}/authorize?service_token=${service_token}`);
       //  console.log('data', data)
       //  return data;
    },
    getRules: async ({ endpoint, key }) => await VKStreamingAPI.getRules(endpoint, key),
    removeRule: async ({ endpoint, key, tag }) => {
        console.log('removeRule tag', tag);
        return await VKStreamingAPI.deleteRule(endpoint, key, {tag});
        // const { data } = await axios.delete(`https://${endpoint}/rules?key=${key}`,{headers, data: { tag: tag }});
        // console.log('removeRule tag', tag);
        // console.log('removeRule', data);
        // return data;
    },
    removeAllRules: async ({ endpoint, key }) => await VKStreamingAPI.flushRules(endpoint, key),
    postRule: async ({ endpoint, key , rule}) => await VKStreamingAPI
        .postRule(...Object.entries({ endpoint, key , rule }).map(([key, value]) => {
            if (key === 'rule') {
                return { rule: value }
            }
            return value
        }))
}

export const router = () => {
    App.use(KOABody())
    App.use(async (ctx) => {
        const { path } = Utils;
        const [first, second] = path(ctx.request.path);
        const { limit, offset, service_token, endpoint, key, tag } = ctx.request.query;
        const body = (ctx.request?.body) ? ctx.request.body : {};
        const { rule } = body;

        console.log({ limit, offset, service_token, endpoint, key, rule, tag });
        try {
            if (first === 'backend') {
                if (Router[second]) {
                    return ctx.body = await Router[second]({
                        limit: Number(limit),
                        offset: Number(offset),
                        service_token, endpoint, key, rule, tag
                    });
                }
            }
        } catch (e) {
            console.log(e);
            return new CustomError({ numberOfError: 1 }).ersponse(ctx)
        }

        return new CustomError({ numberOfError: 1 }).ersponse(ctx)

    });
}