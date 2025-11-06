import Cristiano from "@/assets/images/cristiano.jpg";








function SubCategoryCard(data : any) {

    const name = data.name;
    const image = data.image;
    return (
        <div className = "w-[300px] aspect-[4/5] flex flex-col bg-gray-500/30 m-10 rounded-2xl items-center hover:cursor-pointer hover:scale-105 \
        transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-gray-400 ">
            <img src = {Cristiano} className = "flex w-full h-[70%] shrink-0 overflow-hidden rounded-lg justify-center"></img>
            <div className = "text-2xl font-semibold mx-2 flex flex-1 pt-2 grow-0 self-center">Ronaldo</div>
        </div>
        
    )
};
export default SubCategoryCard;