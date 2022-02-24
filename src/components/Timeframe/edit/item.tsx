import React, { FC, memo } from 'react';

interface Props {
  name: string;
  selected?: boolean;
  onClick: () => void;
}

const Item: FC<Props> = (props) => {
  const { selected = false, onClick } = props;
  return (
    <div
      onClick={onClick}
      className={`bg-gray-700 m-2 w-7 h-3 p-1 flex items-center justify-center text-white cursor-pointer ${
        selected ? 'bg-yellow-200' : ''
      }`}
    >
      {props.name}
    </div>
  );
};

export default memo(Item);
