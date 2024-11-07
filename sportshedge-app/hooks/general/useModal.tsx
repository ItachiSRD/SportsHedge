import { useCallback, useState } from 'react';

type IUseModal = {
  defaultState?: boolean;
};

export function useModal({ defaultState = false }: IUseModal) {
  const [isVisible, setIsVisible] = useState(defaultState);

  const openModal = useCallback(() => {
    setIsVisible(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsVisible(false);
  }, []);


  
  return { openModal, closeModal, isVisible };
}
