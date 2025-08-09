import Header from "@/components/client/reusable-components/header";
import Footer from "@/components/client/reusable-components/footer";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="pt-40">{children}</main>
      <Footer />
    </>
  );
}
