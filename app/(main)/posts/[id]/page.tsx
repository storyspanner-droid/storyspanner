import PostDetail from './components/PostDetail';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function PostPage({ params }: Props) {
  const { id } = await params;
  return <PostDetail postId={id} />;
}
