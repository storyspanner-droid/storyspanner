import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import storage from '@/lib/firebase/storage';

export async function uploadImage(
  file: File,
  folder: 'thumbnails' | 'content',
): Promise<string> {
  const ext = file.name.split('.').pop() ?? 'jpg';
  const key = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const snap = await uploadBytes(ref(storage, key), file);
  return getDownloadURL(snap.ref);
}
