import axios from 'axios';
import { useState, useCallback , useContext} from 'react';
import { UserContext } from '../../context/userContext';

export default function FileUploader({ onUploadSuccess }) {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('idle');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const {setDetails} = useContext(UserContext)

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  }, []);

  async function handleFileUpload() {
    if (!file) return;

    setStatus('uploading');
    setUploadProgress(0);

    const formData = new FormData();
    formData.append('file', file);

    try {
      await axios.post('http://127.0.0.1:5000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const progress = progressEvent.total
            ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
            : 0;
          setUploadProgress(progress);
        },
      }).then( res =>{
        console.log(res.data)
        setDetails(res.data)
      });
      setStatus('success');
      onUploadSuccess()
      setUploadProgress(100);
    } catch {
      setStatus('error');
      setUploadProgress(0);
    }
  }

  return (
    <div className="space-y-4 p-6 max-w-md mx-auto">
      {/* Drag and Drop Area */}
      <div 
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
        }`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <input 
          type="file" 
          id="file-upload"
          onChange={handleFileChange} 
          className="hidden"
        />
        <label 
          htmlFor="file-upload" 
          className="cursor-pointer flex flex-col items-center justify-center gap-2"
        >
          <svg 
            className={`h-12 w-12 ${isDragging ? 'text-blue-500' : 'text-gray-400'}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" 
            />
          </svg>
          <p className="text-sm">
            <span className="font-medium text-blue-600 hover:text-blue-500">
              Click to upload
            </span> or drag and drop
          </p>
          <p className="text-xs text-gray-500">Any file type</p>
        </label>
      </div>

      {/* File Info */}
      {file && (
        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="text-sm"><span className="font-medium">File name:</span> {file.name}</p>
          <p className="text-sm"><span className="font-medium">Size:</span> {(file.size / 1024).toFixed(2)} KB</p>
          <p className="text-sm"><span className="font-medium">Type:</span> {file.type || 'Unknown'}</p>
        </div>
      )}

      {/* Upload Progress */}
      {status === 'uploading' && (
        <div className="space-y-2">
          <div className="h-2.5 w-full rounded-full bg-gray-200">
            <div
              className="h-2.5 rounded-full bg-blue-600 transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600 text-center">{uploadProgress}% uploaded</p>
        </div>
      )}

      {/* Upload Button */}
      {file && status !== 'uploading' && (
        <button
          onClick={handleFileUpload}
          className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
        >
          Upload File
        </button>
      )}

      {/* Status Messages */}
      {status === 'success' && (
        <div className="p-3 bg-green-50 text-green-700 rounded-md text-center">
          File uploaded successfully!
        </div>
      )}

      {status === 'error' && (
        <div className="p-3 bg-red-50 text-red-700 rounded-md text-center">
          Upload failed. Please try again.
        </div>
      )}
    </div>
  );
}