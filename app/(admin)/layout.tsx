import { Sidebar } from "@/components/admin/reusable-components/sidebar"
import { Header } from "@/components/admin/reusable-components/header"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-background flex">
            <Sidebar />
            <div className="flex-1 lg:ml-64">
                <Header />
                <main className="p-6">{children}</main>
            </div>
        </div>
    )
}
