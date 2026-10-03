/** Tiny class-name joiner (keeps JSX readable without pulling in a dependency). */
export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}
