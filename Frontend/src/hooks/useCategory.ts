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
  created_by: string;
  created_at: string;
  updated_by: string;
  updated_at: string;
};

export type CategoryEditItem = {
  id: number;
  name: string;
  status: "active" | "inactive";
  parent_id: number | null;
  description: string;
};

export function useBuildTree() {
  const [tree, setTree] = useState<CategoryNode[] | null>(null);
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
        if (data.tree.length != 0) {
          setTree(data.tree);
        } else {
          setTree(null);
        }
      })
      .catch(() => {
        setTree(null);
      });
  }, []);
  return { tree };
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
        console.log(data.list);
        setItems(data.list);
      })
      .catch(() => setItems([]));
  }, []);

  return { items };
}

export function useCategoryWithID(id: number) {
  const [item, setItem] = useState<CategoryEditItem | null>(null);

  useEffect(() => {
    if (!id) return;

    fetch(
      `${import.meta.env.VITE_API_URL}/${
        import.meta.env.VITE_PATH_ADMIN
      }/api/category/edit/${id}`,
      { credentials: "include" }
    )
      .then((res) => res.json())
      .then((data) => {
        const it = data.item;

        setItem({
          id: it.id,
          name: it.name,
          status: it.status,
          parent_id: it.parent_id ?? null,
          description: it.description ?? "",
        });
      })
      .catch(() => setItem(null));
  }, [id]);

  return { item };
}
