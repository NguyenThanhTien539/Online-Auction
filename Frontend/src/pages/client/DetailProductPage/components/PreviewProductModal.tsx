import { useState } from 'react';
import { Eye, X, ChevronLeft, ChevronRight } from 'lucide-react';

type ProductType = {
    product_id : number,
    product_images : string[],
    product_name : string,
    current_price : number,
    buy_now_price : number,
    start_time : any,
    end_time : any,
    price_owner_username : string,
    bid_turns : string
}

export default function PreviewImage({images, name, modalImageIndex, setModalImageIndex, setImageModalOpen}: {images : string[], name: string, modalImageIndex: number, setModalImageIndex: any, setImageModalOpen: (isOpen: boolean) => void}) {
    const [oldImageIndex, setOldImageIndex] = useState<number | null>(null);
    const [oldImageAnimation, setOldImageAnimation] = useState("");
    const [newImageAnimation, setNewImageAnimation] = useState("");
    
    const animateTransition = (newIndex: number, direction: "left" | "right") => {
        // Set old image to fade out
        setOldImageIndex(modalImageIndex);
        setOldImageAnimation(direction === "right" ? "animate__animated animate__fadeOutLeft animate__faster" : "animate__animated animate__fadeOutRight animate__faster");
        
        // Set new image to fade in
        setNewImageAnimation(direction === "right" ? "animate__animated animate__fadeInRight animate__faster" : "animate__animated animate__fadeInLeft animate__faster");
        
        setModalImageIndex(newIndex);
        
        // Clean up after animation
        setTimeout(() => {
            setOldImageIndex(null);
            setOldImageAnimation("");
            setNewImageAnimation("");
        }, 600);
    };
    
    const nextImage = () => {
        if (images) {
            const newIndex = (modalImageIndex + 1) % images.length;
            animateTransition(newIndex, "right");
        }
    };

    const prevImage = () => {
        if (images) {
            const newIndex = (modalImageIndex - 1 + images.length) % images.length;
            animateTransition(newIndex, "left");
        }
    };
    
    const handleThumbnailClick = (index: number) => {
        if (index === modalImageIndex) return;
        
        const direction = index > modalImageIndex ? "right" : "left";
        animateTransition(index, direction);
    };
    return(
        <>
          <div className="fixed inset-0 z-[10001] flex items-center justify-center p-2 bg-black/70 backdrop-blur-sm animate-fadeIn" onClick={() => setImageModalOpen(false)}>
          <div className="relative w-[70vw] max-w-7xl max-h-[95vh] rounded-xl shadow-2xl overflow-hidden animate-scaleIn" onClick={e => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 bg-white/50 text-white">
              <h3 className="text-lg font-semibold flex items-center">
                <Eye className="w-5 h-5 mr-2" />
                {name} ({modalImageIndex + 1}/{images.length})
              </h3>
              <button
                onClick={() => setImageModalOpen(false)}
                className="p-2 hover:bg-red-400 rounded-full transition-all duration-200"
                title="Đóng"
              >
                <X className="w-5 h-5 bg-red-500 cursor-pointer" />
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="relative bg-white/30">
              <div className="relative p-6 py-2 min-h-[70vh] flex items-center justify-center">
                {/* Old image fading out */}
                {oldImageIndex !== null && (
                  <img
                    key={`old-${oldImageIndex}`}
                    src={images[oldImageIndex]}
                    alt={`${name} - Image ${oldImageIndex + 1}`}
                    className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-full max-h-[70vh] object-contain rounded-lg shadow-lg ${oldImageAnimation}`}
                  />
                )}
                {/* New image fading in */}
                <img
                  key={`current-${modalImageIndex}`}
                  src={images[modalImageIndex]}
                  alt={`${name} - Image ${modalImageIndex + 1}`}
                  className={`max-w-full max-h-[70vh] object-contain rounded-lg shadow-lg ${newImageAnimation}`}
                />
                
                {/* Navigation Arrows */}
                {images && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute cursor-pointer left-2 top-1/2 -translate-y-1/2 p-3 bg-black/50 hover:bg-black/70 text-white rounded-full transition-all duration-200 backdrop-blur-sm"
                      title="Hình trước"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute cursor-pointer right-2 top-1/2 -translate-y-1/2 p-3 bg-black/50 hover:bg-black/70 text-white rounded-full transition-all duration-200 backdrop-blur-sm"
                      title="Hình tiếp theo"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </>
                )}
              </div>
              
              {/* Thumbnail Navigation */}
              {images && (
                <div className="p-4 bg-gray-100/70 h-[100px] ">
                  <div className="flex justify-center space-x-2 py-2 overflow-x-auto">
                    {images.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`Thumbnail ${index + 1}`}
                        className={`w-16 h-16 object-cover rounded cursor-pointer transition-all duration-200 flex-shrink-0 ${
                          index === modalImageIndex 
                            ? 'ring-2 ring-pink-500  ring-offset-2' 
                            : 'opacity-70 hover:opacity-100'
                        }`}
                        onClick={() => handleThumbnailClick(index)}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        </>
    );
}