import { useState, useEffect } from 'react';
import { IconButton } from '@mui/material';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import { useGetFavoriteStatusQuery, useSaveChallengeMutation, useUnsaveChallengeMutation } from '@/lib/store/api/challengesApi';
import { isFavoriteInStorage } from '@/lib/utils/favorites';

interface FavoriteButtonProps {
  challengeId: string;
  disabled?: boolean;
  size?: 'small' | 'medium' | 'large';
}

export default function FavoriteButton({ challengeId, disabled = false, size = 'small' }: FavoriteButtonProps) {
  // Local state for immediate UI updates
  const [isLocalFavorite, setIsLocalFavorite] = useState(false);
  
  // API hooks
  const { data: isFavorite } = useGetFavoriteStatusQuery(challengeId);
  const [saveChallenge, { isLoading: isSaving }] = useSaveChallengeMutation();
  const [unsaveChallenge, { isLoading: isUnsaving }] = useUnsaveChallengeMutation();

  // Initialize local state from localStorage and API
  useEffect(() => {
    const storedFavorite = isFavoriteInStorage(challengeId);
    setIsLocalFavorite(storedFavorite || isFavorite || false);
  }, [challengeId, isFavorite]);

  const handleBookmark = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (disabled || isSaving || isUnsaving) return;
    
    // Update local state immediately
    setIsLocalFavorite(!isLocalFavorite);
    
    try {
      if (isLocalFavorite) {
        await unsaveChallenge(challengeId).unwrap();
      } else {
        await saveChallenge(challengeId).unwrap();
      }
    } catch (error) {
      // Revert local state on error
      setIsLocalFavorite(isLocalFavorite);
      console.error('Failed to toggle bookmark:', error);
    }
  };

  return (
    <IconButton
      onClick={handleBookmark}
      size={size}
      disabled={disabled || isSaving || isUnsaving}
      sx={{ 
        p: 0,
        color: '#9CA3AF',
        '&:hover': !disabled ? {
          color: '#FFD700'
        } : {},
        '&.Mui-disabled': {
          color: '#9CA3AF'
        }
      }}
    >
      {isLocalFavorite ? (
        <BookmarkIcon sx={{ fontSize: size === 'small' ? 20 : 24, color: disabled ? '#9CA3AF' : '#FFD700' }} />
      ) : (
        <BookmarkBorderIcon sx={{ fontSize: size === 'small' ? 20 : 24 }} />
      )}
    </IconButton>
  );
} 