import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {useAuth} from "@/routes/ProtectedRouter";
import {useParams} from "react-router-dom"
import Loading from '@/components/common/Loading';
import {
  User,
  Mail,
  MapPin,
  Calendar,
  Star,
  Award,
  ArrowBigLeft,
  Edit
} from 'lucide-react';


interface UserProfile {
  username: string;
  full_name: string;
  email: string;
  address: string;
  role: string;
  date_of_birth: string;
  rating: number;
  rating_count: number;
}

export default function ProfilePage() {
  const navigate = useNavigate();
  const {auth} = useAuth();
  const params = useParams();
  const [isOwner , setIsOwner] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  
  
  useEffect (() => {

    const username = params.username_id?.trim().split("_")[0];
    const user_id = params.username_id?.trim().split("_")[1];
    if (!username || !user_id){
      navigate("/");
      return;
    }
    fetch(`${import.meta.env.VITE_API_URL}/api/profile/detail?username=${username}&user_id=${user_id}`, {
      credentials: "include",
    })
    .then (res => {
      if (!res.ok){
        throw new Error("Failed to fetch user profile");
      }
      return res.json();
    })
    .then (data => {
      setUserProfile(data.data);
      setIsOwner(data.is_owner);
    })
    .catch (error => {
      console.error("Can't connect to backend:", error);
      navigate("/");
    })

  }, []);

  const getRoleLabel = (role: string) => {
    switch(role) {
      case 'admin': return 'Quản trị viên';
      case 'seller': return 'Người bán';
      case 'user': return 'Người dùng';
      default: return 'Người dùng';
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch(role) {
      case 'admin': return 'bg-gradient-to-r from-gray-600 to-gray-700 text-white';
      case 'seller': return 'bg-gradient-to-r from-blue-500 to-blue-600 text-white';
      case 'user': return 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white';
      default: return 'bg-gradient-to-r from-gray-400 to-gray-500 text-white';
    }
  };
  if (!userProfile) return <Loading />;
  return (

    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">


          <div className="text-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-slate-700 bg-clip-text text-transparent mb-2">
              Hồ sơ cá nhân
            </h1>
            <p className="text-gray-600">Thông tin chi tiết về tài khoản của bạn</p>
          </div>
        </div>

        {/* Profile Header Card */}
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl border border-gray-200/50 p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
            {/* Avatar */}
            <div className="relative">
              <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-gray-600 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-4xl font-bold text-white">
                  {userProfile.full_name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full border-4 border-white shadow-md"></div>
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">{userProfile.full_name}</h2>
              <p className="text-gray-600 mb-4">@{userProfile.username}</p>

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-4">
                <span className={`px-4 py-2 rounded-full text-sm font-semibold shadow-md ${getRoleBadgeColor(userProfile.role)}`}>
                  {getRoleLabel(userProfile.role)}
                </span>

                <div className="flex items-center bg-yellow-50 px-4 py-2 rounded-full border border-yellow-200">
                  <Star className="w-5 h-5 text-yellow-500 fill-current mr-2" />
                  <span className="font-bold text-yellow-700 mr-1">{userProfile.rating.toFixed(1)}</span>
                  <span className="text-yellow-600">({userProfile.rating_count} đánh giá)</span>
                </div>
              </div>

              {/* Rating Stars */}
              <div className="flex items-center justify-center md:justify-start">
                {[1,2,3,4,5].map((star) => (
                  <Star
                    key={star}
                    className={`w-6 h-6 ${star <= Math.floor(userProfile.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                  />
                ))}
                <span className="ml-3 text-gray-600 font-medium">
                  {userProfile.rating.toFixed(1)} / 5.0
                </span>
              </div>

              {/* Edit Profile Button - Only for Owner */}
              {isOwner && (
                <div className="mt-6 flex justify-center md:justify-start">
                  <button
                    onClick={() => navigate('/profile/edit')}
                    className="inline-flex items-center px-4 py-2 cursor-pointer bg-blue-500 hover:bg-blue-400 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-colors duration-200"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Chỉnh sửa hồ sơ
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Personal Information Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Contact Information */}
          <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 p-6">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                <User className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">Thông tin liên hệ</h3>
            </div>

            <div className="space-y-4">
              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <Mail className="w-5 h-5 text-blue-500 mr-3 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-semibold text-gray-800">{userProfile.email}</p>
                </div>
              </div>

              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <MapPin className="w-5 h-5 text-gray-500 mr-3 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-500">Địa chỉ</p>
                  <p className="font-semibold text-gray-800">{userProfile.address || 'Chưa cập nhật'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Account Details */}
          <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 p-6">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center mr-3">
                <Award className="w-5 h-5 text-yellow-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">Chi tiết tài khoản</h3>
            </div>

            <div className="space-y-4">
              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <User className="w-5 h-5 text-blue-500 mr-3 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-500">Tên đăng nhập</p>
                  <p className="font-semibold text-gray-800">{userProfile.username}</p>
                </div>
              </div>

              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <Calendar className="w-5 h-5 text-yellow-500 mr-3 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-500">Ngày sinh</p>
                  <p className="font-semibold text-gray-800">
                    {userProfile.date_of_birth ? new Date(userProfile.date_of_birth).toLocaleDateString('vi-VN') : 'Chưa cập nhật'}
                  </p>
                </div>
              </div>

              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <Award className="w-5 h-5 text-gray-500 mr-3 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-500">Vai trò</p>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getRoleBadgeColor(userProfile.role)}`}>
                    {getRoleLabel(userProfile.role)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>


      </div>
    </div>
  );
}