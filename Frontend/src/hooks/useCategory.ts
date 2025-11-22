// src/hooks/useCategory.ts
import { useEffect, useState } from "react";

export interface CategoryNode {
  id: number;
  name: string;
  slug: string;
  children: CategoryNode[];
}

export interface FlatOption {
  id: number;
  label: string;
}

type CategoryItem = {
  id: number;
  name: string;
  status: "active" | "inactive";
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
};
export function useBuildTree(): FlatOption[] | null {
  const [options, setOptions] = useState<FlatOption[] | null>(null);

  // helper: convert tree -> list có indent
  const flattenTree = (nodes: CategoryNode[], level = 0): FlatOption[] => {
    const result: FlatOption[] = [];

    nodes.forEach((node) => {
      const prefix = level > 0 ? "-".repeat(level) : "";
      result.push({ id: node.id, label: `${prefix}${node.name}` });

      if (node.children && node.children.length > 0) {
        result.push(...flattenTree(node.children, level + 1));
      }
    });

    return result;
  };

  useEffect(() => {
    fetch(
      `${import.meta.env.VITE_API_URL}/${
        import.meta.env.VITE_PATH_ADMIN
      }/api/category/build-tree`,
      {
        credentials: "include",
      }
    )
      .then((res) => res.json())
      .then((data) => {
        const tree: CategoryNode[] = data.tree;
        if (Array.isArray(tree)) {
          setOptions(flattenTree(tree));
        } else {
          setOptions(null);
        }
      })
      .catch(() => {
        setOptions(null);
      });
  }, []);
  return options;
}

export function useCategories() {
  const [items, setItems] = useState<CategoryItem[]>([]);

  useEffect(() => {
    fetch(
      `${import.meta.env.VITE_API_URL}/${
        import.meta.env.VITE_PATH_ADMIN
      }/api/category/list`,
      { credentials: "include" }
    )
      .then((res) => res.json())
      .then((data) => {
        const mapped: CategoryItem[] = data.list.map((it: any) => ({
          id: it.id,
          name: it.name,
          status: it.status, // active / inactive
          createdBy: it.created_by ?? "Không rõ",
          updatedBy: it.updated_by ?? "Không rõ",
          createdAt: formatDate(it.created_at),
          updatedAt: formatDate(it.updated_at),
        }));
        console.log(mapped);
        setItems(mapped);
      })
      .catch(() => setItems([]));
  }, []);

  return { items, setItems };
}

function formatDate(dateStr: string) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleString("vi-VN"); // 14:46 12/10/2025
}
