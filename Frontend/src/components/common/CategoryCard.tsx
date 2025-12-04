import Cristiano from "@/assets/images/cristiano.jpg";

function CategoryCard(data: any) {
  const name = data?.name ?? "Ronaldo";
  const image = data?.image ?? Cristiano;
  const handleClick = data.onClick;

  return (
    <div
      className="w-[300px] aspect-[4/5] flex flex-col bg-black/90 rounded-2xl items-center hover:cursor-pointer hover:scale-105 \
        transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-green-400 text-white"
      onClick={handleClick}
    >
      <img
        src={image}
        className="flex w-full h-[70%] shrink-0 overflow-hidden rounded-lg justify-center object-cover"
      ></img>
      <div className="text-2xl font-semibold mx-2 mt-3 flex flex-1 pt-2 grow-0 self-center">
        {name}
      </div>
    </div>
  );
}
export default CategoryCard;
