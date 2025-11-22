interface Category {
  id: number;
  name: string;
  parent_id: number | null;
  slug: string;
}

interface CategoryNode {
  id: number;
  name: string;
  slug: string;
  children: CategoryNode[];
}

export const buildTree = (
  categories: Category[],
  parentID: number | null = null
): CategoryNode[] => {
  const tree: CategoryNode[] = [];

  categories.forEach((item) => {
    if (item.parent_id === parentID) {
      const children = buildTree(categories, item.id);

      tree.push({
        id: item.id,
        name: item.name,
        slug: item.slug,
        children,
      }); 
    }
  });

  return tree;
};

