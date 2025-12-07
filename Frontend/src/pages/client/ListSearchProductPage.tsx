import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
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
            {/* Name cat2 of these products */}
            <div className="relative mt-16 mb-8 ml-5">
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                   Kết quả tìm kiếm cho:
                </div>


                {/* Decorative elements */}
                <div className="absolute -top-2 -left-2 w-4 h-4 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full animate-ping opacity-60"></div>
                <div className="absolute -bottom-4 -right-4 w-3 h-3 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full animate-bounce opacity-60"></div>
            </div>
            <div className="text-2xl md:text-3xl font-semibold mt-2 ml-4 text-gray-400 bg-clip-text relative inline-block">
                    "{searchQuery.trim()}"
            </div>




            {/* Products List */}

            <div className = "grid grid-cols-1 md:grid-cols-2 gap-10 p-5 mt-[100px] mb-[100px] max-w-[1200px] mx-auto">
                
                {!isLoading && products && products.map((item, index) => {


                    return(
                    <div className = "flex justify-center" key = {index}>
                        <ProductCard className = "w-[400px]" product_image = {item.product_images ? item.product_images[0] : ""} product_id = {item.product_id}
                            product_name = {item.product_name} current_price = {item.current_price} buy_now_price = {item.buy_now_price}
                            start_time = {item.start_time} end_time = {item.end_time} price_owner_username = {item.price_owner_username}
                            bid_turns = {item.bid_turns} onClick = {()=> handleClickProduct(item.product_id, item.product_name)}
                        />
                    </div>
                )
                })}
            
            </div>

            <PaginationComponent numberOfPages = {numberOfPages} currentPage = {currentPage} controlPage = {handleSetCurrentPage}/>

            <div className = "mb-[50px]"></div>

        </div>
    );
}
