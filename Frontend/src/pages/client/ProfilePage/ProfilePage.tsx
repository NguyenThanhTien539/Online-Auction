import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {useAuth} from "@/routes/ProtectedRouter";

import { 
  User, 
  Mail, 
  MapPin, 
  Calendar, 
  Star, 
  Award, 
  ShoppingBag, 
  Package, 
  Heart, 
  TrendingUp, 
  LogOut, 
  UserPlus,
  Plus,
  Edit3,
  ArrowBigLeft
} from 'lucide-react';

interface UserProfile {
  username: string;
  full_name: string;
  email: string;
  address: string;
  role: string;
  date_of_birth: string;
  rating_score: number;
  rating_count: number;
}

export default function ProfilePage() {
  const navigate = useNavigate();
  
  // Sample user data - in real app, this would come from API/context
  // const [userProfile, setUserProfile] = useState<UserProfile>({
  //   username: "john_doe",
  //   full_name: "Nguyễn Văn John",
  //   email: "john.doe@email.com",
  //   address: "123 Đường ABC, Quận 1, TP.HCM",
  //   role: "seller", // user | seller | admin
  //   date_of_birth: "1990-05-15",
  //   rating_score: 4.5,
  //   rating_count: 127
  // });
  const auth = useAuth();
  useEffect (() => {
    setUserProfile({
      username : auth?.username || "",
      full_name: auth?.full_name || "",
      email: auth?.email || "",
      address: auth?.address || "",
      role: auth?.role || "user",
      date_of_birth: auth?.date_of_birth || "",
      rating_score: auth?.rating || 0,
      rating_count: auth?.rating_count || 0
    });
  }, [auth])
  const [userProfile, setUserProfile] = useState<UserProfile>({
    username : "",
    full_name: "",
    email: "",
    address: "",
    role: "user",
    date_of_birth: "",
    rating_score: 0,
    rating_count: 0
  });


  const handleLogout = () => {
    if (window.confirm("Bạn có chắc chắn muốn đăng xuất?")) {
      // Clear auth data in cookies
      fetch("http://localhost:5000/accounts/logout", 
          {method: "POST", credentials: "include"}
      )
      navigate('/');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

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
      case 'admin': return 'bg-red-100 text-red-800';
      case 'seller': return 'bg-green-100 text-green-800';
      case 'user': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-white py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <a href = "/" className = "flex items-center text-blue-600 font-semibold hover:text-blue-800 mb-4 transition-colors w-fit">
          <ArrowBigLeft className = ""></ArrowBigLeft>
          <span>Trở lại Home</span>
        </a>
        
        <div className="text-center mb-8">
          <div className="relative inline-block">
            <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl font-bold text-white">
                {userProfile.full_name.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{userProfile.full_name}</h1>
          <div className="flex items-center justify-center space-x-4">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRoleBadgeColor(userProfile.role)}`}>
              {getRoleLabel(userProfile.role)}
            </span>
            <div className="flex items-center text-yellow-500 cursor-pointer">
              <Star className="w-5 h-5 fill-current mr-1" />
              <span className="font-semibold">{userProfile.rating_score}</span>
              <span className="text-gray-500 ml-1">({userProfile.rating_count} đánh giá)</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* User Information Card */}
          <div className="xl:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl p-8 border-2 rounded-2xl shadow-sm border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                  <User className="w-6 h-6 mr-3 text-blue-500" />
                  Thông tin cá nhân
                </h2>
                <button className="px-4 py-2 bg-blue-400 hover:bg-blue-300 cursor-pointer text-white rounded-lg transition-colors duration-200 flex items-center"
                onClick = {() => {navigate("/profile/edit")}}>
                  <Edit3 className="w-4 h-4 mr-2" />
                  Chỉnh sửa 
                </button>
              </div>
              
              {/* Information Table */}
              <div className="overflow-hidden">
                <table className="w-full">
                  <tbody className="divide-y divide-gray-100">
                    <tr className="hover:bg-gray-50 transition-colors duration-200">
                      <td className="py-4 pr-6">
                        <div className="flex items-center text-gray-600">
                          <User className="w-5 h-5 mr-3 text-blue-500" />
                          <span className="font-medium">Tên đăng nhập</span>
                        </div>
                      </td>
                      <td className="py-4 font-semibold text-gray-900">
                        {userProfile.username}
                      </td>
                    </tr>
                    
                    <tr className="hover:bg-gray-50 transition-colors duration-200">
                      <td className="py-4 pr-6">
                        <div className="flex items-center text-gray-600">
                          <User className="w-5 h-5 mr-3 text-green-500" />
                          <span className="font-medium">Họ và tên</span>
                        </div>
                      </td>
                      <td className="py-4 font-semibold text-gray-900">
                        {userProfile.full_name}
                      </td>
                    </tr>
                    
                    <tr className="hover:bg-gray-50 transition-colors duration-200">
                      <td className="py-4 pr-6">
                        <div className="flex items-center text-gray-600">
                          <Mail className="w-5 h-5 mr-3 text-purple-500" />
                          <span className="font-medium">Email</span>
                        </div>
                      </td>
                      <td className="py-4 font-semibold text-gray-900">
                        {userProfile.email}
                      </td>
                    </tr>
                    
                    <tr className="hover:bg-gray-50 transition-colors duration-200">
                      <td className="py-4 pr-6">
                        <div className="flex items-center text-gray-600">
                          <MapPin className="w-5 h-5 mr-3 text-red-500" />
                          <span className="font-medium">Địa chỉ</span>
                        </div>
                      </td>
                      <td className="py-4 font-semibold text-gray-900">
                        {userProfile.address}
                      </td>
                    </tr>
                    
                    <tr className="hover:bg-gray-50 transition-colors duration-200">
                      <td className="py-4 pr-6">
                        <div className="flex items-center text-gray-600">
                          <Award className="w-5 h-5 mr-3 text-indigo-500" />
                          <span className="font-medium">Vai trò</span>
                        </div>
                      </td>
                      <td className="py-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRoleBadgeColor(userProfile.role)}`}>
                          {getRoleLabel(userProfile.role)}
                        </span>
                      </td>
                    </tr>
                    
                    <tr className="hover:bg-gray-50 transition-colors duration-200">
                      <td className="py-4 pr-6">
                        <div className="flex items-center text-gray-600">
                          <Calendar className="w-5 h-5 mr-3 text-orange-500" />
                          <span className="font-medium">Ngày sinh</span>
                        </div>
                      </td>
                      <td className="py-4 font-semibold text-gray-900">
                        {formatDate(userProfile.date_of_birth)}
                      </td>
                    </tr>
                    
                    <tr className="hover:bg-gray-50 transition-colors duration-200">
                      <td className="py-4 pr-6">
                        <div className="flex items-center text-gray-600">
                          <Star className="w-5 h-5 mr-3 text-yellow-500" />
                          <span className="font-medium">Điểm đánh giá</span>
                        </div>
                      </td>
                      <td className="py-4">
                        <div className="flex items-center">
                          <span className="font-bold text-2xl text-yellow-600 mr-2">
                            {userProfile.rating_score}
                          </span>
                          <div className="flex items-center">
                            {[1,2,3,4,5].map((star) => (
                              <Star 
                                key={star}
                                className={`w-4 h-4 ${star <= userProfile.rating_score ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                              />
                            ))}
                          </div>
                          <span className="text-gray-500 ml-2">
                            ({userProfile.rating_count} lượt đánh giá)
                          </span>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Action Buttons Card */}
          <div className="xl:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-8 border-2 rounded-2xl shadow-sm border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <Package className="w-6 h-6 mr-3 text-blue-500" />
                Hành động
              </h2>
              
              <div className="space-y-4">
                {/* Register as Seller */}
                {userProfile.role !== 'seller' && userProfile.role !== 'admin' && (
                  <button 
                    onClick={() => navigate('/register-seller')}
                    className="w-full bg-yellow-400 hover:bg-yellow-300 cursor-pointer text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center transform hover:scale-105"
                  >
                    <UserPlus className="w-5 h-5 mr-2" />
                    Đăng ký làm Seller
                  </button>
                )}
                
                {/* Post Product */}
                {(userProfile.role === 'seller' || userProfile.role === 'admin') && (
                  <button 
                    onClick={() => navigate('/products/post')}
                    className="w-full bg-blue-500 hover:bg-blue-400 cursor-pointer text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center transform hover:scale-105"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Đăng sản phẩm
                  </button>
                )}

                {/* Favorite Products */}
                <button 
                  onClick={() => navigate('/my-products?type=my-favorites&page=1')}
                  className="w-full bg-rose-600 hover:bg-rose-500 cursor-pointer text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center transform hover:scale-105"
                >
                  <Heart className="w-5 h-5 mr-2" />
                  Sản phẩm yêu thích
                </button>

                {/* Products I'm Selling */}
                {(userProfile.role === 'seller' || userProfile.role === 'admin') && (
                  <button 
                    onClick={() => navigate('/my-products?type=my-selling&page=1')}
                    className="w-full bg-yellow-500 hover:bg-yellow-400 cursor-pointer text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center transform hover:scale-105"
                  >
                    <TrendingUp className="w-5 h-5 mr-2" />
                    Đang bán
                  </button>
                )}

                {/* Products I Sold */}
                {(userProfile.role === 'seller' || userProfile.role === 'admin') && (
                  <button 
                    onClick={() => navigate('/my-products?type=my-sold&page=1')}
                    className="w-full bg-gray-600 hover:bg-gray-500 cursor-pointer text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center transform hover:scale-105"
                  >
                    <Package className="w-5 h-5 mr-2" />
                    Đã bán
                  </button>
                )}
                {/* Products I'm bidding */}
                <button 
                  onClick={() => navigate('/my-products?type=my-bidding&page=1')}
                  className="w-full bg-neutral-600 hover:bg-neutral-500 cursor-pointer text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center transform hover:scale-105"
                >
                  <Award className="w-5 h-5 mr-2" />
                  Sản phẩm đang đấu giá
                </button>
                {/* Products I Won */}
                <button 
                  onClick={() => navigate('/my-products?type=my-won&page=1')}
                  className="w-full bg-green-600 hover:bg-green-500 cursor-pointer text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center transform hover:scale-105"
                >
                  <ShoppingBag className="w-5 h-5 mr-2" />
                  Sản phẩm đã thắng
                </button>


                <div className="border-t border-gray-200 pt-4 mt-6">
                  {/* Change Password */}
                  <button 
                    onClick={() => {navigate("/profile/change-password")}}
                    className="w-full bg-gradient-to-r mb-4 cursor-pointer bg-gray-500 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center transform hover:scale-105"
                  >
                    <LogOut className="w-5 h-5 mr-2" />
                    Đổi mật khẩu
                  </button>
                  {/* Logout */}
                  <button 
                    onClick={handleLogout}
                    className="w-full bg-gradient-to-r cursor-pointer from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center transform hover:scale-105"
                  >
                    <LogOut className="w-5 h-5 mr-2" />
                    Đăng xuất
                  </button>
                </div>
              </div>
            </div>


          </div>
        </div>
      </div>
    </div>
  );
}