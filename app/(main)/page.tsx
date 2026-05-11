import HeroSection from './components/HeroSection';
import HotPosts from './components/HotPosts';
import PostList from './components/PostList';
import WeeklySidebar from './components/WeeklySidebar';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <div className="max-w-6xl mx-auto px-4 py-6">
        <HotPosts />
        <div className="flex gap-5 items-start">
          <div className="flex-1 min-w-0">
            <PostList />
          </div>
          <aside className="w-[268px] shrink-0 hidden lg:block">
            <WeeklySidebar />
          </aside>
        </div>
      </div>
    </>
  );
}
