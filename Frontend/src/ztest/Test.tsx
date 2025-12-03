"use client"
import {useEffect, useState, useRef} from "react";
import * as React from "react"
import {Link} from "react-router-dom"
import { CircleCheckIcon, CircleHelpIcon, CircleIcon, Navigation } from "lucide-react"
import ProductCard from "@/components/common/ProductCard"
import SubCategoryCard from "@/components/common/CategoryCard";
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

import OTPForm from "@/components/common/OTPForm"
import {toast, Toaster} from "sonner"
import Pagination from "@/components/common/Pagination"


import {useDropzone} from 'react-dropzone';

function Basic(props? : any) {
  const {acceptedFiles, getRootProps, getInputProps} = useDropzone();
  
  const files = acceptedFiles.map(file => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
    </li>
  ));

  return (
    <section className="container">
      <div {...getRootProps({className: 'dropzone'})}>
        <input {...getInputProps()} />
        <p>Drag 'n' drop some files here, or click to select files</p>
      </div>
      <aside>
        <h4>Files</h4>
        <ul>{files}</ul>
      </aside>
    </section>
  );
}



function Test(){

  useEffect(()=>{
    const input = document.querySelector('input[type="file"]');
    if(input){
      input.addEventListener('change', (e) => {
      let file;
        if(e.target)
      { 
        file =  e.target
      }
      
      console.log(file);
    })
  }
   
  });


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

      <input type = "file" id = "test-input-file" className = "bg-gray-600 text-white"></input>
      
      <Basic/>
      <TestPagination/>

    
      

    </div>
  );
}

function TestPagination(){

  const [currentPage, setPage] = useState<number>(1);
  useEffect (()=>{
    console.log(currentPage);
  },[currentPage]);
  return(
    <div>
      <Pagination numberOfPages = {10} currentPage = {currentPage} controlPage = {setPage} />
    </div>
  )
}
export default Test;