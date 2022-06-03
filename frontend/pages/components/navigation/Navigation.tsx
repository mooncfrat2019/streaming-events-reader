import {Group, Panel, PanelHeader, Root, View} from "@vkontakte/vkui";
import {useContext, useEffect} from "react";
import {StateContext} from "../context/Context";
import {Utils} from '../service/utils'
import Dashboard from "../panels/Dashboard";

const Navigation = () => {
    const { view, panel } = new Utils;
    const { state } = useContext(StateContext);
    const { activeView, activePanel } = state;

    useEffect(() => {
        console.log('activeView', activeView);
        console.log('activePanel', activePanel);
    }, [activeView, activePanel])

    return (<Root activeView={activeView}>
        <View activePanel={activePanel} id={view('START')}>
            <Panel id={panel('START', 'EVENTS')}>
                <PanelHeader>Events</PanelHeader>
                <Group>
                    Events store
                </Group>
            </Panel>
            <Panel id={panel('START', 'DASHBOARD')}>
                <PanelHeader>Управление</PanelHeader>
                <Dashboard/>
            </Panel>
        </View>
    </Root>);
}

export default Navigation;