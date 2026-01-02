import { useState } from 'react';
import { postData, MyPayload } from '../lib/api';

export function usePostData() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const send = async (payload: MyPayload) => {
    setLoading(true); setError(null);
    try {
      const result = await postData(payload);
      return result;
    } catch (e) {
      setError(e as Error);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return { send, loading, error };
}