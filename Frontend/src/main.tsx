import { createRoot } from "react-dom/client";
import "./global.css";
import { RouterProvider } from "react-router-dom";
import { Header } from "./components/Header/Header";

createRoot(document.getElementById("root") as HTMLElement).render(
  <Header />

  // <MainContent/>

  // <Footer/>
);
