import { View, Modal } from 'react-native';
import React, { useCallback, useState } from 'react';
import { PLAYER_STATES }  from 'react-native-youtube-iframe';
import Button from '@/components/general/buttons/Button';
import YoutubeVideo from '@/components/general/video/YoutubeVideo';

interface IVideoModalProps {
    modalVisible: boolean;
    setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
    videoId?: string;
}

const VideoModal = ({ videoId = 'ACJYz2f6wFA', modalVisible, setModalVisible }: IVideoModalProps) => {
  const [playing, setPlaying] = useState(false);

  const onStateChange = useCallback((state: PLAYER_STATES) => {
    if (state === 'ended') {
      setPlaying(false);
    }
  }, []);

  const handleClose = () => {
    setModalVisible(false);
    setPlaying(false);
  };

  return (
    <Modal animationType="slide" transparent visible={modalVisible}>
      <View className="flex-1 p-[30px] justify-center items-center bg-[#000000cc]">
        <View className="w-full rounded-[20px] overflow-hidden">
          <YoutubeVideo
            videoId={videoId}
            handleStateChange={onStateChange}
            playing={playing}
            horizontalOffset={60}
          />
          <Button
            title="Close"
            size="large"
            containerClass="bg-global-gray-80"
            textClass="text-brand-content"
            onPress={handleClose}
          />
        </View>
      </View>
    </Modal>
  );
};

export default VideoModal;