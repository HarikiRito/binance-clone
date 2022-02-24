import React, { FC, memo, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { timeframes } from '../../utils/constant';
import './style.scss';
import EditTimeframeBoard from './edit/board';
import { GlobalContext } from '../../state/global';
import { stat } from 'fs';
interface Props {}

const TimeframeBar: FC<Props> = (props) => {
  const [showEditBoard, setShowEditBoard] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const [rect, setRect] = useState<DOMRect>();
  const { state, setState } = useContext(GlobalContext);

  useEffect(() => {
    setRect(ref.current?.getBoundingClientRect());
  }, [state.selectedTimeframeKeys]);

  const selectedTimeframe = useMemo(() => {
    const list: Record<string, string> = {};
    for (const [key, tf] of Object.entries(timeframes)) {
      if (state.selectedTimeframeKeys.includes(key)) {
        list[key] = tf;
      }
    }
    return list;
  }, [state.selectedTimeframeKeys]);

  const temporaryTimeframe = useMemo(() => {
    if (!state.selectedTimeframeKeys.includes(state.currentTimeframeKey)) {
      return [state.currentTimeframeKey, timeframes[state.currentTimeframeKey]];
    }
    return;
  }, [state.selectedTimeframeKeys, state.currentTimeframeKey]);
  function toggleBoard() {
    setShowEditBoard(!showEditBoard);
  }

  function setCurrentTimeframe(key: string) {
    setState({
      ...state,
      currentTimeframeKey: key,
    });
  }

  return (
    <>
      {Object.entries(selectedTimeframe).map(([key, tf]) => _renderTimeframeItem(key, tf))}
      {temporaryTimeframe && _renderTimeframeItem(temporaryTimeframe[0], temporaryTimeframe[1])}
      <div
        tabIndex={0}
        role="button"
        ref={ref}
        className="text-gray-100 m-2 inline cursor-pointer"
        onClick={toggleBoard}
        onKeyDown={toggleBoard}
      >
        &#10084;
      </div>
      <EditTimeframeBoard
        closePopup={() => setShowEditBoard(false)}
        onSave={() => setShowEditBoard(false)}
        showEditBoard={showEditBoard}
        rect={rect}
      />
    </>
  );

  function _renderTimeframeItem(key: string, timeframe: string) {
    return (
      <div
        onClick={() => setCurrentTimeframe(key)}
        className={`text-gray-100 m-1 inline cursor-pointer p-2 ${
          key === state.currentTimeframeKey ? 'bg-gray-700 text-yellow-100' : ''
        }`}
        key={key}
      >
        {timeframe}
      </div>
    );
  }
};

export default memo(TimeframeBar);
