import React, { useState, useRef } from "react";
import { Camera, Save, X, User, Mail, Shield, Calendar } from "lucide-react";
import { useAuth } from "@/routes/ProtectedRouter";
import { toast } from "sonner";

export default function ProfilePage() {
  const { auth: user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Update form data when user data loads
  React.useEffect(() => {
    if (user) {
      setFormData({
        full_name: user.full_name || "",
        email: user.email || "",
      });
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    setIsSaving(true);
    try {
      // const formDataToSend = new FormData();
      // formDataToSend.append("full_name", formData.full_name);
      // formDataToSend.append("email", formData.email);

      // // if (selectedFile) {
      // //   formDataToSend.append("avatar", selectedFile);
      // // }
      const finalData: any = {
        full_name: formData.full_name,
        username: user.username,
        email: formData.email,
      };
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/profile/edit`,
        {
          method: "PATCH",
          credentials: "include",
          body: JSON.stringify(finalData),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (data.status === "success") {
        toast.success("Cập nhật thông tin thành công!");
        setIsEditing(false);
        setSelectedFile(null);
        setPreviewUrl(null);
      } else {
        toast.error(data.message || "Có lỗi xảy ra khi cập nhật");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Có lỗi xảy ra khi cập nhật thông tin");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setSelectedFile(null);
    setPreviewUrl(null);
    if (user) {
      setFormData({
        full_name: user.full_name || "",
        email: user.email || "",
      });
    }
  };

  const getInitials = (name: string) => {
    const words = name.trim().split(" ");
    if (words.length === 0) return "?";
    const lastWord = words[words.length - 1];
    return lastWord.charAt(0).toUpperCase();
  };

  if (!user) {
    return (
      <div className="w-full min-h-screen px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="w-full min-h-screen px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <User className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Không thể tải thông tin người dùng
            </h2>
            <p className="text-gray-600">Vui lòng đăng nhập lại để tiếp tục.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Thông tin cá nhân
          </h1>
          <p className="text-gray-600 mt-1">
            Quản lý thông tin tài khoản của bạn
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Avatar Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-center">
                <div className="relative inline-block">
                  {previewUrl || user.avatar ? (
                    <img
                      src={previewUrl || user.avatar}
                      alt={user.full_name}
                      className="w-32 h-32 rounded-full object-cover border-4 border-gray-200 mx-auto"
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-blue-500 text-white flex items-center justify-center text-4xl font-bold mx-auto border-4 border-gray-200">
                      {getInitials(user.full_name)}
                    </div>
                  )}

                  {isEditing && (
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-colors"
                    >
                      <Camera size={16} />
                    </button>
                  )}
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />

                <h3 className="text-xl font-semibold text-gray-900 mt-4">
                  {user.full_name}
                </h3>
                <p className="text-gray-600">{user.email}</p>

                <div className="mt-4 flex justify-center">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      user.role === "admin"
                        ? "bg-purple-100 text-purple-800"
                        : user.role === "seller"
                        ? "bg-green-100 text-green-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    <Shield className="w-4 h-4 mr-1" />
                    {user.role === "admin"
                      ? "Quản trị viên"
                      : user.role === "seller"
                      ? "Người bán"
                      : "Người dùng"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Information */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Thông tin chi tiết
                </h2>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Chỉnh sửa
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={handleCancel}
                      className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                      disabled={isSaving}
                    >
                      <X size={16} className="inline mr-1" />
                      Hủy
                    </button>
                    <button
                      onClick={handleSave}
                      className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
                      disabled={isSaving}
                    >
                      {isSaving ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white inline mr-1"></div>
                      ) : (
                        <Save size={16} className="inline mr-1" />
                      )}
                      Lưu
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-6">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User className="inline w-4 h-4 mr-1" />
                    Họ và tên
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Nhập họ và tên"
                    />
                  ) : (
                    <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                      {user.full_name}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Mail className="inline w-4 h-4 mr-1" />
                    Email
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      readOnly
                      onChange={handleInputChange}
                      className=" w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Nhập email"
                    />
                  ) : (
                    <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                      {user.email}
                    </p>
                  )}
                </div>

                {/* Role */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Shield className="inline w-4 h-4 mr-1" />
                    Quyền người dùng
                  </label>
                  <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                    {user.role === "admin"
                      ? "Quản trị viên"
                      : user.role === "seller"
                      ? "Người bán"
                      : "Người dùng"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
