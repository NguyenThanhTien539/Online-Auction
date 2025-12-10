import React from 'react';
import { Code, Server, Users, Award, Github, Mail } from 'lucide-react';
import useIntersectionObserver from '@/hooks/useIntersectionObserver';


// Header Component
const HeaderSection = () => {
  const { ref, isIntersecting } = useIntersectionObserver();

  return (
    <div ref={ref} className={`bg-blue-300 text-white py-20 transition-opacity duration-1000 ${isIntersecting ? 'animate__animated animate__fadeInDown' : 'opacity-0'}`}>
      <div className="max-w-6xl mx-auto px-4 text-center">
        <h1 className="text-5xl font-bold mb-6">Về Chúng Tôi</h1>
        <p className="text-xl opacity-90 max-w-2xl mx-auto">
          Nền tảng đấu giá trực tuyến được phát triển bởi đội ngũ tài năng,
          mang đến trải nghiệm mua bán độc đáo và minh bạch.
        </p>
      </div>
    </div>
  );
};

// Project Overview Component
const ProjectOverview = () => {
  const { ref, isIntersecting } = useIntersectionObserver();

  return (
    <div ref={ref} className={`max-w-6xl mx-auto px-4 py-8 transition-opacity duration-1000 ${isIntersecting ? 'animate__animated animate__fadeInUp' : 'opacity-0'}`}>
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Dự Án Online Auction</h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Nền tảng đấu giá trực tuyến hiện đại, nơi người dùng có thể tham gia đấu giá,
          mua bán sản phẩm một cách an toàn và thuận tiện. Chúng tôi cam kết mang đến
          trải nghiệm tốt nhất cho cộng đồng người dùng.
        </p>
      </div>
    </div>
  );
};

// Technologies Component
const TechnologiesSection = () => {
  const { ref, isIntersecting } = useIntersectionObserver();

  return (
    <div ref={ref} className={`max-w-6xl mx-auto px-4 pb-8 transition-opacity duration-1000 ${isIntersecting ? 'animate__animated animate__fadeInLeft' : 'opacity-0'}`}>
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Code className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">Frontend</h3>
          <p className="text-gray-600 mb-4">Giao diện người dùng hiện đại và responsive</p>
          <div className="inline-flex items-center px-4 py-2 bg-blue-50 rounded-full">
            <span className="text-blue-700 font-medium">React + TypeScript</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Server className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">Backend</h3>
          <p className="text-gray-600 mb-4">API mạnh mẽ và bảo mật cao</p>
          <div className="inline-flex items-center px-4 py-2 bg-green-50 rounded-full">
            <span className="text-green-700 font-medium">Node.js + Express</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Team Component
const TeamSection = () => {
  const { ref, isIntersecting } = useIntersectionObserver();

  return (
    <div ref={ref} className={`max-w-6xl mx-auto px-4 pb-8 transition-opacity duration-1000 ${isIntersecting ? 'animate__animated animate__fadeInUp' : 'opacity-0'}`}>
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Đội Ngũ Phát Triển</h2>
        <p className="text-gray-600">Những người tạo nên nền tảng này</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Member 1 */}
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
          <div className="relative mb-6">
            <div className="w-32 h-32 bg-blue-300 rounded-full flex items-center justify-center mx-auto shadow-lg">
              <span className="text-3xl font-bold text-white">LT</span>
            </div>
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full border-4 border-white shadow-md"></div>
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Lê Tuấn Lộc</h3>
          <p className="text-blue-600 font-medium mb-4">Full-Stack Developer</p>
          <p className="text-gray-600 mb-6">
            Chuyên gia phát triển web với niềm đam mê tạo ra trải nghiệm người dùng tuyệt vời.
          </p>
          <div className="flex justify-center space-x-4">
            <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
              <Github className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
              <Mail className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Member 2 */}
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
          <div className="relative mb-6">
            <div className="w-32 h-32 bg-gray-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
              <span className="text-3xl font-bold text-white">NT</span>
            </div>
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-400 rounded-full border-4 border-white shadow-md"></div>
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Nguyễn Thanh Tiến</h3>
          <p className="text-gray-600 font-medium mb-4">Full-Stack Developer</p>
          <p className="text-gray-600 mb-6">
            Phát triển các giải pháp backend mạnh mẽ và tối ưu hóa hiệu suất ứng dụng.
          </p>
          <div className="flex justify-center space-x-4">
            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <Github className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <Mail className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Mission Component
const MissionSection = () => {
  const { ref, isIntersecting } = useIntersectionObserver();

  return (
    <div ref={ref} className={`max-w-6xl mx-auto px-4 pb-8 transition-opacity duration-1000 ${isIntersecting ? 'animate__animated animate__fadeInUp' : 'opacity-0'}`}>
      <div className="mt-16 bg-gray-100 rounded-2xl p-8 text-center">
        <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Award className="w-8 h-8 text-indigo-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-800 mb-4">Sứ Mệnh Của Chúng Tôi</h3>
        <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Tạo ra một nền tảng đấu giá trực tuyến đáng tin cậy, nơi mọi người có thể
          tham gia mua bán một cách công bằng, minh bạch và an toàn.
        </p>
      </div>
    </div>
  );
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <HeaderSection />
      <ProjectOverview />
      <TechnologiesSection />
      <TeamSection />
      <MissionSection />
    </div>
  );
}
