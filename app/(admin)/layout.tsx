export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      <aside className="w-64 bg-gray-800 text-white p-4">
        {/* Sidebar content */}
        <h2 className="text-2xl font-bold">Admin Panel</h2>
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
