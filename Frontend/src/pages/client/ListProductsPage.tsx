import ProductCard from "@/components/common/ProductCard";
import PaginationComponent from "@/components/common/Pagination";
import SelectComponent from "@/components/common/Select";
import { usePreventBodyLock } from "@/hooks/usePreventBodyLock";
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { slugify } from "@/utils/make_slug";
import Loading from "@/components/common/Loading";
import { Search } from "lucide-react";
import { useBreadcrumb } from "@/contexts/BreadcrumbContext";

type Products = {
  product_id: number;
  product_images: string[];
  product_name: string;
  current_price: number;
  buy_now_price: number;
  start_time: any;
  end_time: any;
  price_owner_username: string;
  price_owner_id: number;
  bid_turns: string;
};

type Cat = {
  cat_id: number;
  cat_name: string;
}
function ListProductsPage() {
  usePreventBodyLock();
  const [searchParams, setSeachParams] = useSearchParams();
  const navigate = useNavigate();
  const { setBreadcrumbs } = useBreadcrumb();

  // 3 parameters for this page
  const [price, setFilterPrice] = useState(searchParams.get("price") || "");
  const [time, setFilterTime] = useState(searchParams.get("time") || "");
  const [searchText, setSearchText] = useState(searchParams.get("search") || "");
  const [currentPage, setCurrentPage] = useState(
    Number(searchParams.get("page")) || 1
  );
  const [numberOfPages, setNumberOfPages] = useState(1);
  const [quantity, setQuantity] = useState(0);

  const [products, setProducts] = useState<Products[]>();
  const [isLoading, setLoading] = useState(true);
  const [cat2, setCat2] = useState<Cat | null>(null);

  
  useEffect(() => {
    const cat2_id = searchParams.get("cat2_id");
    fetch(`${import.meta.env.VITE_API_URL}/api/categories/cat2?cat2_id=${cat2_id}`)
      .then((response) => {
        if (!response.ok) {
          toast.error("Có lỗi khi lấy tên danh mục");
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {


        setCat2 ({
          cat_id: data.data.cat2_id,
          cat_name: data.data.cat2_name,
        })

        
        // Update breadcrumb
        setBreadcrumbs([
          { label: "Trang chủ", path: "/" },
          { label: "Danh mục", path: "/categories" },
          { label: data.data.cat1_name, path: `/categories/${slugify(data.data.cat1_name)}-${data.data.cat1_id}` },
          { label: data.data.cat2_name, path: null },
        ]);
      })
      .catch((error) => {
        toast.error(error.message || "Lỗi kết nối máy chủ");
      });
  }, [searchParams]);

  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true);
        const page = searchParams.get("page");
        setCurrentPage(page ? Number(page) : 1);
        const cat2_id = searchParams.get("cat2_id");
        const priceFilter = searchParams.get("price");
        const timeFilter = searchParams.get("time");
        const searchFilter = searchParams.get("search");

        setFilterPrice(priceFilter || "");
        setFilterTime(timeFilter || "");
        setSearchText(searchFilter || "");
        const response = await fetch(
          `${
            import.meta.env.VITE_API_URL
          }/api/products/page_list?cat2_id=${cat2_id}&page=${page}&price=${priceFilter}&time=${timeFilter}&search=${searchFilter || ''}`
        );
        const data = await response.json();

        if (!response.ok) {
          toast.error("Có lỗi khi lấy dữ liệu");
          setLoading(false);
          return;
        }
        setLoading(false);
        setProducts(data.data);
        setNumberOfPages(data.numberOfPages);
        setQuantity(data.quantity);
      } catch (e) {
        toast.error("Lỗi kết nối máy chủ");
      }
    };
    getData();
  }, [searchParams]);

  useEffect(() => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("page", String(currentPage));
    setSeachParams(newParams, { replace: currentPage === 1 });
  }, [currentPage]);

  const filterPrice = [
    {
      value: "asc",
      content: "Giá tăng dần",
    },
    {
      value: "desc",
      content: "Giá giảm dần",
    },
    {
      value: "none",
      content: "Giá",
    },
  ];
  const filterTime = [
    {
      value: "asc",
      content: "Thời gian còn lại tăng dần",
    },
    {
      value: "desc",
      content: "Thời gian còn lại giảm dần",
    },
    {
      value: "none",
      content: "Thời gian còn lại",
    },
  ];

  const handleSubmitFilter = () => {
    let filTime, filPrice;
    if (time == "" || time == "none") filTime = "none";
    else filTime = time;
    if (price == "" || price == "none") filPrice = "none";
    else filPrice = price;

    const newUrl = new URLSearchParams(searchParams.toString());
    if (filTime) newUrl.set("time", filTime);
    if (filPrice) newUrl.set("price", filPrice);
    if (searchText) newUrl.set("search", searchText);
    else newUrl.delete("search");
    navigate(`/products?${newUrl.toString()}`);
  };

  return isLoading ? (
    <Loading></Loading>
  ) : (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
              {cat2?.cat_name}
            </h1>
            <p className="text-gray-600">
              Khám phá các sản phẩm đấu giá trong danh mục này
            </p>
          </div>

          {/* Filter Section */}
          <div className="flex flex-col gap-4">
            {/* Search Input - Top Row */}
            <div className="w-full max-w-md relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <form onSubmit={(e) => {
                e.preventDefault();
                handleSubmitFilter();
              }}>
                <input
                  type="text"
                  placeholder="Tìm kiếm sản phẩm..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-100 border border-gray-200 rounded-full outline-none focus:border-blue-500 focus:bg-white transition-all duration-200 text-sm"
                />
              </form>
            </div>

            {/* Filters - Bottom Row */}
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="w-full sm:w-48">
                  <SelectComponent
                    items={filterPrice}
                    placeholder="Sắp xếp theo giá"
                    value={price}
                    setState={setFilterPrice}
                  />
                </div>
                <div className="w-full sm:w-56">
                  <SelectComponent
                    items={filterTime}
                    placeholder="Sắp xếp theo thời gian"
                    value={time}
                    setState={setFilterTime}
                  />
                </div>
                <button
                  type="submit"
                  className="bg-gray-600 hover:bg-gray-700 w-full sm:w-[140px] cursor-pointer text-white px-4 py-2 rounded-lg text-sm transition-colors duration-200 shadow-sm"
                  onClick={handleSubmitFilter}
                >
                  Áp dụng
                </button>
              </div>

              <div className="text-sm text-gray-500">
                {quantity && <span>{quantity} sản phẩm</span>}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="container mx-auto px-4 py-8">
        {products && products.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {products &&
                products.map((item, index) => (
                  <div key={index} className="flex justify-center">
                    <ProductCard
                      className="w-full max-w-[450px]"
                      product_image={
                        item.product_images ? item.product_images[0] : ""
                      }
                      product_id={item.product_id}
                      product_name={item.product_name}
                      current_price={item.current_price}
                      buy_now_price={item.buy_now_price}
                      start_time={item.start_time}
                      end_time={item.end_time}
                      price_owner_username={item.price_owner_username}
                      price_owner_id={item.price_owner_id}
                      bid_turns={item.bid_turns}
                    />
                  </div>
                ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center mt-12">
              <PaginationComponent
                numberOfPages={numberOfPages}
                currentPage={currentPage}
                controlPage={setCurrentPage}
              />
            </div>
          </>
        ) : (
          /* Empty State */
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="text-gray-400 text-6xl mb-4">📦</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Không có sản phẩm nào
              </h3>
              <p className="text-gray-600">
                Hiện tại chưa có sản phẩm nào trong danh mục này. Hãy quay lại
                sau hoặc khám phá các danh mục khác.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ListProductsPage;
