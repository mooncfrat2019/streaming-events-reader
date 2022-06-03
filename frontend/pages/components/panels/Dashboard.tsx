import React from "react";
import {Group, Header} from "@vkontakte/vkui";


const Dashboard = () => {
    return (<React.Fragment>
        <Group>
            <Header>
                Настройка сбора событий
            </Header>
        </Group>
        <Group>
            <Header>
                Текущее состояние
            </Header>
        </Group>
    </React.Fragment>)
}

export default Dashboard;