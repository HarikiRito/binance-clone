import React, { useEffect, useState } from 'react';
import './App.scss';
import { SocketClient } from './utils/websocket';
import Timeframe from './components/Timeframe';
import { GlobalContext, GlobalState } from './state/global';
import { timeframes } from './utils/constant';
import Canvas from './components/Canvas';
import { getKLines } from './utils/api';

function App() {
  const [state, setState] = useState<GlobalState>({
    currentTimeframeKey: '0',
    selectedTimeframeKeys: Object.keys(timeframes),
  });
  useEffect(() => {
    // client.on('btcbusd@kline_1m', (data) => {
    //   console.log(data);
    // });
  }, []);

  return (
    <div id="main">
      <GlobalContext.Provider value={{ state, setState }}>
        <div>
          <Timeframe />
        </div>
        <Canvas />
      </GlobalContext.Provider>
    </div>
  );
}

export default App;
