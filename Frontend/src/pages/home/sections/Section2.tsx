import HorizontalBar from "@/components/common/HorizontalBar"
import ProductCard from "@/components/common/ProductCard"
import {useEffect} from "react"

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
            <div className = "ml-2 text-3xl font-bold text-red-500">Top 5 sản phẩm sắp kết thúc</div>
            <div>
                <HorizontalBar className = "h-[400px] bg-red-200">
                    <ProductCard className = "scale-80 hover:scale-85"></ProductCard>
                    <ProductCard className = "scale-80 hover:scale-85"></ProductCard>
                    <ProductCard className = "scale-80 hover:scale-85"></ProductCard>
                    <ProductCard className = "scale-80 hover:scale-85"></ProductCard>
                    <ProductCard className = "scale-80 hover:scale-85"></ProductCard>
                </HorizontalBar>
            </div>
            {/* Top 5 sản phẩm có nhiều lượt ra giá nhất */}
            <div className = "ml-2 text-3xl font-bold text-yellow-300">Top 5 sản phẩm được ra giá nhiều nhất</div>
            <div>
                <HorizontalBar className = "h-[400px] bg-yellow-200">
                    <ProductCard className = "scale-80 hover:scale-85"></ProductCard>
                    <ProductCard className = "scale-80 hover:scale-85"></ProductCard>
                    <ProductCard className = "scale-80 hover:scale-85"></ProductCard>
                    <ProductCard className = "scale-80 hover:scale-85"></ProductCard>
                    <ProductCard className = "scale-80 hover:scale-85"></ProductCard>
                </HorizontalBar>
            </div>
            {/* Top 5 sản phẩm có giá cao nhất */}
            <div className = "ml-2 text-3xl font-bold text-violet-500">Top 5 sản phẩm có giá nhiều nhất</div>
            <div>
                <HorizontalBar className = "h-[400px] bg-violet-300">
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