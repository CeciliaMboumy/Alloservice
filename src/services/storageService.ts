import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '../config/firebase';

export async function uploadAvatar(
  userId: string,
  uri: string,
  onProgress?: (pct: number) => void,
): Promise<string> {
  const response = await fetch(uri);
  const blob = await response.blob();
  const storageRef = ref(storage, `avatars/${userId}/avatar.jpg`);

  return new Promise((resolve, reject) => {
    const task = uploadBytesResumable(storageRef, blob, { contentType: 'image/jpeg' });
    task.on(
      'state_changed',
      (snap) => {
        if (onProgress) onProgress(snap.bytesTransferred / snap.totalBytes);
      },
      reject,
      async () => {
        const url = await getDownloadURL(task.snapshot.ref);
        resolve(url);
      },
    );
  });
}

export async function uploadProviderPhoto(
  providerId: string,
  uri: string,
  index: number,
  onProgress?: (pct: number) => void,
): Promise<string> {
  const response = await fetch(uri);
  const blob = await response.blob();
  const storageRef = ref(storage, `providers/${providerId}/photos/photo_${index}.jpg`);

  return new Promise((resolve, reject) => {
    const task = uploadBytesResumable(storageRef, blob, { contentType: 'image/jpeg' });
    task.on(
      'state_changed',
      (snap) => {
        if (onProgress) onProgress(snap.bytesTransferred / snap.totalBytes);
      },
      reject,
      async () => {
        const url = await getDownloadURL(task.snapshot.ref);
        resolve(url);
      },
    );
  });
}

export async function deleteFile(path: string): Promise<void> {
  await deleteObject(ref(storage, path));
}
