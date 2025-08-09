import BrandsListing from '@/components/client/brands/brands-listing'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'

export default function BrandsPage() {
  return (
    <div className="min-h-screen bg-white">
      
      <main className="pb-16">
        {/* Breadcrumbs */}
        <div className="container mx-auto px-4 py-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Brands</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <div className="container mx-auto px-4 max-w-7xl">
          <BrandsListing />
        </div>
      </main>
    </div>
  )
}
