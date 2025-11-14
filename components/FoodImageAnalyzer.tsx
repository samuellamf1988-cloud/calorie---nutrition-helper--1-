// components/FoodImageAnalyzer.tsx
import React, { useState, useCallback, useRef, useEffect } from 'react'; // Added useEffect
import LoadingSpinner from './LoadingSpinner';
import { analyzeFoodImage } from '../services/geminiService';
import { FoodImageAnalysisResult } from '../types';
import { marked } from 'marked';
import { useLanguage } from '../context/LanguageContext';

interface FoodImageAnalyzerProps {}

const FoodImageAnalyzer: React.FC<FoodImageAnalyzerProps> = () => {
  const { translations, language } = useLanguage(); // Get language
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageMimeType, setImageMimeType] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<FoodImageAnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const renderMarkdown = (markdownText: string) => {
    return { __html: marked.parse(markdownText) };
  };

  const resetState = useCallback(() => {
    setError(null);
    setAnalysisResult(null);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
      videoRef.current.pause();
      videoRef.current.load();
    }
  }, []);

  // New effect to trigger analysis when selectedImage/imageMimeType change
  useEffect(() => {
    if (selectedImage && imageMimeType) {
      handleAnalyze(selectedImage, imageMimeType);
    }
  }, [selectedImage, imageMimeType]);

  const handleAnalyze = useCallback(async (image: string, mime: string) => {
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);

    try {
      const base64Data = image.split(',')[1];
      const result = await analyzeFoodImage(base64Data, mime, language); // Pass language
      setAnalysisResult(result);
    } catch (err: any) {
      console.error("Failed to analyze food image:", err);
      let errorMessage = translations.failedToAnalyzeImage;
      if (err instanceof Error && err.message.includes("Requested entity was not found.")) {
        errorMessage = translations.alertApiIssue;
        await (window as any).aistudio.openSelectKey(); // Prompt user to select key only on this specific error
      } else if (err.message) {
        errorMessage = err.message;
      }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [translations, language]);


  const handleImageUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    resetState();
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // No need to split base64String here, `reader.result` is already the data URL
        setSelectedImage(reader.result as string);
        setImageMimeType(file.type);
        // Analysis will be triggered by useEffect
      };
      reader.readAsDataURL(file);
    } else {
      setSelectedImage(null);
      setImageMimeType(null);
    }
  }, [resetState]);

  const handleCaptureImage = useCallback(async () => {
    resetState();
    setSelectedImage(null);
    setImageMimeType(null);
    try {
      // Check for camera permission first
      const permissionStatus = await navigator.permissions.query({ name: 'camera' as PermissionName });
      if (permissionStatus.state === 'denied') {
        setError(translations.cameraPermissionDenied);
        return;
      }

      streamRef.current = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = streamRef.current;
        videoRef.current.play();
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setError(translations.cameraPermissionDenied);
    }
  }, [resetState, translations]);

  const takePhoto = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
          if (blob) {
            const reader = new FileReader();
            reader.onloadend = () => {
              // No need to split base64String here, `reader.result` is already the data URL
              setSelectedImage(reader.result as string);
              setImageMimeType(blob.type);
              // Analysis will be triggered by useEffect
            };
            reader.readAsDataURL(blob);
          }
        }, 'image/jpeg', 0.9); // Use JPEG for smaller size, 0.9 quality
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      video.srcObject = null;
      video.pause();
    }
  }, [resetState]);


  return (
    <div className="p-6 bg-white rounded-lg shadow-md w-full max-w-lg" role="region" aria-labelledby="food-analyzer-title">
      <h2 id="food-analyzer-title" className="text-2xl font-bold text-gray-800 mb-6 text-center">{translations.foodImageAnalyzerTitle}</h2>

      <div className="mb-6 flex flex-col items-center">
        {selectedImage ? (
          <img src={selectedImage} alt={translations.imageUploadPlaceholder} className="w-full h-auto max-h-64 object-contain rounded-md border border-gray-300 mb-4" />
        ) : (
          <div className="w-full h-48 bg-gray-100 flex items-center justify-center rounded-md border border-gray-300 text-gray-500 mb-4 text-center">
            {translations.imageUploadPlaceholder}
          </div>
        )}

        {streamRef.current && (
          <div className="relative w-full mb-4">
            <video ref={videoRef} autoPlay playsInline className="w-full h-auto rounded-md border border-gray-300"></video>
            <button
              onClick={takePhoto}
              className="absolute bottom-4 left-1/2 -translate-x-1/2 px-5 py-2 bg-red-600 text-white rounded-full font-semibold hover:bg-red-700 transition duration-300"
              aria-label={translations.captureImage}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline-block mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {translations.captureImage}
            </button>
          </div>
        )}
        <canvas ref={canvasRef} className="hidden"></canvas> {/* Hidden canvas for photo capture */}

        <div className="flex space-x-4 w-full justify-center">
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageUpload}
            className="hidden"
            id="image-upload-input"
            aria-label={translations.uploadImage}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-md font-semibold hover:bg-blue-600 transition duration-300"
            aria-label={translations.uploadImage}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            {translations.uploadImage}
          </button>
          <button
            onClick={handleCaptureImage}
            className="flex-1 px-4 py-2 bg-green-500 text-white rounded-md font-semibold hover:bg-green-600 transition duration-300"
            aria-label={translations.captureImage}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {translations.captureImage}
          </button>
        </div>
      </div>

      {/* Removed "Analyze Food" button as analysis is now automatic */}
      {/*
      <button
        onClick={handleAnalyze}
        className={`w-full bg-purple-600 text-white py-3 rounded-md font-semibold hover:bg-purple-700 transition duration-300 ${isLoading || !selectedImage ? 'opacity-50 cursor-not-allowed' : ''}`}
        disabled={isLoading || !selectedImage}
        aria-label={isLoading ? translations.analyzingFood : translations.analyzeFood}
      >
        {isLoading ? translations.analyzingFood : translations.analyzeFood}
      </button>
      */}

      {error && <p className="text-red-600 mt-4 text-center" role="alert">{error}</p>}

      {isLoading && <LoadingSpinner />}

      {analysisResult && (
        <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200" role="complementary" aria-labelledby="food-analysis-result-title">
          <h3 id="food-analysis-result-title" className="text-xl font-bold text-gray-800 mb-4">{translations.imageAnalysisResult}</h3>
          <div className="space-y-4 text-gray-700">
            {analysisResult.estimatedCalories !== null && (
              <p>
                <span className="font-semibold">{translations.estimatedCalories}</span>{' '}
                <span className="text-blue-600 font-bold">{Math.round(analysisResult.estimatedCalories)} kcal</span>
              </p>
            )}
            <p className="font-semibold">{translations.evaluation}</p>
            <div className="prose max-w-none" dangerouslySetInnerHTML={renderMarkdown(analysisResult.evaluation)} />
            <p className="font-semibold">{translations.advice}</p>
            <div className="prose max-w-none" dangerouslySetInnerHTML={renderMarkdown(analysisResult.advice)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default FoodImageAnalyzer;