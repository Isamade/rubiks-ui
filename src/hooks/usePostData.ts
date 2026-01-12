import { useState } from 'react';
import { initiateRotation, initiateScramble, RotationPayload, ScramblePayload } from '../lib/api';

export function usePostData() {
  const [loadingRotation, setLoadingRotation] = useState(false);
  const [rotationError, setRotationError] = useState<Error | null>(null);

  const [loadingScramble, setLoadingScramble] = useState(false);
  const [scrambleError, setScrambleError] = useState<Error | null>(null);

  const rotate = async (payload: RotationPayload) => {
    setLoadingRotation(true); setRotationError(null);
    try {
      const result = await initiateRotation(payload);
      return result;
    } catch (e) {
      setRotationError(e as Error);
      throw e;
    } finally {
      setLoadingRotation(false);
    }
  };

  const scramble = async (payload: ScramblePayload) => {
    setLoadingScramble(true); setScrambleError(null);
    try {
      const result = await initiateScramble(payload);
      return result;
    } catch (e) {
      setScrambleError(e as Error);
      throw e;
    } finally {
      setLoadingScramble(false);
    }
  };

  return { rotate, loadingRotation, rotationError, scramble, loadingScramble, scrambleError };
}