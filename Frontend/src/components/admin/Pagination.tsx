import { useSearchParams } from "react-router-dom";

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  isPageLoading: boolean;
}

export default function Pagination({
  totalPages,
  currentPage,
  isPageLoading,
}: PaginationProps) {
  const [, setSearchParams] = useSearchParams();

  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const showPages = 5; // Số trang hiển thị xung quanh trang hiện tại

    if (totalPages <= 7) {
      // Nếu tổng số trang <= 7, hiển thị tất cả
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Luôn hiển thị trang đầu
      pages.push(1);

      if (currentPage <= 3) {
        // Gần đầu: 1 2 3 4 5 ... 10
        for (let i = 2; i <= 5; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Gần cuối: 1 ... 6 7 8 9 10
        pages.push("...");
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // Ở giữa: 1 ... 4 5 6 ... 10
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex justify-center items-center space-x-2 mt-6">
      <button
        onClick={() =>
          setSearchParams((prev) => ({
            ...Object.fromEntries(prev),
            page: Math.max(currentPage - 1, 1).toString(),
          }))
        }
        disabled={currentPage === 1 || isPageLoading}
        className="cursor-pointer px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Trước
      </button>
      {pageNumbers.map((page, index) =>
        typeof page === "string" ? (
          <span
            key={`ellipsis-${index}`}
            className=" px-3 py-2 text-gray-500 text-sm font-medium"
          >
            {page}
          </span>
        ) : (
          <button
            key={page}
            onClick={() =>
              setSearchParams((prev) => ({
                ...Object.fromEntries(prev),
                page: page.toString(),
              }))
            }
            disabled={isPageLoading}
            className={` cursor-pointer px-3 py-2 border border-gray-300 rounded-md text-sm font-medium ${
              page === currentPage
                ? "bg-blue-500 text-white border-blue-500"
                : "text-gray-700 bg-white hover:bg-gray-50"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {page}
          </button>
        )
      )}
      <button
        onClick={() =>
          setSearchParams((prev) => ({
            ...Object.fromEntries(prev),
            page: Math.min(currentPage + 1, totalPages).toString(),
          }))
        }
        disabled={currentPage === totalPages || isPageLoading}
        className="cursor-pointer px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Sau
      </button>
    </div>
  );
}
