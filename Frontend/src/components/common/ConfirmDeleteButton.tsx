import React from "react";
import Swal from "sweetalert2";

interface ConfirmDeleteButtonProps {
  apiUrl: string;
  onSuccess: (data: any) => void;
  onError: (message: string) => void;
  className?: string;
  children: React.ReactNode;
}

const ConfirmDeleteButton: React.FC<ConfirmDeleteButtonProps> = ({
  apiUrl,
  onSuccess,
  onError,
  className,
  children,
}) => {
  const handleClick = () => {
    Swal.fire({
      title: "Bạn có chắc muốn xóa bản ghi này?",
      text: "Hành động này sẽ không được khôi phục được",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Vẫn xóa",
      cancelButtonText: "Không xóa",
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(apiUrl, {
          method: "DELETE",
          credentials: "include",
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.code === "success") {
              onSuccess(data);
            } else {
              onError(data.message);
            }
          })
          .catch((error) => {
            onError("Có lỗi xảy ra khi xóa.");
          });
      }
    });
  };

  return (
    <button className={className} onClick={handleClick}>
      {children}
    </button>
  );
};

export default ConfirmDeleteButton;
