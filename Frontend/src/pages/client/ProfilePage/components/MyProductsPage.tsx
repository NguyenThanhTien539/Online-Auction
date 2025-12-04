import React, {use, useEffect, useState} from "react";
import PaginationComponent from "@/components/common/Pagination";
import ProductCard from "@/components/common/ProductCard";
import {useNavigate, useSearchParams} from "react-router-dom"
import {toast} from "sonner"

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




export default function MyProductsPage() {
    

    const [searchParams, setSeachParams] = useSearchParams();
    const navigate = useNavigate();

    // Follow  URL to know current my products page such as /products/my-favorites, /products/my-selling, /products/my-sold, /products/my-bidding, /products/my-won
    const [myProductList, setMyProductList] = useState("");
    const [nameList, setNameList] = useState("");
    const getColorNameList = (nameList : any) => {
        switch (nameList) {
            case "Sản phẩm yêu thích":
                return "text-rose-600 bg-rose-100";
            case "Sản phẩm đang bán":
                return "text-yellow-500 bg-yellow-100";
            case "Sản phẩm đã bán":
                return "text-gray-600 bg-gray-100";
            case "Sản phẩm bạn đang đấu giá":
                return "text-neutral-600 bg-neutral-100";
            case "Sản phẩm bạn đã thắng":
                return "text-green-700 bg-green-100";
    }
    }

    useEffect (() => {
        switch (searchParams.get("type")) {
            case "my-favorites":
                setMyProductList("my-favorites");
                setNameList("Sản phẩm yêu thích");
                break;
            case "my-selling":
                setMyProductList("my-selling");
                setNameList("Sản phẩm đang bán");
                break;
            case "my-sold":
                setMyProductList("my-sold");
                setNameList("Sản phẩm đã bán");
                break;
            case "my-bidding":
                setMyProductList("my-bidding");
                setNameList("Sản phẩm bạn đang đấu giá");
                break;
            case "my-won":
                setMyProductList("my-won");
                setNameList("Sản phẩm bạn đã thắng");
                break;
            default:
                navigate("/profile");
    }
    }, [searchParams, navigate])

    
    
    const[currentPage, setCurrentPage] = useState(Number(searchParams.get("page")) || 1);
    const [numberOfPages, setNumberOfPages] = useState(1);
    

    const [products, setProducts] = useState<Products[]>();
    const [isLoading, setLoading] = useState(true);
    
    useEffect(()=>{
        // Only fetch data if myProductList is set (not empty string)
        if (!myProductList) return;

        const getData = async() => {
            try{
                setLoading(true);
                const response = await fetch (`http://localhost:5000/api/products/my-products?type=${myProductList}&page=${currentPage}`,{credentials: "include"})
                const data = await response.json();

                if (!response.ok)
                {
                    toast.error("Có lỗi khi lấy dữ liệu ");
                    setLoading(false);
                    if (response.status === 403){
                        navigate("/profile");
                    }
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
    }, [myProductList, currentPage])

    useEffect(()=>{
        const newParams = new URLSearchParams(searchParams);
        newParams.set("page", String(currentPage));
        setSeachParams(newParams, { replace: currentPage === 1 });
    }, [currentPage])


  
    



    const handleClickProduct = (productId : number, productName : string) => {

        
    }

    return(
        <>
            {/* Name cat2 of these products */}

            <div className = {`text-5xl font-semibold text-gray-500 mt-10 ml-5 ${getColorNameList(nameList)} inline-block px-4 py-2 rounded-lg`}>
                {nameList}
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