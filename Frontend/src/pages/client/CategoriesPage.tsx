import CategoryCard from "@/components/common/CategoryCard"
import {toast} from "sonner";
import {useEffect, useState} from "react";
import {useParams, useNavigate} from "react-router-dom"
import {slugify} from "@/utils/make_slug"
import Loading from "@/components/common/Loading";

const getLevelCategoriesList = async(level : number, catId? : number, catSlug? : string) =>{
    
    let linkFetch = "";
    if (level == 1)
    {
        linkFetch = "http://localhost:5000/api/categories/level1";
    }
    else if (level == 2)
    {
        linkFetch = `http://localhost:5000/api/categories/level2?cat_id=${catId}&cat_slug=${catSlug}`;
    }
    try{
        const response = await fetch(linkFetch);
        const data = await response.json();

        if (!response.ok){
            console.log("Error: ", data.message);
            toast.error("Lỗi xảy ra");
            return null;
        }
        return data;
    }
    catch(e){
        console.log("Error connecting backend: ", e);
        toast.error("Lỗi kết nối");
        return null;
    }    

}


interface CategoryData {
    id: number,
    name: string,
    cat_image: string,

}
function AllCategoriesPage({level} : {level : number}){
    const navigate = useNavigate();
    const [subCategories, setSubCategories] =useState<CategoryData[]> ([]);
    const [isLoading, setLoading] = useState(true);
    const [cat1_name, setCat1_name] = useState("");
    
    // This is if URL contain sub ID, it means it want to all categories lv2 with id of lv1
    const {slugid} = useParams();
    console.log(slugid);
    let catSlug : string, catId;
    if (slugid){
        const parts = slugid.split("-");
        catId = parts.pop();
        catSlug = parts.join("-");
    }
    catId = Number(catId);


    

    // Load initial data
    useEffect (()=>{

        setLoading(true);
        const fetchData = async () =>{
            const finalData = await getLevelCategoriesList(level, catId, catSlug);

            if(finalData){
                setSubCategories(finalData.data);
                if (level == 2 && finalData.cat1_name){
                    setCat1_name(finalData.cat1_name);
                }
                console.log("Data for all subcategories",finalData);
                setLoading(false);
            }

        }

        fetchData();
        setLoading(false);
        
    }, [level, slugid]);

    // Difference between cat 1 and cat 2
    const handleClick =(id: number, name: string) => {
        if (level == 1)
        {
            const slug = slugify(name);
            navigate(`/categories/${slug}-${id}`)
        }
        if (level == 2)
        {
            navigate(`/products?cat2_id=${id}&page=${1}`)
        }
    };

    return(
        isLoading ? <Loading></Loading> : <>
            {/* Background with gradient and floating shapes */}
            <div className="fixed inset-0 -z-10 overflow-hidden">
                <div className="absolute inset-0 "></div>

                {/* Floating geometric shapes */}
                <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-blue-200/30 to-purple-200/30 rounded-full blur-xl animate-pulse"></div>
                <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-br from-purple-200/30 to-pink-200/30 rounded-full blur-lg animate-bounce" style={{ animationDuration: '3s' }}></div>
                <div className="absolute bottom-40 left-1/4 w-40 h-40 bg-gradient-to-br from-pink-200/20 to-blue-200/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                <div className="absolute bottom-20 right-10 w-28 h-28 bg-gradient-to-br from-blue-200/25 to-purple-200/25 rounded-full blur-xl animate-bounce" style={{ animationDuration: '4s' }}></div>

                {/* Floating particles */}
                {[...Array(8)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-2 h-2 bg-blue-300/40 rounded-full animate-ping"
                        style={{
                            top: `${20 + i * 10}%`,
                            left: `${10 + i * 12}%`,
                            animationDelay: `${i * 0.5}s`,
                            animationDuration: '3s'
                        }}
                    ></div>
                ))}
            </div>

            {/* Main content */}
            <div className="relative z-10 min-h-screen">
                {/* Title section with enhanced styling */}
                <div className="relative mt-[120px] mb-20 text-center px-4">
                    <div className="inline-block relative">
                        <div className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-pulse">
                            {level == 1 ? "Tất cả danh mục" : cat1_name}
                        </div>

                        {/* Decorative elements */}
                        <div className="absolute -top-4 -left-4 w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full animate-spin opacity-60" style={{ animationDuration: '4s' }}></div>
                        <div className="absolute -bottom-4 -right-4 w-6 h-6 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full animate-bounce opacity-60"></div>

                        {/* Underline decorations */}
                        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full"></div>
                        <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-20 h-0.5 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full animate-pulse"></div>
                    </div>

                    {/* Subtitle */}
                    <div className="mt-8 text-lg text-gray-600 font-medium">
                        {level == 1 ? "Khám phá tất cả danh mục sản phẩm của chúng tôi" : `Danh mục con của ${cat1_name}`}
                    </div>
                </div>

                {/* Categories grid with enhanced layout */}
                <div className="relative px-4">
                    {/* Grid container with backdrop */}
                    <div className="max-w-7xl mx-auto relative">
                        {/* Background glow for grid */}
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-100/20 via-purple-100/20 to-pink-100/20 rounded-3xl blur-3xl -z-10"></div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 lg:gap-10 p-8  backdrop-blur-sm rounded-3xl ">
                            {subCategories.map((item,index) => {
                                return (
                                    <div key={index} className="transform hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-200/50">
                                        <CategoryCard
                                            image={item.cat_image}
                                            name={item.name}
                                            onClick={() => handleClick(item.id, item.name)}
                                        />
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    {/* Bottom decorative elements */}
                    <div className="flex justify-center mt-16 space-x-4">
                        <div className="w-16 h-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"></div>
                        <div className="w-8 h-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-pulse"></div>
                        <div className="w-12 h-1 bg-gradient-to-r from-pink-400 to-blue-400 rounded-full"></div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default AllCategoriesPage;
