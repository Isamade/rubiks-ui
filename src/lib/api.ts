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

export async function initiateRotation(payload: RotationPayload) {
    console.log("Posting data:", payload);
    const data = JSON.stringify(payload);
    console.log("Serialized data:", data);
  const res = await fetch('http://localhost:8000/rotate', {
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
  const res = await fetch('http://localhost:8000/scramble', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: data,
  });
  if (!res.ok) throw new Error('Request failed');
  return res.json();
}