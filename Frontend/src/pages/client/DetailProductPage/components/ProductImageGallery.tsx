import { useState } from "react";
import { Eye, FileText } from "lucide-react";
import AddToLove from "@/components/common/AddToLove";

interface ProductImageGalleryProps {
  product_id?: number;
  product_name?: string;
  product_images?: string[];
  onOpenImageModal: (index: number) => void;
}

export default function ProductImageGallery({
  product_id,
  product_name,
  product_images,
  onOpenImageModal,
}: ProductImageGalleryProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleImageClick = (index: number) => {
    setCurrentImageIndex(index);
  };

  return (
    <div className="space-y-4 min-w-0">
      {/* Main Image */}
      <div className="flex justify-center relative min-w-0">
        {product_images && product_images.length > 0 ? (
          <img
            src={product_images[currentImageIndex]}
            alt={product_name}
            loading="lazy"
            className="w-full h-[600px] object-cover rounded-lg shadow-lg cursor-pointer"
            onClick={() => onOpenImageModal(currentImageIndex)}
          />
        ) : (
          <div className="w-full h-[600px] bg-gray-200 rounded-lg flex items-center justify-center">
            <FileText className="w-16 h-16 text-gray-400" />
          </div>
        )}
        <div onClick={(e) => e.stopPropagation()}>
          <AddToLove
            product_id={product_id || 0}
            className="w-[100px] right-20 top-5"
          />
        </div>
        <div
          className="absolute top-5 right-5 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 backdrop-blur-sm"
          onClick={() => onOpenImageModal(currentImageIndex)}
          title="Xem chi tiết hình ảnh"
        >
          <Eye className="w-5 h-5 text-white" />
        </div>
      </div>

      {/* Related Images - Horizontal Scroll */}
      <div className="max-w-[80%] mx-auto">
        <div className="flex overflow-x-auto space-x-2 pb-4 pt-2">
          {product_images?.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Image ${index + 1}`}
              loading="lazy"
              className={`w-28 h-20 object-cover rounded-lg shadow-md cursor-pointer transition-all duration-200 hover:scale-105 flex-shrink-0 ${
                index === currentImageIndex
                  ? "ring-2 ring-blue-500"
                  : "hover:ring-1 hover:ring-gray-300"
              }`}
              onClick={() => handleImageClick(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
