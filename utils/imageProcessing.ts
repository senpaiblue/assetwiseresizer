export const resizeImage = (
    sourceImage: HTMLImageElement,
    targetWidth: number,
    targetHeight: number
  ): Promise<string> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        throw new Error('Could not get canvas context');
      }
  
      // Calculate dimensions to maintain aspect ratio and center crop
      const sourceAspect = sourceImage.width / sourceImage.height;
      const targetAspect = targetWidth / targetHeight;
      
      let sWidth, sHeight, sx, sy;
      
      if (sourceAspect > targetAspect) {
        // Source is wider than target
        sHeight = sourceImage.height;
        sWidth = sourceImage.height * targetAspect;
        sx = (sourceImage.width - sWidth) / 2;
        sy = 0;
      } else {
        // Source is taller than target
        sWidth = sourceImage.width;
        sHeight = sourceImage.width / targetAspect;
        sx = 0;
        sy = (sourceImage.height - sHeight) / 2;
      }
      
      // Draw source image into the canvas with cropping
      ctx.drawImage(
        sourceImage,
        sx, sy, sWidth, sHeight,
        0, 0, targetWidth, targetHeight
      );
      
      // Convert the canvas to a data URL
      resolve(canvas.toDataURL('image/jpeg', 0.9));
    });
  };