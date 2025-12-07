import React from 'react';
import { Loader2, ShoppingBag } from 'lucide-react';
import avatar from '@/assets/images/avatar.png';
interface LoadingProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  showImage?: boolean;
  image?: string;
}

const Loading: React.FC<LoadingProps> = ({
  message = "Đang tải...",
  size = 'md',
  showImage = true,
  image
}) => {
  const sizeClasses = {
    sm: {
      container: 'p-4',
      spinner: 'w-6 h-6',
      image: 'w-12 h-12',
      text: 'text-sm',
      dots: 'text-sm'
    },
    md: {
      container: 'p-8',
      spinner: 'w-8 h-8',
      image: 'w-16 h-16',
      text: 'text-base',
      dots: 'text-base'
    },
    lg: {
      container: 'p-12',
      spinner: 'w-12 h-12',
      image: 'w-24 h-24',
      text: 'text-lg',
      dots: 'text-lg'
    }
  };

  const currentSize = sizeClasses[size];
  if (!image) {
    image = avatar;
  }
  return (
    <div className="fixed inset-0 mt-[50px] lg:mt-[70px] bg-gray-100 backdrop-blur-sm flex items-center justify-center z-100">
      <div className={`${currentSize.container} backdrop-blur-md rounded-2xl  max-w-4xl mx-4`}>
        {/* Main content - Horizontal layout */}
        <div className="flex flex-col items-center justify-center space-x-12">
          {/* Image/Icon with orbiting dots */}
          {showImage && (
            <div className="relative flex-shrink-0">
              {image ? (
                <div className={`${currentSize.image} rounded-full overflow-hidden border-2 border-white/30 shadow-lg relative`}>
                  <img
                    src={image}
                    alt="Loading"
                    className="w-full h-full object-cover bg-white"
                  />
                </div>
              ) : (
                <div className={`${currentSize.image} bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg relative`}>
                  <ShoppingBag className="w-8 h-8 text-white" />
                </div>
              )}

              {/* Pulsing ring */}
              <div className="absolute inset-0 rounded-full border-2 border-blue-400/30 animate-ping"></div>

              {/* Orbiting dots around image */}
              <div className="absolute inset-0 animate-spin" style={{ animationDuration: '3s' }}>
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-2 h-2 bg-blue-100 rounded-full shadow-sm"
                    style={{
                      top: '50%',
                      left: '50%',
                      transform: `translateX(-50%) translateY(-50%) rotate(${i * 90}deg) translateX(${parseInt(currentSize.image.split('w-')[1].split(' ')[0]) * 4 + 8}px)`,
                    }}
                  ></div>
                ))}
              </div>
            </div>
          )}

          {/* Loading text */}
          <div className="mt-5 flex flex-col items-start space-y-2 mx-auto  ">
            <div className="text-md text-gray-400">
              Đang tải ...
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes loading-bar {
          0%, 100% { width: 0%; }
          50% { width: 100%; }
        }

        @keyframes shooting-star {
          0% {
            opacity: 0;
            transform: rotate(45deg) translateX(0px) scale(0);
          }
          10% {
            opacity: 1;
            transform: rotate(45deg) translateX(0px) scale(1);
          }
          90% {
            opacity: 1;
            transform: rotate(45deg) translateX(40px) scale(1);
          }
          100% {
            opacity: 0;
            transform: rotate(45deg) translateX(40px) scale(0);
          }
        }
      `}</style>
    </div>
  );
};

export default Loading;