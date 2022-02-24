import React, { FC, memo, useContext, useEffect, useState } from 'react';
import Item from './item';
import './style.scss';
import { timeframes } from '../../../utils/constant';
import { GlobalContext } from '../../../state/global';
interface Props {
  rect?: DOMRect;
  showEditBoard: boolean;
  onSave: () => void;
  closePopup: () => void;
}

const EditTimeframeBoard: FC<Props> = (props) => {
  const { rect, showEditBoard, closePopup } = props;
  const [enableEditMode, setEnableEditMode] = useState(false);
  const { state, setState } = useContext(GlobalContext);
  const [editedTimeframe, setEditedTimeframe] = useState<Record<string, string | undefined>>(timeframes);

  function selectTimeframe(key: string) {
    setState({
      ...state,
      currentTimeframeKey: key,
    });
    closePopup();
  }

  function editTimeframe(key: string) {
    const clone = { ...editedTimeframe };
    if (clone[key] === undefined) {
      clone[key] = timeframes[key];
    } else {
      clone[key] = undefined;
    }
    setEditedTimeframe(clone);
  }

  function handleMode() {
    if (!enableEditMode) {
      setEnableEditMode(true);
    } else {
      onSave();
    }
  }

  function onSave() {
    const selectedKeys: string[] = [];
    Object.entries(editedTimeframe).forEach(([key, tf]) => {
      if (tf !== undefined) {
        selectedKeys.push(key);
      }
    });
    setState({
      ...state,
      selectedTimeframeKeys: selectedKeys,
    });
    closePopup();
    disableEditMode();
  }

  function disableEditMode() {
    setEnableEditMode(false);
  }

  function restoreBoardState() {
    const timeframeMap: Record<string, string> = {};
    state.selectedTimeframeKeys.forEach((key) => {
      timeframeMap[key] = timeframes[key];
    });
    setEditedTimeframe(timeframeMap);
  }

  useEffect(() => {
    if (!showEditBoard) {
      restoreBoardState();
      setEnableEditMode(false);
    }
  }, [showEditBoard]);

  if (rect === undefined || !showEditBoard) return null;

  return (
    <>
      <div
        onMouseLeave={restoreBoardState}
        className="bg-gray-800 p-4 absolute"
        style={{
          top: rect.top + rect.height + 8,
          left: rect.left,
        }}
      >
        <div className="flex flex-row justify-between">
          <div className="text-gray-100">Select Intervals</div>
          <div className="text-yellow-100" onClick={handleMode}>
            {enableEditMode ? 'Save' : 'Edit'}
          </div>
        </div>
        <div className="grid-container grid-row-4 mt-4">
          {Object.entries(timeframes).map(([key, tf]) => {
            return (
              <Item
                onClick={() => (enableEditMode ? editTimeframe(key) : selectTimeframe(key))}
                selected={editedTimeframe[key] !== undefined}
                key={key}
                name={tf}
              />
            );
          })}
        </div>
      </div>
    </>
  );
};

export default memo(EditTimeframeBoard);
