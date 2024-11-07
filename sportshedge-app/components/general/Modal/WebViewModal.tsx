import React from 'react';
import { Modal, View } from 'react-native';
import WebView from 'react-native-webview';
import ScreenHeader from '../ScreenHeader';

interface WebViewModalProps {
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
  selectedURL: string | null;
}

const WebViewModal = ({ modalVisible, setModalVisible, selectedURL }: WebViewModalProps) => {
  const handleCloseWebView = () => {
    setModalVisible(false);
  };

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(!modalVisible);
      }}
    >
      <View className="flex-row w-full bg-theme-reverse-content-primary h-[50px] items-center px-5 border-b border-global-gray-80">
        <ScreenHeader
          handleGoBack={handleCloseWebView}
        />
      </View>
      {selectedURL && <WebView source={{ uri: selectedURL }} style={{flex: 1}} />}
    </Modal>
  );
};

export default WebViewModal;
