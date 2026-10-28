import AsyncStorage from '@react-native-async-storage/async-storage';
import type { SavedSubmission } from '../types/form';

const STORAGE_KEY = '@Checkpoint3:submissions';

export async function loadSubmissions(): Promise<SavedSubmission[]> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  if (!raw) return [];

  try {
    const parsed: unknown = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed as SavedSubmission[];
    return [];
  } catch {
    return [];
  }
}

export async function saveSubmission(submission: SavedSubmission): Promise<SavedSubmission[]> {
  const current = await loadSubmissions();
  const updated = [submission, ...current];
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

export async function clearSubmissions(): Promise<void> {
  await AsyncStorage.removeItem(STORAGE_KEY);
}
