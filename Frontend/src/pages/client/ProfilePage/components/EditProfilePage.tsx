import React, { useState, useEffect, useRef} from 'react';
import { useAuth } from '@/routes/ProtectedRouter';
import { useNavigate } from 'react-router-dom';
import JustValidate from 'just-validate';
import {DatePicker} from "react-datepicker";
import Loading from '@/components/common/Loading';
import { 
  User, 
  Mail, 
  MapPin, 
  Calendar, 
  Save, 
  ArrowLeft, 
  Edit3 
} from 'lucide-react';
import { toast } from 'sonner';

interface ProfileData {
  username: string;
  email: string;
  full_name: string;
  address: string;
  date_of_birth: string;
}

export default function EditProfilePage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {auth, setAuth} = useAuth();
  const [date, setDate] = useState<Date | null>(null);
  const formRef = useRef<HTMLFormElement | null>(null); // Ensure form is initialized only once
  
  // Form state
  const [formData, setFormData] = useState<ProfileData | null>(null);
  useEffect(() => {
    if (auth) {

        console.log ("Auth data loaded in EditProfilePage:", auth);
        setFormData({
            username: auth.username,
            email: auth.email,
            full_name: auth.full_name,
            address: auth.address,
            date_of_birth : auth.date_of_birth 
        });
        const parsedDate = auth.date_of_birth ? new Date(auth.date_of_birth) : null;
        setDate(parsedDate && !isNaN(parsedDate.getTime()) ? parsedDate : null);
        console.log ("Form data initialized:", formData);
    }
    }, [auth]);



  useEffect (() => {
    if (!formData || formRef.current) return;  
    const validate = new JustValidate ('#edit-profile-form');
    formRef.current = validate;
    validate
      .addField ('#username', [
        { rule: 'required', errorMessage: 'Username là bắt buộc' },
        { rule: 'minLength', value: 3, errorMessage: 'Username phải có ít nhất 3 ký tự' }
      ])
      .addField ('#email', [
        { rule: 'required', errorMessage: 'Email là bắt buộc' },
        { rule: 'email', errorMessage: 'Email không hợp lệ' }
      ])
        .addField ('#full_name', [
        { rule: 'required', errorMessage: 'Họ và tên là bắt buộc' },
        { rule: 'minLength', value: 3, errorMessage: 'Họ và tên phải có ít nhất 3 ký tự' }
      ])
    .onSuccess ((event : any) => {
        setIsSubmitting (true);
    })
  }, [formData]);

  const handleSubmit = (event : any) => {
    event.preventDefault();
    if (!isSubmitting) return; // Prevent multiple submissions
    const formSubmit = {
        username: event.target.username.value,
        email: event.target.email.value,
        full_name: event.target.full_name.value,
        address: event.target.address.value,
        date_of_birth: date ? date.toLocaleDateString('en-CA') : ''
    }
    fetch (`${import.meta.env.VITE_API_URL}/api/profile/edit`, {
        method: "PATCH",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify (formSubmit)
    })
    .then (res => { 
        if (!res.ok){
            return res.json().then (data => {
                throw new Error (data.message || "Có lỗi xảy ra");
            });
        }
        return res.json();
    }
    )
    .then (data => {
        toast.success (data.message || "Cập nhật thông tin thành công");
        setAuth (data.data);
        navigate (-1);
    })
    .catch (err => {
        toast.error (err.message || "Có lỗi xảy ra khi cập nhật thông tin");

    })
    .finally (()=> {
        setIsSubmitting(false);
    });
  } 



  if (!formData) return <Loading />;

  return (
    <div className="min-h-screen  py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          
          <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <Edit3 className="w-8 h-8 text-white" />
          </div>
          
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Chỉnh sửa thông tin</h1>
          <p className="text-gray-600">Cập nhật thông tin cá nhân của bạn</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden" >
          {/* Card Header */}
          <div className="bg-blue-400 text-white p-6">
            <h2 className="text-xl font-semibold flex items-center">
              <User className="w-5 h-5 mr-3" />
              Thông tin cá nhân
            </h2>
            <p className="text-blue-100 mt-2">Vui lòng điền chính xác thông tin của bạn</p>
          </div>

          {/* Form Content */}
          <form id = "edit-profile-form" onSubmit = {handleSubmit} className="p-8">
            <div className="space-y-6">
              {/* Username */}
              <div>
                <label htmlFor="#username" className="block text-sm font-medium text-gray-700 mb-2">
                  Username <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    id="username"
                    name="username"
                    defaultValue={formData.username}
                    className="w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="username123"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label htmlFor = "#email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    id="email"
                    name = "email"
                    defaultValue = {formData.email}               
                    className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors `
                      }
                    placeholder="example@email.com"
                  />
                </div>
                
              </div>

              {/* Full Name */}
              <div>
                <label htmlFor = "#full_name" className="block text-sm font-medium text-gray-700 mb-2">
                  Họ và tên <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    id="full_name"
                    name="full_name"
                    defaultValue={formData.full_name}
                    className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
                    placeholder="Nguyễn Văn A"
                  />
                </div>
               
              </div>

              {/* Address */}
              <div>
                <label htmlFor = "#address" className="block text-sm font-medium text-gray-700 mb-2">
                  Địa chỉ 
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <textarea
                    defaultValue={formData.address}
                    name ="address"
                    rows={3}
                    id="address"
                    className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none 
                      `}
                    placeholder="123 Đường ABC, Phường XYZ, Quận DEF, TP.HCM"
                  />
                </div>
                
              </div>

              {/* Date of Birth */}
              <div>
                <label htmlFor = "#date_of_birth" className="block text-sm font-medium text-gray-700 mb-2">
                  Ngày sinh 
                </label>
                <DatePicker
                  id="date_of_birth"
                  name="date_of_birth"
                  selected={date}
                  onChange={(date: Date | null) => setDate(date)}
                  dateFormat="dd/MM/yyyy"
                  className="w-full pl-5 py-5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholderText="Chọn ngày sinh"
                />
  
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 mt-8 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-6 py-3 cursor-pointer border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Hủy bỏ
              </button>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-3 cursor-pointer bg-blue-500  text-white font-semibold rounded-lg transition-all duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 disabled:hover:scale-100"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Đang lưu...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Lưu thay đổi
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}