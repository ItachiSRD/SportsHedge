import { useState } from 'react';
import { USER_INFO_MODAL } from '@/constants/userInfoModal';

export const useModalFunctions = () => {
  const [currentId, setCurrentId] = useState(1);
  const totalIds = USER_INFO_MODAL.length;

  const handleLeftButton = () => {
    setCurrentId((prevId) => Math.max(1, prevId - 1));
  };

  const handleRightButton = () => {
    setCurrentId((prevId) => Math.min(totalIds, prevId + 1));
  };

  const currentInfo = USER_INFO_MODAL.find((info) => info.id === currentId) || {
    title: '',
    desc: '',
    distance: '',
  };

  return {
    currentId,
    totalIds,
    handleLeftButton,
    handleRightButton,
    currentInfo,
  };
};
