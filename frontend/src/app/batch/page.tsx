'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MdOutlineFileUpload, MdOutlineSubdirectoryArrowRight, MdOutlineDelete, MdOutlineDownload, MdContentCopy } from "react-icons/md";
import { PulseLoader } from "react-spinners";
import JSZip from 'jszip';
import { useAuth } from '../../context/AuthContext';
import BackgroundDots from '../../components/BackgroundDots';
import Link from 'next/link';

interface ProcessedFile {
  name: string;
  url: string;
  originalSize: number;
}

interface ProcessingStatus {
  [key: string]: {
    status: 'processing' | 'completed' | 'error';
    progress: number;
    error?: string;
  };
}

const BatchUploadForm = () => {
  const { user, loading } = useAuth();
  const [files, setFiles] = useState<File[]>([]);
  const [text, setText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedFiles, setProcessedFiles] = useState<ProcessedFile[]>([]);
  const [processingStatus, setProcessingStatus] = useState<ProcessingStatus>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [isLinkCopied, setIsLinkCopied] = useState(false);

  // Cleanup processed file URLs when component unmounts
  useEffect(() => {
    return () => {
      processedFiles.forEach(file => {
        URL.revokeObjectURL(file.url);
      });
    };
  }, [processedFiles]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    const validFiles = selectedFiles.filter(file => file.type.startsWith('image/'));
    
    if (validFiles.length === 0) {
      setError('Please select valid image files.');
      return;
    }

    setFiles(prevFiles => [...prevFiles, ...validFiles]);
    setError(null);
    setProcessingStatus({});
  };

  const removeFile = (index: number) => {
    setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
    setProcessingStatus({});
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  const downloadZip = async (processedFiles: ProcessedFile[]) => {
    const zip = new JSZip();
    
    for (const file of processedFiles) {
      try {
        const response = await fetch(file.url);
        const blob = await response.blob();
        zip.file(`watermarked_${file.name}`, blob);
      } catch (error) {
        console.error(`Error adding ${file.name} to zip:`, error);
      }
    }

    const content = await zip.generateAsync({ type: "blob" });
    const zipUrl = URL.createObjectURL(content);
    const link = document.createElement('a');
    link.href = zipUrl;
    link.download = 'watermarked_images.zip';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(zipUrl);
  };

  const processFiles = async () => {
    if (!user) {
      setError('Please login with Google to embed watermarks.');
      return;
    }

    if (!files.length || !text) {
      setError('Please select files and enter watermark text.');
      return;
    }

    setIsProcessing(true);
    setError(null);
    setProcessedFiles([]);
    setProcessingStatus({});

    try {
      const results: ProcessedFile[] = [];
      let completedFiles = 0;

      for (const file of files) {
        try {
          setProcessingStatus(prev => ({
            ...prev,
            [file.name]: { status: 'processing', progress: 0 }
          }));

          const formData = new FormData();
          formData.append('file', file);
          formData.append('text', text);
          formData.append('user_email', user.email || '');

          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/upload`, {
            method: 'POST',
            body: formData,
          });

          if (!response.ok) {
            throw new Error(`Failed to process ${file.name}`);
          }

          const blob = await response.blob();
          const url = URL.createObjectURL(blob);
          
          results.push({
            name: file.name,
            url,
            originalSize: file.size,
          });

          completedFiles++;

          setProcessingStatus(prev => ({
            ...prev,
            [file.name]: { status: 'completed', progress: 100 }
          }));

        } catch (fileError) {
          setProcessingStatus(prev => ({
            ...prev,
            [file.name]: { 
              status: 'error', 
              progress: 0,
              error: fileError instanceof Error ? fileError.message : 'Unknown error'
            }
          }));
          console.error(`Error processing ${file.name}:`, fileError);
        }
      }

      if (results.length > 0) {
        setProcessedFiles(results);
      } else {
        setError('No files were successfully processed.');
      }
    } catch (error) {
      setError('Error processing files: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setIsProcessing(false);
    }
  };

  const copyDetectionLink = (fileName: string, index: number) => {
    const detectionLink = `${window.location.origin}/detect?file=${encodeURIComponent(fileName)}`;
    navigator.clipboard.writeText(detectionLink);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const copyDetectionPageLink = () => {
    const detectionLink = `${window.location.origin}/detect`;
    navigator.clipboard.writeText(detectionLink);
    setIsLinkCopied(true);
    setTimeout(() => setIsLinkCopied(false), 2000);
  };

  const renderProgressBar = (progress: number, status: 'processing' | 'completed' | 'error') => {
    const getProgressColor = () => {
      if (status === 'error') return 'bg-red-500';
      if (status === 'completed') return 'bg-emerald-500';
      return 'bg-indigo-500';
    };

    return (
      <div className="w-full h-1 bg-gray-700 rounded-full overflow-hidden">
        <div
          className={`h-full ${getProgressColor()} transition-all duration-300`}
          style={{ width: `${progress}%` }}
        />
      </div>
    );
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
      <div className="container mx-auto mb-8 px-4 pt-24 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl leading-12 font-bold mb-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-transparent bg-clip-text">
              Batch Watermark
            </h1>
            <p className="text-gray-400 text-lg">
              Upload multiple images and add the same watermark to all of them
            </p>
          </div>

          {!user ? (
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-800 text-center flex flex-col items-center justify-center">
              <h2 className="text-2xl font-semibold text-white mb-4">Login Required</h2>
              <p className="text-gray-400 mb-8 max-w-md">Please login with Google to use the watermark embedding feature.</p>
              <div className="flex justify-center">
                <Link 
                  href="/login"
                  className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full font-semibold hover:from-indigo-600 hover:to-purple-600 transition-all duration-300"
                >
                  Sign in with Google
                </Link>
              </div>
            </div>
          ) : user.plan === 'free' ? (
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-800 text-center flex flex-col items-center justify-center">
              <h2 className="text-2xl font-semibold text-white mb-4">Pro Feature</h2>
              <p className="text-gray-400 mb-8 max-w-md">Batch processing is available only with the Pro plan. Upgrade to process multiple files at once.</p>
              <Link
                href="/plan"
                className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full font-semibold hover:from-indigo-600 hover:to-purple-600 transition-all duration-300"
              >
                Upgrade to Pro
              </Link>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* File List Section */}
                <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-800">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="block text-sm font-medium text-gray-300">
                        Upload Files
                      </label>
                      <div className="flex items-center text-sm text-gray-400">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                        Logged in as {user.email}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full p-3 hover:cursor-pointer rounded-xl border-2 border-dashed border-gray-700 bg-gray-800/50 text-gray-300 hover:border-indigo-500 hover:text-white transition-all duration-300 flex items-center justify-center"
                    >
                      <MdOutlineFileUpload className="w-6 h-6 mr-2" />
                      <span>Choose files</span>
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </div>

                  <div className="mt-4 space-y-2">
                    {files.map((file, index) => (
                      <div
                        key={index}
                        className="p-3 rounded-lg bg-gray-800/30 border border-gray-700"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-300 truncate">{file.name}</span>
                          <button
                            onClick={() => removeFile(index)}
                            className="p-1 text-gray-400 hover:text-red-400 transition-colors"
                          >
                            <MdOutlineDelete className="w-5 h-5" />
                          </button>
                        </div>
                        {processingStatus[file.name] && (
                          <div className="space-y-1">
                            {renderProgressBar(
                              processingStatus[file.name].progress,
                              processingStatus[file.name].status
                            )}
                            <div className="flex justify-between items-center text-xs">
                              <span className={`
                                ${processingStatus[file.name].status === 'completed' ? 'text-emerald-400' : ''}
                                ${processingStatus[file.name].status === 'error' ? 'text-red-400' : ''}
                                ${processingStatus[file.name].status === 'processing' ? 'text-indigo-400' : ''}
                              `}>
                                {processingStatus[file.name].status === 'completed' && 'Completed'}
                                {processingStatus[file.name].status === 'error' && processingStatus[file.name].error}
                                {processingStatus[file.name].status === 'processing' && 'Processing...'}
                              </span>
                              {processingStatus[file.name].status !== 'error' && (
                                <span className="text-gray-400">
                                  {processingStatus[file.name].progress}%
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Form Section */}
                <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 space-y-6 border border-gray-800">

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

                  {processedFiles.length > 0 && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium text-white">Processed Files</h3>
                        <button
                          onClick={() => downloadZip(processedFiles)}
                          className="flex items-center px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg hover:from-emerald-600 hover:to-teal-600 transition-all duration-300"
                        >
                          <MdOutlineDownload className="w-5 h-5 mr-2" />
                          <span className="text-sm font-medium">Download All</span>
                        </button>
                      </div>
                      <div className="space-y-2">
                        {processedFiles.map((file, index) => (
                          <div
                            key={index}
                            className="p-3 rounded-lg bg-gray-800/30 border border-gray-700"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-300 truncate">{file.name}</span>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => copyDetectionLink(file.name, index)}
                                  className="p-1 text-gray-400 hover:text-indigo-400 transition-colors group relative"
                                >
                                  <MdContentCopy className="w-5 h-5" />
                                  <span className="absolute -top-8 right-0 bg-gray-900 text-xs text-gray-300 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                    {copiedIndex === index ? 'Copied!' : 'Copy detection link'}
                                  </span>
                                </button>
                                <a
                                  href={file.url}
                                  download={`watermarked_${file.name}`}
                                  className="p-1 text-indigo-400 hover:text-indigo-300 transition-colors"
                                >
                                  <MdOutlineDownload className="w-5 h-5" />
                                </a>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {!processedFiles.length && (
                    <button
                      type="submit"
                      onClick={processFiles}
                      disabled={!files.length || !text || isProcessing}
                      className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/20"
                    >
                      <div className="flex justify-center items-center">
                        {isProcessing ? (
                          <PulseLoader size={10} color="#FFFFFF" />
                        ) : (
                          <span className="font-semibold flex items-center">
                            Process {files.length} {files.length === 1 ? 'File' : 'Files'}
                            <MdOutlineSubdirectoryArrowRight className="ml-2" />
                          </span>
                        )}
                      </div>
                    </button>
                  )}

                  {error && (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                      <p className="text-red-400 text-sm">{error}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Detection Link Section - Only show after processing */}
              {processedFiles.length > 0 && (
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
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BatchUploadForm; 