import avatar from "@/assets/images/Cristiano.jpg";

export default function Header() {
  return (
    <div className="mx-auto flex h-16 items-center justify-between px-[60px]">
      <div className="text-2xl font-semibold">
        <a href="/admin/dashboard" className="text-blue-600">
          Admin
        </a>
      </div>

      <div className="flex items-center gap-3">
        <div className="size-10 rounded-full overflow-hidden">
          <img
            src={avatar}
            alt="Avatar"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex flex-col leading-tight">
          <span className="font-medium">Thanh Tiến</span>
          <span className="font-[400] text-sm">Quản trị viên</span>
        </div>
      </div>
    </div>
  );
}
