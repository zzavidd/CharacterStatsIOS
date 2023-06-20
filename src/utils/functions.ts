export function calculateBST(character: Character): number {
  return Object.values(character.stats).reduce((bst, value: unknown) => {
    if (value) {
      bst += parseInt(value as string);
    }
    return bst;
  }, 0);
}
