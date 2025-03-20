'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MdOutlineFileUpload, MdCheckCircle, MdError, MdInfo } from "react-icons/md";
import { PulseLoader } from "react-spinners";
import BackgroundDots from '../../components/BackgroundDots';
import Image from 'next/image';

interface DetectionResult {
  detection_result: string;
  error?: string;
}

const DetectionPage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [detectionResult, setDetectionResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cleanup preview URL when component unmounts or file changes
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setImagePreview(URL.createObjectURL(selectedFile));
      setError(null);
      setDetectionResult(null); // Reset detection result when new file is selected
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file');
      return;
    }

    setIsDetecting(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/detect`, {
        method: 'POST',
        body: formData,
      });

      const data: DetectionResult = await response.json();
      if (response.ok) {
        setDetectionResult(data.detection_result);
        setError(null);
      } else {
        setDetectionResult(null);
        setError(data.error || 'An error occurred');
      }
    } catch (error) {
      setError('Error during upload: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setIsDetecting(false);
    }
  };

  const renderDetectionResult = () => {
    if (!detectionResult) return null;

    const isNoWatermark = detectionResult === 'No watermark detected' || detectionResult === 'No valid watermark found';
    const watermarkText = detectionResult.split(' - ')[0].split(': ')[1];

    return (
      <div className={`p-6 rounded-xl ${
        isNoWatermark 
          ? "bg-red-500/10 border border-red-500/20" 
          : "bg-emerald-500/10 border border-emerald-500/20"
      }`}>
        <div className="flex items-start space-x-4">
          <div className={`p-2 rounded-lg ${
            isNoWatermark 
              ? "bg-red-500/20" 
              : "bg-emerald-500/20"
          }`}>
            {isNoWatermark ? (
              <MdError className="w-6 h-6 text-red-400" />
            ) : (
              <MdCheckCircle className="w-6 h-6 text-emerald-400" />
            )}
          </div>
          <div className="flex-1">
            <h3 className={`text-lg font-semibold mb-2 ${
              isNoWatermark ? "text-red-400" : "text-emerald-400"
            }`}>
              {isNoWatermark ? 'No Watermark Detected' : 'Watermark Detected'}
            </h3>
            {isNoWatermark ? (
              <div className="space-y-2">
                <p className="text-gray-300">
                  {detectionResult === 'No watermark detected' 
                    ? 'This image does not contain any invisible watermark.'
                    : 'This image contains a watermark, but it was not created using Markora.'}
                </p>
                <div className="flex items-center text-sm text-gray-400">
                  <MdInfo className="w-4 h-4 mr-1" />
                  <span>Only watermarks created with Markora can be detected.</span>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="p-3 rounded-lg bg-gray-800/50 border border-gray-700">
                  <p className="text-sm text-gray-400 mb-1">Detected Watermark</p>
                  <p className="text-lg font-semibold text-indigo-400">{watermarkText}</p>
                </div>
                <div className="flex items-center text-sm text-emerald-400">
                  <MdCheckCircle className="w-4 h-4 mr-1" />
                  <span>This watermark was created using Markora</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen w-full bg-black relative">
      <BackgroundDots 
        dotColor="#6366F1"
        backgroundColor="transparent"
        dotSize={1}
        gap={20}
        fade={true}
      />
      <div className="container mx-auto mb-8 px-4 pt-24 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl leading-12 font-bold mb-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-transparent bg-clip-text">
              Detect Watermark
            </h1>
            <p className="text-gray-400 text-lg">
              Upload your file to detect any invisible watermarks
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Image Preview Section */}
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-800">
              <div className="h-[400px] rounded-xl overflow-hidden bg-gray-800/50 flex items-center justify-center p-6">
                {imagePreview && (
                  <div className="relative w-full h-full">
                    <Image
                      src={imagePreview}
                      alt="Preview"
                      fill
                      className="object-contain"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Form Section */}
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-800">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Select File
                  </label>
                  <button
                    type="button"
                    onClick={handleButtonClick}
                    className="w-full p-3 rounded-xl border-2 border-dashed border-gray-700 bg-gray-800/50 text-gray-300 hover:border-indigo-500 hover:text-white transition-all duration-300 flex items-center justify-center"
                  >
                    <MdOutlineFileUpload className="w-6 h-6 mr-2" />
                    <span>Choose a file</span>
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>

                <button
                  type="submit"
                  disabled={!file || isDetecting}
                  className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/20"
                >
                  <div className="flex justify-center items-center">
                    {isDetecting ? (
                      <PulseLoader size={10} color="#FFFFFF" />
                    ) : (
                      <span className="font-semibold">Detect Watermark</span>
                    )}
                  </div>
                </button>

                {error && (
                  <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                    <p className="text-red-400 text-sm">{error}</p>
                  </div>
                )}

                {renderDetectionResult()}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetectionPage; 