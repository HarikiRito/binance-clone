import { KLineData } from '../../utils/api';

interface Option {
  highestPrice: number;
  lowestPrice: number;
}
export class Candle {
  static chartHeight = 850;
  static width = 8;
  static offset = 5;
  pinWidth = 1;
  ctx: CanvasRenderingContext2D;
  highestPrice = 0;
  lowestPrice = 0;

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
  }

  drawBoard(data: KLineData[]) {
    this.ctx.fillStyle = '#26272a';
    this.highestPrice = Math.max(...data.map((k) => Number(k[2])));
    this.lowestPrice = Math.min(...data.map((k) => Number(k[3])));
    this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    for (let i = 0; i < data.length; i++) {
      this.drawCandle(data[i], i);
    }
  }

  drawCandle(kline: KLineData, position: number) {
    const [openTime, open, high, low, close, volume, closeTime] = kline.map(Number);
    const isGreen = close > open;
    this.ctx.fillStyle = isGreen ? 'green' : 'red';
    const x = (Candle.width + Candle.offset) * position;

    const maxRange = this.highestPrice - this.lowestPrice;

    const oP = (Math.abs(open - this.highestPrice) / Math.abs(maxRange)) * Candle.chartHeight;
    const cP = (Math.abs(close - this.highestPrice) / Math.abs(maxRange)) * Candle.chartHeight;
    const hP = (Math.abs(high - this.highestPrice) / Math.abs(maxRange)) * Candle.chartHeight;
    const lP = (Math.abs(low - this.highestPrice) / Math.abs(maxRange)) * Candle.chartHeight;

    // Draw bar
    this.ctx.fillRect(x, isGreen ? cP : oP, Candle.width, Math.max(Math.abs(oP - cP), 1));
    // Draw pin
    this.ctx.fillRect(x + Candle.width / 2, hP, this.pinWidth, Math.abs(hP - lP));
  }
}
