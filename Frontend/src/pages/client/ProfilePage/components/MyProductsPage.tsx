import React, {useEffect, useState} from "react";
import PaginationComponent from "@/components/common/Pagination";
import ProductCard from "@/components/common/ProductCard";
import {useNavigate, useSearchParams} from "react-router-dom"
import {toast} from "sonner"
import Loading from "@/components/common/Loading";
import { Heart, Package, ShoppingCart, Trophy, TrendingUp, Archive } from "lucide-react";
import speakingURL from "speakingurl";
import LoginRequest from "@/components/common/LoginRequest";
import {useAuth} from "@/routes/ProtectedRouter";
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
    price_owner_id : number,
    bid_turns: string
}

type TabItem = {
    id: string;
    label: string;
    icon: React.ReactNode;
    color: string;
    bgColor: string;
}

export default function MyProductsPage() {
    const {auth} = useAuth();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    console.log ("Search params: ", searchParams);

    // Tab management
    const [activeTab, setActiveTab] = useState(searchParams.get("type") || "my-favorites");

    const allTabs: TabItem[] = [
        {
            id: "my-favorites",
            label: "Yêu thích",
            icon: <Heart size={18} />,
            color: "text-rose-600",
            bgColor: "bg-rose-50"
        },
        {
            id: "my-selling",
            label: "Đang bán",
            icon: <Package size={18} />,
            color: "text-blue-600",
            bgColor: "bg-blue-50"
        },
        {
            id: "my-inventory",
            label: "Tồn kho",
            icon: <Archive size={18} />,
            color: "text-gray-600",
            bgColor: "bg-gray-50"
        },
        {
            id: "my-sold",
            label: "Đã bán",
            icon: <ShoppingCart size={18} />,
            color: "text-green-600",
            bgColor: "bg-green-50"
        },
        {
            id: "my-bidding",
            label: "Đang đấu giá",
            icon: <TrendingUp size={18} />,
            color: "text-orange-600",
            bgColor: "bg-orange-50"
        },
        {
            id: "my-won",
            label: "Đã thắng",
            icon: <Trophy size={18} />,
            color: "text-purple-600",
            bgColor: "bg-purple-50"
        }
    ];

    // Filter tabs based on user role
    const tabs = allTabs.filter(tab => {
        // If not seller or admin, hide selling-related tabs
        if (auth?.role !== 'seller' && auth?.role !== 'admin') {
            const sellerOnlyTabs = ['my-selling', 'my-inventory', 'my-sold'];
            return !sellerOnlyTabs.includes(tab.id);
        }
        return true;
    });

    const getActiveTabInfo = () => {
        return tabs.find(tab => tab.id === activeTab) || tabs[0];
    };

    // Pagination
    const [currentPage, setCurrentPage] = useState(searchParams.get("page") ? parseInt(searchParams.get("page") as string) : 1);
    const [numberOfPages, setNumberOfPages] = useState(1);
    const [quantity, setQuantity] = useState(0);

    // Products data
    const [products, setProducts] = useState<Products[]>();
    const [isLoading, setLoading] = useState(true);

    // Fetch data when tab or page changes
    useEffect(() => {
        const getData = async() => {
            try {
                setLoading(true);
                const page = searchParams.get("page") ? parseInt(searchParams.get("page") as string) : 1;
                const type = searchParams.get("type") || "my-favorites";
                const response = await fetch(
                    `${import.meta.env.VITE_API_URL}/api/products/my-products?type=${type}&page=${page}`,
                    { credentials: "include" }
                );
                const data = await response.json();

                if (!response.ok) {
                    setLoading(false);
                    if (response.status === 403) {
                        navigate(-1);
                    }
                    return;
                }
                setLoading(false);
                setProducts(data.data);
                setNumberOfPages(data.numberOfPages);
                setQuantity(data.quantity);

            } catch(e) {
                toast.error("Lỗi kết nối máy chủ");
                setLoading(false);
            }
        };

        getData();
    }, [searchParams]);

    const handleTabChange = (tabId: string) => {
        setActiveTab(tabId);
        setCurrentPage(1); // Reset to first page when changing tabs
        setSearchParams({ type: tabId});

    };
    const handlePageChange = (page : number) => {
        setCurrentPage(page);
        const newParams = new URLSearchParams(searchParams);
        newParams.set("page", page.toString());
        setSearchParams(newParams);
    }


    const activeTabInfo = getActiveTabInfo();
    if (!auth) return <LoginRequest />;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="container mx-auto px-4 py-6">
                    <div className="mb-6">
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                            Sản phẩm của tôi
                        </h1>
                        <p className="text-gray-600">
                            Quản lý và theo dõi các sản phẩm của bạn
                        </p>
                    </div>

                    {/* Tabs */}
                    <div className="flex flex-wrap gap-2">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => handleTabChange(tab.id)}
                                className={`flex items-center cursor-pointer gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                                    activeTab === tab.id
                                        ? `${tab.color} ${tab.bgColor} shadow-sm`
                                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                                }`}
                            >
                                {tab.icon}
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="container mx-auto px-4 py-8">
                {/* Tab Info */}
                {quantity ? (<div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg mb-6 ${activeTabInfo.color} ${activeTabInfo.bgColor}`}>
                    {activeTabInfo.icon}
                    <span className="font-medium">{activeTabInfo.label}</span>
                    {products && products.length > 0 && (
                        <span className="text-sm opacity-75">({quantity} sản phẩm)</span>
                    )}
                
                </div>)
                : null
                }

                {/* Products Grid */}
                {isLoading ? (
                    <Loading />
                ) : quantity > 0 && products ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                            {products.map((item, index) => (
                                <div key={index} className="flex justify-center">
                                    <ProductCard
                                        className="w-full max-w-sm"
                                        product_image={item.product_images ? item.product_images[0] : ""}
                                        product_id={item.product_id}
                                        product_name={item.product_name}
                                        current_price={item.current_price}
                                        buy_now_price={item.buy_now_price}
                                        start_time={item.start_time}
                                        end_time={item.end_time}
                                        price_owner_username={item.price_owner_username}
                                        price_owner_id={item.price_owner_id}
                                        bid_turns={item.bid_turns}

                                    />
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        <div className="flex justify-center mt-12">
                            <PaginationComponent
                                numberOfPages={numberOfPages}
                                currentPage={currentPage}
                                controlPage={handlePageChange}
                            />
                        </div>
                    </>
                ) : (
                    /* Empty State */
                    <div className="text-center py-16">
                        <div className="max-w-md mx-auto">

                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                Chưa có sản phẩm nào
                            </h3>
                            <p className="text-gray-600">
                                {activeTab === "my-favorites" && "Bạn chưa thêm sản phẩm nào vào danh sách yêu thích."}
                                {activeTab === "my-selling" && "Bạn chưa đăng bán sản phẩm nào."}
                                {activeTab === "my-inventory" && "Bạn chưa có sản phẩm tồn kho."}
                                {activeTab === "my-sold" && "Bạn chưa bán được sản phẩm nào."}
                                {activeTab === "my-bidding" && "Bạn chưa tham gia đấu giá sản phẩm nào."}
                                {activeTab === "my-won" && "Bạn chưa thắng cuộc đấu giá nào."}
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};