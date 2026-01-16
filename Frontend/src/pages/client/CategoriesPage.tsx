import CategoryCard from "@/components/common/CategoryCard"
import {toast} from "sonner";
import {useEffect, useState} from "react";
import {useParams, useNavigate} from "react-router-dom"
import {slugify} from "@/utils/make_slug"
import Loading from "@/components/common/Loading";
import { useBreadcrumb } from "@/contexts/BreadcrumbContext";

const getLevelCategoriesList = async(level : number, catId? : number, catSlug? : string) =>{
    
    let linkFetch = "";
    if (level == 1)
    {
        linkFetch = `${import.meta.env.VITE_API_URL}/api/categories/level1`;
    }
    else if (level == 2)
    {
        linkFetch = `${import.meta.env.VITE_API_URL}/api/categories/level2?cat_id=${catId}&cat_slug=${catSlug}`;
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
    const { setBreadcrumbs } = useBreadcrumb();
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
                    const cat1Name = finalData.cat1_name;
                    setCat1_name(cat1Name);
                    
                    // Update breadcrumb for level 2
                    setBreadcrumbs([
                        { label: "Trang chủ", path: "/" },
                        { label: "Danh mục", path: "/categories" },
                        { label: cat1Name, path: null }
                    ]);
                } else if (level == 1) {
                    // Update breadcrumb for level 1
                    setBreadcrumbs([
                        { label: "Trang chủ", path: "/" },
                        { label: "Danh mục", path: null }
                    ]);
                }
                console.log("Data for all subcategories",finalData);
                setLoading(false);
            }

        }

        fetchData();
        
        
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
            {/* Clean background */}
            <div className="min-h-screen ">
                {/* Main content */}
                <div className="container mx-auto px-4 py-8">
                    {/* Header section */}
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-400 mb-4">
                            {level == 1 ? "Tất cả danh mục" : cat1_name}
                        </h1>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            {level == 1 ? "Khám phá tất cả danh mục sản phẩm của chúng tôi" : `Danh mục con của ${cat1_name}`}
                        </p>
                        <div className="w-24 h-1 bg-blue-200 mx-auto mt-6 rounded-full"></div>
                    </div>

                    {/* Categories grid */}
                    <div className="max-w-7xl mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                            {subCategories.map((item,index) => {
                                return (
                                    <div key={index} className="">
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

                    {/* Empty state */}
                    {subCategories.length === 0 && !isLoading && (
                        <div className="text-center py-16">
                            <div className="text-gray-400 text-lg">
                                Không có danh mục nào để hiển thị
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default AllCategoriesPage;
