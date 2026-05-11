import Header from '@/components/ui/Header';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#FAFAFA]">{children}</main>
    </>
  );
}
