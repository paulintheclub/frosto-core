import CategoryPage from '@/components/client/category-page';
import { categoriesData } from '@/lib/categories-data';
import { notFound } from 'next/navigation';
import { Category } from '@/lib/categories-data';

type Props = {
  params: { slug: string[] };
};

function findCategory(slug: string[], categories: Category[]): Category | undefined {
  if (!slug || slug.length === 0) return undefined;

  let currentCategory: Category | undefined = undefined;
  let currentCategories: Category[] | undefined = categories;

  for (const segment of slug) {
    currentCategory = currentCategories?.find(c => c.slug === segment);
    if (!currentCategory) return undefined;
    currentCategories = currentCategory.subcategories;
  }

  return currentCategory;
}

export default function Page({ params }: Props) {
  const { slug } = params;
  const category = findCategory(slug, categoriesData);

  if (!category) {
    notFound();
  }

  // Find parent categories for breadcrumbs
  const breadcrumbs = slug.reduce((acc, segment, index) => {
    const parentSlug = slug.slice(0, index);
    const parent = findCategory(parentSlug, categoriesData);
    if (parent) {
      acc.push({ name: parent.name, href: `/categories/${parent.slug}` });
    }
    return acc;
  }, [] as { name: string, href: string }[]);
  
  breadcrumbs.push({ name: category.name, href: `/categories/${slug.join('/')}` });

  return <CategoryPage category={category} breadcrumbs={breadcrumbs} />;
}

// This function is optional but recommended for performance
export async function generateStaticParams() {
    // We will generate static pages for all categories and subcategories
    const paths: { slug: string[] }[] = [];
    
    function generatePaths(categories: Category[], prefix: string[] = []) {
        for (const category of categories) {
            const newPrefix = [...prefix, category.slug];
            paths.push({ slug: newPrefix });
            if (category.subcategories) {
                generatePaths(category.subcategories, newPrefix);
            }
        }
    }

    generatePaths(categoriesData);
    return paths;
}

