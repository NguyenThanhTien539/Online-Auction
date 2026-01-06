import { useEffect, useRef, useState } from "react"
import { Zap, Shield, Target, Trophy, BookOpen, Heart, Sparkles, Lock, Grid3x3 } from "lucide-react"
import useIntersectionObserver from "@/hooks/useIntersectionObserver"
import {Link} from "react-router-dom"
import heroImage from "@/assets/images/hero-section-background.png"



const WelcomeText = () => {
  const { ref, hasIntersected } = useIntersectionObserver()

  return (
    <div
      ref={ref}
      className={`relative bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 py-20 px-6 rounded-3xl mx-4 my-12 overflow-hidden transition-opacity duration-700 ${
        hasIntersected ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full border border-blue-200/50 dark:border-slate-700 mb-6">
            <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
              Nền tảng đấu giá hàng đầu
            </span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 dark:from-white dark:via-slate-200 dark:to-white bg-clip-text text-transparent mb-6 leading-tight">
            Khám Phá Thế Giới Đấu Giá Trực Tuyến
          </h2>
          
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Chào mừng bạn đến với nền tảng đấu giá online hàng đầu, nơi mọi món đồ quý giá đều chờ đợi chủ nhân mới.
            Từ đồ cổ xưa đến công nghệ hiện đại, chúng tôi mang đến trải nghiệm đấu giá thú vị, công bằng và an toàn.
          </p>
        </div>
        
        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="group relative bg-white dark:bg-slate-800 p-8 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
            
            <div>
              <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-md mb-6 group-hover:scale-105 transition-transform duration-200">
                <Zap className="w-8 h-8 text-white" />
              </div>
              
              <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-3">
                Nhanh Chóng & Dễ Dàng
              </h3>
              
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                Đăng ký tài khoản và bắt đầu đấu giá chỉ trong vài phút. Giao diện thân thiện, hướng dẫn rõ ràng.
              </p>
            </div>
          </div>
          
          <div className="group relative bg-white dark:bg-slate-800 p-8 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-emerald-300 dark:hover:border-emerald-600 transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
            
            <div>
              <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-md mb-6 group-hover:scale-105 transition-transform duration-200">
                <Lock className="w-8 h-8 text-white" />
              </div>
              
              <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-3">
                An Toàn & Bảo Mật
              </h3>
              
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                Hệ thống mã hóa cao, thanh toán bảo mật. Đảm bảo quyền lợi cho cả người bán và người mua.
              </p>
            </div>
          </div>
          
          <div className="group relative bg-white dark:bg-slate-800 p-8 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-purple-300 dark:hover:border-purple-600 transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
            
            <div>
              <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 shadow-md mb-6 group-hover:scale-105 transition-transform duration-200">
                <Grid3x3 className="w-8 h-8 text-white" />
              </div>
              
              <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-3">
                Đa Dạng Sản Phẩm
              </h3>
              
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                Từ nghệ thuật, đồ cổ đến điện tử, thời trang. Luôn có thứ gì đó phù hợp với sở thích của bạn.
              </p>
            </div>
          </div>
        </div>
        
        {/* Quote Section */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-900 rounded-2xl border border-slate-200/50 dark:border-slate-700/50">
            <div className="w-1 h-12 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
            <p className="text-base text-slate-600 dark:text-slate-300 italic font-medium">
              "Đấu giá không chỉ là mua bán, mà là cuộc phiêu lưu tìm kiếm kho báu!"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

const Hero = () => {
  const { ref, hasIntersected } = useIntersectionObserver()

  return (
    <>
      
      <div
        ref={ref}
        className={`relative pl-[30px] pb-[110px] pt-[120px] bg-gradient-to-br from-blue-50 via-indigo-50/80 to-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 lg:pt-[100px] mb-[50px] overflow-hidden border border-blue-100/30 dark:border-slate-800/50 shadow-2xl shadow-blue-500/5 dark:shadow-slate-900/50 rounded-3xl ${
          hasIntersected ? 'animate__animated animate__fadeInUp animate__slow' : 'opacity-0'
        }`}
      >
        {/* Enhanced decorative gradients */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-400/10 via-transparent to-transparent"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-indigo-400/10 via-transparent to-transparent"></div>
        
        {/* Elegant floating shapes */}
        <div className={`absolute top-20 right-32 w-72 h-72 bg-gradient-to-br from-blue-400/20 to-indigo-500/20 rounded-full blur-3xl transition-all duration-1000 delay-300 ${hasIntersected ? 'animate__animated animate__pulse animate__infinite animate__slower' : 'scale-0 opacity-0'}`}></div>
        <div className={`absolute bottom-32 left-20 w-96 h-96 bg-gradient-to-tr from-purple-400/15 to-pink-400/15 rounded-full blur-3xl transition-all duration-1000 delay-500 ${hasIntersected ? 'opacity-100' : 'scale-0 opacity-0'}`}></div>
        <div className={`absolute top-1/2 left-1/3 w-64 h-64 bg-gradient-to-bl from-cyan-300/10 to-blue-300/10 rounded-full blur-3xl transition-all duration-1000 delay-700 ${hasIntersected ? 'animate__animated animate__pulse animate__infinite animate__slow' : 'scale-0 opacity-0'}`}></div>
        
        <div className="container relative z-10">
          <div className="-mx-4 flex flex-wrap">
            <div className="w-full px-4 lg:w-5/12">
              <div className="hero-content">
                <h1 className={`mb-5 text-4xl font-bold !leading-[1.208] sm:text-[42px] lg:text-[40px] xl:text-6xl transition-all duration-1000 delay-300 ${
                  hasIntersected ? 'animate__animated animate__fadeInLeft' : ''
                }`}>
                  <div className="inline-flex items-center gap-3 mb-2">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-2xl blur-lg opacity-60 animate__animated animate__pulse animate__infinite"></div>
                      <div className="relative bg-gradient-to-br from-yellow-400 via-yellow-500 to-orange-500 p-3 rounded-2xl shadow-xl">
                        <Trophy className="text-white" size={44} />
                      </div>
                    </div>
                  </div>
                  <span className="block bg-gradient-to-r from-slate-900 via-blue-800 to-indigo-900 dark:from-white dark:via-blue-200 dark:to-indigo-100 bg-clip-text text-transparent font-extrabold tracking-tight">
                    Sàn Đấu Giá Trực Tuyến
                  </span>
                  <span className="block text-2xl mt-2 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent font-semibold">
                    Nơi Khởi Đầu Những Giá Trị Đích Thực
                  </span>
                </h1>
                <div className={`mb-8 max-w-[520px] transition-all duration-1000 delay-500 ${
                  hasIntersected ? 'animate__animated animate__fadeInLeft' : ''
                }`}>
                  <p className="text-lg text-slate-700 dark:text-slate-300 font-medium leading-relaxed mb-3">
                    Đang tìm kiếm điều gì đó đặc biệt? Các chuyên gia của chúng tôi đã tuyển chọn những món đồ tốt nhất.
                  </p>
                  <p className="text-base text-slate-600 dark:text-slate-400 leading-relaxed">
                    Tham gia ngay hôm nay và khám phá thế giới đấu giá đầy hứng khởi với hàng ngàn sản phẩm chất lượng!
                  </p>
                </div>
                <div className={`flex flex-wrap items-center gap-4 pt-5 transition-all duration-1000 delay-700 ${
                  hasIntersected ? 'animate__animated animate__fadeInUp' : ''
                }`}>
                  <Link to="/about"
                    className="group relative inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white rounded-2xl overflow-hidden transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/50"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 transition-all duration-500 group-hover:scale-110"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <BookOpen className="relative mr-2 group-hover:rotate-12 transition-transform duration-500" size={20} />
                    <span className="relative">Về chúng tôi</span>
                  </Link>
                  
                  <Link to="/my-products"
                    className="group relative inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white rounded-2xl overflow-hidden transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-rose-500/50"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-rose-500 via-pink-600 to-rose-600 transition-all duration-500 group-hover:scale-110"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-rose-400 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <Heart className="relative mr-2 group-hover:scale-125 transition-transform duration-500" size={20} />
                    <span className="relative">Yêu thích của bạn</span>
                  </Link>
                </div>
              </div>
            </div>
            <div className="hidden px-4 lg:block lg:w-1/12"></div>
            <div className="w-full px-4 lg:w-6/12">
              <div className="lg:ml-auto lg:text-right">
                <div className="relative z-10 inline-block pt-11 lg:pt-0">
                  <div className="relative inline-block">
                    <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-3xl blur-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-1000"></div>
                    <img
                      src={heroImage}
                      alt="hero"
                      className={`relative max-w-full lg:ml-auto lg:h-[450px] object-cover rounded-3xl shadow-[0_20px_50px_rgba(59,130,246,0.3)] hover:shadow-[0_25px_60px_rgba(59,130,246,0.4)] border-4 border-white/20 dark:border-slate-700/30 transition-all duration-1000 delay-900 hover:scale-[1.02] ${
                        hasIntersected ? 'animate__animated animate__fadeInRight' : 'opacity-0 translate-x-5'
                      }`}
                    />
                  </div>
                  <span className="absolute -bottom-8 -left-8 z-[-1]">
                    <svg
                      width="93"
                      height="93"
                      viewBox="0 0 93 93"
                      fill="none"
                    >
                      <circle cx="2.5" cy="2.5" r="2.5" fill="#3B82F6" />
                      <circle cx="2.5" cy="24.5" r="2.5" fill="#3B82F6" />
                      <circle cx="2.5" cy="46.5" r="2.5" fill="#3B82F6" />
                      <circle cx="2.5" cy="68.5" r="2.5" fill="#3B82F6" />
                      <circle cx="2.5" cy="90.5" r="2.5" fill="#3B82F6" />
                      <circle cx="24.5" cy="2.5" r="2.5" fill="#3B82F6" />
                      <circle cx="24.5" cy="24.5" r="2.5" fill="#3B82F6" />
                      <circle cx="24.5" cy="46.5" r="2.5" fill="#3B82F6" />
                      <circle cx="24.5" cy="68.5" r="2.5" fill="#3B82F6" />
                      <circle cx="24.5" cy="90.5" r="2.5" fill="#3B82F6" />
                      <circle cx="46.5" cy="2.5" r="2.5" fill="#3B82F6" />
                      <circle cx="46.5" cy="24.5" r="2.5" fill="#3B82F6" />
                      <circle cx="46.5" cy="46.5" r="2.5" fill="#3B82F6" />
                      <circle cx="46.5" cy="68.5" r="2.5" fill="#3B82F6" />
                      <circle cx="46.5" cy="90.5" r="2.5" fill="#3B82F6" />
                      <circle cx="68.5" cy="2.5" r="2.5" fill="#3B82F6" />
                      <circle cx="68.5" cy="24.5" r="2.5" fill="#3B82F6" />
                      <circle cx="68.5" cy="46.5" r="2.5" fill="#3B82F6" />
                      <circle cx="68.5" cy="68.5" r="2.5" fill="#3B82F6" />
                      <circle cx="68.5" cy="90.5" r="2.5" fill="#3B82F6" />
                      <circle cx="90.5" cy="2.5" r="2.5" fill="#3B82F6" />
                      <circle cx="90.5" cy="24.5" r="2.5" fill="#3B82F6" />
                      <circle cx="90.5" cy="46.5" r="2.5" fill="#3B82F6" />
                      <circle cx="90.5" cy="68.5" r="2.5" fill="#3B82F6" />
                      <circle cx="90.5" cy="90.5" r="2.5" fill="#3B82F6" />
                    </svg>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};






function Section1(){
  return (
    <div>
      {/* Title */}
      
      <Hero></Hero>
      <WelcomeText />
      
      
    </div>
  );
}




export default Section1;