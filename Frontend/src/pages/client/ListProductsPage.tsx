import ProductCard from "@/components/common/ProductCard";
import PaginationComponent from "@/components/common/Pagination";
import SelectComponent from "@/components/common/Select"
import { usePreventBodyLock } from "@/hooks/usePreventBodyLock";
import {useState, useEffect} from "react"
import {useNavigate, useSearchParams} from "react-router-dom"
import {toast} from "sonner"
import {slugify} from "@/utils/make_slug";
import Loading from "@/components/common/Loading";




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
function ListProductsPage() {
    
    usePreventBodyLock();
    const [searchParams, setSeachParams] = useSearchParams();
    const navigate = useNavigate();


    // 3 parameters for this page 
    const [price, setFilterPrice] = useState(searchParams.get("price") || "");
    const [time, setFilterTime] = useState(searchParams.get("time") || "");
    const[currentPage, setCurrentPage] = useState(Number(searchParams.get("page")) || 1);
    const [numberOfPages, setNumberOfPages] = useState(1);
    const [quantity, setQuantity] = useState(0);
    

    const [products, setProducts] = useState<Products[]>();
    const [isLoading, setLoading] = useState(true);
    const [nameCat2, setNameCat2] = useState("");
    useEffect (() => {
        const cat2_id = searchParams.get("cat2_id");
        fetch (`http://localhost:5000/api/categories/cat2?cat2_id=${cat2_id}`)
        .then (response => {
            if (!response.ok){
                toast.error("Có lỗi khi lấy tên danh mục");
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then (data => {
            setNameCat2(data.data.name);
        })
        .catch (error => {
            toast.error (error.message || "Lỗi kết nối máy chủ");
        });
    }, [])



    useEffect(()=>{

        const getData = async() => {
            try{
                setLoading(true);
                const page = searchParams.get("page");
                console.log ("This page and currentPage: ", page, currentPage);
                const cat2_id = searchParams.get("cat2_id");
                const priceFilter = searchParams.get("price");
                const timeFilter = searchParams.get("time");

                setFilterPrice(priceFilter || "");
                setFilterTime(timeFilter || "");
                const response = await fetch (`http://localhost:5000/api/products/page_list?cat2_id=${cat2_id}&page=${page}&price=${priceFilter}&time=${timeFilter}`)
                const data = await response.json();

                if (!response.ok)
                {
                    toast.error("Có lỗi khi lấy dữ liệu");
                    setLoading(false);
                    return;
                }
                toast.success("Tải trang thành công");
                setLoading(false);
                setProducts(data.data);
                setNumberOfPages(data.numberOfPages);
                setQuantity(data.quantity);    
                }
                catch(e){
                    toast.error("Lỗi kết nối máy chủ")
                }
            }
        getData();
    }, [searchParams])
  
    

    useEffect(()=>{
        const newParams = new URLSearchParams(searchParams);
        newParams.set("page", String(currentPage));
        setSeachParams(newParams, { replace: currentPage === 1 });
    }, [currentPage])

    const filterPrice = [
        {
            value: "asc",
            content: "Giá tăng dần"
        },
        {
            value: "desc",
            content: "Giá giảm dần"
        },
        {
            value: "none",
            content: "Giá"
        }
    ]
    const filterTime = [
        {
            value: "asc",
            content: "Thời gian còn lại tăng dần"
        },
        {
            value: "desc",
            content: "Thời gian còn lại giảm dần"
        },
        {
            value: "none",
            content: "Thời gian còn lại"
        }
    ]
    
    const handleSubmitFilter =() => {
        let filTime, filPrice;
        if (time == "" || time == "none")  filTime = "none";
        else filTime = time;
        if (price == "" || price == "none") filPrice = "none";
        else filPrice = price;

        const newUrl = new URLSearchParams(searchParams.toString());
        if (filTime) newUrl.set("time", filTime);
        if (filPrice) newUrl.set("price", filPrice);
        navigate(`/products?${newUrl.toString()}`);
    }

    const handleClickProduct = (productId : number, productName : string) => {
        const slug = slugify(productName);
        navigate(`/product/${slug}-${productId}`);
    }

    return(
        isLoading ? <Loading></Loading> : <div className="min-h-screen bg-gray-50">
            {/* Header Section */}
            <div className="bg-white shadow-sm border-b">
                <div className="container mx-auto px-4 py-8">
                    <div className="mb-6">
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
                            {nameCat2}
                        </h1>
                        <p className="text-gray-600">
                            Khám phá các sản phẩm đấu giá trong danh mục này
                        </p>
                    </div>

                    {/* Filter Section */}
                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                        <div className="flex flex-col sm:flex-row gap-3">
                            <SelectComponent
                                items={filterPrice}
                                placeholder="Sắp xếp theo giá"
                                value={price}
                                setState={setFilterPrice}
                            />
                            <SelectComponent
                                items={filterTime}
                                placeholder="Sắp xếp theo thời gian"
                                value={time}
                                setState={setFilterTime}
                            />
                            <button
                                type="submit"
                                className="bg-gray-600 hover:bg-gray-700 w-[200px] cursor-pointer text-white px-4 rounded-lg font-sm transition-colors duration-200 shadow-sm"
                                onClick={handleSubmitFilter}
                            >
                                Áp dụng
                            </button>
                        </div>

                        <div className="text-sm text-gray-500">
                            {quantity && (
                                <span>{quantity} sản phẩm</span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Products Grid */}
            <div className="container mx-auto px-4 py-8">
                {products && products.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            {products.map((item, index) => (
                                <div key={index} className="flex justify-center">
                                    <ProductCard
                                        className="w-full max-w-[450px]"
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
                                Hiện tại chưa có sản phẩm nào trong danh mục này.
                                Hãy quay lại sau hoặc khám phá các danh mục khác.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
};

export default ListProductsPage;