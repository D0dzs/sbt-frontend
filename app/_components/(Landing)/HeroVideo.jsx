'use client';

import { useContext, useState, useEffect, useRef } from 'react';
import { MobileContext } from '../Providers/Screen-provider';

// Video Loader component
const VideoLoader = ({ setLoading, videoRef }) => {
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleCanPlay = () => {
      setLoading(false);
    };

    video.addEventListener('loadeddata', handleCanPlay);
    return () => video.removeEventListener('loadeddata', handleCanPlay);
  }, [setLoading, videoRef]);

  return (
    <video
      ref={videoRef}
      className="fixed h-full w-full object-cover"
      src="/hero/hero_video.mp4"
      loop
      autoPlay
      muted
      disablePictureInPicture
      playsInline
    />
  );
};

// Video Placeholder (Fallback UI)
const VideoPlaceholder = () => {
  return (
    <div className="bg-bme-lsecondary dark:bg-bme-dfront fixed flex h-full w-full items-center justify-center object-cover backdrop-blur-sm">
      <div className="flex flex-col items-center gap-3">
        <div className="border-bme-blue dark:border-bme-orange h-8 w-8 animate-spin rounded-full border-4 border-t-transparent dark:border-t-transparent" />
        <div className="dark:text-bme-white/90 text-sm">Videó betöltése</div>
      </div>
    </div>
  );
};

const HeroVideo = () => {
  const isMobile = useContext(MobileContext);
  const [loading, setLoading] = useState(true);
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          video.pause();
        } else {
          video.play();
        }
      },
      { root: null, threshold: 0.3 },
    );

    observer.observe(video);

    return () => observer.disconnect();
  }, []);

  if (isMobile) {
    // eslint-disable-next-line
    return <img className="fixed h-full w-full object-cover" src="/images/carousel/12kep.webp" alt="Hero Image" />;
  }

  return (
    <div>
      {loading ? <VideoPlaceholder /> : null}
      <VideoLoader setLoading={setLoading} videoRef={videoRef} />
    </div>
  );
};

export default HeroVideo;
