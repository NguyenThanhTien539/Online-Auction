import HorizontalBar from "@/components/common/HorizontalBar"
import ProductCard from "@/components/common/ProductCard"
import {useEffect} from "react"
import moneyIcon from "@/assets/icons/money.png"
import bidIcon from "@/assets/icons/bid_turn.svg"
import clockIcon from "@/assets/icons/clock.png"
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
            {/* Top 5 sản phẩm gần kết thúc */}
            <div className = "ml-2 text-3xl font-bold flex">Top 5 sản phẩm sắp kết thúc
                <span><img src= {clockIcon} className = "flex h-[35px] aspect-square ml-3"></img></span>
            </div>
            <div>
                <HorizontalBar className = "h-[400px] bg-linear-to-r from-blue-300 to-green-100">
                    <ProductCard className = "scale-80 hover:scale-85"></ProductCard>
                    <ProductCard className = "scale-80 hover:scale-85"></ProductCard>
                    <ProductCard className = "scale-80 hover:scale-85"></ProductCard>
                    <ProductCard className = "scale-80 hover:scale-85"></ProductCard>
                    <ProductCard className = "scale-80 hover:scale-85"></ProductCard>
                </HorizontalBar>
            </div>
            {/* Top 5 sản phẩm có nhiều lượt ra giá nhất */}
            <div className = "ml-2 text-3xl font-bold flex">Top 5 sản phẩm được đấu giá nhiều nhất
                <span><img src = {bidIcon} className = "flex w-[35px] ml-3 aspect-square"></img></span>
            </div>
            <div>
                <HorizontalBar className = "h-[400px] bg-linear-to-r from-blue-300 to-green-100">
                    <ProductCard className = "scale-80 hover:scale-85"></ProductCard>
                    <ProductCard className = "scale-80 hover:scale-85"></ProductCard>
                    <ProductCard className = "scale-80 hover:scale-85"></ProductCard>
                    <ProductCard className = "scale-80 hover:scale-85"></ProductCard>
                    <ProductCard className = "scale-80 hover:scale-85"></ProductCard>
                </HorizontalBar>
            </div>
            {/* Top 5 sản phẩm có giá cao nhất */}
            <div className = "ml-2 text-3xl font-bold flex">Top 5 sản phẩm có giá cao nhất
                <span><img src={moneyIcon} className = "flex w-[35px] ml-3 aspect-square"></img></span>
            </div>
            <div>
                <HorizontalBar className = "h-[400px] bg-linear-to-r from-blue-300 to-green-100">
                    <ProductCard className = "scale-80 hover:scale-85"></ProductCard>
                    <ProductCard className = "scale-80 hover:scale-85"></ProductCard>
                    <ProductCard className = "scale-80 hover:scale-85"></ProductCard>
                    <ProductCard className = "scale-80 hover:scale-85"></ProductCard>
                    <ProductCard className = "scale-80 hover:scale-85"></ProductCard>
                </HorizontalBar>
            </div>
        </>
    );
}
export default Section2;