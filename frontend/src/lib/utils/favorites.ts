import { Challenge } from '../types/api.types';

const FAVORITES_KEY = 'challenge_favorites';

export const getFavoritesFromStorage = (): string[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(FAVORITES_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const addFavoriteToStorage = (challengeId: string): void => {
  if (typeof window === 'undefined') return;
  const favorites = getFavoritesFromStorage();
  if (!favorites.includes(challengeId)) {
    favorites.push(challengeId);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }
};

export const removeFavoriteFromStorage = (challengeId: string): void => {
  if (typeof window === 'undefined') return;
  const favorites = getFavoritesFromStorage();
  const index = favorites.indexOf(challengeId);
  if (index !== -1) {
    favorites.splice(index, 1);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }
};

export const isFavoriteInStorage = (challengeId: string): boolean => {
  if (typeof window === 'undefined') return false;
  const favorites = getFavoritesFromStorage();
  return favorites.includes(challengeId);
}; 