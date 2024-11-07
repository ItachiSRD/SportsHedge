import { Dimensions } from 'react-native';
import { useEffect } from 'react';
import YoutubePlayer, { PLAYER_STATES }  from 'react-native-youtube-iframe';
import { useYoutubeVideoMetadata } from '@/hooks/video/useYoutubeVideoMetadata';

interface YoutubeVideoProps {
    playing?: boolean;
    handleStateChange?: (state: PLAYER_STATES) => void;
    horizontalOffset?: number;
    videoId: string;
}

const YoutubeVideo = ({ videoId, handleStateChange, horizontalOffset = 0 }: YoutubeVideoProps) => {
  const { videoMetaData, getVideoMetadata } = useYoutubeVideoMetadata();

  useEffect(() => {
    getVideoMetadata(videoId);
  }, []);

  const screenWidth = Dimensions.get('window').width;
  const playerHeight = videoMetaData ? (screenWidth - horizontalOffset) * (videoMetaData.height / videoMetaData.width) : 186;
    
  return (
    <YoutubePlayer
      height={playerHeight}
      videoId={videoId}
      onChangeState={handleStateChange}
    />
  );
};

export default YoutubeVideo;