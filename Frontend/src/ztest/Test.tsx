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
import {toast, Toaster} from "sonner"


function Test(){
  return (
    <div >
      <ProductCard/>
      <SubCategoryCard/>
      <OTPForm/>

      {/* <Toaster richColors closeButton/> */}
      <button className = "flex mx-auto my-10 p-2 rounded-2xl text-white bg-green-500"
      onClick = {() => {toast.success(
        <div className = "ml-2 text-green-400 text-lg">
          Toi dep trai vcl
        </div>
      )}}
      >
        CLick me
      </button>

      
      

    </div>
  );
}

export default Test;