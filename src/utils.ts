
export function formatTime(timeInSeconds: number): string {
  return new Date(timeInSeconds * 1000).toTimeString().replace(/.*(\d{2}:\d{2}).*/, "$1");
}

export function radomPercentil(min: number, max: number): string {
  const n = Math.random() * 100;
  if (n > max) {
    return `${max}%`;
  }
  if (n < min) {
    return `${min}%`;
  }
  return `${n}%`;
}