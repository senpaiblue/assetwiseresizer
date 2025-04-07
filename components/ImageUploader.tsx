"use client";
import { useState, useRef } from 'react';
import { IconUpload, IconX } from '@tabler/icons-react';

interface ImageUploaderProps {
  onImagesUploaded: (images: string[]) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImagesUploaded }) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const processFiles = (files: FileList) => {
    const imageFiles = Array.from(files).filter(file => file.type.startsWith('image/'));
    
    const newImages: string[] = [];
    let processed = 0;
    
    imageFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          newImages.push(event.target.result as string);
        }
        
        processed++;
        if (processed === imageFiles.length) {
          const allImages = [...uploadedImages, ...newImages];
          setUploadedImages(allImages);
          onImagesUploaded(allImages);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const removeImage = (index: number) => {
    const updatedImages = [...uploadedImages];
    updatedImages.splice(index, 1);
    setUploadedImages(updatedImages);
    onImagesUploaded(updatedImages);
  };

  return (
    <div className="w-full">
      <h2 className="text-xl font-semibold mb-3 text-black ">Upload Images</h2>
      
      <div
        className={`border-2 border-dashed p-6 rounded-lg text-center ${
          dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
        }`}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={openFileDialog}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleChange}
          className="hidden"
        />
        
        <IconUpload className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-2 text-sm text-gray-600">
          Drag & drop images here, or click to select files
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Supported formats: JPG, PNG, GIF, etc.
        </p>
      </div>

      {uploadedImages.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {uploadedImages.map((image, index) => (
            <div 
              key={index} 
              className="relative h-16 w-16 rounded overflow-hidden group"
            >
              <img 
                src={image} 
                alt={`Uploaded ${index + 1}`} 
                className="h-full w-full object-cover"
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeImage(index);
                }}
                className="absolute top-0 right-0 bg-red-500 text-white p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <IconX size={12} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUploader;