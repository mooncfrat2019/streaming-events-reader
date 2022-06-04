import React, {useEffect, useState} from "react";
import {
    Button,
    Cell,
    FormItem,
    FormLayout,
    FormLayoutGroup,
    Group,
    Header,
    IconButton,
    Input,
    Placeholder
} from "@vkontakte/vkui";
import {Utils} from "../service/utils";
import axios from "axios";
import {AuthResult, Rule, Rules} from "../../../../backend/service/router";
import {Icon24CancelOutline, Icon56MoonOutline} from "@vkontakte/icons";
import styles from './Dashboard.module.css';

type getRulesFunc = (props: AuthResult) => Promise<Rules>
type removeRuleFunc = (props: DeleteRuleProps) => Promise<Rules>

interface DeleteRuleProps extends AuthResult {
    tag: string
}

const Dashboard = () => {
    const [needAuth, setNeedAuth] = useState(false);
    const [needUpdate, setNeedUpdate] = useState(false);
    const [token, setToken] = useState('');
    const [cred, setCred] = useState<AuthResult>({ endpoint: '', key: '' })
    const [rules, setRules] = useState<Rule[]|null>(null);
    const [newRule, setNewRule] = useState<Rule>({ tag: 'vk', value: 'vk' })
    const { host } = new Utils;
    const url = host();
    const headers = {
        'Content-Type': 'application/json',
    }


    const authorize = async () => {
        const { data } = await axios.get(`${url}/authorize?service_token=${token}`);
        return data;
    }

    const getRules: getRulesFunc = async ({ endpoint, key }) => {
        const { data } = await axios.get(`${url}/getRules?service_token=${token}&endpoint=${endpoint}&key=${key}`);
        return data;
    }

    const addRules = async ({ endpoint, key }: AuthResult) => {
        const { data } = await axios.post(`${url}/postRule?&endpoint=${endpoint}&key=${key}`,
            { rule: newRule }, { headers });
        return data;
    }

    const removeRule: removeRuleFunc = async ({ endpoint, key, tag }) => {
        const { data } = await axios.get(`${url}/getRules?endpoint=${endpoint}&key=${key}&tag=${tag}`);
        return data;
    }

    useEffect(() => {
        console.log('host', host());
        if (needAuth) {
            setNeedAuth(false)
            authorize()
                .then((result) => setCred(result))
                .catch((error) => console.error(error))
        }
    }, [needAuth]);

    useEffect(() => {
        console.log('cred', cred);

        if (cred.endpoint.length || (cred.endpoint.length && needUpdate)) {
            setNeedUpdate(false);
            console.log('TRYYING FETCH RULES')
            getRules(cred)
                .then((response) => {
                    console.log('response', response);
                    if (response?.rules) {
                        console.log('response?.rules', response?.rules);
                        setRules(response.rules);
                    }
                })
                .catch((e) => {
                    console.error(e)
                })
        }
    }, [cred, needUpdate])

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
            {(!rules) ?
                <Placeholder icon={<Icon56MoonOutline/>}>
                Нет текущих правил для сбора событий
                </Placeholder> :
                <React.Fragment>
                    <Header mode={'secondary'}>
                        Правила
                    </Header>
                    {rules.map((rule) => {
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
                    })}
                </React.Fragment>
            }
        </Group>
    </React.Fragment>)
}

export default Dashboard;