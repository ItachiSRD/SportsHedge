import { IFetchState } from '@/types/local/state';
import { useState } from 'react';
import { YoutubeMeta, getYoutubeMeta } from 'react-native-youtube-iframe';

export const useYoutubeVideoMetadata = () => {
  const [videoMetaData, setVideoMetadata] = useState<YoutubeMeta>();
  const [videoState, setVideoState] = useState<IFetchState>({ status: 'init' });

  const getVideoMetadata = async (videoId: string) => {
    try {
      setVideoState({ status: 'pending' });
      const meta = await getYoutubeMeta(videoId);
      setVideoMetadata(videoMetaData);
      setVideoMetadata(meta);
      setVideoState({ status: 'success' });
    } catch(err) {
      console.error('Failed to get the video meta', err);
      const error = err as Error;
      setVideoState({ status: 'failed', message: error.message });
    }
  };

  return { videoMetaData, videoState, getVideoMetadata };
};