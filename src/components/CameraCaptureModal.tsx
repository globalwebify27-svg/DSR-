"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { Camera, X, RefreshCw, Check, AlertCircle, SwitchCamera } from "lucide-react";

interface CameraCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (blob: Blob) => void;
}

export function CameraCaptureModal({
  isOpen,
  onClose,
  onCapture,
}: CameraCaptureModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const nativeCameraInputRef = useRef<HTMLInputElement>(null);

  const [facingMode, setFacingMode] = useState<"environment" | "user">("environment");
  const [hasMultipleCameras, setHasMultipleCameras] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [capturedBlob, setCapturedBlob] = useState<Blob | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [flashEffect, setFlashEffect] = useState(false);
  const [retryTrigger, setRetryTrigger] = useState(0);

  // Stop active camera stream
  const stopStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  }, []);

  // Start or stop camera based on modal state and facingMode
  useEffect(() => {
    if (!isOpen || previewUrl) {
      stopStream();
      return;
    }

    let isMounted = true;

    async function initCamera() {
      if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
        if (isMounted) {
          setCameraError(
            "Camera access is not supported by your browser or environment. You can use your device's native camera below."
          );
          setIsInitializing(false);
        }
        return;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: facingMode },
            width: { ideal: 1920 },
            height: { ideal: 1080 },
          },
          audio: false,
        });

        if (!isMounted) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }

        streamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }

        try {
          const devices = await navigator.mediaDevices.enumerateDevices();
          const videoDevices = devices.filter((d) => d.kind === "videoinput");
          if (isMounted) {
            setHasMultipleCameras(videoDevices.length > 1);
          }
        } catch {
          if (isMounted) {
            setHasMultipleCameras(false);
          }
        }
      } catch (err: unknown) {
        if (!isMounted) return;
        const msg =
          err instanceof Error && err.name === "NotAllowedError"
            ? "Camera permission was denied. Please allow camera access in your browser settings, or use the native camera option below."
            : "Unable to start camera. Please verify device permissions or use the native camera option.";
        setCameraError(msg);
      } finally {
        if (isMounted) {
          setIsInitializing(false);
        }
      }
    }

    initCamera();

    return () => {
      isMounted = false;
      stopStream();
    };
  }, [isOpen, previewUrl, facingMode, stopStream, retryTrigger]);

  // Cleanup object URLs on unmount or reset
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // Take snapshot from video feed
  const handleShutter = () => {
    const video = videoRef.current;
    if (!video) return;

    // Trigger visual flash feedback
    setFlashEffect(true);
    setTimeout(() => setFlashEffect(false), 200);

    const canvas = document.createElement("canvas");
    const videoWidth = video.videoWidth || 1280;
    const videoHeight = video.videoHeight || 720;
    canvas.width = videoWidth;
    canvas.height = videoHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // If using front camera, flip horizontally for natural mirror feel
    if (facingMode === "user") {
      ctx.translate(videoWidth, 0);
      ctx.scale(-1, 1);
    }

    ctx.drawImage(video, 0, 0, videoWidth, videoHeight);

    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        stopStream();
        setCapturedBlob(blob);
        const url = URL.createObjectURL(blob);
        setPreviewUrl(url);
      },
      "image/jpeg",
      0.92
    );
  };

  // Retake photo
  const handleRetake = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    setCapturedBlob(null);
    setIsInitializing(true);
    setCameraError(null);
    setRetryTrigger((prev) => prev + 1);
  };

  // Confirm and upload photo
  const handleConfirm = () => {
    if (capturedBlob) {
      onCapture(capturedBlob);
      handleClose();
    }
  };

  // Close modal and cleanup
  const handleClose = () => {
    stopStream();
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    setCapturedBlob(null);
    setCameraError(null);
    onClose();
  };

  // Switch between front and rear cameras
  const handleToggleFacingMode = () => {
    setFacingMode((prev) => (prev === "environment" ? "user" : "environment"));
  };

  // Native mobile camera fallback handler
  const handleNativeFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onCapture(file);
      handleClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Camera Capture"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-lg bg-[#111318] border border-[#2D3139] rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#2D3139] bg-[#171923]/90">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-[#FF5722]/20 text-[#FF5722] flex items-center justify-center">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-semibold text-white">
                {previewUrl ? "Review Storefront Photo" : "Live Camera Capture"}
              </h3>
              <p className="text-[10px] text-gray-400">
                {previewUrl ? "Verify photo clarity before uploading" : "Align storefront within frame"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close camera"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Viewfinder / Preview Area */}
        <div className="relative flex-1 min-h-[300px] sm:min-h-[360px] bg-black flex items-center justify-center overflow-hidden">
          {/* Shutter Flash Animation */}
          {flashEffect && (
            <div className="absolute inset-0 bg-white z-30 pointer-events-none transition-opacity duration-200" />
          )}

          {/* Review Captured Photo */}
          {previewUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={previewUrl}
              alt="Captured outlet preview"
              className="w-full h-full max-h-[55vh] object-contain"
            />
          ) : cameraError ? (
            /* Error / Permission Fallback View */
            <div className="p-6 text-center max-w-sm space-y-3">
              <div className="w-12 h-12 rounded-full bg-amber-500/10 text-amber-500 mx-auto flex items-center justify-center">
                <AlertCircle className="w-6 h-6" />
              </div>
              <p className="text-xs text-gray-300 leading-relaxed">{cameraError}</p>
              <div className="pt-2 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => nativeCameraInputRef.current?.click()}
                  className="w-full py-2 px-3 text-xs font-semibold text-white bg-[#FF5722] hover:bg-[#E64A19] rounded-lg transition-colors inline-flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                >
                  <Camera className="w-4 h-4" />
                  Open Device Camera App
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsInitializing(true);
                    setCameraError(null);
                    setRetryTrigger((prev) => prev + 1);
                  }}
                  className="w-full py-1.5 px-3 text-xs font-medium text-gray-400 hover:text-white rounded-lg transition-colors cursor-pointer"
                >
                  Retry In-Browser Camera
                </button>
              </div>
            </div>
          ) : (
            /* Live Camera Stream */
            <>
              {isInitializing && (
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/70 gap-2">
                  <div className="w-7 h-7 border-2 border-[#FF5722] border-t-transparent rounded-full animate-spin" />
                  <span className="text-xs text-gray-300">Starting camera...</span>
                </div>
              )}

              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`w-full h-full max-h-[55vh] object-cover ${
                  facingMode === "user" ? "scale-x-[-1]" : ""
                }`}
              />

              {/* Viewfinder Target Guidelines */}
              <div className="absolute inset-6 sm:inset-10 border border-white/30 rounded-lg pointer-events-none flex flex-col justify-between p-3">
                <div className="flex justify-between">
                  <span className="w-4 h-4 border-t-2 border-l-2 border-[#FF5722]"></span>
                  <span className="w-4 h-4 border-t-2 border-r-2 border-[#FF5722]"></span>
                </div>
                <div className="flex justify-between">
                  <span className="w-4 h-4 border-b-2 border-l-2 border-[#FF5722]"></span>
                  <span className="w-4 h-4 border-b-2 border-r-2 border-[#FF5722]"></span>
                </div>
              </div>

              {/* Switch Camera Button (Front / Rear) */}
              {hasMultipleCameras && (
                <button
                  type="button"
                  onClick={handleToggleFacingMode}
                  className="absolute top-3 right-3 z-10 p-2.5 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-sm border border-white/20 transition-all cursor-pointer shadow-lg active:scale-95"
                  title="Switch camera"
                >
                  <SwitchCamera className="w-4 h-4" />
                </button>
              )}
            </>
          )}

          {/* Hidden native camera capture input fallback */}
          <input
            ref={nativeCameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleNativeFileChange}
            className="hidden"
          />
        </div>

        {/* Modal Bottom Controls */}
        <div className="p-4 bg-[#171923] border-t border-[#2D3139]">
          {previewUrl ? (
            /* Review Photo Actions */
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleRetake}
                className="flex-1 py-2.5 px-4 text-xs font-semibold text-gray-200 bg-white/10 hover:bg-white/15 border border-white/20 rounded-xl transition-all inline-flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Retake
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                className="flex-1 py-2.5 px-4 text-xs font-semibold text-white bg-[#FF5722] hover:bg-[#E64A19] rounded-xl transition-all inline-flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
              >
                <Check className="w-4 h-4" />
                Use This Photo
              </button>
            </div>
          ) : !cameraError ? (
            /* Shutter Controls */
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => nativeCameraInputRef.current?.click()}
                className="text-[11px] text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                Use phone camera app
              </button>

              {/* Circular Shutter Button */}
              <button
                type="button"
                onClick={handleShutter}
                disabled={isInitializing}
                className="relative w-14 h-14 rounded-full border-4 border-white/80 bg-white hover:bg-gray-100 flex items-center justify-center transition-transform active:scale-90 shadow-xl cursor-pointer disabled:opacity-50"
                aria-label="Capture photo"
              >
                <div className="w-10 h-10 rounded-full bg-[#FF5722]" />
              </button>

              <button
                type="button"
                onClick={handleClose}
                className="text-[11px] text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
