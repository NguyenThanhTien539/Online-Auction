import React, { useEffect, useState } from "react";
import ProductCard from "@/components/common/ProductCard"
import HorizontalBar from "@/components/common/HorizontalBar";
import { Package, Sparkles } from "lucide-react";
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

export default function RelatedProductsSection({category_id, product_id}: {category_id?: number, product_id?: number}) {

    const [products, setProducts] = useState<Products[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    
    useEffect (() => {
        async function fetchData(){
            setIsLoading(true);
            try{
                const promise = await fetch(`${import.meta.env.VITE_API_URL}/api/products/related?category_id=${category_id}&product_id=${product_id}&limit=5`);
                const response = await promise.json();
                if (!promise.ok){
                    throw new Error(response.message || 'Failed to fetch related products');
                }
                setProducts(response.data || []);

            }
            catch (err){
                console.error(err);
            }
            finally {
                setIsLoading(false);
            }
        }
        if (category_id) {
            fetchData();
        }
    }, [category_id, product_id])

    if (isLoading) {
        return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                <Loading className="static w-full h-32 bg-transparent" />
            </div>
        );
    }

    if (!products || products.length === 0) {
        return null;
    }

    return (
        <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl overflow-hidden mb-[100px]">
            {/* Header Section */}
            <div className="relative bg-gradient-to-r from-blue-400 via-teal-400 to-cyan-300 px-8 py-6">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>
                <div className="relative flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg">
                        <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-white tracking-tight">
                            Sản phẩm liên quan
                        </h2>
                        <p className="text-emerald-50 text-sm mt-0.5">
                            Khám phá thêm {products.length} sản phẩm tương tự
                        </p>
                    </div>
                </div>
            </div>

            {/* Products Section */}
            <div className="px-8 py-8 bg-gradient-to-b from-gray-50/50 to-white">
                <HorizontalBar className="h-[450px]">
                    {products.map((item, index) => (
                        <div 
                            key={item.product_id} 
                            className="flex justify-center px-2 animate__animated animate__fadeInUp"
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            <ProductCard
                                className="scale-90 hover:scale-95 transition-transform duration-300 shadow-md hover:shadow-xl"
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

            {/* Empty State - Fallback */}
            {products.length === 0 && (
                <div className="px-8 py-12 text-center">
                    <div className="flex justify-center mb-4">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                            <Package className="w-8 h-8 text-gray-400" />
                        </div>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Chưa có sản phẩm liên quan
                    </h3>
                    <p className="text-gray-600 text-sm">
                        Hiện tại chưa có sản phẩm tương tự trong danh mục này.
                    </p>
                </div>
            )}
        </div>
    )
}


