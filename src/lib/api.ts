interface CubeState {
  pieces: Array<{
    position: [number, number, number];
    colors: string[];
  }>;
}

export interface MyPayload {
  move: string;
  cubeState: CubeState;
}

export async function postData(payload: MyPayload) {
    console.log("Posting data:", payload);
  const res = await fetch('/api/endpoint', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Request failed');
  return res.json();
}