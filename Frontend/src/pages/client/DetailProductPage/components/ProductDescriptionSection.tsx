import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FileText, ChevronDown, ChevronUp, Edit3 } from 'lucide-react';

interface ProductDescriptionSectionProps {
  description: string;
  isSeller?: boolean;
}

const ProductDescriptionSection: React.FC<ProductDescriptionSectionProps> = ({ description, isSeller }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleEditClick = () => {
    navigate(`${location.pathname}/edit`);
  };

  return (
    <div className="bg-white rounded-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 rounded-lg">
            <FileText className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Mô tả sản phẩm
            </h3>
            <p className="text-sm text-blue-600">Thông tin chi tiết về sản phẩm</p>
          </div>
        </div>
        
        {/* Edit Button - Only visible for seller */}
        {isSeller && (
          <button
            onClick={handleEditClick}
            className="flex items-center cursor-pointer gap-2 px-4 py-2 bg-gradient-to-r from-blue-300 to-blue-600 text-white rounded-lg hover:from-blue-400 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg font-medium text-sm"
          >
            <Edit3 className="w-4 h-4" />
            Cập nhật mô tả
          </button>
        )}
      </div>

      {/* Content */}
      <div className="prose prose-sm max-w-none pl-4">
        <div
          className={`text-gray-700 leading-relaxed transition-all duration-300 ${
            isExpanded ? 'max-h-none' : 'max-h-24 overflow-hidden'
          }`}
          dangerouslySetInnerHTML={{ __html: description || '' }}
        />
        {description && description.length > 200 && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {isExpanded ? (
              <>
                Thu gọn <ChevronUp className="w-4 h-4" />
              </>
            ) : (
              <>
                Xem thêm <ChevronDown className="w-4 h-4" />
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductDescriptionSection;