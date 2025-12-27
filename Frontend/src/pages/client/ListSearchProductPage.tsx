import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { Search } from "lucide-react";
import Loading from "@/components/common/Loading";
import ProductCard from "@/components/common/ProductCard";
import PaginationComponent from "@/components/common/Pagination";
import { slugify } from "@/utils/make_slug";
type Products = {
    product_id : number,
    product_images : string[],
    product_name: string,
    current_price : number,
    buy_now_price: number,
    start_time: any,
    end_time: any,
    price_owner_username : string,
    bid_turns: string
}


export default function ListSearchProductPage() {
    const [searchParams, setSeachParams] = useSearchParams();
    const [searchQuery, setSearchQuery] = useState(searchParams.get("query") || "");
    const navigate = useNavigate();
    const [products, setProducts] = useState<Products[]>();
    const [isLoading, setLoading] = useState(false);
    const [numberOfPages, setNumberOfPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(Number(searchParams.get("page")) || 1);
    const [quantity, setQuantity] = useState(0);

    const handleClickProduct = (productId : number, productName : string) => {
            const slug = slugify(productName);
            navigate(`/product/${slug}-${productId}`);
    }
    
    const handleSetCurrentPage = (page : number) => {
        setCurrentPage(page);
        setSeachParams(
            {query: searchQuery, page: page.toString()}
        );
    }

    useEffect (() => {
        setSearchQuery(searchParams.get("query") || "");
        setCurrentPage(Number(searchParams.get("page")) || 1);
        setLoading(true);
        fetch (`http://localhost:5000/api/products/search?query=${searchParams.get("query")}&page=${currentPage}`)
        .then (response => {
            if (!response.ok){
                toast.error("Có lỗi khi lấy sản phẩm");
                throw new Error("Network response was not ok");
            }
            return response.json();
        }
        )
        .then (data => {
            setProducts(data.data.products);
            setNumberOfPages(data.data.total_pages);
            setQuantity(data.data.quantity);
        })
        .catch (error => {
            toast.error (error.message || "Lỗi kết nối máy chủ");

        })
        .finally(() => {
            setLoading(false);
        });
    }, [searchParams]);

    return (
      isLoading ? <Loading></Loading> : <div>  
            
            <div className="relative mt-16 mb-12 ml-20 flex items-center gap-6">
                <div className="relative w-20 h-20 flex justify-center bg-gray-50 rounded-lg border-2 border-gray-100">
                    <Search className="w-10 h-10 text-blue-700" />
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-300/50 rounded-full border-2 border-white"></div>
                </div>
                <div>
                    <div className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">
                       Kết quả tìm kiếm
                    </div>
                    <div className="text-2xl md:text-3xl font-medium mt-2 text-gray-600">
                        cho <span className="text-blue-700 font-semibold">"{searchQuery.trim()}"</span>
                    </div>
                </div>

                {/* Decorative elements */}
                <div className="absolute -top-4 -left-3 w-20 h-20 border-2 border-gray-200 rounded-lg"></div>
                <div className="absolute -bottom-3 right-8 w-16 h-16 border-2 border-blue-100 rounded-full"></div>
                <div className="absolute top-1/2 -right-8 w-2 h-2 bg-blue-300 rounded-full"></div>
                <div className="absolute top-0 right-12 w-1 h-1 bg-gray-400 rounded-full"></div>
            </div>




            {/* Products List */}
            <div className="bg-white rounded-2xl p-8 py-15 mt-[100px] mb-[100px] max-w-[1200px] mx-auto shadow-sm shadow-blue-100">
                {products && products.length > 0 ? (
                    <>
                        <div className="flex items-center gap-2 mb-8 pb-4 border-b-2 border-blue-400">
                            <div className="w-1 h-6 bg-blue-600"></div>
                            <div className="text-lg font-semibold text-gray-900">
                                Tìm thấy <span className="text-blue-700">{quantity}</span> sản phẩm
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            {products.map((item, index) => (
                                <div className="flex justify-center" key={index}>
                                    <ProductCard 
                                        className="w-[400px] hover:shadow-xl hover:border-blue-200 transition-all duration-300 rounded-xl overflow-hidden border border-gray-200" 
                                        product_image={item.product_images ? item.product_images[0] : ""} 
                                        product_id={item.product_id}
                                        product_name={item.product_name} 
                                        current_price={item.current_price} 
                                        buy_now_price={item.buy_now_price}
                                        start_time={item.start_time} 
                                        end_time={item.end_time} 
                                        price_owner_username={item.price_owner_username}
                                        bid_turns={item.bid_turns} 
                                        onClick={() => handleClickProduct(item.product_id, item.product_name)}
                                    />
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="text-center py-20">
                        <div className="relative inline-block mb-6">
                            <Search className="w-24 h-24 text-gray-300 mx-auto" />
                            <div className="absolute -bottom-2 -right-2 w-8 h-8 border-2 border-gray-200 rounded-full"></div>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Không tìm thấy sản phẩm</h3>
                        <p className="text-gray-600">Hãy thử tìm kiếm với từ khóa khác</p>
                    </div>
                )}
            </div>

            {products && products.length > 0 && (
                <div className="flex justify-center mt-12 mb-8">
                    <PaginationComponent numberOfPages={numberOfPages} currentPage={currentPage} controlPage={handleSetCurrentPage} />
                </div>
            )}

            <div className="mb-[50px]"></div>

        </div>
    );
}
