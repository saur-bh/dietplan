import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { DocumentArrowUpIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { processUploadedFile } from '../utils/fileUtils';

const UploadReport = ({ onTextExtracted, extractedText }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  const onDrop = async (acceptedFiles) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    setIsProcessing(true);
    setError(null);

    try {
      const extractedText = await processUploadedFile(file);
      onTextExtracted(extractedText);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'text/markdown': ['.md'],
      'text/plain': ['.txt']
    },
    maxFiles: 1,
    disabled: isProcessing
  });

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors duration-200
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
          ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}
          ${extractedText ? 'border-green-500 bg-green-50' : ''}
        `}
      >
        <input {...getInputProps()} />
        
        <div className="flex flex-col items-center space-y-3">
          {extractedText ? (
            <CheckCircleIcon className="w-12 h-12 text-green-500" />
          ) : (
            <DocumentArrowUpIcon className="w-12 h-12 text-gray-400" />
          )}
          
          {isProcessing ? (
            <div className="space-y-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
              <p className="text-sm text-gray-600">Processing your file...</p>
            </div>
          ) : extractedText ? (
            <div className="space-y-2">
              <p className="text-sm font-medium text-green-600">Health report uploaded successfully!</p>
              <p className="text-xs text-gray-500">
                Extracted {extractedText.length} characters
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">
                {isDragActive 
                  ? 'Drop your health report here...' 
                  : 'Upload your health report'
                }
              </p>
              <p className="text-xs text-gray-500">
                Supports PDF, Markdown (.md), and text files
              </p>
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {extractedText && (
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Extracted Text Preview:</h3>
          <div className="text-xs text-gray-600 max-h-32 overflow-y-auto">
            {extractedText.substring(0, 500)}
            {extractedText.length > 500 && '...'}
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadReport;