import HorizontalBar from "@/components/common/HorizontalBar"
import ProductCard from "@/components/common/ProductCard"
import {useEffect, useState} from "react"
import moneyIcon from "@/assets/icons/money.png"
import bidIcon from "@/assets/icons/bid_turn.svg"
import clockIcon from "@/assets/icons/clock.png"
import useIntersectionObserver from "@/hooks/useIntersectionObserver"
import { Section } from "lucide-react"
const getDataAllTop5 =() => {
    let endProducts;
    let turnProducts;
    let priceProducts;
    useEffect(()=>{
        const end = async() =>{
            try{
                let endRequest = await fetch("http://localhost:5000/api/products/ending-soon?limit=5")
                let endData = await endRequest.json();

                if (!endRequest.ok){
                    console.log("Error:", endData.message);
                    return;
                }
                endProducts = endData;
            }
            catch(e){
                console.log("Error database:", e)
            }
            
        }

    }, [])
}


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
    // simulate 5 products
    const number = 5;
    const {ref, hasIntersected} = useIntersectionObserver ();
    return (
        <div ref = {ref}>
            {/* Top 5 sản phẩm gần kết thúc */}
            <div className = "ml-2 text-3xl font-bold flex">Top 5 sản phẩm sắp kết thúc
                <span><img src= {clockIcon} className = "flex h-[35px] aspect-square ml-3"></img></span>
            </div>
            <div>
                <HorizontalBar className = {`h-[400px] bg-linear-to-r from-blue-300 to-green-100 `}>
                    {Array.from({length: number}).map((_, index) => (
                        <ProductCard key={index} className = {`scale-80 hover:scale-85 ${hasIntersected ? "animate__animated animate__slideInRight " : ""}`}></ProductCard>
                    ))}

                    
                </HorizontalBar>
            </div>
        </div>
    )
}

function Section22()
{
    const {ref, hasIntersected} = useIntersectionObserver ();
    const number = 5;
    return (
        <div ref = {ref}>
             {/* Top 5 sản phẩm có nhiều lượt ra giá nhất */}
            <div className = "ml-2 text-3xl font-bold flex">Top 5 sản phẩm được đấu giá nhiều nhất
                <span><img src = {bidIcon} className = "flex w-[35px] ml-3 aspect-square"></img></span>
            </div>
            <div>
                <HorizontalBar className = "h-[400px] bg-linear-to-r from-blue-300 to-green-100">
                    {Array.from({length: number}).map((_, index) => (
                        <ProductCard key={index} className = {`scale-80 hover:scale-85 ${hasIntersected ? "animate__animated animate__slideInLeft " : ""}`}></ProductCard>
                    ))}
                </HorizontalBar>
            </div>
        </div>
    );
}

function Section23()
{
    const {ref, hasIntersected} = useIntersectionObserver ();
    const number = 5;
    return (
        <div ref = {ref}>
              {/* Top 5 sản phẩm có giá cao nhất */}
            <div className = "ml-2 text-3xl font-bold flex">Top 5 sản phẩm có giá cao nhất
                <span><img src={moneyIcon} className = "flex w-[35px] ml-3 aspect-square"></img></span>
            </div>
            <div>
                <HorizontalBar className = "h-[400px] bg-linear-to-r from-blue-300 to-green-100">
                    {Array.from({length: number}).map((_, index) => (
                        <ProductCard key={index} className = {`scale-80 hover:scale-85 ${hasIntersected ? "animate__animated animate__slideInRight " : ""}`}></ProductCard>
                    ))}
                </HorizontalBar>
            </div>
        </div>
    )
}
export default Section2;