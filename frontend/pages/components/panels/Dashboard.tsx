import React, {useEffect, useState} from "react";
import {Button, FormItem, FormLayout, FormLayoutGroup, Group, Header, Input} from "@vkontakte/vkui";
import {Utils} from "../service/utils";
import axios from "axios";

interface Credentials {
    endpoint: "streaming.vk.com",
    key: string
}

const Dashboard = () => {
    const [needAuth, setNeedAuth] = useState(false);
    const [token, setToken] = useState('');
    const [cred, setCred] = useState<Credentials|null>(null)
    const [rules, seteRules] = useState(null);
    const { host } = new Utils;
    const url = host();

    const authorize = async () => {
        const { data } = await axios.get(`${url}/authorize?service_token=${token}`);
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
        console.log('cred')
        console.log(cred)
    }, [cred])

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
            </FormLayout>
        </Group>
        <Group>
            <Header>
                Текущее состояние
            </Header>
        </Group>
    </React.Fragment>)
}

export default Dashboard;