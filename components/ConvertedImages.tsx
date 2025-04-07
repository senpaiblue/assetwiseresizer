"use client";
import { useState } from 'react';
import { ConvertedImage, Platform } from '../types/index';
import { saveAs } from 'file-saver';

interface ConvertedImagesProps {
  convertedImages: ConvertedImage[];
  platforms: Platform[];
}

const ConvertedImages: React.FC<ConvertedImagesProps> = ({ convertedImages, platforms }) => {
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  
  const filteredImages = selectedPlatform 
    ? convertedImages.filter(img => img.platformId === selectedPlatform)
    : convertedImages;
  
  const getPlatformName = (platformId: string) => {
    return platforms.find(p => p.id === platformId)?.name || platformId;
  };
  
  const handleDownloadImage = (image: ConvertedImage) => {
    const platform = getPlatformName(image.platformId);
    saveAs(image.dataUrl, `${platform}-${image.aspectRatioName}.jpg`);
  };
  
  const handleDownloadAll = () => {
    filteredImages.forEach(image => {
      const platform = getPlatformName(image.platformId);
      saveAs(image.dataUrl, `${platform}-${image.aspectRatioName}.jpg`);
    });
  };

  // Group images by original source image
  const groupedByPlatform = filteredImages.reduce<Record<string, ConvertedImage[]>>((acc, image) => {
    if (!acc[image.platformId]) {
      acc[image.platformId] = [];
    }
    acc[image.platformId].push(image);
    return acc;
  }, {});

  return (
    <div className="bg-white rounded-lg border p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-black">Converted Images</h2>
        
        <div className="flex items-center gap-3">
          <select
            value={selectedPlatform || ''}
            onChange={(e) => setSelectedPlatform(e.target.value || null)}
            className="border rounded-md px-2 py-1 text-sm"
          >
            <option value="">All Platforms</option>
            {platforms
              .filter(p => convertedImages.some(img => img.platformId === p.id))
              .map(platform => (
                <option key={platform.id} value={platform.id}>
                  {platform.name}
                </option>
              ))}
          </select>
          
          <button
            onClick={handleDownloadAll}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1 rounded transition-colors"
          >
            Download All
          </button>
        </div>
      </div>
      
      {Object.entries(groupedByPlatform).map(([platformId, images]) => (
        <div key={platformId} className="mb-8">
          <h3 className="font-medium text-black text-lg mb-3">{getPlatformName(platformId)}</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {images.map((image, index) => (
              <div key={index} className="border rounded-lg overflow-hidden bg-gray-50">
                <div className="p-3 border-b bg-white">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{image.aspectRatioName}</span>
                    <span className="text-xs text-gray-500">
                      {image.width} x {image.height}px
                    </span>
                  </div>
                </div>
                
                <div className="relative pt-[56.25%]">
                  <img 
                    src={image.dataUrl} 
                    alt={`${getPlatformName(image.platformId)} - ${image.aspectRatioName}`}
                    className="absolute top-0 left-0 w-full h-full object-contain" 
                  />
                </div>
                
                <div className="p-3 border-t bg-white">
                  <button
                    onClick={() => handleDownloadImage(image)}
                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm py-1 px-3 rounded transition-colors"
                  >
                    Download
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ConvertedImages;