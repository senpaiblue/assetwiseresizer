"use client";
import { useState } from 'react';
import Head from 'next/head';
import ImageUploader from '../components/ImageUploader';
import PlatformSelector from '../components/PlatformSelector';
import ImagePreview from '../components/ImagePreview';
import ConvertedImages from '../components/ConvertedImages';
import { Platform, ConvertedImage } from '../types/index';

const platforms: Platform[] = [
  {
    id: 'twitter',
    name: 'Twitter',
    icon: 'IconBrandX',
    aspectRatios: [
      {
        name: 'Standard Post',
        width: 1200,
        height: 675,
        ratio: '16:9',
        maxFileSize: '5MB (15MB for GIFs on web)'
      }
    ]
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    icon: 'IconBrandLinkedin',
    aspectRatios: [
      {
        name: 'Shared Image/Post',
        width: 1200,
        height: 627,
        ratio: '1.91:1',
        maxFileSize: '5MB (JPEG, PNG, GIF)'
      },
      {
        name: 'Company Page Hero',
        width: 1128,
        height: 191,
        ratio: '5.9:1',
        maxFileSize: '5MB (JPEG, PNG, GIF)'
      }
    ]
  },
  {
    id: 'instagram',
    name: 'Instagram',
    icon: 'IconBrandInstagram',
    aspectRatios: [
      {
        name: 'Square Post',
        width: 1080,
        height: 1080,
        ratio: '1:1',
        maxFileSize: '30MB'
      },
      {
        name: 'Portrait Post',
        width: 1080,
        height: 1350,
        ratio: '4:5',
        maxFileSize: '30MB'
      },
      {
        name: 'Landscape Post',
        width: 1080,
        height: 566,
        ratio: '1.91:1',
        maxFileSize: '30MB'
      }
    ]
  },
  {
    id: 'facebook',
    name: 'Facebook',
    icon: 'IconBrandFacebook',
    aspectRatios: [
      {
        name: 'Shared Image/Post',
        width: 1200,
        height: 630,
        ratio: '1.91:1',
        maxFileSize: '30MB'
      },
      {
        name: 'Square Post',
        width: 1080,
        height: 1080,
        ratio: '1:1',
        maxFileSize: '30MB'
      }
    ]
  }
];

export default function Home() {
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [convertedImages, setConvertedImages] = useState<ConvertedImage[]>([]);
  const [isConverting, setIsConverting] = useState(false);

  const handleImagesUploaded = (images: string[]) => {
    setUploadedImages(images);
    // Reset converted images when new images are uploaded
    setConvertedImages([]);
  };

  const handlePlatformsSelected = (platformIds: string[]) => {
    setSelectedPlatforms(platformIds);
    // Reset converted images when platforms selection changes
    setConvertedImages([]);
  };

  const handleConvertImages = async () => {
    if (uploadedImages.length === 0 || selectedPlatforms.length === 0) return;
    
    setIsConverting(true);
    const newConvertedImages: ConvertedImage[] = [];
    
    try {
      for (const imageUrl of uploadedImages) {
        // Load image
        const sourceImage = await new Promise<HTMLImageElement>((resolve) => {
          const img = new Image();
          img.onload = () => resolve(img);
          img.src = imageUrl;
        });
        
        // Convert for each selected platform and its aspect ratios
        for (const platformId of selectedPlatforms) {
          const platform = platforms.find(p => p.id === platformId);
          if (!platform) continue;
          
          for (const aspectRatio of platform.aspectRatios) {
            const resizedDataUrl = await resizeImage(
              sourceImage,
              aspectRatio.width,
              aspectRatio.height
            );
            
            newConvertedImages.push({
              platformId,
              aspectRatioName: aspectRatio.name,
              dataUrl: resizedDataUrl,
              width: aspectRatio.width,
              height: aspectRatio.height
            });
          }
        }
      }
      
      setConvertedImages(newConvertedImages);
    } catch (error) {
      console.error('Error converting images:', error);
    } finally {
      setIsConverting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Social Media Image Converter</title>
        <meta name="description" content="Convert images for various social media platforms" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-black text-center mb-8">Social Media Image Converter</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <ImageUploader onImagesUploaded={handleImagesUploaded} />
            <PlatformSelector 
              platforms={platforms} 
              selectedPlatforms={selectedPlatforms}
              onPlatformsSelected={handlePlatformsSelected} 
            />
            
            {uploadedImages.length > 0 && (
              <div className="mt-6">
                <h2 className="text-xl text-black font-semibold mb-3">Preview Original Images</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {uploadedImages.map((image, index) => (
                    <ImagePreview key={index} imageUrl={image} />
                  ))}
                </div>
              </div>
            )}
            
            {uploadedImages.length > 0 && selectedPlatforms.length > 0 && (
              <button
                onClick={handleConvertImages}
                disabled={isConverting}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:bg-blue-400"
              >
                {isConverting ? 'Converting...' : 'Convert Images'}
              </button>
            )}
          </div>
          
          <div>
            {convertedImages.length > 0 && (
              <ConvertedImages 
                convertedImages={convertedImages} 
                platforms={platforms} 
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
async function resizeImage(sourceImage: HTMLImageElement, targetWidth: number, targetHeight: number): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        throw new Error('Canvas context is not available');
      }

      // Set canvas dimensions to the target size
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      
      // Calculate source and target aspect ratios
      const sourceAspect = sourceImage.width / sourceImage.height;
      const targetAspect = targetWidth / targetHeight;
      
      // Variables for source drawing area
      let sx = 0, sy = 0, sWidth = sourceImage.width, sHeight = sourceImage.height;
      
      // Apply cropping strategy based on aspect ratios
      if (sourceAspect > targetAspect) {
        // Source is wider than target - crop sides
        sWidth = sourceImage.height * targetAspect;
        sx = (sourceImage.width - sWidth) / 2;
      } else if (sourceAspect < targetAspect) {
        // Source is taller than target - crop top/bottom
        sHeight = sourceImage.width / targetAspect;
        sy = (sourceImage.height - sHeight) / 2;
      }
      
      // Draw the properly cropped image to the canvas
      ctx.drawImage(
        sourceImage,
        sx, sy, sWidth, sHeight,  // Source rectangle
        0, 0, targetWidth, targetHeight  // Destination rectangle
      );

      // Convert the canvas content to a data URL
      const dataUrl = canvas.toDataURL('image/jpeg', 0.9); // Slightly higher quality
      resolve(dataUrl);
    } catch (error) {
      reject(error);
    }
  });
}
