import avatar from "@/assets/images/Cristiano.jpg";
import {useAuth} from "@/routes/ProtectedRouter"
export default function Header() {
  const {auth} = useAuth();
  return (
    <div className="mx-auto flex h-16 items-center justify-between px-[60px]">
      <div className="text-2xl font-semibold">
        <a href="/admin/dashboard" className="text-blue-600">
          Admin
        </a>
      </div>

      <div className="flex items-center gap-3">
        <div className="size-10 rounded-full overflow-hidden shadow-[0px_0px_20px] shadow-blue-500">
          { auth && auth.avatar ?
          <img
            src={auth.avatar}
            alt="Avatar"
            className="w-full h-full object-cover "
          /> :
            <img
            src={avatar}
            alt="Avatar"
            className="w-full h-full object-cover"
          />}
        </div>

        <div className="flex flex-col leading-tight">
          <span className="font-medium max-w-[150px] truncate">{auth?.username}</span>
          <span className="font-[400] text-sm">Quản trị viên</span>
        </div>
      </div>
    </div>
  );
}
