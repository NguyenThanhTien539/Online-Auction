import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import TinyMCEEditor from '@/components/editor/TinyMCEEditor';
import { Clock, Package, DollarSign, Calendar, Tag, Save, ArrowLeft, Check, X } from 'lucide-react';
import Loading from '@/components/common/Loading';
import {useAuth} from "@/routes/ProtectedRouter"

interface ProductDetail {
    product_id: number;
    product_name: string;
    product_images: string[];
    current_price: number;
    start_price: number;
    step_price: number;
    buy_now_price: number;
    start_time: string;
    end_time: string;
    description: string;
    cat2_id: number;
    bid_turns: number;
    auto_extended: boolean;
}

export default function EditProductPage() {

    const {auth} = useAuth();
    const {slugid}= useParams();
    const navigate = useNavigate();
    const [product_id, setProductId] = useState<number | null>(null);
    const [product_slug, setProductSlug] = useState<string>('');
    const [product, setProduct] = useState<ProductDetail | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [newDescription, setNewDescription] = useState('');
    const [isSeller, setIsSeller] = useState(false);

    useEffect(() => {
        // Check if the user is a seller of the product or an admin
        if (auth && product){
            if (auth.user_id === (product as any).seller_id) {
                setIsSeller(true);
            }
            else{
                navigate (-1);
            }
        }
    }, [auth, product]);

    // Extract product_id from slugId (format: slug-123)
    useEffect(()=> {
         if (slugid){
            const parts = slugid.split("-");
            if (parts.length > 1) {
                const id = Number(parts[parts.length - 1]);
                const slug = parts.slice(0, parts.length - 1).join("-");
                if (product_id !== id) {
                    setProductId(id);
                }
                if (product_slug !== slug) {
                    setProductSlug(slug);
                }
            }
    }
    }, [slugid]);
   

    const handleEditorChange = (content: string) => {
        setNewDescription(content);
    };
    const editorRef = React.useRef<any>(null);
    useEffect(() => {
        if (product_id && product_slug)
            fetchProductDetail();
    }, [product_id, product_slug]);

    const fetchProductDetail = async () => {
        try {
            // Assuming you have an API endpoint to get product by ID
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/products/detail?product_id=${product_id}&product_slug=${product_slug}`, {
                method: 'GET',
                credentials: 'include',
            });
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Failed to fetch product');
            }
            
            setProduct(data.data);
        } catch (error: any) {
            toast.error(error.message || 'Không thể tải thông tin sản phẩm');
            navigate(-1);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddDescription = async () => {
        if (!newDescription.trim()) {
            toast.error('Vui lòng nhập nội dung mô tả');
            return;
        }

        setIsSaving(true);
        try {
            // Create timestamp HTML
            const now = new Date();
            const timestamp = now.toLocaleString('vi-VN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });
            
            const timestampDiv = `<div style="background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); padding: 12px 16px; border-radius: 8px; margin: 24px 0 12px; border-left: 4px solid #3b82f6; box-shadow: 0 2px 4px rgba(59, 130, 246, 0.1);">
                <p style="margin: 0; color: #1e40af; font-size: 13px; font-weight: 600; letter-spacing: 0.3px;">
                    <strong style="color: #2563eb;">⏱ Cập nhật lúc:</strong> ${timestamp}
                </p>
            </div>`;
            
            // Append new content to existing description
            const updatedDescription = (product?.description || '') + timestampDiv + newDescription;
            
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/products/update/description`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    product_id: product_id,
                    description: updatedDescription
                })
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Failed to update description');
            }

            toast.success('Cập nhật mô tả thành công!');
            setProduct(product ? { ...product, description: updatedDescription } : null);
            setNewDescription('');
        } catch (error: any) {
            toast.error(error.message || 'Không thể cập nhật mô tả');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading || !product || !isSeller) {
        return (
            <Loading />
        );
    }   


    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-8 px-4">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span>Quay lại</span>
                    </button>
                    <h1 className="text-3xl font-bold text-gray-900">Chỉnh sửa sản phẩm</h1>
                    <p className="text-gray-600 mt-2">Cập nhật thông tin mô tả sản phẩm của bạn</p>
                </div>

                {/* Product Images - Full Width */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Package className="w-5 h-5 text-blue-600" />
                        Hình ảnh sản phẩm
                    </h3>
                    <div className="grid grid-cols-5 gap-4 max-h-[400px] overflow-y-auto p-2">
                        {product?.product_images?.map((image, index) => (
                            <div key={index} className="aspect-square">
                                <img
                                    src={image}
                                    alt={`Product ${index + 1}`}
                                    className="w-full h-full object-cover rounded-lg border-2 border-gray-200 hover:border-blue-400 transition-colors shadow-sm"
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Product Name and Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {/* Product Name */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <Package className="w-5 h-5 text-blue-600" />
                            Tên sản phẩm
                        </h3>
                        <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-4 py-3 rounded-lg border border-gray-200">
                            <p className="text-gray-900 font-semibold text-lg">{product?.product_name}</p>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <Tag className="w-5 h-5 text-blue-600" />
                            Thống kê đấu giá
                        </h3>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center bg-gray-50 px-4 py-2 rounded-lg">
                                <span className="text-gray-600 font-medium">Số lượt đấu giá:</span>
                                <span className="font-bold text-blue-600 text-lg">{product?.bid_turns ?? 0}</span>
                            </div>
                            <div className="flex justify-between items-center bg-gray-50 px-4 py-2 rounded-lg">
                                <span className="text-gray-600 font-medium">Tự động gia hạn:</span>
                                <span className={`font-semibold flex items-center gap-1 ${product?.auto_extended ? 'text-emerald-600' : 'text-gray-400'}`}>
                                    {product?.auto_extended ? (
                                        <>
                                            <Check className="w-4 h-4" />
                                            Có
                                        </>
                                    ) : (
                                        <>
                                            <X className="w-4 h-4" />
                                            Không
                                        </>
                                    )}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Price and Time Info Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                    {/* Price Info */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 lg:col-span-2">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <DollarSign className="w-5 h-5 text-blue-600" />
                            Thông tin giá
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">
                                    Giá khởi điểm
                                </label>
                                <div className="bg-gray-50 px-4 py-2 rounded-lg border border-gray-200">
                                    <p className="text-gray-900 font-semibold">{product?.start_price?.toLocaleString()} VNĐ</p>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">
                                    Giá hiện tại
                                </label>
                                <div className="bg-gradient-to-r from-blue-50 to-emerald-50 px-4 py-2 rounded-lg border-2 border-emerald-200">
                                    <p className="text-emerald-600 font-bold text-lg">{product?.current_price?.toLocaleString()} VNĐ</p>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">
                                    Bước giá
                                </label>
                                <div className="bg-gray-50 px-4 py-2 rounded-lg border border-gray-200">
                                    <p className="text-gray-900 font-semibold">{product?.step_price?.toLocaleString()} VNĐ</p>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">
                                    Giá mua ngay
                                </label>
                                <div className="bg-gray-50 px-4 py-2 rounded-lg border border-gray-200">
                                    <p className="text-gray-900 font-semibold">{product?.buy_now_price?.toLocaleString()} VNĐ</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Time Info */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-blue-600" />
                            Thời gian đấu giá
                        </h3>
                        <div className="space-y-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">
                                    Bắt đầu
                                </label>
                                <div className="bg-gray-50 px-4 py-2 rounded-lg border border-gray-200">
                                    <p className="text-gray-900 text-sm">{product?.start_time ? new Date(product.start_time).toLocaleString('vi-VN') : 'N/A'}</p>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">
                                    Kết thúc
                                </label>
                                <div className="bg-gray-50 px-4 py-2 rounded-lg border border-gray-200">
                                    <p className="text-gray-900 text-sm">{product?.end_time ? new Date(product.end_time).toLocaleString('vi-VN') : 'N/A'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Current Description - Full Width */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Mô tả hiện tại
                    </h3>
                    <div 
                        className="prose max-w-none bg-gray-50 p-4 rounded-lg border border-gray-200 max-h-96 overflow-y-auto"
                        dangerouslySetInnerHTML={{ __html: product?.description || 'Chưa có mô tả' }}
                    />
                </div>

                {/* Add New Description - Full Width */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Thêm mô tả mới
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                        Nội dung mới sẽ được thêm vào cuối mô tả hiện tại. Bạn không thể xóa hoặc chỉnh sửa nội dung cũ.
                    </p>
                    <div className="mb-4">
                        <TinyMCEEditor editorRef = {editorRef} onEditChange = {handleEditorChange}/>
                    </div>
                    <button
                        onClick={handleAddDescription}
                        disabled={isSaving || !newDescription.trim()}
                        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                    >
                        <Save className="w-5 h-5" />
                        {isSaving ? 'Đang lưu...' : 'Thêm mô tả'}
                    </button>
                </div>
            </div>
        </div>
    );
}
