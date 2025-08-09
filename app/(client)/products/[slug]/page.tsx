import ProductDetail from "@/components/client/product-details";
import { categoriesData } from "@/lib/categories-data";
import { notFound } from 'next/navigation';

function findProductBySlug(slug: string) {
    for (const category of categoriesData) {
        if (category.products) {
            const product = category.products.find(p => p.slug === slug);
            if (product) return product;
        }
        if (category.subcategories) {
            for (const subcategory of category.subcategories) {
                if (subcategory.products) {
                    const product = subcategory.products.find(p => p.slug === slug);
                    if (product) return product;
                }
            }
        }
    }
    return null;
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
    const product = findProductBySlug(params.slug);

    if (!product) {
        notFound();
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <ProductDetail product={product} />
        </div>
    );
}

export async function generateStaticParams() {
    const paths: { slug: string }[] = [];
    categoriesData.forEach(category => {
        if (category.products) {
            category.products.forEach(product => {
                paths.push({ slug: product.slug });
            });
        }
        if (category.subcategories) {
            category.subcategories.forEach(subcategory => {
                if (subcategory.products) {
                    subcategory.products.forEach(product => {
                        paths.push({ slug: product.slug });
                    });
                }
            });
        }
    });
    return paths;
}
