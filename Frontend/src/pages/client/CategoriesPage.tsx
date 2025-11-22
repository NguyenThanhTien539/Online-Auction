import CategoryCard from "@/components/common/CategoryCard"
import {toast} from "sonner";
import {useEffect, useState} from "react";
import {useParams, useNavigate} from "react-router-dom"
import {slugify} from "@/utils/make_slug"

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
        return data.data;
    }
    catch(e){
        console.log("Error connecting backend: ", e);
        toast.error("Lỗi kết nối");
        return null;
    }    

}


interface CategoryData {
    cat1_id : number,
    cat2_id : number,
    name: string,
    image: string,
}
function AllCategoriesPage({level} : {level : number}){
    const navigate = useNavigate();
    const [subCategories, setSubCategories] =useState<CategoryData[]> ([]);
    const [isLoading, setLoading] = useState(true);

    
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
                setSubCategories(finalData);
                console.log("Data for all subcategories",finalData);
                setLoading(false);
            }

        }

        fetchData();
        
    }, [level, slugid]);

    // Difference between cat 1 and cat 2
    const handleClick =(cat1_id : number, cat2_id: number, name: string) => {
        if (level == 1)
        {
            const slug = slugify(name);
            navigate(`/categories/${slug}-${cat1_id}`)
        }
        if (level == 2)
        {
            navigate(`/products?cat2_id=${cat2_id}&page=${1}`)
        }
    };

    return(
        <>
            <div className = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mt-[100px] w-fit mx-auto mb-[200px]">
                {!isLoading && subCategories.map((item,index) => {
                    return (
                        <CategoryCard
                            key = {index}
                            image = {item.image}
                            name = {item.name}
                            onClick = {() => handleClick(item.cat1_id, item.cat2_id, item.name)}
                        ></CategoryCard>     
                    )
                })}
               
            </div>
        </>
    );
}

export default AllCategoriesPage;
