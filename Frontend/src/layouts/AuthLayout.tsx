import React from 'react';
import { Outlet } from 'react-router-dom';
import {
  Shield,
  Lock,
  Users,
  Zap,
  Star,
  Award,
  Crown,
  Sparkles,
  TrendingUp,
  Heart
} from 'lucide-react';

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden">
      {/* Elegant Background Pattern */}
      <div className="absolute inset-0">
        {/* Subtle Grid Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="h-full w-full bg-gradient-to-br from-blue-100 to-transparent"></div>
        </div>

        {/* Floating Geometric Shapes */}
        <div className="absolute top-20 left-16 w-32 h-32 border-2 border-blue-200 rounded-full opacity-10"></div>
        <div className="absolute top-40 right-20 w-24 h-24 border-2 border-gray-300 rotate-45 opacity-8"></div>
        <div className="absolute bottom-32 left-24 w-28 h-28 border-2 border-blue-300 rounded-lg opacity-6"></div>
        <div className="absolute bottom-20 right-16 w-20 h-20 bg-yellow-200 rounded-full opacity-20"></div>

        {/* Decorative Icons */}
        <div className="absolute top-1/4 left-1/5 text-blue-300 opacity-8">
          <Shield size={48} />
        </div>
        <div className="absolute top-1/3 right-1/4 text-gray-400 opacity-6">
          <Crown size={40} />
        </div>
        <div className="absolute bottom-1/4 left-1/3 text-blue-400 opacity-7">
          <Award size={44} />
        </div>
        <div className="absolute bottom-1/3 right-1/5 text-yellow-400 opacity-10">
          <Sparkles size={36} />
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-12">
        <div className="w-full">
          {/* Premium Header */}
          <div className="text-center">
            <div className="relative inline-block">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-50 to-white rounded-3xl shadow-xl border-2 border-yellow-200">
                <Award className="w-10 h-10 text-blue-600" />
              </div>
              <div className="absolute -top-1 -right-1">
                <Star className="w-6 h-6 text-yellow-500 fill-current" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mt-4">Online Auction</h1>
            <p className="text-gray-600 mt-2 font-medium">Nền tảng đấu giá trực tuyến hàng đầu</p>
          </div>

          {/* Auth Form Container */}
          <div className="mx-auto overflow-hidden">
            <div className="px-8">
              <Outlet />
            </div>

            {/* Footer */}
            <div className="px-8 py-4 bg-gray-50 border-t border-gray-100">
              <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
                <div className="flex items-center">
                  <Shield className="w-4 h-4 mr-1" />
                  <span>An toàn</span>
                </div>
                <div className="flex items-center">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  <span>Đáng tin cậy</span>
                </div>
                <div className="flex items-center">
                  <Heart className="w-4 h-4 mr-1" />
                  <span>Uy tín</span>
                </div>
              </div>
            </div>
          </div>

          {/* Luxury Bottom Section */}
          <div className="text-center mt-8">
            <div className="flex justify-center space-x-1 mb-3">
              <Star className="w-5 h-5 text-yellow-400 fill-current" />
              <Star className="w-5 h-5 text-yellow-400 fill-current" />
              <Star className="w-5 h-5 text-yellow-400 fill-current" />
              <Star className="w-5 h-5 text-yellow-400 fill-current" />
              <Star className="w-5 h-5 text-yellow-400 fill-current" />
            </div>
            <p className="text-sm text-gray-600 font-medium">
              Nền tảng đấu giá hàng đầu Việt Nam
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Hàng triệu người dùng tin tưởng
            </p>
          </div>
        </div>
      </div>

      {/* Additional Floating Elements */}
      <div className="absolute top-1/2 left-8 text-blue-300 opacity-20 animate-spin" style={{animationDuration: '20s'}}>
        <Zap size={30} />
      </div>
      <div className="absolute top-1/2 right-8 text-purple-300 opacity-20 animate-spin" style={{animationDuration: '25s'}}>
        <Award size={35} />
      </div>

      {/* Corner Decorative Elements */}
      <div className="absolute top-4 left-4 text-blue-400 opacity-15">
        <Crown size={32} />
      </div>
      <div className="absolute top-4 right-4 text-yellow-400 opacity-15">
        <Sparkles size={28} />
      </div>
      <div className="absolute bottom-4 left-4 text-gray-400 opacity-15">
        <Shield size={30} />
      </div>
      <div className="absolute bottom-4 right-4 text-blue-400 opacity-15">
        <Award size={26} />
      </div>
    </div>
  );
}
