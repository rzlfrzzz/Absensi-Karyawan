import { useRef, useEffect, useState } from 'react';
import { mediaService } from '../services/mediaService';

interface CameraPreviewProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
}

export const CameraPreview: React.FC<CameraPreviewProps> = ({ videoRef, canvasRef }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initCamera = async () => {
      setIsLoading(true);
      const hasPermission = await mediaService.requestCameraPermission();
      if (hasPermission && videoRef.current) {
        await mediaService.startVideoStream(videoRef.current);
      }
      setIsLoading(false);
    };

    initCamera();

    return () => {
      if (videoRef.current?.srcObject) {
        mediaService.stopVideoStream(videoRef.current.srcObject as MediaStream);
      }
    };
  }, [videoRef]);

  return (
    <div className="w-full h-56 bg-slate-200 rounded-[2.5rem] mb-6 border-4 border-white shadow-inner relative overflow-hidden">
      {isLoading && (
        <div className="absolute inset-0 bg-slate-300 flex items-center justify-center z-10">
          <span className="text-white font-black uppercase text-xs">Loading Camera...</span>
        </div>
      )}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="w-full h-full object-cover grayscale-[30%]"
      />
      <canvas ref={canvasRef} className="hidden" />
      <div className="absolute top-4 right-4 flex gap-1">
        <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
        <span className="text-[8px] font-black text-white uppercase drop-shadow-md">Live</span>
      </div>
    </div>
  );
};
