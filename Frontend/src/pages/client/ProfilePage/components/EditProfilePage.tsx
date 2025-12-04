import React, { useState, useEffect, use } from 'react';
import { useAuth } from '@/routes/ProtectedRouter';
import { useNavigate } from 'react-router-dom';
import JustValidate from 'just-validate';
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
  email: string;
  full_name: string;
  address: string;
  date_of_birth: string;
}

export default function EditProfilePage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const auth = useAuth();

  // Form state
  const [formData, setFormData] = useState<ProfileData>({
    email: "",
    full_name: "",
    address: "",
    date_of_birth: ""
  });
  useEffect(() => {
    if (auth) {

        console.log ("Auth data loaded in EditProfilePage:", auth);
        setFormData({
            email: auth.email,
            full_name: auth.full_name,
            address: auth.address,
            date_of_birth : auth.date_of_birth 
        });
        console.log ("Form data initialized:", formData);
    }
    }, [auth]);



  useEffect (() => {
    const validate = new JustValidate ('#edit-profile-form');
    validate
      .addField ('#email', [
        { rule: 'required', errorMessage: 'Email là bắt buộc' },
        { rule: 'email', errorMessage: 'Email không hợp lệ' }
      ])
        .addField ('#full_name', [
        { rule: 'required', errorMessage: 'Họ và tên là bắt buộc' },
        { rule: 'minLength', value: 3, errorMessage: 'Họ và tên phải có ít nhất 3 ký tự' }
      ])
    .onSuccess ((e : React.FormEvent)=> {
        e.preventDefault();
    
  })
  }, []);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return; // Prevent multiple submissions
    console.log ("Submitting form with data:", formData);
    setIsSubmitting(true);
    fetch ("http://localhost:5000/api/profile/edit", {
        method: "PUT",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify (formData)
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
    
        navigate ("/profile");
    })
    .catch (err => {
        toast.error (err.message || "Có lỗi xảy ra khi cập nhật thông tin");

    })
    .finally (()=> {
        setIsSubmitting(false);
    });
  }

  
  

  const handleChange = (field: keyof ProfileData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen  py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <button
            onClick={() => navigate('/profile')}
            className="inline-flex items-center cursor-pointer text-blue-600 hover:text-blue-800 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại Profile
          </button>
          
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
          <form id = "edit-profile-form" className="p-8" onSubmit ={onSubmit}>
            <div className="space-y-6">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors `
                      }
                    placeholder="example@email.com"
                  />
                </div>
                
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Họ và tên <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    id="full_name"
                    value={formData.full_name}
                    onChange={(e) => handleChange('full_name', e.target.value)}
                    className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
                    placeholder="Nguyễn Văn A"
                  />
                </div>
               
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Địa chỉ <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <textarea
                    value={formData.address}
                    onChange={(e) => handleChange('address', e.target.value)}
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ngày sinh <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="date"
                    id="date_of_birth"
                    value={formData.date_of_birth}
                    onChange={(e) => handleChange('date_of_birth', e.target.value)}
                    className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors   `}
                    max={new Date().toISOString().split('T')[0]}
                  />
                </div>
                
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 mt-8 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate('/profile')}
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