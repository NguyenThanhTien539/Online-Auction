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
        className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Trước
      </button>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <button
          key={page}
          onClick={() =>
            setSearchParams((prev) => ({
              ...Object.fromEntries(prev),
              page: page.toString(),
            }))
          }
          disabled={isPageLoading}
          className={`px-3 py-2 border border-gray-300 rounded-md text-sm font-medium ${
            page === currentPage
              ? "bg-blue-500 text-white border-blue-500"
              : "text-gray-700 bg-white hover:bg-gray-50"
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {page}
        </button>
      ))}
      <button
        onClick={() =>
          setSearchParams((prev) => ({
            ...Object.fromEntries(prev),
            page: Math.min(currentPage + 1, totalPages).toString(),
          }))
        }
        disabled={currentPage === totalPages || isPageLoading}
        className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Sau
      </button>
    </div>
  );
}
