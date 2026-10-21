export interface LatestRequestGate {
  begin: () => number;
  isCurrent: (requestId: number) => boolean;
  cancel: (requestId: number) => void;
}

export function createLatestRequestGate(): LatestRequestGate {
  let generation = 0;
  return {
    begin: () => ++generation,
    isCurrent: (requestId) => requestId === generation,
    cancel: (requestId) => {
      if (requestId === generation) generation += 1;
    },
  };
}
