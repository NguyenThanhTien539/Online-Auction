import Cristiano from "@/assets/images/cristiano.jpg";
import { cn } from "@/lib/utils";
import useIntersectionObserver from "@/hooks/useIntersectionObserver";
interface CategoryCardProps {
  name?: string;
  image?: string;
  onClick?: () => void;
  className?: string;
}

function CategoryCard({ name = "Ronaldo", image, onClick, className }: CategoryCardProps) {
  // Fallback to Ronaldo image if no image provided
  const displayImage = image || Cristiano;

  const { ref, hasIntersected } = useIntersectionObserver();
  return (
    <div ref={ref}
      className={cn(
        // Main container with glassmorphism effect - Gray/Blue theme
        "group relative w-[380px] h-[450px] cursor-pointer overflow-hidden rounded-3xl",
        "bg-gray-100/50 backdrop-blur-xl border-1 border-black/20",
        "hover:bg-white/10 hover:border-white/20",
        "transition-all duration-500 ease-out",
        "hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/25",
        "before:absolute before:inset-0 before:rounded-3xl",
        "before:bg-gradient-to-br before:from-blue-500/10 before:to-gray-500/10",
        "before:opacity-0 before:transition-opacity before:duration-500",
        "hover:before:opacity-100 shadow-2xl shadow-blue-500/20",
        hasIntersected ? "animate__animated animate__fadeInUp" : "opacity-0",
        className
      )}
      onClick={onClick}
    >
      {/* Background pattern - Gray/Blue theme */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-400/20 to-transparent rounded-full blur-xl"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-gray-400/20 to-transparent rounded-full blur-xl"></div>
      </div>

      {/* Image container */}
      <div className="relative h-[70%] overflow-hidden rounded-t-3xl">
        <img
          src={displayImage}
          alt={name}
          className="w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-110 group-hover:brightness-110"
          loading ="lazy"
        />

        {/* Image overlay gradient - Gray/Blue theme */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-gray-900/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500"></div>

        {/* Hover overlay with icon - Gray/Blue theme */}
        <div className="absolute inset-0 bg-gray-900/20 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center">
          <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-100">
            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Content section */}
      <div className="relative h-[30%] flex flex-col justify-center items-center p-6 text-center">
        {/* Decorative line - Gray/Blue theme */}
        <div className="w-10 h-0.5 bg-gradient-to-r from-blue-400 to-gray-400 rounded-full mb-3 opacity-60 group-hover:opacity-100 transition-opacity duration-500"></div>

        {/* Category name */}
        <h3 className="text-lg font-bold text-gray-500 group-hover:text-gray-400 transition-colors duration-500 leading-tight">
          {name}
        </h3>

        {/* Subtitle */}
        <p className="text-sm text-gray-400 mt-2 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-200 transform translate-y-2 group-hover:translate-y-0">
          Khám phá ngay
        </p>
      </div>

      {/* Shine effect - Gray/Blue theme */}
      <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none overflow-hidden">
        <div className="absolute -inset-1 bg-gradient-to-r from-transparent via-blue-400/20 to-transparent -skew-x-12 animate-shine"></div>
      </div>
    </div>
  );
}

export default CategoryCard;
