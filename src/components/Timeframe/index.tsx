import React, { FC, memo } from 'react';
import TimeframeBar from './bar';

interface Props {}

const Timeframe: FC<Props> = (props) => {
  return (
    <>
      <TimeframeBar />
    </>
  );
};

export default memo(Timeframe);
