import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { Label } from '../ui/label';

const ImageUploader = ({ value, onChange, label = "Imagine", className = "" }) => {
  const [preview, setPreview] = useState(value || null);
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = (file) => {
    if (file && file.type.startsWith('image/')) {
      setIsUploading(true);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target.result;
        setPreview(dataUrl);
        onChange(dataUrl);
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    setPreview(null);
    onChange('');
  };

  // Update preview when value changes externally
  React.useEffect(() => {
    if (value && value !== preview) {
      setPreview(value);
    }
  }, [value]);

  return (
    <div className={className}>
      {label && <Label className="text-gray-300 mb-2 block">{label}</Label>}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all ${
          dragActive 
            ? 'border-red-500 bg-red-500/10' 
            : 'border-white/20 hover:border-white/40 bg-black/30'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={(e) => handleFileSelect(e.target.files?.[0])}
          className="hidden"
        />
        
        {isUploading ? (
          <div className="flex flex-col items-center py-4">
            <Loader2 className="w-8 h-8 text-red-500 animate-spin mb-2" />
            <p className="text-gray-400 text-sm">Se încarcă...</p>
          </div>
        ) : preview ? (
          <div className="relative">
            <img 
              src={preview} 
              alt="Preview" 
              className="max-h-32 mx-auto rounded-lg"
            />
            <button
              type="button"
              onClick={handleRemove}
              className="absolute -top-2 -right-2 p-1 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center py-4">
            <Upload className="w-8 h-8 text-gray-500 mb-2" />
            <p className="text-gray-400 text-sm">Click sau trage imaginea</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;
