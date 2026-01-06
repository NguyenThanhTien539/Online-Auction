import HorizontalBar from "@/components/common/HorizontalBar"
import ProductCard from "@/components/common/ProductCard"
import {useEffect, useState} from "react"
import { Clock, TrendingUp, DollarSign, Sparkles } from "lucide-react"
import useIntersectionObserver from "@/hooks/useIntersectionObserver"



function Section2(){

    return(
        <div className="relative py-16 px-4">
          <div className="space-y-16">
            <Section21/>
            <Section22/>
            <Section23/>
          </div>
        </div>
    );
}

type Products = {
    product_id : number,
    product_images : string[],
    product_name: string,
    current_price : number,
    buy_now_price: number,
    start_time: any,
    end_time: any,
    price_owner_username : string,
    price_owner_id : number,
    bid_turns: string
}

function Section21()
{
    const [products, setProducts] = useState<Products[]>([]);
    useEffect (() => {
        async function fetchData(){
            try{
                const promise = await fetch(`${import.meta.env.VITE_API_URL}/api/products/ending_soon?limit=5`);
                const response = await promise.json();
                if (!promise.ok){
                    throw new Error(response.message || 'Failed to fetch top ending soon products');
                }
                setProducts(response.data);

            }
            catch (err){
                console.error(err);
            }
        }
        fetchData();
    }, [])
    
    return (
        <div>
            {/* Header Section */}
            <div className="mb-8">
                <div className="flex items-center gap-4 mb-4">
                    <div className="relative">
                        <div className="relative bg-gradient-to-r from-orange-500 to-red-500 p-3 rounded-2xl shadow-md">
                            <Clock className="w-7 h-7 text-white" />
                        </div>
                    </div>
                    <div>
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-white">
                            Sắp Kết Thúc
                        </h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                            Nhanh tay đấu giá trước khi hết thời gian
                        </p>
                    </div>
                </div>
                <div className="h-1 w-24 bg-gradient-to-r from-orange-500 to-red-500 rounded-full"></div>
            </div>

            {/* Products Carousel */}
            <div className="relative">
                <HorizontalBar className="h-[400px] rounded-3xl bg-orange-50/30 dark:bg-orange-950/10 border border-orange-100/50 dark:border-orange-900/50">
                    {products && products.length > 0 && 
                            products.map((item, index) => (
                                <div key={index} className="flex justify-center">
                                    <ProductCard
                                        className="scale-80  hover:scale-85 shadow-md"
                                        product_image={item.product_images ? item.product_images[0] : ""}
                                        product_id={item.product_id}
                                        product_name={item.product_name}
                                        current_price={item.current_price}
                                        buy_now_price={item.buy_now_price}
                                        start_time={item.start_time}
                                        end_time={item.end_time}
                                        price_owner_username={item.price_owner_username}
                                        price_owner_id ={item.price_owner_id}
                                        bid_turns={item.bid_turns}
                                    />
                                </div>
                            ))}
                </HorizontalBar>
            </div>
        </div>
    )
}

function Section22()
{
    const [products, setProducts] = useState<Products[]>([]);
    useEffect (() => {
        async function fetchData(){
            try{
                const promise = await fetch(`${import.meta.env.VITE_API_URL}/api/products/most_bids?limit=5`);
                const response = await promise.json();
                if (!promise.ok){
                    throw new Error(response.message || 'Failed to fetch top ending soon products');
                }
                setProducts(response.data);

            }
            catch (err){
                console.error(err);
            }
        }
        fetchData();
    }, [])
    return (
        <div>
            {/* Header Section */}
            <div className="mb-8">
                <div className="flex items-center gap-4 mb-4">
                    <div className="relative">
                        <div className="relative bg-gradient-to-r from-emerald-500 to-teal-500 p-3 rounded-2xl shadow-md">
                            <TrendingUp className="w-7 h-7 text-white" />
                        </div>
                    </div>
                    <div>
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-white">
                            Nhiều Lượt Ra Giá Nhất
                        </h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                            Sản phẩm được quan tâm nhiều nhất
                        </p>
                    </div>
                </div>
                <div className="h-1 w-24 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"></div>
            </div>

            {/* Products Carousel */}
            <div className="relative">
                <HorizontalBar className="h-[400px] rounded-3xl bg-emerald-50/30 dark:bg-emerald-950/10 border border-emerald-100/50 dark:border-emerald-900/50">
                    {products && products.length > 0 && 
                            products.map((item, index) => (
                                <div key={index} className="flex justify-center">
                                    <ProductCard
                                        className="scale-80  hover:scale-85 shadow-md"
                                        product_image={item.product_images ? item.product_images[0] : ""}
                                        product_id={item.product_id}
                                        product_name={item.product_name}
                                        current_price={item.current_price}
                                        buy_now_price={item.buy_now_price}
                                        start_time={item.start_time}
                                        end_time={item.end_time}
                                        price_owner_username={item.price_owner_username}
                                        price_owner_id ={item.price_owner_id}
                                        bid_turns={item.bid_turns}
                                    />
                                </div>
                            ))}
                </HorizontalBar>
            </div>
        </div>
    );
}

function Section23()
{
    const [products, setProducts] = useState<Products[]>([]);
    useEffect (() => {
        async function fetchData(){
            try{
                const promise = await fetch(`${import.meta.env.VITE_API_URL}/api/products/highest_price?limit=5`);
                const response = await promise.json();
                if (!promise.ok){
                    throw new Error(response.message || 'Failed to fetch top ending soon products');
                }
                setProducts(response.data);

            }
            catch (err){
                console.error(err);
            }
        }
        fetchData();
    }, [])
    return (
        <div>
            {/* Header Section */}
            <div className="mb-8">
                <div className="flex items-center gap-4 mb-4">
                    <div className="relative">
                        <div className="relative bg-gradient-to-r from-violet-500 to-purple-500 p-3 rounded-2xl shadow-md">
                            <DollarSign className="w-7 h-7 text-white" />
                        </div>
                    </div>
                    <div>
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-white">
                            Giá Cao Nhất
                        </h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                            Những món hàng giá trị cao nhất
                        </p>
                    </div>
                </div>
                <div className="h-1 w-24 bg-gradient-to-r from-violet-500 to-purple-500 rounded-full"></div>
            </div>  

            {/* Products Carousel */}
            <div className="relative">
                <HorizontalBar className="h-[400px] rounded-3xl bg-violet-50/30 dark:bg-violet-950/10 border border-violet-100/50 dark:border-violet-900/50">
                    {products && products.length > 0 && 
                            products.map((item, index) => (
                                <div key={index} className="flex justify-center">
                                    <ProductCard
                                        className="scale-80 hover:scale-85 shadow-md"
                                        product_image={item.product_images ? item.product_images[0] : ""}
                                        product_id={item.product_id}
                                        product_name={item.product_name}
                                        current_price={item.current_price}
                                        buy_now_price={item.buy_now_price}
                                        start_time={item.start_time}
                                        end_time={item.end_time}    
                                        price_owner_username={item.price_owner_username}
                                        price_owner_id ={item.price_owner_id}
                                        bid_turns={item.bid_turns}
                                    />
                                </div>
                            ))}
                </HorizontalBar>
            </div>
        </div>
    );
}
export default Section2;