import React from 'react';
import useInitUser from '@/hooks/useInitUser';
import RouterElement from '@/routers';
import { HashRouter } from 'react-router-dom';
import { fromAppIdInit } from '@/utils/appInfo';

function App() {
  useInitUser();
  fromAppIdInit();
  return (
    <>
      <HashRouter>
        <React.Suspense fallback={<>正在加载……</>}>
          <RouterElement />
        </React.Suspense>
      </HashRouter>
    </>
  );
}

export default App;
