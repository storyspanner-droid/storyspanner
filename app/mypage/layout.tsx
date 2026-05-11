import Header from '@/components/ui/Header';

export default function MyPageLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#FAFAFA]">{children}</main>
    </>
  );
}
