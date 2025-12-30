import { useEffect, useRef, useState } from "react"
import { Zap, Shield, Target, Trophy, BookOpen, Heart } from "lucide-react"
import useIntersectionObserver from "@/hooks/useIntersectionObserver"
import {Link} from "react-router-dom"
import heroImage from "@/assets/images/hero-section-background.png"



const WelcomeText = () => {
  const { ref, hasIntersected } = useIntersectionObserver()

  return (
    <div
      ref={ref}
      className={`bg-gradient-to-r from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900 py-16 px-6 rounded-2xl shadow-lg mx-4 my-8 transition-all duration-1000 ${
        hasIntersected ? 'animate__animated animate__fadeInUp' : ''
      }`}
    >
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-6">
          🌟 Khám Phá Thế Giới Đấu Giá Trực Tuyến
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
          Chào mừng bạn đến với nền tảng đấu giá online hàng đầu, nơi mọi món đồ quý giá đều chờ đợi chủ nhân mới!
          Từ đồ cổ xưa đến công nghệ hiện đại, chúng tôi mang đến trải nghiệm đấu giá thú vị, công bằng và an toàn.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
          <div className={`bg-white dark:bg-gray-700 p-6 rounded-xl shadow-md hover:shadow-lg transition-all delay-200 duration-500 ${hasIntersected ? 'animate__animated animate__fadeInLeft animate__slow' : ''}`}>
            <div className="text-4xl mb-4 text-blue-500"><Zap size={48} /></div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">Nhanh Chóng & Dễ Dàng</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Đăng ký tài khoản và bắt đầu đấu giá chỉ trong vài phút. Giao diện thân thiện, hướng dẫn rõ ràng.
            </p>
          </div>
          
          <div className={`bg-white dark:bg-gray-700 p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-500 delay-800 ${hasIntersected ? 'animate__animated animate__fadeInUp animate__slow' : ''}`}>
            <div className="text-4xl mb-4 text-green-500"><Shield size={48} /></div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">An Toàn & Bảo Mật</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Hệ thống mã hóa cao, thanh toán bảo mật. Đảm bảo quyền lợi cho cả người bán và người mua.
            </p>
          </div>
          
          <div className={`bg-white dark:bg-gray-700 p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-500 delay-500 ${hasIntersected ? 'animate__animated animate__fadeInRight animate__slow' : ''}`}>
            <div className="text-4xl mb-4 text-purple-500"><Target size={48} /></div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">Đa Dạng Sản Phẩm</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Từ nghệ thuật, đồ cổ đến điện tử, thời trang. Luôn có thứ gì đó phù hợp với sở thích của bạn.
            </p>
          </div>
        </div>
        
        <div className="mt-10">
          <p className="text-base text-gray-500 dark:text-gray-400 italic">
            "Đấu giá không chỉ là mua bán, mà là cuộc phiêu lưu tìm kiếm kho báu!" 
          </p>
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
        className={`relative pl-[30px] pb-[110px] pt-[120px] bg-gradient-to-br from-blue-300 via-blue-200 to-white dark:from-gray-800 dark:to-gray-900 lg:pt-[100px] mb-[50px] overflow-hidden border border-blue-200/50 shadow-2xl shadow-blue-300/30 backdrop-blur-sm ${
          hasIntersected ? 'animate__animated animate__fadeInUp animate__slow' : 'opacity-0'
        }`}
      >
        {/* Floating shapes for fun */}
        <div className={`absolute top-10 left-10 w-20 h-20 bg-white rounded-full opacity-30 transition-all duration-1000 delay-300 ${hasIntersected ? 'animate__animated animate__pulse  animate__infinite' : 'scale-0'}`}></div>
        <div className={`absolute top-12 right-20 w-16 h-16 bg-white rounded-full opacity-30 transition-all duration-1000 delay-500 ${hasIntersected ? 'animate__animated animate__fadeInDown animate__slower animate__infinite' : 'scale-0'}`}></div>
        <div className={`absolute bottom-20 left-1/4 w-12 h-12 bg-white opacity-25 transition-all delay-700 ${hasIntersected ? 'animate__animated animate__hinge animate__slower animate__infinite' : 'scale-0'}`}></div>
        
        <div className="container relative z-10">
          <div className="-mx-4 flex flex-wrap">
            <div className="w-full px-4 lg:w-5/12">
              <div className="hero-content">
                <h1 className={`mb-5 text-4xl font-bold !leading-[1.208] bg-gradient-to-r from-blue-600 via-blue-500 to-blue-300 bg-clip-text text-transparent sm:text-[42px] lg:text-[40px] xl:text-5xl transition-all duration-1000 delay-300 ${
                  hasIntersected ? 'animate__animated animate__fadeInLeft' : ''
                }`}>
                  <Trophy className="inline mr-3 text-yellow-400 bg-linear-180 from-yellow-200 via-yellow-50 to-white/50 p-2 rounded-full" size={50} /> Sàn Đấu Giá Trực Tuyến
                </h1>
                <p className={`mb-8 max-w-[480px] text-base text-gray-800 dark:text-dark-6 font-medium transition-all duration-1000 delay-500 ${
                  hasIntersected ? 'animate__animated animate__fadeInLeft' : ''
                }`}>
                  Đang tìm kiếm điều gì đó đặc biệt? Các chuyên gia của chúng tôi đã tuyển chọn những món đồ tốt nhất. Hãy cứ tự thưởng cho mình đi nào! 
                </p>
                <ul className={`flex flex-wrap items-center gap-[10px] pt-5 transition-all duration-1000 delay-700 ${
                  hasIntersected ? 'animate__animated animate__fadeInUp' : ''
                }`}>
                  <li>
                    <Link to = "/about"
                      className="inline-flex items-center justify-center rounded-full bg-blue-600 text-white px-8 py-4 text-center text-base font-bold hover:bg-blue-800 lg:px-10 transition-all duration-700 transform hover:scale-110 hover:shadow-2xl hover:shadow-blue-400"
                    >
                      <BookOpen className="mr-2 animate__animated animate__infinite animate__flash animate__slower" size={20} /> Về chúng tôi
                    </Link>
                  </li>
                  <li>
                    <Link to = "/my-products"
                      className="inline-flex items-center justify-center px-6 py-4 text-center text-base font-bold text-white hover:text-blue-200 dark:text-white transition-all duration-700 rounded-full shadow-lg shadow-gray-400 hover:shadow-xl hover:shadow-blue-400 transform hover:scale-110 bg-gradient-to-r from-rose-300 to-rose-500"
                    >
                      <Heart className="mr-2 animate__animated animate__infinite animate__heartBeat animate__slow" size={24} />
                       Yêu thích của bạn
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="hidden px-4 lg:block lg:w-1/12"></div>
            <div className="w-full px-4 lg:w-6/12">
              <div className="lg:ml-auto lg:text-right">
                <div className="relative z-10 inline-block pt-11 lg:pt-0">
                  <img
                    src={heroImage}
                    alt="hero"
                    className={`max-w-full lg:ml-auto lg:h-[450px] object-cover rounded-4xl shadow-[20px_10px_15px_rgb(59,130,246,0.5)] hover:shadow-[30px_20px_25px_rgb(59,130,246,0.7)] transition-all duration-1000 delay-900 ${
                      hasIntersected ? 'animate__animated animate__fadeInRight' : 'opacity-0 translate-x-5'
                    }`}
                  />
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