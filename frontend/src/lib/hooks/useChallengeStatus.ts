import { useCallback, useEffect, useState } from 'react';
import { challengesApi, ChallengeStatus } from '../api/challenges';

interface UseChallengeStatusReturn {
  status: ChallengeStatus | null;
  loading: boolean;
  error: string | null;
  updateStatus: (
    action: 'accept' | 'submit_proof' | 'approve' | 'reject',
    proofData?: { proofUrl?: string; description?: string; proofType?: 'image' | 'video' }
  ) => Promise<void>;
  refetch: () => Promise<void>;
}

export function useChallengeStatus(challengeId: string): UseChallengeStatusReturn {
  const [status, setStatus] = useState<ChallengeStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Функция для получения статуса задания
  const fetchStatus = useCallback(async () => {
    if (!challengeId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await challengesApi.getChallengeStatus(challengeId);
      
      if (response.error) {
        setError(response.error);
      } else {
        setStatus(response.data);
      }
    } catch (err) {
      setError('Failed to fetch challenge status');
      console.error('Error fetching challenge status:', err);
    } finally {
      setLoading(false);
    }
  }, [challengeId]);

  // Функция для обновления статуса задания
  const updateStatus = useCallback(async (
    action: 'accept' | 'submit_proof' | 'approve' | 'reject',
    proofData?: { proofUrl?: string; description?: string; proofType?: 'image' | 'video' }
  ) => {
    if (!challengeId) return;
    
    setError(null);
    
    try {
      const response = await challengesApi.updateChallengeStatus(
        challengeId,
        action,
        proofData
      );
      
      if (response.error) {
        setError(response.error);
        throw new Error(response.error);
      } else {
        // Обновляем статус после успешного изменения
        await fetchStatus();
      }
    } catch (err) {
      setError('Failed to update challenge status');
      console.error('Error updating challenge status:', err);
      throw err;
    }
  }, [challengeId, fetchStatus]);

  const refetch = useCallback(async () => {
    await fetchStatus();
  }, [fetchStatus]);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  useEffect(() => {
    const handleUserUpdate = () => {
      fetchStatus();
    };

    window.addEventListener('userUpdated', handleUserUpdate);
    
    return () => {
      window.removeEventListener('userUpdated', handleUserUpdate);
    };
  }, [fetchStatus]);

  return {
    status,
    loading,
    error,
    updateStatus,
    refetch
  };
} 