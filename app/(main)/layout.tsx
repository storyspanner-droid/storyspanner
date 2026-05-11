import Header from '@/components/ui/Header';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="flex-1 bg-[#F8F7F4]">{children}</main>
    </>
  );
}
