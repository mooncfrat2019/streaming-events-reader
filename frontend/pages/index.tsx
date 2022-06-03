import React, {useEffect, useState} from 'react';
import '@vkontakte/vkui/dist/vkui.css';
import '@vkontakte/vkui/dist/unstable.css';
import {AdaptivityProvider, AppRoot, ConfigProvider, SplitCol, SplitLayout} from '@vkontakte/vkui';
import {StateProvider} from "./components/context/Context";
import bridge from "@vkontakte/vk-bridge";
import Navigation from "./components/navigation/Navigation";

function HomePage() {
  const [isSSR, setIsSSR] = useState(true);

  bridge.send('VKWebAppInit');

  useEffect(() => {
    setIsSSR(false);
  }, []);

  // @ts-ignore
  return (<StateProvider><ConfigProvider><AdaptivityProvider>
    <AppRoot>
      <SplitLayout>
        <SplitCol>
          {!isSSR ? <Navigation/> : null}
        </SplitCol>
      </SplitLayout>
    </AppRoot>
  </AdaptivityProvider>
  </ConfigProvider>
  </StateProvider>);
}

export default HomePage;

