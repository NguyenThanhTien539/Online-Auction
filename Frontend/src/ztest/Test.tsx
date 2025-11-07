"use client"
import {useEffect, useState, useRef} from "react";
import * as React from "react"
import {Link} from "react-router-dom"
import { CircleCheckIcon, CircleHelpIcon, CircleIcon, Navigation } from "lucide-react"
import ProductCard from "@/features/auction/components/ProductCard"
import SubCategoryCard from "@/features/auction/components/SubCategoryCard";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu"

import OTPForm from "@/features/auth/components/OTPForm"



function Test(){
  return (
    <div >
      <ProductCard/>
      <SubCategoryCard/>
      <OTPForm/>
      

    </div>
  );
}

export default Test;