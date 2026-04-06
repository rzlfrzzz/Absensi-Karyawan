export const mediaService = {
    async startVideoStream(videoElement) {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { width: 300 },
            });
            if (videoElement) {
                videoElement.srcObject = stream;
            }
            return stream;
        }
        catch (error) {
            console.error('Failed to start video stream:', error);
            return null;
        }
    },
    stopVideoStream(stream) {
        if (stream) {
            stream.getTracks().forEach((track) => track.stop());
        }
    },
    async requestCameraPermission() {
        try {
            const result = await navigator.permissions.query({
                name: 'camera',
            });
            return result.state === 'granted' || result.state === 'prompt';
        }
        catch (error) {
            console.warn('Permission query not supported:', error);
            return true;
        }
    },
};
