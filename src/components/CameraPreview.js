import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { mediaService } from '../services/mediaService';
export const CameraPreview = ({ videoRef, canvasRef }) => {
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
                mediaService.stopVideoStream(videoRef.current.srcObject);
            }
        };
    }, [videoRef]);
    return (_jsxs("div", { className: "w-full h-56 bg-slate-200 rounded-[2.5rem] mb-6 border-4 border-white shadow-inner relative overflow-hidden", children: [isLoading && (_jsx("div", { className: "absolute inset-0 bg-slate-300 flex items-center justify-center z-10", children: _jsx("span", { className: "text-white font-black uppercase text-xs", children: "Loading Camera..." }) })), _jsx("video", { ref: videoRef, autoPlay: true, playsInline: true, className: "w-full h-full object-cover grayscale-[30%]" }), _jsx("canvas", { ref: canvasRef, className: "hidden" }), _jsxs("div", { className: "absolute top-4 right-4 flex gap-1", children: [_jsx("span", { className: "w-2 h-2 bg-red-500 rounded-full animate-pulse" }), _jsx("span", { className: "text-[8px] font-black text-white uppercase drop-shadow-md", children: "Live" })] })] }));
};
