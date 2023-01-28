import React, {useEffect, useState} from "react";
import {
    Avatar,
    Button,
    Card,
    CardScroll,
    Cell,
    Counter,
    FormItem,
    FormLayout,
    FormLayoutGroup,
    Group,
    Header,
    IconButton,
    Input,
    Placeholder,
    Separator,
    SubnavigationButton,
    Title
} from "@vkontakte/vkui";
import {Utils} from "../service/utils";
import axios from "axios";
import {AuthResult, EventsGetter, Rule, Rules} from "../../../../backend/service/router";
import {Icon16ChevronLeft, Icon16ChevronOutline, Icon24CancelOutline, Icon56MoonOutline} from "@vkontakte/icons";
import styles from './Dashboard.module.css';
import {Interweave} from "interweave";

type getRulesFunc = (props: AuthResult) => Promise<Rules>
type removeRuleFunc = (props: DeleteRuleProps) => Promise<Rules>

interface DeleteRuleProps extends AuthResult {
    tag: string
}

const Dashboard = () => {
    const [needAuth, setNeedAuth] = useState(false);
    const [needUpdate, setNeedUpdate] = useState(false);
    const [token, setToken] = useState('');
    const [cred, setCred] = useState<AuthResult>({ endpoint: '', key: '' });
    const [rules, setRules] = useState<Rule[]|null>(null);
    const [rulesRendered, setRulesRendered] = useState<any>(null);
    const [needRulesUpdate, setNeedRulesUpdate] = useState<boolean>(false);
    const [newRule, setNewRule] = useState<Rule>({ tag: 'vk', value: 'vk' });
    const [currentOffset, setCurrentOffset] = useState(0);
    const [currentLimit] = useState(100);
    const [fetchedEvents, setFetchedEvents] = useState<Array<any>|null>(null)
    const { host } = new Utils;
    const url = host();

    useEffect(() => {
        console.log('rules', rules);
        if (rules && Array.isArray(rules) && rules.length) {
            setRulesRendered(<React.Fragment>
                <Header mode={'secondary'}>
                    Правила
                </Header>
                {(rules && rules.length) ? rules.map((rule) => {
                    return <Cell
                        disabled={true}
                        after={<IconButton onClick={() => removeRule({ ...cred, tag: rule.tag})}>
                            <Icon24CancelOutline/>
                        </IconButton>}
                        before={<a
                            className={styles.tag}>
                            {rule.tag}
                        </a>}>
                        {rule.value}
                    </Cell>
                }) : null}
            </React.Fragment> )
        } else {
            setRulesRendered(<Placeholder icon={<Icon56MoonOutline/>}>
                    Нет текущих правил для сбора событий
                </Placeholder>);
        }
    }, [rules])

    const headers = {
        'Content-Type': 'application/json',
    }

    const authorize = async () => {
        const { data } = await axios.get(`${url}/backend/authorize?service_token=${token}`);
        console.log('authorize data', data)
        return data;
    };

    const getRules: getRulesFunc = async ({ endpoint, key }) => {
        const { data } = await axios.get(`${url}/backend/getRules?service_token=${token}&endpoint=${endpoint}&key=${key}`);
        return data;
    }

    const addRules = async ({ endpoint, key }: AuthResult) => {
        const { data } = await axios.post(`${url}/backend/postRule?&endpoint=${endpoint}&key=${key}`,
            { rule: newRule }, { headers });
        return data;
    }

    const removeRule: removeRuleFunc = async ({ endpoint, key, tag }) => {
        const { data } = await axios.get(`${url}/backend/removeRule?endpoint=${endpoint}&key=${key}&tag=${tag}`);
        console.log('removeRule', data);
        setNeedRulesUpdate(true);
        return data;
    }

    const getAllEvents: EventsGetter = async ({ limit, offset }) => {
        const { data } = await axios.get(`${url}/backend/getAllEvents?limit=${limit}&offset=${offset}`);
        return data;
    }

    useEffect(() => {
        getAllEvents({ limit: 100, offset: currentOffset })
            .then((data) => {
                setFetchedEvents(data);
            })
            .catch((e) => {
                console.error(e);
            })
    }, [currentOffset])

    useEffect(() => {
        console.log('host', host());
        if (needAuth) {
            console.log('MAKE AUTH');
            setNeedAuth(false)
            authorize()
                .then((result) => setCred(result))
                .catch((error) => console.error('authorize error', error));
        }
    }, [needAuth]);

    useEffect(() => {
        console.log('cred', cred);

        if (cred?.endpoint && cred.endpoint.length || (cred?.endpoint && cred.endpoint.length && needUpdate)) {
            console.log('cred indefined', cred);
            setNeedUpdate(false);
            setNeedRulesUpdate(false);
            console.log('TRYYING FETCH RULES');
            getRules(cred)
                .then((response) => {
                    console.log('response', response);
                    if (response?.rules) {
                        console.log('response?.rules', response?.rules);
                        setRules(response.rules);
                    } else {
                        setRules(null);
                    }
                })
                .catch((e) => {
                    console.error(e)
                })
        }
    }, [cred, needUpdate, needRulesUpdate])

    return (<React.Fragment>
        <Group>
            <Header>
                Настройка сбора событий
            </Header>
            <FormLayout >
                <FormLayoutGroup mode="horizontal">
                    <FormItem top="Сервисный токен">
                        <Input type="text" value={token} onChange={(e) => setToken(e.target.value)} />
                    </FormItem>
                    <FormItem top="действия">
                        <Button size={'s'} onClick={() => setNeedAuth(true)}>
                                Авторизовать приложение
                        </Button>
                    </FormItem>
                </FormLayoutGroup>
                <FormLayoutGroup mode="horizontal">
                    <FormItem top={'тэг'}>
                        <Input type="text" value={newRule.tag} onChange={(e) => setNewRule((prv) => ({ ...prv, tag: e.target.value }))} />
                    </FormItem>
                    <FormItem top={'значение'}>
                        <Input type="text" value={newRule.value} onChange={(e) => setNewRule((prv) => ({ ...prv, value: e.target.value }))} />
                    </FormItem>
                    <FormItem top="действия">
                        <Button size={'s'} onClick={() => (cred) ? addRules(cred).then((result) => {
                            console.log(result);
                            setNeedUpdate(true);
                        }).catch((e) => console.log(e)) : () => false}>
                            Добавить правило
                        </Button>
                    </FormItem>
                </FormLayoutGroup>
            </FormLayout>
        </Group>
        <Group>
            <Header>
                Текущее состояние
            </Header>
            {rulesRendered}
        </Group>
        <Group>
            <Header>
                Записанные события
            </Header>
            <FormLayoutGroup mode="horizontal">
                <SubnavigationButton disabled={!currentOffset} onClick={() => setCurrentOffset((prev) => prev - currentLimit)}><Icon16ChevronLeft/></SubnavigationButton>
                <Input value={fetchedEvents?.length} disabled={true} className={styles.tinyInput} />
                <SubnavigationButton disabled={!!fetchedEvents && fetchedEvents?.length < currentLimit} onClick={() => setCurrentOffset((prev) => prev + currentLimit)}><Icon16ChevronOutline/></SubnavigationButton>
            </FormLayoutGroup>
        </Group>
        {(fetchedEvents && fetchedEvents.length) ? <Group>
            {fetchedEvents.map((item) => <>
                <Cell
                before={<Avatar height={80} width={80}><Counter>{item.id}</Counter></Avatar>}
                disabled multiline key={item.id}>
                    <Title level={'3'}>{item.event.event.event_type}</Title>
                    <br/>
                    <br/>
                    <Interweave content={item.event.event.text} />
                    <br/>
                    <br/>
                    <a href={item.event.event.event_url} target={'_blank'}>Источник</a>
                    <br/>
                    <br/>
                    {item.event.event?.attachments && item.event.event?.attachments.length ?
                        <CardScroll size="s">{
                            item.event.event?.attachments.map((attach: any) => {
                                if (attach.type === 'photo') {
                                    return <Card>
                                        <div style={{
                                            paddingBottom: "66%",
                                            backgroundImage: `url(${attach.photo.photo_604})`
                                        }}/>
                                    </Card>
                                }
                            })
                        }</CardScroll>
                        : null}
                </Cell>
                <Separator/>
            </>)}
        </Group> : null}
    </React.Fragment>)
}

export default Dashboard;