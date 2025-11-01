import { Outlet } from "react-router-dom";
import { Header } from "../../../components/client/Header/Header";
function Default() {
  return (
    <div className="min-h-screen w-full flex flex-col">
      <Header />
      <main className="flex-1 pt-[100px]">
        <Outlet />
      </main>
    </div>
  );
}
export default Default;
