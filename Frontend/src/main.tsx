import { createRoot } from "react-dom/client";
import {RouterProvider} from "react-router-dom";
import routers from "./routes/AppRouter.tsx";
import "@/assets/styles/global.css";
import {Toaster} from "sonner"

createRoot(document.getElementById("root") as HTMLElement).render(
  <>
    <Toaster richColors closeButton/>
    <RouterProvider router={routers} />
  </>
 
);
