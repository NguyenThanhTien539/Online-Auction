"use client"
import {useEffect, useState, useRef} from "react";




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
  const [showInput, setShowInput] = useState({
    input1: "",
    input2: ""
  })
  const handleChange = (e : any) => {
    const {name, value} = e.target;
    setShowInput ((i) => {
      return {
        ...i,
        [name]: value
      }
    })
  }

  const handleSubmit = (e : any) => {
    e.preventDefault();
    const form = e.target;
    const input1 = form.input1.value;
    const input2 = form.input2.value;
    console.log("Input 1:", input1);
    console.log("Input 2:", input2);
    setShowInput({
      input1: input1,
      input2: input2
    })
  }
  

    
  return (
    <>
      <form onSubmit = {handleSubmit} className = "bg-blue-200 w-[50%] h-[300px] mx-auto flex-col justify-center">
        <p>Hello</p>
        <input className = "w-[50%] bg-rose-100 m-10" id = "input1" name = "input1"></input>
        <input className = "w-[50%] bg-rose-100 m-10" id = "input2" name = "input2"></input>
        <button type="submit" className = "bg-gray-400">Submit</button>
        <p>Input 1: {showInput.input1}</p>
        <p>Input 2: {showInput.input2}</p>
      </form>
    </>
  )

    
  
}


export default Test;