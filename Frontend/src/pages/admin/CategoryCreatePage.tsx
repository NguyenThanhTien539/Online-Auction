/* eslint-disable @typescript-eslint/no-explicit-any */
import { useNavigate } from "react-router-dom";
import TinyMCEEditor from "@/components/editor/TinyMCEEditor";
import JustValidate from "just-validate";
import { useEffect, useRef } from "react";
import { slugify } from "@/utils/make_slug";
import { useBuildTree } from "@/hooks/useCategory";
import { toast } from "sonner";

export default function CategoryCreate() {
  const editorRef = useRef(null);
  const options = useBuildTree();
  const navigate = useNavigate();
  console.log("options", options);

  useEffect(() => {
    const validate = new JustValidate("#CategoryCreateForm");
    validate
      .addField(
        "#name",
        [{ rule: "required", errorMessage: "Vui lòng nhập tên danh mục!" }],
        { errorContainer: "#nameError" }
      )

      .onSuccess((event: any) => {
        const name = event.target.name.value;
        const status = event.target.status.value;
        const parentValue = event.target.parent.value as string; // "" hoặc "3"
        const parent_id = parentValue === "" ? null : Number(parentValue);
        let description;
        if (editorRef.current) {
          description = (editorRef.current as any).getContent();
        }

        const slug = slugify(name);
        const dataFinal = {
          name: name,
          status: status,
          description: description,
          parent_id: parent_id,
          slug: slug,
        };

        fetch(
          `${import.meta.env.VITE_API_URL}/${
            import.meta.env.VITE_PATH_ADMIN
          }/api/category/create`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dataFinal),
            credentials: "include",
          }
        )
          .then((res) => res.json())
          .then((data) => {
            if (data.code == "error") {
              toast.error(data.message);
            }
            if (data.code == "success") {
              toast.success(data.message);
              navigate(0);
            }
          });
      });
  }, []);

  const value = "";

  return (
    <form id="CategoryCreateForm" className="space-y-6">
      <h2 className="text-3xl font-medium">Tạo danh mục</h2>

      <div className="rounded-2xl border-3 bg-white p-6 md:p-8">
        <div className="space-y-8">
          {/* tên danh mục */}
          <div className="grid gap-6 md:grid-cols-2">
            <div className="">
              <div className="space-y-5  ">
                <label
                  htmlFor="name"
                  className="mb-4 block text-sm font-medium text-gray-700"
                >
                  Tên danh mục
                </label>
                <input
                  id="name"
                  type="text"
                  className="w-full rounded-lg border bg-gray-50 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="Nhập tên danh mục"
                />
              </div>
              <div id="errorName" className="text-sm text-red mt-0.2"></div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="parent"
                className="mb-4 block text-sm font-medium text-gray-700"
              >
                Danh mục cha
              </label>
              <select
                id="parent"
                name="parent"
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm
             text-gray-800 shadow-sm outline-none
             focus:border-blue-500 focus:ring-2 focus:ring-blue-200
             disabled:bg-gray-100"
                defaultValue=""
              >
                <option value="">-- Chọn danh mục --</option>
                {options &&
                  options.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.label}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          {/* Hàng 2: Vị trí + Trạng thái */}
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label
                htmlFor="status"
                className="mb-4 block text-sm font-medium text-gray-700"
              >
                Trạng thái
              </label>
              <select
                id="status"
                className="w-full rounded-lg border bg-gray-50 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                defaultValue="active"
              >
                <option value="active">Hoạt động</option>
                <option value="inactive">Tạm dừng</option>
              </select>
            </div>
          </div>

          {/* Mô tả */}
          <TinyMCEEditor editorRef={editorRef} value={value} />

          {/* Nút hành động */}
          <div className="flex flex-col items-center justify-center gap-5 pt-2">
            <button
              type="submit"
              className="rounded-xl bg-blue-500 px-3 py-5 text-[18px] font-medium text-white hover:bg-blue-600 cursor-pointer"
            >
              Tạo mới danh mục
            </button>

            <span
              className="text-[15px] font-medium cursor-pointer underline text-blue-400"
              onClick={() => {
                navigate(`/${import.meta.env.VITE_PATH_ADMIN}/category/list`);
              }}
            >
              Quay lại danh sách
            </span>
          </div>
        </div>
      </div>
    </form>
  );
}
