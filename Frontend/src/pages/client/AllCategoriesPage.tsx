import SubCategoryCard from "@/components/common/SubCategoryCard"
import Ronaldo from "@/assets/images/Cristiano.jpg"
import {useLocation, Link} from "react-router-dom";
import {toast} from "sonner";
import {useEffect, useState} from "react";

const getSubCategoriesList = async(largeCate : string) =>{
    

    try{
        let response = await fetch(`http://localhost:5000/largeCategory?name=${largeCate}`);
        let data = await response.json();

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
/*
Data pash into SubCategoryCard:
{
    name : string,
    image: string (link url),
    link: string (link to navigate to)
}
 */

interface subCategoryData {
    name: string,
    image: string,
    link: string
}
function AllCategoriesPage(){

    const [subCategories, setSubCategories] =useState<subCategoryData[]> ([]);
    const [isLoading, setLoading] = useState(true);
    const location = useLocation();
    
    // Boolean remove last /
    const pathSegments = location.pathname.split("/").filter(Boolean);
    const largeCate = pathSegments[pathSegments.length - 1];



    useEffect (()=>{
        if (!largeCate){
            setLoading(false);
            toast.error("Đường dẫn không hợp lệ");
        }
        setLoading(true);
        const fetchData = async () =>{
            const finalData = await getSubCategoriesList(largeCate);

            if(finalData){
                setSubCategories(finalData);
                console.log("Data for all subcategories",finalData);
            }
              setLoading(true);
        }

        fetchData();
        
    }, [largeCate]);

    return(
        <>
            <div className = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mt-[100px] w-fit mx-auto mb-[200px]">
                {subCategories.map((item,index) => {
                    return (
                        <SubCategoryCard
                            key = {index}
                            image = {item.image}
                            link = {item.link}
                        ></SubCategoryCard>
                        
                    )
                })}
                <SubCategoryCard/>
                <SubCategoryCard/>
                <SubCategoryCard/>
            </div>
        </>
    );
}

export default AllCategoriesPage;
