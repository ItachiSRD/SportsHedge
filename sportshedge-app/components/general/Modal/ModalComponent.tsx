import { colors } from '@/styles/theme/colors';
import React from 'react';
import { Modal, View } from 'react-native';
import Button from '../buttons/Button';

export type ModalProps = {
  isVisible?: boolean;
  children: React.ReactNode;
  onClose?: () => void;
  customModal?: boolean;
};

const ModalComponent = ({
  isVisible = false,
  children,
  onClose,
  customModal = false
}: ModalProps) => (
  <Modal animationType="slide" transparent visible={isVisible} onRequestClose={onClose}>
    <View
      style={{
        backgroundColor: 'rgba(23, 23, 26, 0.8)',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20
      }}>
      {customModal ? (
        children
      ) : (
        <View
          style={{
            backgroundColor: colors['global-gray-80'],
            padding: 20,
            flex: 1,
            borderRadius: 20
          }}>
          {children}
          <Button
            containerClass="border-global-gray-20 rounded-xl py-3"
            textClass="text-global-gray-20 text-base tracking-[0.64px]"
            shape="rounded"
            variant="outlined"
            size="large"
            title="Okay"
            onPress={onClose}
          />
        </View>
      )}
    </View>
  </Modal>
);

export default React.memo(ModalComponent);
