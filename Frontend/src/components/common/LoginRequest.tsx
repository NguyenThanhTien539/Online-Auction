import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, ArrowLeft, LogIn, Shield } from 'lucide-react';

export default function LoginRequest() {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoToLogin = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pb-10">
      <div className="max-w-md w-full">
        {/* Card */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-blue-400 px-6 py-8 text-center">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
              <Shield className="w-8 h-8 text-blue-400" />
            </div>
            <h1 className="text-2xl font-bold text-white">
              Truy cập bị hạn chế
            </h1>
          </div>

          {/* Content */}
          <div className="px-6 py-8">
            <div className="text-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-3">
                Yêu cầu xác thực
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Để tiếp tục sử dụng tính năng này, bạn cần đăng nhập vào tài khoản của mình.
                Việc này giúp đảm bảo an toàn và bảo mật thông tin.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleGoToLogin}
                className="w-full bg-blue-400 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center shadow-md hover:shadow-lg"
              >
                <LogIn className="w-5 h-5 mr-2" />
                Đăng nhập
              </button>

              <button
                onClick={handleGoBack}
                className="w-full bg-white hover:bg-gray-50 text-gray-700 font-semibold py-3 px-4 rounded-lg border border-gray-300 transition-all duration-200 flex items-center justify-center hover:border-gray-400"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Quay lại
              </button>
            </div>

            {/* Footer */}
            <div className="mt-6 pt-6 border-t border-gray-200 text-center">
              <p className="text-sm text-gray-500">
                Chưa có tài khoản?{' '}
                <button
                  onClick={() => navigate('/register')}
                  className="text-blue-400 hover:text-blue-500 font-medium hover:underline"
                >
                  Đăng ký ngay
                </button>
              </p>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-400">
            Bảo mật thông tin của bạn là ưu tiên hàng đầu của chúng tôi
          </p>
        </div>
      </div>
    </div>
  );
}
