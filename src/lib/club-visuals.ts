export function getClubMonogram(name: string): string {
  const clean = name.replace(/\s*IILM$/, "");
  const words = clean.split(/[\s&/]+/).filter(Boolean);
  const letters = words
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");
  return letters || clean.slice(0, 2).toUpperCase();
}

export function getPositionInitials(position: string): string {
  const map: Record<string, string> = {
    President: "P",
    "Vice President": "VP",
    Secretary: "S",
    Treasurer: "T",
    "Event Head": "EH",
  };
  return map[position] ?? position.slice(0, 2).toUpperCase();
}
