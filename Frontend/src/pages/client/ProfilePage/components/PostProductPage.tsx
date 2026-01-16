import React, { useState, useRef, useEffect, use } from 'react';

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
import {NumericFormat} from 'react-number-format';




type CatType = {
    id: number;
    name: string;
}
type ExtendSettingType = {
    extend_time_minutes: number;
    threshold_minutes: number;
}
function PostProductPage(){
    usePreventBodyLock ();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [productImages, setProductImages] = useState<File[]>([]);
    const [startTime, setStartTime] = useState<Date | null>(null);
    const [endTime, setEndTime] = useState<Date | null>(null);
    const [selectedCat1, setSelectedCat1] = useState<number>(0);
    const [selectedCat2, setSelectedCat2] = useState<number>(0);

    const [catlv1, setCatlv1] = useState<CatType[]>();
    const [catlv2, setCatlv2] = useState<CatType[]>();
    const [extendTime, setExtendTime] = useState<ExtendSettingType>(); // in minutes



    useEffect(() => {

        fetch(`${import.meta.env.VITE_API_URL}/api/categories/level1`)
        .then (res => res.json())
        .then (data=> {
            setCatlv1 (data.data);
        })
    }, [])

    useEffect(() => {
        if (selectedCat1) {
            fetch(`${import.meta.env.VITE_API_URL}/api/categories/level2/noslug?cat_id=${selectedCat1}`)
            .then(res => res.json())
            .then(data => {
                setCatlv2(data.data);
            })
        } else {
            setCatlv2([]);
        }
    }, [selectedCat1])

    useEffect (() => {
        fetch(`${import.meta.env.VITE_API_URL}/api/setting/auto_extend_time`)
        .then (res => res.json())
        .then (data => {
            if (data.status === "success") {
                setExtendTime(data.data);
            } else {
                toast.error("Lấy cài đặt gia hạn tự động thất bại!");
            }
        })
    }, [])
    // Đồng bộ hidden inputs khi state thay đổi
    useEffect (() => {
        console.log ("Selected Cat1 changed: ", selectedCat1);
        console.log ("Selected Cat2 changed: ", selectedCat2);
        
        const cat1Input = document.getElementById("cat1_id") as HTMLInputElement;
        const cat2Input = document.getElementById("cat2_id") as HTMLInputElement;
        
        if (cat1Input) cat1Input.value = selectedCat1.toString();
        if (cat2Input) cat2Input.value = selectedCat2.toString();
        
        console.log("Hidden inputs synced - cat1:", selectedCat1, "cat2:", selectedCat2);
    }, [selectedCat1, selectedCat2])
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
        validate.addField(`[name="cat1_id"]`, [
            {
                validator: (value: any) => {
                    // Lấy giá trị trực tiếp từ DOM thay vì state
                    const cat1Input = document.getElementById("cat1_id") as HTMLInputElement;
                    return Number(cat1Input.value) > 0;
                },
                errorMessage: "Vui lòng chọn danh mục chính!"
            }
        ])
        validate.addField(`[name="cat2_id"]`, [
            {
                validator: (value: any) => {
                    // Lấy giá trị trực tiếp từ DOM thay vì state
                    const cat2Input = document.getElementById("cat2_id") as HTMLInputElement;
                    return Number(cat2Input.value) > 0;
                },
                errorMessage: "Vui lòng chọn danh mục phụ!"
            }
        ])
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
        validate.addField("#product_images", [
            {
                validator : (value: any, fields: any) => {
                    const inputElement = document.getElementById("product_images") as HTMLInputElement;
                    return inputElement.files && inputElement.files.length >= 1;
                },
                errorMessage: "Vui lòng chọn ít nhất 1 hình ảnh!"
            },
            {
                validator: (value: any, fields: any) => {
                    const inputElement = document.getElementById("product_images") as HTMLInputElement;
                    return inputElement.files && inputElement.files.length >= 3;
                },
                errorMessage: "Nên thêm ít nhất 3 hình ảnh để thu hút người mua!"
            }
        ]),
        validate.addField ("#description", [
            {
                rule: "required",
                errorMessage: "Vui lòng nhập mô tả sản phẩm!"
            }
        ])
        .onSuccess ((event : any) => {
            event.preventDefault();
            console.log ("Form validated successfully!");
            if (isSubmitting) return; // Prevent multiple submissions
            setIsSubmitting(true);


            const formPayLoad = new FormData();
            const form = event.target as HTMLFormElement;
            
            formPayLoad.append("product_name", form.product_name.value);
            formPayLoad.append("cat2_id", form.cat2_id.value);
            formPayLoad.append("start_price", (form.start_price.value.split(".").join("")));
            formPayLoad.append("step_price", form.step_price.value.split(".").join(""));
            formPayLoad.append("buy_now_price", form.buy_now_price.value.split(".").join(""));
            formPayLoad.append("start_time",  form.start_time.value ? formatToUTC(form.start_time.value, "datetime") : '');
            formPayLoad.append("end_time", form.end_time.value ? formatToUTC(form.end_time.value, "datetime") : '');
            formPayLoad.append("description", form.description.value);
            formPayLoad.append("auto_extended", form.auto_extended.checked ? "true" : "false");
            if (form.product_images.files) {
                for (let i = 0; i < form.product_images.files.length; i++) {
                    formPayLoad.append("product_images", form.product_images.files[i]);
                }
            }
           

            
            // Check formData correctness before submit
            const apiData = {
                product_name: form.product_name.value,
                cat2_id: form.cat2_id.value,
                start_price: (form.start_price.value).split(".").join(""),
                step_price: (form.step_price.value).split(".").join(""),
                buy_now_price: (form.buy_now_price.value).split(".").join(""),
                start_time: form.start_time.value ? formatToUTC(form.start_time.value, "datetime") : '',
                end_time: form.end_time.value ? formatToUTC(form.end_time.value, "datetime") : '',
                description: form.description.value,
                auto_extended: form.auto_extended.checked ? true : false,
                product_images: form.product_images.files

                

            }
            console.log("Prepared API Data:", apiData);
        


        
            
            // Handle form submission here - send apiData to backend
            // console.log("Submitting data to API:", formPayLoad);
            
            fetch(`${import.meta.env.VITE_API_URL}/api/products/post-product`, {
                method: "POST",
                credentials: "include",
                body: formPayLoad
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
            })
            .finally (()=> {
                setIsSubmitting(false);
            });
        })

    }, [])


    const editorRef = useRef<any>(null);
    // Không cần handlers phức tạp - sử dụng DOM values trực tiếp




    const handleStartTimeChange = (date: Date | null) => {
        setStartTime(date);
        // Automatically set end time to 7 days after start time if no end time is set
        if (date && !endTime) {
            const autoEndTime = new Date(date);
            autoEndTime.setDate(autoEndTime.getDate() + 7);
            setEndTime(autoEndTime);
        }
    };

    const handleEndTimeChange = (date: Date | null) => {
        setEndTime(date);
    };

    const handleCat1Change = (value: any) => {
        const catId = Number(value);
        setSelectedCat1(catId);
        setSelectedCat2(0); // Reset cat2 when cat1 changes
        
        // Đồng bộ hidden inputs
        const cat1Input = document.getElementById("cat1_id") as HTMLInputElement;
        const cat2Input = document.getElementById("cat2_id") as HTMLInputElement;
        if (cat1Input) cat1Input.value = catId.toString();
        if (cat2Input) cat2Input.value = "0";
        
        console.log("Cat1 changed to:", catId, "Hidden input updated");
    };

    const handleCat2Change = (value: any) => {
        const catId = Number(value);
        setSelectedCat2(catId);
        
        // Đồng bộ hidden input
        const cat2Input = document.getElementById("cat2_id") as HTMLInputElement;
        if (cat2Input) cat2Input.value = catId.toString();
        
        console.log("Cat2 changed to:", catId, "Hidden input updated");
    };

    const handleEditorChange = (content: string) => {
        const description = document.getElementById("description") as HTMLInputElement;
        description.value = content;
    };

    const handleUploadImageChange = (images: File[]) => {
        setProductImages(images);
        // Sync to hidden input for validation
        const imageInput = document.getElementById("product_images") as HTMLInputElement;
        const dt = new DataTransfer();
        images.forEach(image => {
            dt.items.add(image);
        });
        imageInput.files = dt.files;
    };


    return (
        <div className="min-h-screen 100 py-8">
            <div className="max-w-4xl mx-auto px-4">
                <div className="bg-white rounded-lg shadow-lg shadow-blue-200 p-8 border-2 border-gray-200">
                    <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Đăng sản phẩm đấu giá</h1>
                    
                    <form  className="space-y-6" id = "PostProductForm">
                        {/* Product Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Tên sản phẩm <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="product_name"
                                id="product_name"
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
                                images={productImages}
                                onImagesChange={handleUploadImageChange}
                                maxFiles={10}
                            />
                            <input type= "file" id = "product_images" name = "product_images" className = "hidden"></input>
                        </div>
                        

                        {/* Price Information */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Giá khởi điểm <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <NumericFormat
                                        thousandSeparator="."
                                        decimalSeparator= ","
                                        name="start_price"
                                        id="start_price"
                                        className ="w-full px-4 py-2 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    ></NumericFormat>
                                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">VNĐ</span>
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Bước giá <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <NumericFormat
                                        thousandSeparator="."
                                        decimalSeparator= ","
                                        name="step_price"
                                        id="step_price"
                                        className ="w-full px-4 py-2 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    ></NumericFormat>
                                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">VNĐ</span>
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Giá mua ngay (tùy chọn)
                                </label>
                                <div className="relative">
                                    <NumericFormat
                                        thousandSeparator="."
                                        decimalSeparator= ","
                                        name="buy_now_price"
                                        id="buy_now_price"
                                        className ="w-full px-4 py-2 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    ></NumericFormat>
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
                                        id="start_time"
                                        name="start_time"
                                        selected={startTime}
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
                                        id="end_time"
                                        name="end_time"
                                        selected={endTime}
                                        onChange={handleEndTimeChange}
                                        showTimeSelect
                                        timeFormat="HH:mm"
                                        timeIntervals={15}
                                        timeCaption="Giờ"
                                        dateFormat="dd/MM/yyyy HH:mm"
                                        placeholderText="Chọn ngày và giờ kết thúc"
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                        minDate={startTime || new Date()}
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
                                    value={selectedCat1}
                                    setState={handleCat1Change}
                                    items={catlv1?.map(cat => ({ value: cat.id, content: cat.name })) || []}
                                    placeholder="Chọn danh mục chính"
                                    className=""
                                />
                                <input type="hidden" name="cat1_id" id="cat1_id" value={selectedCat1} />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Danh mục phụ <span className="text-red-500">*</span>
                                </label>
              
                                <SelectMenu
                                    value={selectedCat2}
                                    setState={handleCat2Change}
                                    items={catlv2?.map(cat => ({ value: cat.id, content: cat.name })) || []}
                                    placeholder={selectedCat1 ? "Chọn danh mục phụ" : "Chọn danh mục chính trước"}
                                    disabled={!selectedCat1}
                                />
                                <input type="hidden" name="cat2_id" id="cat2_id" value={selectedCat2} />
                            </div>
                        </div>

                        {/* Description */}
                        <div className = "text-xl">Mô tả sản phẩm <span className="text-red-500">*</span></div>
                        <TinyMCEEditor editorRef = {editorRef} onEditChange = {handleEditorChange}/>
                        <input type="hidden" name="description" id="description" />

                        {/* Auto Extend Option */}
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                name="auto_extended"
                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                                id="autoExtend"
                            />
                            <label htmlFor="autoExtend" className="ml-2 text-sm font-medium text-gray-700">
                                Tự động gia hạn đấu giá thêm <span className = "font-bold underline">{extendTime?.extend_time_minutes}</span> phút khi có người đặt giá trong  <span className = "font-bold underline">{extendTime?.threshold_minutes}</span> phút cuối
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