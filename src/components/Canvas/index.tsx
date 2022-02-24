import React, {
  CanvasHTMLAttributes,
  DetailedHTMLProps,
  FC,
  memo,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { GlobalContext, Size } from '../../state/global';
import { Candle } from './canvasUtil';
import { timeframeForKLine, timeframes } from '../../utils/constant';
import { BinanceKLine, SocketClient } from '../../utils/websocket';
import { getKLines, KLineData } from '../../utils/api';

interface Props extends Partial<DetailedHTMLProps<CanvasHTMLAttributes<HTMLCanvasElement>, HTMLCanvasElement>> {}
const Canvas: FC<Props> = (props) => {
  const [client] = useState(new SocketClient());
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [klines, setKLines] = useState<KLineData[]>([]);
  const [streamKLine, setStreamKLine] = useState<BinanceKLine>();
  const [size, setSize] = useState<Size>({
    width: 0,
    height: 0,
  });
  const { setState, state } = useContext(GlobalContext);

  useEffect(() => {
    const context = canvasRef.current?.getContext('2d');
    if (!context || size.width === 0) return;
    setState({
      ...state,
      canvasContext: context,
    });
    context.fillStyle = '#26272a';
    context.fillRect(0, 0, size.width, size.height);
  }, [size]);

  function handleKLine(data: BinanceKLine) {}

  useEffect(() => {
    if (!streamKLine) return;
    const k = streamKLine.k;
    const kLinesClone = [...klines];
    const currentKline: KLineData = [k.t, k.o, k.h, k.l, k.c, k.v, k.T];
    if (!k.x) {
      kLinesClone.pop();
    }
    setKLines([...kLinesClone, currentKline]);
  }, [streamKLine]);

  useEffect(() => {
    if (!state.canvasContext) return;
    const candle = new Candle(state.canvasContext);
    candle.drawBoard(klines);
  }, [state.canvasContext, klines, size]);
  useEffect(() => {
    function listener() {
      setSize({
        width: Math.max(document.documentElement.clientWidth, klines.length * (Candle.offset + Candle.width)),
        height: Candle.chartHeight,
      });
    }
    listener();
    window.addEventListener('resize', listener);
    return () => {
      window.removeEventListener('resize', listener);
    };
  }, [klines]);

  useEffect(() => {
    const tf = timeframeForKLine[state.currentTimeframeKey];
    getKLines({
      symbol: 'BTCBUSD',
      interval: tf,
      limit: 120,
    }).then((data) => {
      setKLines(data);
    });
    client.on(`btcbusd@kline_${tf}`, (data: BinanceKLine) => {
      setStreamKLine(data);
    });
    return () => {
      client.closeSocket();
    };
  }, [state.currentTimeframeKey]);
  return (
    <div className="scroll-x-auto">
      <canvas ref={canvasRef} width={size.width} height={size.height} />
    </div>
  );
};

export default memo(Canvas);
