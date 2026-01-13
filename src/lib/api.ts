interface CubeState {
  pieces: Array<{
    position: [number, number, number];
    colors: string[];
  }>;
}

export interface RotationPayload {
  move: string;
  cubeState: CubeState;
}

export interface ScramblePayload {
  movesCount: number;
  cubeState: CubeState;
}

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000';

export async function initiateRotation(payload: RotationPayload) {
    console.log("Posting data:", payload);
    const data = JSON.stringify(payload);
    console.log("Serialized data:", data);
  const res = await fetch(`${BASE_URL}/rotate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: data,
  });
  if (!res.ok) throw new Error('Request failed');
  return res.json();
}

export async function initiateScramble(payload: ScramblePayload) {
    console.log("Posting data for scramble:", payload);
    const data = JSON.stringify(payload);
    console.log("Serialized scramble data:", data);
  const res = await fetch(`${BASE_URL}/scramble`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: data,
  });
  if (!res.ok) throw new Error('Request failed');
  return res.json();
}