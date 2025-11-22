import React, { useState, useRef, useEffect } from 'react';
import {formatPrice, parsePrice} from "@/utils/format_price";
import TinyMCEEditor from '@/components/editor/TinyMCEEditor';
import JustValidate from "just-validate";

type CatType = {
    id: number;
    name: string;
}
function PostProductPage(){
    const [formData, setFormData] = useState({
        productName: '',
        images: [] as File[],
        startingPrice: '',
        priceStep: '',
        buyNowPrice: '',
        description: '',
        autoExtend: false,
        category1: '',
        category2: ''
    });


    const [catlv1, setCatlv1] = useState<CatType[]> ();
    const [catlv2, setCatlv2] = useState<CatType[]> ();


    useEffect(() => {
        fetch("http://localhost:5000/api/categories/level1")
        .then (res => res.json())
        .then (data=> {
            setCatlv1 (data.data);
        })
        console.log("cat1 : ", catlv1);
    }, [])
    useEffect (()=>{
        console.log("Category1 changed to:", formData.category1, typeof formData.category1);
        if (formData.category1) {
            fetch(`http://localhost:5000/api/categories/level2?cat_id=${formData.category1}`)
            .then (res => res.json())
            .then (data=> {
                setCatlv2 (data.data);
                console.log("catlv2", data.data);
            })
            // Reset category2 when category1 changes
            setFormData(prev => ({
                ...prev,
                category2: ''
            }));
        } else {
            setCatlv2([]);
        }
        console.log("Form Data: ", formData);
    }, [formData.category1])

    
    useEffect (()=>{
        const validate = new JustValidate ("#PostProductForm");
        validate.addField("#productName", [
            {
                rule: "required",
                errorMessage: "Vui lòng nhập tên sản phẩm!"
            }
        ])
        validate.addField("#startingPrice", [
            {
                rule: "required",
                errorMessage: "Vui lòng nhập giá khởi điểm!"
            }
        ]),
        validate.addField("#priceStep", [
            {
                rule: "required",
                errorMessage: "Vui lòng nhập bước giá!"
            }
        ])
        validate.addField("#category1", [
            {
                validator: (value : any) => value.trim() !== "",
                errorMessage: "Vui lòng chọn danh mục chính!"
            }
        ]

        ),
        validate.addField("#category2", [
            {
                validator: (value : any) => value.trim() !== "",
                errorMessage: "Vui lòng chọn danh mục phụ!"
            }
        ]

        )
        .onSuccess ((event : any) => {
            event.preventDefault();
            console.log("Form data:", formData);
        })

    }, [])


    const editorRef = useRef (null);
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        
        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData(prev => ({
                ...prev,
                [name]: checked
            }));
        } else {
            // For category selects, value is already the ID from option value
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }

        // Reset category2 when category1 changes
        if (name === 'category1') { 
            setFormData(prev => ({
                ...prev,
                category2: ''
            }));
        }
    };

    const handleCurrencyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const numericValue = parsePrice(value);
        setFormData(prev => ({
            ...prev,
            [name]: numericValue
        }));
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        setFormData(prev => ({
            ...prev,
            images: [...prev.images, ...files].slice(0, 10) // Limit to 10 images
        }));
    };

    const removeImage = (index: number) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Form data:', formData);
        // Handle form submission here
    };

    return (
        <div className="min-h-screen 100 py-8">
            <div className="max-w-4xl mx-auto px-4">
                <div className="bg-white rounded-lg shadow-lg shadow-blue-200 p-8 border-2 border-gray-200">
                    <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Đăng sản phẩm đấu giá</h1>
                    
                    <form onSubmit={handleSubmit} className="space-y-6" id = "PostProductForm">
                        {/* Product Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Tên sản phẩm <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="productName"
                                id ="productName"
                                value={formData.productName}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Nhập tên sản phẩm..."
                                required
                            />
                        </div>

                        {/* Image Upload */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Hình ảnh sản phẩm <span className="text-red-500">*</span>
                            </label>
                            <div className="border-2 border-2 border-gray-300 rounded-lg p-6">
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handleImageUpload}
                                    className="hidden"
                                    id="imageUpload"
                                />
                                <label
                                    htmlFor="imageUpload"
                                    className="cursor-pointer flex flex-col items-center justify-center text-gray-500 hover:text-gray-700"
                                >
                                    <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                    <span>Click để tải ảnh lên (min: 3, max: 10)</span>
                                </label>
                                
                                {/* Image Preview */}
                                {formData.images.length > 0 && (
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                                        {formData.images.map((image, index) => (
                                            <div key={index} className="relative">
                                                <img
                                                    src={URL.createObjectURL(image)}
                                                    alt={`Preview ${index + 1}`}
                                                    className="w-full h-24 object-cover rounded-lg"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removeImage(index)}
                                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Price Information */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Giá khởi điểm <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        name="startingPrice"
                                        id ="startingPrice"
                                        value={formatPrice(Number(formData.startingPrice) || 0)}
                                        onChange={handleCurrencyChange}
                                        className="w-full px-4 py-2 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="0"
                                        required
                                    />
                                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">VNĐ</span>
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Bước giá <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        name="priceStep"
                                        id ="priceStep"
                                        value={formatPrice(Number(formData.priceStep) || 0)}
                                        onChange={handleCurrencyChange}
                                        className="w-full px-4 py-2 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="0"
                                        required
                                    />
                                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">VNĐ</span>
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Giá mua ngay (tùy chọn)
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        name="buyNowPrice"
                                        id ="buyNowPrice"
                                        value={formatPrice(Number(formData.buyNowPrice) || 0)}
                                        onChange={handleCurrencyChange}
                                        className="w-full px-4 py-2 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="0"
                                    />
                                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">VNĐ</span>
                                </div>
                            </div>
                        </div>

                        {/* Categories */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Danh mục chính <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="category1"
                                    id ="category1"
                                    value={formData.category1}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                >
                                    <option value="">Chọn danh mục chính</option>
                                    {catlv1?.map((cat, index) => (
                                        <option key={index} value={cat.id}>{cat?.name}</option>
                                    ))}
                                </select>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Danh mục phụ <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="category2"
                                    id ="category2"
                                    value={formData.category2}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    disabled={!formData.category1}
                                    required
                                >
                                    {!formData.category1 ? 
                                        <option value="">Chọn danh mục chính trước</option>
                                        : 
                                        <>
                                            <option value="">Chọn danh mục phụ</option>
                                            {catlv2?.map((cat, index) => (
                                                <option key={index} value={cat.id}>{cat.name}</option>
                                            ))}
                                        </>
                                    }
                                </select>
                            </div>
                        </div>

                        {/* Description */}
                        <div className = "text-xl">Mô tả sản phẩm <span className="text-red-500">*</span></div>
                        <TinyMCEEditor editorRef = {editorRef} />

                        {/* Auto Extend Option */}
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                name="autoExtend"
                                checked={formData.autoExtend}
                                onChange={handleInputChange}
                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                                id="autoExtend"
                            />
                            <label htmlFor="autoExtend" className="ml-2 text-sm font-medium text-gray-700">
                                Tự động gia hạn đấu giá khi có người đặt giá trong 5 phút cuối
                            </label>
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-center pt-6">
                            <button
                                type="submit"
                                className="bg-gray-800 hover:bg-gray-700 hover:shadow-md hover:shadow-green-400 hover:scale-105 transition-all duration-300 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2\
                                cursor-pointer"
                            >
                                Đăng sản phẩm
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default PostProductPage;