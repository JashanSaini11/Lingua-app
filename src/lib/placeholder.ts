// Placeholder pictures for units and lessons until real artwork is added.
// The same `seed` always returns the same picture.
export function getPlaceholderImage(
  seed: string,
  width = 400,
  height = width,
): string {
  return `https://picsum.photos/seed/${seed}/${width}/${height}`;
}
