export function calculateBST(stats: Stats): number {
  return Object.values(stats).reduce((bst, value: unknown) => {
    if (value) {
      bst += parseInt(value as string);
    }
    return bst;
  }, 0);
}

export function containsMatch(a: string, b: string): boolean {
  if (!a || !b) return false;
  return a.toLowerCase().includes(b.toLowerCase());
}
