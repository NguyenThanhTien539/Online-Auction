import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu";


function Home() {
  return (
    <>
      
      <NavigationMenu className="flex-row bg-gray-300 ml-[100px] gap-[20px]" viewport = {false}>
        <NavigationMenuList className="md:w-[1000px]">

          <NavigationMenuItem>
            <NavigationMenuTrigger>Item One</NavigationMenuTrigger>
            <NavigationMenuContent className="md:w-[300px] z-100">
              <NavigationMenuLink>Link nanana 2</NavigationMenuLink>
              <NavigationMenuLink>Link</NavigationMenuLink>
            </NavigationMenuContent>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuTrigger>Item One</NavigationMenuTrigger>
            <NavigationMenuContent className="md:w-[300px] z-100">
              <NavigationMenuLink>Link nanana 2</NavigationMenuLink>
              <NavigationMenuLink>Link</NavigationMenuLink>
            </NavigationMenuContent>
          </NavigationMenuItem>


          <NavigationMenuItem className = "ml-[20px]">
            <NavigationMenuTrigger>Item One</NavigationMenuTrigger>
            <NavigationMenuContent className="md:w-[300px] z-100">
              <NavigationMenuLink>Link nanana 2</NavigationMenuLink>
              <NavigationMenuLink>Link</NavigationMenuLink>
            </NavigationMenuContent>
          </NavigationMenuItem>

          <NavigationMenuItem className = "ml-[20px]">
            <NavigationMenuTrigger>Item One</NavigationMenuTrigger>
            <NavigationMenuContent className="md:w-[300px] z-100">
              <NavigationMenuLink>Link nanana 2</NavigationMenuLink>
              <NavigationMenuLink>Link</NavigationMenuLink>
            </NavigationMenuContent>
          </NavigationMenuItem>

          
        </NavigationMenuList>

        {/* <NavigationMenuViewport /> 🟢 Bắt buộc */}
      </NavigationMenu>






      
    </>
  );
}

export default Home;
