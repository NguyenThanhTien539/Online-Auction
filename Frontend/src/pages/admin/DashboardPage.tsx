import {
  FiGrid,
  FiMap,
  FiUsers,
  FiUserPlus,
  FiSearch,
  FiFilter,
  FiEdit,
  FiTrash2,
  FiEye,
  FiAlertCircle,
  FiCheckCircle,
} from "react-icons/fi";

export default function DashboardPage() {
  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white shadow-lg">
        <h1 className="text-3xl font-bold mb-2">
          Hướng Dẫn Sử Dụng Hệ Thống Admin
        </h1>
        <p className="text-blue-100">
          Chào mừng bạn đến với trang quản trị hệ thống đấu giá trực tuyến
        </p>
      </div>

      {/* Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
          <div className="flex items-center gap-3 mb-2">
            <FiGrid className="text-2xl text-blue-500" />
            <h3 className="font-semibold">Danh Mục</h3>
          </div>
          <p className="text-sm text-gray-600">Quản lý danh mục sản phẩm</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
          <div className="flex items-center gap-3 mb-2">
            <FiMap className="text-2xl text-green-500" />
            <h3 className="font-semibold">Sản Phẩm</h3>
          </div>
          <p className="text-sm text-gray-600">Quản lý sản phẩm đấu giá</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
          <div className="flex items-center gap-3 mb-2">
            <FiUsers className="text-2xl text-purple-500" />
            <h3 className="font-semibold">Người Dùng</h3>
          </div>
          <p className="text-sm text-gray-600">Quản lý tài khoản người dùng</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-orange-500">
          <div className="flex items-center gap-3 mb-2">
            <FiUserPlus className="text-2xl text-orange-500" />
            <h3 className="font-semibold">Form Đăng Ký</h3>
          </div>
          <p className="text-sm text-gray-600">Duyệt đơn đăng ký người bán</p>
        </div>
      </div>

      {/* Main Guides */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Management */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-3 mb-4 pb-3 border-b">
            <FiGrid className="text-2xl text-blue-500" />
            <h2 className="text-xl font-semibold">Quản Lý Danh Mục</h2>
          </div>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-blue-600 mb-2">
                📋 Danh sách danh mục
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <FiSearch className="mt-1 text-blue-500 flex-shrink-0" />
                  <span>
                    <strong>Tìm kiếm:</strong> Nhập tên danh mục và nhấn Enter
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <FiFilter className="mt-1 text-blue-500 flex-shrink-0" />
                  <span>
                    <strong>Lọc:</strong> Theo trạng thái (Active/Inactive),
                    người tạo, ngày tạo
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <FiEdit className="mt-1 text-green-500 flex-shrink-0" />
                  <span>
                    <strong>Sửa:</strong> Click icon bút chì để chỉnh sửa
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <FiTrash2 className="mt-1 text-red-500 flex-shrink-0" />
                  <span>
                    <strong>Xóa:</strong> Click icon thùng rác để xóa danh mục
                  </span>
                </li>
              </ul>
            </div>
            <div className="pt-3 border-t">
              <h3 className="font-semibold text-blue-600 mb-2">
                ➕ Tạo mới & chỉnh sửa
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• Nhập tên danh mục và mô tả</li>
                <li>• Chọn trạng thái (Active/Inactive)</li>
                <li>• Hệ thống tự động tạo slug từ tên</li>
                <li>• Xác nhận để lưu thay đổi</li>
              </ul>
            </div>
            <div className="pt-3 border-t">
              <h3 className="font-semibold text-blue-600 mb-2">🗑️ Thùng rác</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• Xem danh mục đã xóa</li>
                <li>• Khôi phục hoặc xóa vĩnh viễn</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Product Management */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-3 mb-4 pb-3 border-b">
            <FiMap className="text-2xl text-green-500" />
            <h2 className="text-xl font-semibold">Quản Lý Sản Phẩm</h2>
          </div>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-green-600 mb-2">
                📦 Danh sách sản phẩm
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <FiSearch className="mt-1 text-green-500 flex-shrink-0" />
                  <span>
                    <strong>Tìm kiếm:</strong> Nhập tên sản phẩm để tìm kiếm
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <FiFilter className="mt-1 text-green-500 flex-shrink-0" />
                  <span>
                    <strong>Lọc:</strong> Theo người tạo, khoảng thời gian
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <FiEye className="mt-1 text-blue-500 flex-shrink-0" />
                  <span>
                    <strong>Xem chi tiết:</strong> Click icon mắt để xem thông
                    tin chi tiết
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <FiTrash2 className="mt-1 text-red-500 flex-shrink-0" />
                  <span>
                    <strong>Xóa:</strong> Chuyển sản phẩm vào thùng rác
                  </span>
                </li>
              </ul>
            </div>
            <div className="pt-3 border-t">
              <h3 className="font-semibold text-green-600 mb-2">
                🔍 Chi tiết sản phẩm
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• Xem đầy đủ thông tin sản phẩm</li>
                <li>• Hình ảnh, mô tả chi tiết</li>
                <li>• Giá khởi điểm, thời gian đấu giá</li>
                <li>• Lịch sử đấu giá và người bán</li>
              </ul>
            </div>
            <div className="pt-3 border-t">
              <h3 className="font-semibold text-green-600 mb-2">
                🗑️ Thùng rác
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• Quản lý sản phẩm đã xóa</li>
                <li>• Khôi phục hoặc xóa vĩnh viễn</li>
              </ul>
            </div>
          </div>
        </div>

        {/* User Management */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-3 mb-4 pb-3 border-b">
            <FiUsers className="text-2xl text-purple-500" />
            <h2 className="text-xl font-semibold">Quản Lý Người Dùng</h2>
          </div>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-purple-600 mb-2">
                👥 Danh sách người dùng
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <FiSearch className="mt-1 text-purple-500 flex-shrink-0" />
                  <span>
                    <strong>Tìm kiếm:</strong> Tìm theo tên, email người dùng
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <FiFilter className="mt-1 text-purple-500 flex-shrink-0" />
                  <span>
                    <strong>Lọc:</strong> Theo trạng thái tài khoản
                    (Active/Inactive)
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <FiEye className="mt-1 text-blue-500 flex-shrink-0" />
                  <span>
                    <strong>Xem chi tiết:</strong> Click để xem thông tin đầy đủ
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <FiEdit className="mt-1 text-green-500 flex-shrink-0" />
                  <span>
                    <strong>Chỉnh sửa:</strong> Cập nhật thông tin, phân quyền
                  </span>
                </li>
              </ul>
            </div>
            <div className="pt-3 border-t">
              <h3 className="font-semibold text-purple-600 mb-2">
                🔑 Quản lý quyền
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• Admin: Toàn quyền quản trị</li>
                <li>• Seller: Người bán hàng</li>
                <li>• Bidder: Người tham gia đấu giá</li>
                <li>• User: Người dùng thông thường</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Application Form */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-3 mb-4 pb-3 border-b">
            <FiUserPlus className="text-2xl text-orange-500" />
            <h2 className="text-xl font-semibold">
              Quản Lý Form Đăng Ký Seller
            </h2>
          </div>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-orange-600 mb-2">
                📝 Danh sách đơn đăng ký
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <FiAlertCircle className="mt-1 text-yellow-500 flex-shrink-0" />
                  <span>
                    <strong>Đơn chờ duyệt:</strong> Cần xem xét và phê duyệt
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <FiCheckCircle className="mt-1 text-green-500 flex-shrink-0" />
                  <span>
                    <strong>Đã phê duyệt:</strong> Đơn đã được chấp nhận
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <FiEye className="mt-1 text-blue-500 flex-shrink-0" />
                  <span>
                    <strong>Chi tiết:</strong> Xem thông tin người đăng ký
                  </span>
                </li>
              </ul>
            </div>
            <div className="pt-3 border-t">
              <h3 className="font-semibold text-orange-600 mb-2">
                ✅ Quy trình duyệt
              </h3>
              <ol className="space-y-2 text-sm text-gray-700 list-decimal list-inside">
                <li>Kiểm tra thông tin người đăng ký</li>
                <li>Xác minh giấy tờ, tài liệu</li>
                <li>Phê duyệt hoặc từ chối đơn</li>
                <li>Hệ thống tự động cập nhật quyền</li>
              </ol>
            </div>
            <div className="pt-3 border-t">
              <h3 className="font-semibold text-orange-600 mb-2">
                📋 Thông tin cần kiểm tra
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• Thông tin cá nhân đầy đủ</li>
                <li>• Giấy tờ tuỳ thân hợp lệ</li>
                <li>• Lý do muốn trở thành seller</li>
                <li>• Kinh nghiệm bán hàng (nếu có)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Common Features */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4 pb-3 border-b">
          ⚙️ Tính Năng Chung
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-blue-600 mb-3">
              🔍 Thanh tìm kiếm và lọc
            </h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>
                • <strong>Tìm kiếm:</strong> Nhập từ khóa vào ô tìm kiếm, nhấn
                Enter hoặc click nút tìm kiếm
              </li>
              <li>
                • <strong>Lọc nâng cao:</strong> Sử dụng FilterBar để lọc theo
                nhiều tiêu chí
              </li>
              <li>
                • <strong>Reset:</strong> Click nút "Reset" để xóa bộ lọc và tìm
                kiếm
              </li>
              <li>
                • <strong>Phân trang:</strong> Sử dụng nút Previous/Next để
                chuyển trang
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-blue-600 mb-3">
              💾 Thao tác dữ liệu
            </h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>
                • <strong>Tạo mới:</strong> Click nút "Tạo mới" trên thanh công
                cụ
              </li>
              <li>
                • <strong>Chỉnh sửa:</strong> Click icon{" "}
                <FiEdit className="inline text-green-500" /> trong bảng
              </li>
              <li>
                • <strong>Xóa:</strong> Click icon{" "}
                <FiTrash2 className="inline text-red-500" /> để chuyển vào thùng
                rác
              </li>
              <li>
                • <strong>Xem chi tiết:</strong> Click icon{" "}
                <FiEye className="inline text-blue-500" /> để xem đầy đủ thông
                tin
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg shadow-md p-6 border-l-4 border-yellow-500">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <FiAlertCircle className="text-yellow-600" />
          💡 Mẹo Sử Dụng
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ul className="space-y-2 text-sm text-gray-700">
            <li>
              ✅ Sử dụng phím tắt{" "}
              <kbd className="px-2 py-1 bg-gray-200 rounded">Ctrl</kbd> +{" "}
              <kbd className="px-2 py-1 bg-gray-200 rounded">F</kbd> để tìm kiếm
              nhanh
            </li>
            <li>✅ Kiểm tra thùng rác định kỳ để dọn dẹp dữ liệu</li>
            <li>✅ Sử dụng bộ lọc để tìm kiếm chính xác hơn</li>
          </ul>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>✅ Backup dữ liệu trước khi xóa vĩnh viễn</li>
            <li>✅ Kiểm tra kỹ thông tin trước khi phê duyệt đơn</li>
            <li>✅ Cập nhật trạng thái sản phẩm và danh mục thường xuyên</li>
          </ul>
        </div>
      </div>

      {/* Footer Note */}
      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
        <p className="text-sm text-blue-800">
          <strong>📌 Lưu ý:</strong> Để được hỗ trợ thêm, vui lòng liên hệ với
          quản trị viên hệ thống hoặc xem tài liệu chi tiết trong mục Cài đặt.
        </p>
      </div>
    </div>
  );
}
