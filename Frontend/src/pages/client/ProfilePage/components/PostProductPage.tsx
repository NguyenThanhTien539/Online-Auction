import React, { useState, useRef, useEffect, use } from 'react';
import {formatPrice, parsePrice} from "@/utils/format_price";
import TinyMCEEditor from '@/components/editor/TinyMCEEditor';
import JustValidate from "just-validate";
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { Clock, Calendar, Image as ImageIcon } from 'lucide-react';
import UploadImage from '@/components/common/UploadImage';
import SelectMenu from '@/components/common/Select';
import { usePreventBodyLock } from '@/hooks/usePreventBodyLock';
import formatToUTC from '@/utils/format_time';
import { toast } from 'sonner';


type CatType = {
    id: number;
    name: string;
}
function PostProductPage(){
    usePreventBodyLock ();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        product_name: '',
        product_images: [] as File[],
        start_price: '',
        step_price: '',
        buy_now_price: '',
        start_time: null as Date | null,
        end_time: null as Date | null,
        description: '',
        autoExtend: false,
        cat1_id: 0,
        cat2_id: 0,
    });


    const [catlv1, setCatlv1] = useState<CatType[]> ();
    const [catlv2, setCatlv2] = useState<CatType[]> ();


    useEffect(() => {

        fetch("http://localhost:5000/api/categories/level1")
        .then (res => res.json())
        .then (data=> {
            setCatlv1 (data.data);
        })
    }, [])

    useEffect (()=>{
        if (formData.cat1_id) {
            fetch(`http://localhost:5000/api/categories/level2/noslug?cat_id=${formData.cat1_id}`)
            .then (res => res.json())
            .then (data=> {
                setCatlv2 (data.data);
              
            })
        } else {
            setCatlv2([]);
        }
    }, [formData.cat1_id])

    
    useEffect (()=>{
        const validate = new JustValidate ("#PostProductForm");
        validate.addField("#product_name", [
            {
                rule: "required",
                errorMessage: "Vui lòng nhập tên sản phẩm!"
            }
        ])
        validate.addField("#start_price", [
            {
                rule: "required",
                errorMessage: "Vui lòng nhập giá khởi điểm!"
            }
        ]),
        validate.addField("#step_price", [
            {
                rule: "required",
                errorMessage: "Vui lòng nhập bước giá!"
            }
        ])
        validate.addField("#cat1_id", [
            {
                validator: (value: any) => value.trim() != 0,
                errorMessage: "Vui lòng chọn danh mục chính!"
            }
        ]),
        validate.addField("#cat2_id", [
            {
                validator: (value: any) => value.trim() != 0,
                errorMessage: "Vui lòng chọn danh mục phụ!"
            }
        ]),
        validate.addField ("#start_time", [
            {
                rule: "required",
                errorMessage: "Vui lòng chọn thời gian bắt đầu!"
            }
        ]),
        validate.addField ("#end_time", [
            {
                rule: "required",   
                errorMessage: "Vui lòng chọn thời gian kết thúc!"
            }
        ])   
        .onSuccess ((event : any) => {
            event.preventDefault();
        })

    }, [])


    const editorRef = useRef<any>(null);
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
    };

    const handleCurrencyChange = (e : any) => {
        const { name, value } = e.target;
        const numericValue = parsePrice(value);
        setFormData(prev => ({
            ...prev,
            [name]: numericValue
        }));
    };




    const handleStartTimeChange = (date: Date | null) => {
        setFormData(prev => {
            if (!date) return prev;
            
            const newData = {
                ...prev,
                start_time: date  // Store the original Date object
            };
            
            // Automatically set end time to 7 days after start time if no end time is set
            if (date && !prev.end_time) {
                const endTime = new Date(date);
                endTime.setDate(endTime.getDate() + 7); // Add 7 days
                newData.end_time = endTime;
            }
            
            return newData;
        });
    };

    const handleEndTimeChange = (date: Date | null) => {
        if (!date) return;
        
        console.log("End date selected:", date);
        console.log("Will format to UTC for API:", formatToUTC(date, "datetime"));
        
        setFormData(prev => ({
            ...prev,
            end_time: date  // Store the original Date object
        }));
    };

    const handleSelectCatChange = (name : any) => (value :any) => {
        if (name === "cat1_id"){
            setFormData (prev => ({
                ...prev,
                cat2_id: 0, // Reset cat2_id when cat1_id changes
                [name]: value
            })) 
            return;
        }
        setFormData (prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleEditorChange = (content: string) => {
        let description = document.getElementById("description") as HTMLInputElement;
        description.value = content;
        setFormData(prev => ({
            ...prev,
            description: content
        }));
    }

 
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isSubmitting) return; // Prevent multiple submissions
        setIsSubmitting(true);
        

        if (formData.product_images.length < 3){
            toast.warning("Nên thêm ít nhất 3 hình ảnh để thu hút người mua!");
            setIsSubmitting(false);
            return;
        }
        if (formData.description.trim() === ''){
            toast.error("Vui lòng nhập mô tả sản phẩm!");
            setIsSubmitting(false);
            return;
        }


        const formPayload = new FormData();
        formPayload.append("product_name", formData.product_name);
        // formPayload.append("cat1_id", formData.cat1_id.toString());
        formPayload.append("cat2_id", formData.cat2_id.toString());
        formPayload.append("start_price", formData.start_price.toString());
        formPayload.append("step_price", formData.step_price.toString());
        formPayload.append("buy_now_price", formData.buy_now_price.toString());
        formPayload.append("start_time", formData.start_time ? formatToUTC(formData.start_time, "datetime") : '');
        formPayload.append("end_time", formData.end_time ? formatToUTC(formData.end_time, "datetime") : '');
        formPayload.append("description", formData.description);
        formPayload.append("auto_extended", formData.autoExtend ? "true" : "false");

        formData.product_images.forEach((file, index) => {
            formPayload.append("product_images", file);
        }
        );


       
        
        // Handle form submission here - send apiData to backend
        console.log("Submitting data to API:", formPayload);

        fetch("http://localhost:5000/api/products/post_product", {
            method: "POST",
            credentials: "include",
            body: formPayload
        })
        .then (res => res.json())
        .then (data => {
            setIsSubmitting(false);
            if (data.status === "success") {
                toast.success("Đăng sản phẩm thành công!");
                // reload form after 2 seconds
                setTimeout (()=> {
                    window.location.reload();
                }, 2000);

                
            } else {
                toast.error(data.message || "Đăng sản phẩm thất bại!");
            }
        })
        .catch (err => {
            setIsSubmitting(false);
            console.error("Error submitting product:", err);
            toast.error("Đã có lỗi xảy ra. Vui lòng thử lại sau.");
        });



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
                                name="product_name"
                                id ="product_name"
                                value={formData.product_name}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Nhập tên sản phẩm..."
                                required
                            />
                        </div>

                        {/* Product Images */}
                        <div>
                            <label className="block text-lg font-semibold text-gray-700 mb-3 flex items-center">
                                <ImageIcon className="w-5 h-5 mr-2 text-blue-500" />
                                Hình ảnh sản phẩm <span className="text-red-500 ml-1">*</span>
                            </label>
                            <p className="text-sm text-gray-500 mb-4">
                                Thêm hình ảnh để thu hút người mua. Ảnh đầu tiên sẽ được sử dụng làm ảnh đại diện.
                            </p>
                            <UploadImage
                                images={formData.product_images}
                                onImagesChange={(images : any) => setFormData(prev => ({ ...prev, product_images: images }))}
                                maxFiles={10}
                            />
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
                                        name="start_price"
                                        id ="start_price"
                                        value={formatPrice(Number(formData.start_price) || 0)}
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
                                        name="step_price"
                                        id ="step_price"
                                        value={formatPrice(Number(formData.step_price) || 0)}
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
                                        name="buy_now_price"
                                        id ="buy_now_price"
                                        value={formatPrice(Number(formData.buy_now_price) || 0)}
                                        onChange={handleCurrencyChange}
                                        className="w-full px-4 py-2 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="0"
                                    />
                                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">VNĐ</span>
                                </div>
                            </div>
                        </div>
                        {/* Thời gian */}
                        <div className="mb-2">
                            <p className="text-sm text-gray-600 flex items-center">
                                <Clock className="w-4 h-4 mr-1 text-blue-500" />
                                Chọn ngày và giờ cho đấu giá. Thời gian kết thúc sẽ tự động được đặt sau 7 ngày nếu chưa chọn.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                                    <Calendar className="w-4 h-4 mr-1 text-blue-500" />
                                    Thời gian bắt đầu <span className="text-red-500 ml-1">*</span>
                                </label>
                                <div className="relative">
                                    <DatePicker
                                        id = "start_time"
                                        name = "start_time"
                                        selected={formData.start_time}
                                        onChange={handleStartTimeChange}
                                        showTimeSelect
                                        timeFormat="HH:mm"
                                        timeIntervals={15}
                                        timeCaption="Giờ"
                                        dateFormat="dd/MM/yyyy HH:mm"
                                        placeholderText="Chọn ngày và giờ bắt đầu"
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                        minDate={new Date()}
                                        required
                                        withPortal
                                        portalId="start-time-portal"
                                        popperProps={{
                                            strategy: 'fixed',
                                            placement: 'bottom-start'
                                        }}
                                        popperClassName="z-[10000]"
                                        
                                    
                                    />
                                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 z-100 text-gray-400" />
                                </div>
                            </div>
                            <div>
                                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                                    <Calendar className="w-4 h-4 mr-1 text-blue-500" />
                                    Thời gian kết thúc <span className="text-red-500 ml-1">*</span>
                                </label>
                                <div className="relative">
                                    <DatePicker
                                        id = "end_time"
                                        name ="end_time"
                                        selected={formData.end_time}
                                        onChange={handleEndTimeChange}
                                        showTimeSelect
                                        timeFormat="HH:mm"
                                        timeIntervals={15}
                                        timeCaption="Giờ"
                                        dateFormat="dd/MM/yyyy HH:mm"
                                        placeholderText="Chọn ngày và giờ kết thúc"
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                        minDate={formData.start_time || new Date()}
                                        required
                                        withPortal
                                        portalId="end-time-portal"
                                        popperProps={{
                                            strategy: 'fixed',
                                            placement: 'bottom-start'
                                        }}
                                        popperClassName="z-[10000]"
                                    />
                                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                </div>
                            </div>
                        </div>

                        {/* Categories */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Danh mục chính <span className="text-red-500">*</span>
                                </label>
                                <SelectMenu
                                    value={formData.cat1_id}
                                    setState={handleSelectCatChange("cat1_id")}
                                    name ="cat1_id"
                                    items={catlv1?.map(cat => ({ value: cat.id.toString(), content: cat.name })) || []}
                                    placeholder="Chọn danh mục chính"
                                    className=""
                                />
                                <input type="hidden" name="cat1_id" id="cat1_id" value={formData.cat1_id} />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Danh mục phụ <span className="text-red-500">*</span>
                                </label>
              
                                <SelectMenu
                                    value={formData.cat2_id}
                                    setState={handleSelectCatChange("cat2_id")}
                                    name="cat2_id"
                                    items={catlv2?.map(cat => ({ value: cat.id.toString(), content: cat.name })) || []}
                                    placeholder={formData.cat1_id ? "Chọn danh mục phụ" : "Chọn danh mục chính trước"}
                                    disabled={!formData.cat1_id}
                                />
                                <input type="hidden" name="cat2_id" id="cat2_id" value={formData.cat2_id} />
                            </div>
                        </div>

                        {/* Description */}
                        <div className = "text-xl">Mô tả sản phẩm <span className="text-red-500">*</span></div>
                        <TinyMCEEditor editorRef = {editorRef} onEditChange = {handleEditorChange}/>
                        <input type="hidden" name="description" id = "description" value={formData.description} />

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
                                className={`bg-gray-800 hover:bg-gray-700 hover:shadow-md hover:shadow-green-400 hover:scale-105 transition-all duration-300 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                                cursor-pointer ${isSubmitting ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}`}
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