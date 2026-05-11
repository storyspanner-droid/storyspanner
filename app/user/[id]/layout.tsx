import Header from '@/components/ui/Header';

export default function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#F8F7F4]">{children}</main>
    </>
  );
}
