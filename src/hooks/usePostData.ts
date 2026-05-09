import { useState } from 'react';
import { initiateRotation, initiateScramble, initiateSolve, initiateSaveSolution, RotationPayload, ScramblePayload, SaveSolutionPayload, CubeState } from '../lib/api';

export function usePostData() {
  const [loadingRotation, setLoadingRotation] = useState(false);
  const [rotationError, setRotationError] = useState<Error | null>(null);

  const [loadingScramble, setLoadingScramble] = useState(false);
  const [scrambleError, setScrambleError] = useState<Error | null>(null);

  const [loadingSolve, setLoadingSolve] = useState(false);
  const [solveError, setSolveError] = useState<Error | null>(null);

  const [loadingSave, setLoadingSave] = useState(false);
  const [saveError, setSaveError] = useState<Error | null>(null);

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

  const solve = async (cubeState: CubeState) => {
    setLoadingSolve(true); setSolveError(null);
    try {
      const result = await initiateSolve({ cubeState });
      return result;
    } catch (e) {
      setSolveError(e as Error);
      throw e;
    } finally {
      setLoadingSolve(false);
    }
  };

  const saveSolution = async (payload: SaveSolutionPayload) => {
    setLoadingSave(true); setSaveError(null);
    try {
      const result = await initiateSaveSolution(payload);
      return result;
    } catch (e) {
      setSaveError(e as Error);
      throw e;
    } finally {
      setLoadingSave(false);
    }
  };

  return { rotate, loadingRotation, rotationError, scramble, loadingScramble, scrambleError, solve, loadingSolve, solveError, saveSolution, loadingSave, saveError };
}