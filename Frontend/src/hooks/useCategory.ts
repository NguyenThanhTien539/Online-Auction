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
