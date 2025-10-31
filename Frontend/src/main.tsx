import { createRoot } from "react-dom/client";
import "./global.css";
import {RouterProvider} from "react-router-dom";
import routers from "./routes/routers.tsx";


createRoot(document.getElementById("root") as HTMLElement).render(
  <RouterProvider router={routers} />
);
