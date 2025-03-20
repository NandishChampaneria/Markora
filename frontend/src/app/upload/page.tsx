'use client';

import { useState, useRef, useEffect } from 'react';
import { MdOutlineFileUpload, MdOutlineSubdirectoryArrowRight, MdError, MdContentCopy } from "react-icons/md";
import { PulseLoader } from "react-spinners";
import { useAuth } from '../../context/AuthContext';
import BackgroundDots from '../../components/BackgroundDots';
import Link from 'next/link';
import Image from 'next/image';

const FileUploadForm = () => {
  const { user, loading, updateUserEmbeds } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [text, setText] = useState('');
  const [error, setError] = useState<React.ReactNode | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedFile, setProcessedFile] = useState<{ url: string; name: string } | null>(null);
  const [isLinkCopied, setIsLinkCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type.startsWith('image/')) {
      setFile(selectedFile);
      setError(null);
      // Create preview URL
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
    } else {
      setError('Please select a valid image file.');
      setPreviewUrl(null);
    }
  };

  // Cleanup preview URL when component unmounts or file changes
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError('Please login with Google to embed watermarks.');
      return;
    }

    if (!file || !text) {
      setError('Please select a file and enter watermark text.');
      return;
    }

    // Check if user has remaining embeds (if not pro)
    if (user.plan === 'free' && user.remainingEmbeds <= 0) {
      setError('You have reached your embed limit. Please upgrade to Pro for unlimited embeds.');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('text', text);
      formData.append('user_email', user.email || '');

      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/upload`;
      console.log('Making request to:', apiUrl);
      console.log('File:', file.name, 'Type:', file.type, 'Size:', file.size);
      console.log('Text:', text);
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        body: formData,
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'Failed to parse error response' }));
        console.error('Error response:', errorData);
        if (errorData.error === 'This image already has a watermark. Cannot add another.') {
          setError(
            <div className="flex items-center space-x-2">
              <MdError className="w-5 h-5 text-red-400" />
              <span>This image already has a watermark. Please use a different image.</span>
            </div>
          );
        } else {
          throw new Error(errorData.detail || 'Failed to process file');
        }
        return;
      }

      const blob = await response.blob();
      console.log('Received blob:', blob.size, 'bytes');
      const url = URL.createObjectURL(blob);
      setProcessedFile({ url, name: file.name });

      // Update remaining embeds if user is on free plan
      if (user.plan === 'free') {
        await updateUserEmbeds(user.remainingEmbeds - 1);
      }
    } catch (error) {
      console.error('Error details:', error);
      setError('Error processing file: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setIsProcessing(false);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const copyDetectionPageLink = () => {
    const detectionLink = `${window.location.origin}/detect`;
    navigator.clipboard.writeText(detectionLink);
    setIsLinkCopied(true);
    setTimeout(() => setIsLinkCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 pt-24">
        <div className="max-w-4xl mx-auto text-center">
          <PulseLoader size={15} color="#6366F1" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-black relative">
      <BackgroundDots 
        dotColor="#6366F1"
        backgroundColor="transparent"
        dotSize={1}
        gap={20}
        fade={true}
      />
      <div className="container mx-auto mb-8 px-4 pt-24 relative">
        <div className="max-w-4xl mx-auto relative">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold leading-12 mb-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-transparent bg-clip-text">
              Single File Watermark
            </h1>
            <p className="text-gray-400 text-lg">
              Upload a file and add an invisible watermark to it
            </p>
          </div>

          {!user ? (
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-800 text-center flex flex-col items-center justify-center">
              <h2 className="text-2xl font-semibold text-white mb-4">Login Required</h2>
              <p className="text-gray-400 mb-8 max-w-md">Please login with Google to use the watermark embedding feature.</p>
              <div className="flex justify-center">
                <Link 
                  href="/login"
                  className="inline-flex items-center px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl hover:from-indigo-600 hover:to-purple-600 transition-all duration-300"
                >
                  Sign in with Google
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Image Preview Section */}
              <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-800">
                <div className="flex items-center mb-4">
                  <div className="flex items-center text-sm text-gray-400">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    Logged in as {user.email}
                  </div>
                </div>
                <div className="h-[400px] rounded-xl overflow-hidden bg-gray-800/50 flex items-center justify-center">
                  {previewUrl && (
                    <div className="relative w-full h-64">
                      <Image
                        src={previewUrl}
                        alt="Preview"
                        fill
                        className="object-contain"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Form Section */}
              <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-800">
                {user.plan === 'free' && (
                  <div className="mb-6 p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
                    <div className="flex text-sm items-center justify-between">
                      <span className="text-gray-300">Remaining Embeds</span>
                      <span className="text-indigo-400 font-semibold">{user.remainingEmbeds} / 5</span>
                    </div>
                    <div className="mt-2 h-1.5 w-full bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-indigo-500 rounded-full transition-all duration-300"
                        style={{ width: `${(user.remainingEmbeds / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                )}
                {user.plan === 'pro' && (
                  <div className="mb-6 p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
                    <div className="flex text-sm items-center justify-between">
                      <span className="text-emerald-500">Pro Plan</span>
                      <span className="text-indigo-400 font-semibold">Unlimited Embeds</span>
                    </div>
                    <div className="mt-2 h-1.5 w-full bg-indigo-500 rounded-full" />
                  </div>
                )}
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

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Watermark Text
                    </label>
                    <input
                      type="text"
                      value={text}
                      onChange={handleTextChange}
                      placeholder="Eg. Markora"
                      className="w-full p-3 rounded-xl border border-gray-700 bg-gray-800/50 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={!file || !text || isProcessing}
                    className={`w-full py-3 text-white rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg ${
                      processedFile 
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 shadow-emerald-500/20' 
                        : 'bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 shadow-indigo-500/20'
                    }`}
                  >
                    <div className="flex justify-center items-center">
                      {isProcessing ? (
                        <PulseLoader size={10} color="#FFFFFF" />
                      ) : processedFile ? (
                        <a
                          href={processedFile.url}
                          download={`watermarked_${processedFile.name}`}
                          className="w-full flex items-center justify-center font-semibold"
                        >
                          Download Watermarked File
                          <MdOutlineSubdirectoryArrowRight className="ml-2" />
                        </a>
                      ) : (
                        <span className="font-semibold flex items-center">
                          Embed Watermark
                          <MdOutlineSubdirectoryArrowRight className="ml-2" />
                        </span>
                      )}
                    </div>
                  </button>

                  {error && (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                      <p className="text-red-400 text-sm">{error}</p>
                    </div>
                  )}
                </form>
              </div>
            </div>
          )}

          {/* Detection Link Section - Only show after processing */}
          {processedFile && (
            <div className="mt-8 p-6 bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-800">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-medium text-white mb-1">Verify Watermarks</h3>
                  <p className="text-sm text-gray-400">Share this link to let others verify watermarks in your images</p>
                </div>
                <button
                  onClick={copyDetectionPageLink}
                  className="flex items-center px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl hover:from-indigo-600 hover:to-purple-600 transition-all duration-300"
                >
                  <MdContentCopy className="w-5 h-5 mr-2" />
                  <span>{isLinkCopied ? 'Copied!' : 'Copy Detection Link'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileUploadForm; 