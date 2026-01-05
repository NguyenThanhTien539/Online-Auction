import React from 'react';
import { Code, Server, Users, Award, Github, Mail, Zap, Radio, CreditCard, Github as GithubIcon, ShoppingBag, CheckCircle2 } from 'lucide-react';
import useIntersectionObserver from '@/hooks/useIntersectionObserver';


// Header Component
const HeaderSection = () => {
  const { ref, isIntersecting } = useIntersectionObserver();

  return (
    <div ref={ref} className={`relative bg-gradient-to-br from-slate-50 via-slate-50 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 py-16 md:py-20 overflow-hidden transition-opacity duration-1000 ${isIntersecting ? 'animate__animated animate__fadeInDown' : 'opacity-0'}`}>
      {/* Decorative elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-slate-300/5 via-transparent to-transparent"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-slate-300/5 via-transparent to-transparent"></div>
      <div className="absolute top-20 right-20 w-72 h-72 bg-gradient-to-br from-slate-300/8 to-slate-400/8 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-gradient-to-tr from-slate-300/6 to-slate-400/6 rounded-full blur-3xl"></div>
      
      <div className="relative z-10 max-w-6xl mx-auto px-4 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full border border-blue-200/50 dark:border-slate-700 mb-6">
          <Award className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span className="text-sm font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
            Về chúng tôi
          </span>
        </div>
        
        <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-slate-900 via-blue-800 to-indigo-900 dark:from-white dark:via-blue-200 dark:to-indigo-100 p-2 bg-clip-text text-transparent mb-6 tracking-tight">
          Đội Ngũ Đam Mê<br />Công Nghệ
        </h1>
        
        <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
          Nền tảng đấu giá trực tuyến được phát triển bởi đội ngũ tài năng,
          mang đến trải nghiệm mua bán độc đáo, minh bạch và đáng tin cậy.
        </p>
      </div>
    </div>
  );
};

// Project Overview Component
const ProjectOverview = () => {
  const { ref, isIntersecting } = useIntersectionObserver();

  const features = [
    {
      icon: Zap,
      title: "Đấu Giá Tự Động",
      description: "Hệ thống tự động đặt giá thay bạn khi có người đấu cao hơn",
      color: "from-amber-400 to-orange-400"
    },
    {
      icon: Radio,
      title: "Đấu Giá Realtime",
      description: "Cập nhật giá đấu tức thì với công nghệ Socket.io",
      color: "from-blue-400 to-indigo-400"
    },
    {
      icon: CreditCard,
      title: "Thanh Toán Chuẩn Chỉnh",
      description: "Quy trình thanh toán an toàn, minh bạch và bảo mật",
      color: "from-emerald-400 to-teal-400"
    },
    {
      icon: GithubIcon,
      title: "Dự Án Open-Source",
      description: "Mã nguồn mở trên GitHub, cộng đồng có thể đóng góp",
      color: "from-slate-500 to-slate-600"
    },
    {
      icon: ShoppingBag,
      title: "Sản Phẩm Đa Dạng",
      description: "Tích hợp API từ Tiki và nhiều nguồn uy tín khác",
      color: "from-purple-400 to-pink-400"
    },
    {
      icon: CheckCircle2,
      title: "Quy Trình Xác Thực",
      description: "Xác thực email, quản lý người dùng chuyên nghiệp",
      color: "from-rose-400 to-red-400"
    }
  ];

  return (
    <div ref={ref} className={`max-w-6xl mx-auto px-4 py-8 transition-opacity duration-1000 ${isIntersecting ? 'animate__animated animate__fadeInUp' : 'opacity-0'}`}>
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent mb-4">
          Online Auction (MIRACLE)
        </h2>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
          Nền tảng đấu giá trực tuyến hiện đại với công nghệ tiên tiến, 
          mang đến trải nghiệm mua bán an toàn, thuận tiện và đầy thú vị cho người dùng.
        </p>
      </div>

      {/* Features Tree Structure */}
      <div className="relative max-w-4xl mx-auto">
        {/* Vertical trunk line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-slate-300 via-slate-400 to-slate-300 dark:from-slate-600 dark:via-slate-500 dark:to-slate-600 transform -translate-x-1/2"></div>
        
        <div className="relative space-y-16">
          {features.map((feature, index) => {
            const isLeft = index % 2 === 0;
            return (
              <div
                key={index}
                className={`flex items-center ${isLeft ? 'flex-row' : 'flex-row-reverse'} gap-8`}
              >
                {/* Feature Card */}
                <div 
                  className={`w-5/12 group relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50 hover:shadow-xl transition-all duration-500 hover:-translate-y-1 ${
                    isIntersecting ? 'animate__animated animate__fadeIn' : 'opacity-0'
                  }`}
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-50/50 to-transparent dark:from-slate-700/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  <div className="relative flex items-start gap-4">
                    <div className="relative flex-shrink-0">
                      <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} rounded-xl blur-lg opacity-20 group-hover:opacity-30 transition-opacity`}></div>
                      <div className={`relative w-12 h-12 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                        <feature.icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Center dot connector */}
                <div className="relative z-10 flex-shrink-0">
                  <div className={`w-4 h-4 rounded-full bg-gradient-to-br ${feature.color} shadow-lg border-2 border-white dark:border-slate-900 ${
                    isIntersecting ? 'animate__animated animate__zoomIn' : 'opacity-0'
                  }`}
                  style={{ animationDelay: `${index * 150}ms` }}></div>
                </div>

                {/* Branch line */}
                <div className={`w-5/12 h-0.5 ${isLeft ? 'mr-auto' : 'ml-auto'}`}>
                  <div className={`h-full bg-gradient-to-${isLeft ? 'r' : 'l'} from-slate-300 to-transparent dark:from-slate-600 ${
                    isIntersecting ? 'animate__animated animate__fadeIn' : 'opacity-0'
                  }`}
                  style={{ animationDelay: `${index * 150}ms` }}></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// Technologies Component
const TechnologiesSection = () => {
  const { ref, isIntersecting } = useIntersectionObserver();

  return (
    <div ref={ref} className={`max-w-6xl mx-auto px-4 pb-8 transition-opacity duration-1000 ${isIntersecting ? 'animate__animated animate__fadeInLeft' : 'opacity-0'}`}>
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="group relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-3xl shadow-lg p-8 text-center hover:shadow-xl transition-all duration-500 hover:-translate-y-1 border border-slate-200/50 dark:border-slate-700/50">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-500/3 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          <div className="relative">
            <div className="relative mb-5">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-500 rounded-2xl blur-xl opacity-15 group-hover:opacity-20 transition-opacity"></div>
              <div className="relative w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-500 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-blue-400/20 group-hover:scale-110 transition-transform duration-500">
                <Code className="w-8 h-8 text-white" />
              </div>
            </div>
            
            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-3">Frontend</h3>
            <p className="text-slate-600 dark:text-slate-300 mb-5 leading-relaxed">Giao diện người dùng hiện đại và responsive</p>
            <div className="inline-flex items-center px-5 py-2 bg-gradient-to-r from-blue-400/10 to-blue-500/10 border border-blue-200/50 dark:border-blue-700/50 rounded-full">
              <span className="text-blue-700 dark:text-blue-400 font-semibold">React + TypeScript</span>
            </div>
          </div>
        </div>

        <div className="group relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-3xl shadow-lg p-8 text-center hover:shadow-xl transition-all duration-500 hover:-translate-y-1 border border-slate-200/50 dark:border-slate-700/50">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-500/3 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          <div className="relative">
            <div className="relative mb-5">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-2xl blur-xl opacity-15 group-hover:opacity-20 transition-opacity"></div>
              <div className="relative w-16 h-16 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-emerald-400/20 group-hover:scale-110 transition-transform duration-500">
                <Server className="w-8 h-8 text-white" />
              </div>
            </div>
            
            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-3">Backend</h3>
            <p className="text-slate-600 dark:text-slate-300 mb-5 leading-relaxed">API mạnh mẽ và bảo mật cao</p>
            <div className="inline-flex items-center px-5 py-2 bg-gradient-to-r from-emerald-400/10 to-emerald-500/10 border border-emerald-200/50 dark:border-emerald-700/50 rounded-full">
              <span className="text-emerald-700 dark:text-emerald-400 font-semibold">Node.js + Express</span>
            </div>
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
      <div className="text-center mb-10">
        <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent mb-3">Đội Ngũ Phát Triển</h2>
        <p className="text-lg text-slate-600 dark:text-slate-400">Những người tạo nên nền tảng này</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Member 1 */}
        <div className="group relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-3xl shadow-xl p-10 text-center hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-500 transform hover:-translate-y-3 border border-slate-200/50 dark:border-slate-700/50 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          <div className="relative">
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full blur-2xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
              <div className="relative w-36 h-36 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-blue-500/30 group-hover:scale-110 transition-transform duration-500 border-4 border-white/20 dark:border-slate-700/30">
                <span className="text-4xl font-bold text-white">LT</span>
              </div>
              <div className="absolute bottom-2 right-1/3 w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full border-4 border-white dark:border-slate-800 shadow-lg flex items-center justify-center">
                <Award className="w-5 h-5 text-white" />
              </div>
            </div>
            
            <h3 className="text-3xl font-bold text-slate-800 dark:text-white mb-3">Lê Tuấn Lộc</h3>
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-200/50 dark:border-blue-700/50 rounded-full mb-6">
              <span className="text-blue-600 dark:text-blue-400 font-semibold">Full-Stack Developer</span>
            </div>
            <p className="text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
              Chuyên gia phát triển web với niềm đam mê tạo ra trải nghiệm người dùng tuyệt vời.
            </p>
            <div className="flex justify-center space-x-3">
              <button className="p-3 bg-slate-100 dark:bg-slate-700/50 rounded-xl text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-300 hover:scale-110">
                <Github className="w-5 h-5" />
              </button>
              <button className="p-3 bg-slate-100 dark:bg-slate-700/50 rounded-xl text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-300 hover:scale-110">
                <Mail className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Member 2 */}
        <div className="group relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-3xl shadow-xl p-10 text-center hover:shadow-2xl hover:shadow-slate-500/20 transition-all duration-500 transform hover:-translate-y-3 border border-slate-200/50 dark:border-slate-700/50 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-500/5 via-transparent to-slate-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          <div className="relative">
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-gradient-to-br from-slate-600 to-slate-700 rounded-full blur-2xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
              <div className="relative w-36 h-36 bg-gradient-to-br from-slate-600 via-slate-700 to-slate-800 rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-slate-500/30 group-hover:scale-110 transition-transform duration-500 border-4 border-white/20 dark:border-slate-700/30">
                <span className="text-4xl font-bold text-white">NT</span>
              </div>
              <div className="absolute bottom-2 right-1/3 w-10 h-10 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full border-4 border-white dark:border-slate-800 shadow-lg flex items-center justify-center">
                <Award className="w-5 h-5 text-white" />
              </div>
            </div>
            
            <h3 className="text-3xl font-bold text-slate-800 dark:text-white mb-3">Nguyễn Thanh Tiến</h3>
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-slate-500/10 to-slate-600/10 border border-slate-300/50 dark:border-slate-600/50 rounded-full mb-6">
              <span className="text-slate-700 dark:text-slate-300 font-semibold">Full-Stack Developer</span>
            </div>
            <p className="text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
              Phát triển các giải pháp backend mạnh mẽ và tối ưu hóa hiệu suất ứng dụng.
            </p>
            <div className="flex justify-center space-x-3">
              <button className="p-3 bg-slate-100 dark:bg-slate-700/50 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600/50 transition-all duration-300 hover:scale-110">
                <Github className="w-5 h-5" />
              </button>
              <button className="p-3 bg-slate-100 dark:bg-slate-700/50 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600/50 transition-all duration-300 hover:scale-110">
                <Mail className="w-5 h-5" />
              </button>
            </div>
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
    <div ref={ref} className={`max-w-6xl mx-auto px-4 pb-12 transition-opacity duration-1000 ${isIntersecting ? 'animate__animated animate__fadeInUp' : 'opacity-0'}`}>
      <div className="mt-8 relative bg-gradient-to-br from-slate-50 via-slate-50 to-slate-100 dark:from-slate-800/80 dark:via-slate-700/80 dark:to-slate-800/80 backdrop-blur-sm rounded-3xl p-10 md:p-12 text-center border border-slate-200/50 dark:border-slate-700/50 shadow-lg overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-300/5 via-transparent to-transparent"></div>
        
        <div className="relative z-10">
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-400 to-slate-500 rounded-3xl blur-2xl opacity-10"></div>
            <div className="relative w-20 h-20 bg-gradient-to-br from-slate-400 via-slate-500 to-slate-600 rounded-3xl flex items-center justify-center mx-auto shadow-lg shadow-slate-400/20">
              <Award className="w-10 h-10 text-white" />
            </div>
          </div>
          
          <h3 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent mb-5">Sứ Mệnh Của Chúng Tôi</h3>
          <p className="text-base text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Tạo ra một nền tảng đấu giá trực tuyến đáng tin cậy, nơi mọi người có thể
            tham gia mua bán một cách công bằng, minh bạch và an toàn. Chúng tôi không ngừng
            cải tiến để mang lại trải nghiệm tốt nhất cho cộng đồng người dùng.
          </p>
        </div>
      </div>
    </div>
  );
};

export default function AboutPage() {
  return (
    <div className=" bg-gray-50">
      <HeaderSection />
      <ProjectOverview />
      <TechnologiesSection />
      <TeamSection />
      <MissionSection />
    </div>
  );
}
