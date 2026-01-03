import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

// Định nghĩa kiểu dữ liệu cho một breadcrumb item
export type BreadcrumbItem = {
  label: string;        // Tên hiển thị (VD: "Điện thoại iPhone 15")
  path: string | null;  // Đường dẫn (null = trang hiện tại, không click được)
};

// Định nghĩa kiểu dữ liệu cho Context
type BreadcrumbContextType = {
  breadcrumbs: BreadcrumbItem[];                    // Mảng các breadcrumb items
  setBreadcrumbs: (items: BreadcrumbItem[]) => void; // Function để set breadcrumbs
};

// Tạo Context với giá trị mặc định là undefined
const BreadcrumbContext = createContext<BreadcrumbContextType | undefined>(
  undefined
);

// Provider component - wrap toàn bộ app
export function BreadcrumbProvider({ children }: { children: ReactNode }) {
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([]);

  return (
    <BreadcrumbContext.Provider value={{ breadcrumbs, setBreadcrumbs }}>
      {children}
    </BreadcrumbContext.Provider>
  );
}

// Custom hook để sử dụng breadcrumb context
export function useBreadcrumb() {
  const context = useContext(BreadcrumbContext);
  if (!context) {
    throw new Error("useBreadcrumb must be used within BreadcrumbProvider");
  }
  return context;
}
