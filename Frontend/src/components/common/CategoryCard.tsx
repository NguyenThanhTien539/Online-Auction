import Cristiano from "@/assets/images/cristiano.jpg";

function CategoryCard(data: any) {
  const name = data?.name ?? "Ronaldo";
  const image = data?.image ?? Cristiano;
  const handleClick = data.onClick;

  return (
    <div
      className="w-[300px] aspect-[4/5] flex flex-col bg-gradient-to-br from-gray-900 to-black rounded-2xl items-center hover:cursor-pointer hover:scale-[101%] \
        transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-purple-400/50 border border-gray-700/50 hover:border-purple-400/30 overflow-hidden group"
      onClick={handleClick}
    >
      <div className="relative w-full h-[70%] overflow-hidden rounded-t-2xl">
        <img
          src={image}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        ></img>
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
      <div className="text-xl font-semibold mx-4 mt-4 flex flex-1 items-center justify-center text-center text-white group-hover:text-purple-200 transition-colors duration-300">
        {name}
      </div>
    </div>
  );
}
export default CategoryCard;
