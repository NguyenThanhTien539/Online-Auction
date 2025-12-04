import ProductCard from "@/components/common/ProductCard";
import PaginationComponent from "@/components/common/Pagination";
import SelectComponent from "@/components/common/Select"
import { usePreventBodyLock } from "@/hooks/usePreventBodyLock";
import {useState, useEffect} from "react"
import {useNavigate, useSearchParams} from "react-router-dom"
import {toast} from "sonner"
import {slugify} from "@/utils/make_slug";




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
    })



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
        <>
            {/* Name cat2 of these products */}
            <div className = "text-5xl font-semibold text-gray-500 mt-10 ml-5">
                {nameCat2}
            </div>

            {/* Filter */}

            <div className = "flex ml-[50%] gap-2">
                <SelectComponent items = {filterPrice} placeholder = "Giá" value = {price} setState = {setFilterPrice}/>
                <SelectComponent items = {filterTime} placeholder = "Thời gian" value = {time} setState = {setFilterTime}/>
                <button type = "submit" className = "bg-black text-white p-1 px-5 rounded-xl hover:cursor-pointer hover:shadow-2xl hover:shadow-blue-500"
                    onClick = {handleSubmitFilter}>
                    Filter
                </button>
            </div>


            {/* Products List */}

            <div className = "grid grid-cols-1 md:grid-cols-2 gap-10 p-5 mt-[100px] mb-[100px] max-w-[1200px] mx-auto">
                
                {!isLoading && products && products.map((item, index) => {


                    return(
                    <div className = "flex justify-center" key = {index}>
                        <ProductCard className = "w-[400px]" product_image = {item.product_images ? item.product_images[0] : ""}
                            product_name = {item.product_name} current_price = {item.current_price} buy_now_price = {item.buy_now_price}
                            start_time = {item.start_time} end_time = {item.end_time} price_owner_username = {item.price_owner_username}
                            bid_turns = {item.bid_turns} onClick = {()=> handleClickProduct(item.product_id, item.product_name)}
                        />
                    </div>
                )
                })}
            
            </div>

            <PaginationComponent numberOfPages = {numberOfPages} currentPage = {currentPage} controlPage = {setCurrentPage}/>

            <div className = "mb-[50px]"></div>

        </>
    )
};

export default ListProductsPage;