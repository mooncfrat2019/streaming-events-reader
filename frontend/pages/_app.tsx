import React, {FC, PropsWithChildren, StrictMode, Suspense, useEffect, useState} from 'react';
import '../styles/globals.css';
import {AppProps} from "next/app";

const SafeHydrate: FC<PropsWithChildren<any>> = ({ children }) => {
  const [showChild, setShowChild] = useState(false);
  useEffect(() => {
    setShowChild(true);
  }, []);

  if (!showChild) {
    return null;
  }

  if (typeof window === 'undefined') {
    return <></>;
  }

  return (
      <div suppressHydrationWarning>
        {typeof document === 'undefined' ? null : children}
      </div>
  )
}

function MyApp({Component, pageProps}: AppProps) {
  return <>
    <SafeHydrate>
      <StrictMode>
        <Suspense fallback="Loading...">
          <Component {...pageProps} />
        </Suspense>
      </StrictMode>
    </SafeHydrate>
  </>;
}

export default MyApp;
