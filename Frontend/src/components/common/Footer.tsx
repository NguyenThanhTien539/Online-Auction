import { Github, Facebook, Mail, Phone, MapPin, Trophy, Heart, ArrowUp } from "lucide-react"
import { useState } from "react"
import {Link } from "react-router-dom"
const Footer = () => {
  const [showScrollTop, setShowScrollTop] = useState(false)

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const currentYear = new Date().getFullYear()

  return (
    <>


      <footer className="bg-gradient-to-br from-gray-800 via-gray-700 to-gray-500 text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-500/20 to-white/10"></div>
        </div>

        <div className="relative z-10 container mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Trophy className="text-yellow-400" size={32} />
                <h3 className="text-2xl font-bold text-blue-400">
                  AuctionPro
                </h3>
              </div>
              <p className="text-gray-300 leading-relaxed">
                Nền tảng đấu giá trực tuyến hàng đầu Việt Nam. Mang đến trải nghiệm đấu giá công bằng,
                an toàn và thú vị cho mọi người.
              </p>
              <div className="flex space-x-4">
                <Link to = "https://www.github.com/NguyenThanhTien539/Online-Auction"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-800 hover:bg-gray-700 p-3 rounded-full transition-all duration-300 transform hover:scale-110 hover:shadow-lg group"
                >
                  <Github size={20} className="group-hover:text-blue-400 transition-colors" />
                </Link>
                <Link to = "https://www.facebook.com/le.tuan.loc.39104/?locale=vi_VN"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-600 hover:bg-blue-500 p-3 rounded-full transition-all duration-300 transform hover:scale-110 hover:shadow-lg group"
                >
                  <Facebook size={20} className="group-hover:text-white transition-colors" />
                </Link>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h4 className="text-xl font-semibold text-white">Liên Kết Nhanh</h4>
              <ul className="space-y-2">
                <li>
                  <Link to = "/" className="text-gray-300 hover:text-blue-400 transition-colors duration-300 flex items-center group">
                    <span className="w-0 group-hover:w-4 transition-all duration-300 overflow-hidden">→</span>
                    Trang Chủ
                  </Link>
                </li>
                <li>
                  <Link to="/categories" className="text-gray-300 hover:text-blue-400 transition-colors duration-300 flex items-center group">
                    <span className="w-0 group-hover:w-4 transition-all duration-300 overflow-hidden">→</span>
                    Danh mục
                  </Link>
                </li>
                <li>
                  <Link to ="/about" className="text-gray-300 hover:text-blue-400 transition-colors duration-300 flex items-center group">
                    <span className="w-0 group-hover:w-4 transition-all duration-300 overflow-hidden">→</span>
                    Về Chúng Tôi
                  </Link>
                </li>
              </ul>
            </div>

            {/* Services */}
            <div className="space-y-4">
              <h4 className="text-xl font-semibold text-white">Dịch Vụ</h4>
              <ul className="space-y-2">
                <li>
                  <span className="text-gray-300">Bán Sản Phẩm</span>
                </li>
                <li>
                  <span className="text-gray-300">Đấu Giá Online</span>
                </li>
                <li>
                  <span className="text-gray-300">Xác Thực Sản Phẩm</span>
                </li>
                <li>
                  <span className="text-gray-300">Hỗ Trợ 24/7</span>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div className="space-y-4">
              <h4 className="text-xl font-semibold text-white">Liên Hệ</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-gray-300">
                  <MapPin size={18} className="text-blue-400 flex-shrink-0" />
                  <span>227 Nguyễn Văn Cừ, phường Chợ Quán, thành phố Hồ Chí Minh</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-300">
                  <Mail size={18} className="text-blue-400 flex-shrink-0" />
                  <span>letuanloc1412@gmail.com</span>
                </div>
              </div>

            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-gray-700 mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-gray-400 text-sm mb-4 md:mb-0">
                © {currentYear} AuctionPro. Tất cả quyền được bảo lưu.
                <span className="ml-2 text-blue-400">Made with <Heart size={14} className="inline animate-pulse" /> in Vietnam</span>
              </div>
              <div className="flex space-x-6 text-sm text-gray-400">
                <div className="hover:text-blue-400 transition-colors">Bảo Mật</div>
                <div className="hover:text-blue-400 transition-colors">Điều Khoản</div>
                <div className="hover:text-blue-400 transition-colors">Cookie</div>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Bottom Wave */}
        <div className="absolute bottom-0 left-0 w-full">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-12 fill-current text-white opacity-10">
            <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25"></path>
            <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5"></path>
            <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"></path>
          </svg>
        </div>
      </footer>
    </>
  )
}

export default Footer