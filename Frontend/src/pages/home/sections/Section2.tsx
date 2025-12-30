import HorizontalBar from "@/components/common/HorizontalBar"
import ProductCard from "@/components/common/ProductCard"
import {useEffect, useState} from "react"
import moneyIcon from "@/assets/icons/money.png"
import bidIcon from "@/assets/icons/bid_turn.svg"
import clockIcon from "@/assets/icons/clock.png"
import useIntersectionObserver from "@/hooks/useIntersectionObserver"



function Section2(){

    return(
        <>
          <div className="h-[50px]"></div>
          <Section21/>
          <div className="h-[30px]"></div>
          <Section22/>
          <div className="h-[30px]"></div>
          <Section23/>
        </>
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
    
    // simulate 5 products
    const {ref, hasIntersected} = useIntersectionObserver ();
    return (
        <div ref = {ref}>
            {/* Top 5 sản phẩm gần kết thúc */}
            <div className = "ml-2 text-3xl font-bold flex">Top 5 sản phẩm sắp kết thúc
                <span><img src= {clockIcon} className = "flex h-[35px] aspect-square ml-3"></img></span>
            </div>
            <div>
                <HorizontalBar className = {`h-[400px] bg-linear-to-r from-blue-300 to-green-100 `}>
                    {products && products.length > 0 && 
                            products.map((item, index) => (
                                <div key={index} className="flex justify-center">
                                    <ProductCard
                                        className = {`scale-80 hover:scale-85 `}
                                        product_image={item.product_images ? item.product_images[0] : ""}
                                        product_id={item.product_id}
                                        product_name={item.product_name}
                                        current_price={item.current_price}
                                        buy_now_price={item.buy_now_price}
                                        start_time={item.start_time}
                                        end_time={item.end_time}
                                        price_owner_username={item.price_owner_username}
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
     const {ref, hasIntersected} = useIntersectionObserver ();
    return (
        <div ref = {ref}>
             {/* Top 5 sản phẩm có nhiều lượt ra giá nhất */}
            <div className = "ml-2 text-3xl font-bold flex">Top 5 sản phẩm được đấu giá nhiều nhất
                <span><img src = {bidIcon} className = "flex w-[35px] ml-3 aspect-square"></img></span>
            </div>
            <div>
                <HorizontalBar className = "h-[400px] bg-linear-to-r from-blue-300 to-green-100">
                    {products && products.length > 0 && 
                            products.map((item, index) => (
                                <div key={index} className="flex justify-center">
                                    <ProductCard
                                        className = {`scale-80 hover:scale-85 `}
                                        product_image={item.product_images ? item.product_images[0] : ""}
                                        product_id={item.product_id}
                                        product_name={item.product_name}
                                        current_price={item.current_price}
                                        buy_now_price={item.buy_now_price}
                                        start_time={item.start_time}
                                        end_time={item.end_time}
                                        price_owner_username={item.price_owner_username}
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
     const {ref, hasIntersected} = useIntersectionObserver ();
    return (
        <div ref = {ref}>
              {/* Top 5 sản phẩm có giá cao nhất */}
            <div className = "ml-2 text-3xl font-bold flex">Top 5 sản phẩm có giá cao nhất
                <span><img src={moneyIcon} className = "flex w-[35px] ml-3 aspect-square"></img></span>
            </div>
            <div>
                <HorizontalBar className = "h-[400px] bg-linear-to-r from-blue-300 to-green-100">
                    {products && products.length > 0 && 
                            products.map((item, index) => (
                                <div key={index} className="flex justify-center">
                                    <ProductCard
                                        className = {`scale-80 hover:scale-85`}
                                        product_image={item.product_images ? item.product_images[0] : ""}
                                        product_id={item.product_id}
                                        product_name={item.product_name}
                                        current_price={item.current_price}
                                        buy_now_price={item.buy_now_price}
                                        start_time={item.start_time}
                                        end_time={item.end_time}
                                        price_owner_username={item.price_owner_username}
                                        bid_turns={item.bid_turns}
                                   
                                    />
                                </div>
                            ))}
                </HorizontalBar>
            </div>
        </div>
    )
}
export default Section2;