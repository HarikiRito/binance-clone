import { createContext, Dispatch, SetStateAction, useReducer, useState } from 'react';
import { timeframes } from '../utils/constant';

export interface GlobalState {
  selectedTimeframeKeys: string[];
  currentTimeframeKey: string;
  canvasContext?: CanvasRenderingContext2D;
}

interface GlobalContextInterface {
  state: GlobalState;
  setState: Dispatch<SetStateAction<GlobalState>>;
}

export const GlobalContext = createContext<GlobalContextInterface>({} as GlobalContextInterface);

export interface Size {
  width: number;
  height: number;
}
