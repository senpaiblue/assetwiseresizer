interface ImagePreviewProps {
    imageUrl: string;
  }
  
  const ImagePreview: React.FC<ImagePreviewProps> = ({ imageUrl }) => {
    return (
      <div className="border rounded-lg overflow-hidden bg-white">
        <div className="relative pt-[56.25%]">
          <img 
            src={imageUrl} 
            alt="Preview" 
            className="absolute top-0 left-0 w-full h-full object-contain"
          />
        </div>
      </div>
    );
  };
  
  export default ImagePreview;
  