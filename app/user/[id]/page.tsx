import UserProfile from './components/UserProfile';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function UserProfilePage({ params }: Props) {
  const { id } = await params;
  return <UserProfile userId={decodeURIComponent(id)} />;
}
