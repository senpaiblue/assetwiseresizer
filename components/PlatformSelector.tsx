"use client";
import { Platform } from '../../types/index';
import { 
  IconBrandX, 
  IconBrandLinkedin, 
  IconBrandInstagram, 
  IconBrandFacebook 
} from '@tabler/icons-react';

interface PlatformSelectorProps {
  platforms: Platform[];
  selectedPlatforms: string[];
  onPlatformsSelected: (platforms: string[]) => void;
}

const PlatformSelector: React.FC<PlatformSelectorProps> = ({ 
  platforms, 
  selectedPlatforms, 
  onPlatformsSelected 
}) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'IconBrandX':
        return <IconBrandX />;
      case 'IconBrandLinkedin':
        return <IconBrandLinkedin />;
      case 'IconBrandInstagram':
        return <IconBrandInstagram />;
      case 'IconBrandFacebook':
        return <IconBrandFacebook />;
      default:
        return null;
    }
  };

  const togglePlatform = (platformId: string) => {
    if (selectedPlatforms.includes(platformId)) {
      onPlatformsSelected(selectedPlatforms.filter(id => id !== platformId));
    } else {
      onPlatformsSelected([...selectedPlatforms, platformId]);
    }
  };

  return (
    <div className="w-full">
      <h2 className="text-xl font-semibold mb-3">Select Platforms</h2>
      
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {platforms.map((platform) => (
          <button
            key={platform.id}
            onClick={() => togglePlatform(platform.id)}
            className={`flex flex-col items-center justify-center p-4 rounded-lg border ${
              selectedPlatforms.includes(platform.id)
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="text-2xl mb-2">
              {getIcon(platform.icon)}
            </div>
            <span className="text-sm font-medium">{platform.name}</span>
          </button>
        ))}
      </div>
      
      {selectedPlatforms.length > 0 && (
        <div className="mt-4">
          <h3 className="font-medium text-sm mb-2">Aspect Ratios:</h3>
          <div className="text-xs text-gray-600 space-y-2">
            {platforms
              .filter(platform => selectedPlatforms.includes(platform.id))
              .map(platform => platform.aspectRatios.map(ratio => (
                <div key={`${platform.id}-${ratio.name}`}>
                  <span className="font-medium">{platform.name} - {ratio.name}:</span>{' '}
                  {ratio.width} x {ratio.height}px ({ratio.ratio})
                </div>
              )))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PlatformSelector;
