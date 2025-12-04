/* eslint-disable @typescript-eslint/no-explicit-any */
import { useNavigate } from "react-router-dom";
import TinyMCEEditor from "@/components/editor/TinyMCEEditor";
import JustValidate from "just-validate";
import { useEffect, useMemo, useRef } from "react";
import { slugify } from "@/utils/make_slug";
import { useBuildTree } from "@/hooks/useCategory";
import { toast } from "sonner";
import UploadImage from "@/components/common/UploadImage";

type FlatOption = {
  id: number;
  label: string;
};

export default function CategoryCreate() {
  const editorRef = useRef(null);
  const { tree } = useBuildTree();
  const navigate = useNavigate();

  const flattenTree = (nodes: any, level = 0): FlatOption[] => {
    const result: FlatOption[] = [];

    nodes.forEach((node: any) => {
      const prefix = level > 0 ? "-".repeat(level) + " " : "";
      result.push({ id: node.id, label: `${prefix}${node.name}` });

      if (node.children && node.children.length > 0) {
        result.push(...flattenTree(node.children, level + 1));
      }
    });

    return result;
  };

  const options: FlatOption[] = useMemo(() => {
    if (!tree) return [];
    return flattenTree(tree);
  }, [tree]);

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
        const parentValue = event.target.parent.value as string;
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
    <div className="w-full px-4 sm:px-6 lg:px-8 py-4">
      <form
        id="CategoryCreateForm"
        className="w-full max-w-6xl mx-auto space-y-4 sm:space-y-6"
      >
        <h2 className="text-2xl sm:text-3xl font-semibold">Tạo danh mục</h2>

        <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-6 lg:p-8">
          <div className="space-y-5 sm:space-y-6">
            {/* Tên danh mục và Danh mục cha */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <div className="w-full">
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Tên danh mục <span className="text-red-500">*</span>
                </label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                  placeholder="Nhập tên danh mục"
                />
                <div
                  id="nameError"
                  className="text-sm text-red-500 mt-1 min-h-[20px]"
                ></div>
              </div>

              <div className="w-full">
                <label
                  htmlFor="parent"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Danh mục cha
                </label>
                <select
                  id="parent"
                  name="parent"
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 shadow-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 disabled:bg-gray-100 transition-all"
                  defaultValue=""
                >
                  <option value="">-- Chọn danh mục --</option>
                  {options.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Trạng thái */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <div className="w-full">
                <label
                  htmlFor="status"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Trạng thái
                </label>
                <select
                  id="status"
                  name="status"
                  className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                  defaultValue="active"
                >
                  <option value="active">Hoạt động</option>
                  <option value="inactive">Tạm dừng</option>
                </select>
              </div>
            </div>

            
            {/* Mô tả */}
            <div className="w-full">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Mô tả
              </label>
              <div className="w-full">
                <TinyMCEEditor editorRef={editorRef} value={value} />
              </div>
            </div>

            {/* Nút hành động */}
            <div className="flex flex-col  items-stretch sm:items-center justify-center gap-3 sm:gap-4 pt-4">
              <button
                type="submit"
                className="w-full sm:w-auto rounded-lg bg-blue-500 px-8 py-3 text-base font-medium text-white hover:bg-blue-600 active:bg-blue-700 transition-colors shadow-sm hover:shadow-md"
              >
                Tạo mới danh mục
              </button>

              <button
                type="button"
                className="w-full sm:w-auto text-base font-medium text-blue-500 hover:text-blue-600 underline transition-colors py-2"
                onClick={() => {
                  navigate(`/${import.meta.env.VITE_PATH_ADMIN}/category/list`);
                }}
              >
                Quay lại danh sách
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
