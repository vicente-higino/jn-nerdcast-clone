import { FilterItemsDict } from "./FilterContext";

export function formatTime(timeInSeconds: number): string {
  return new Date(timeInSeconds * 1000).toTimeString().replace(/.*(\d{2}:\d{2}).*/, "$1");
}

export const formatDuration = (s: number) => {
  const hours = ((s - s % 3600) / 3600) % 60
  const minutes = ((s - s % 60) / 60) % 60
  if (hours > 0) {
    return hours === 1 ? `${hours} hora e ${minutes} minutos` : `${hours} horas e ${minutes} minutos`;
  }
  return `${minutes} minutos`;
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

export function countTrueValues(filter: FilterItemsDict): number {
  return Object.values(filter).reduce((prev, curr) => curr ? prev + 1 : prev, 0);
}

export function checkIfAllFiltersAreTrue(filter: FilterItemsDict) {
  return Object.values(filter).length === countTrueValues(filter);
}

export function isFilterItemsDict(obj: object): obj is FilterItemsDict {
  for (const [key, value] of Object.entries(obj)) {
    if (typeof key !== "string" || typeof value !== "boolean")
      return false;
  }
  return true;
}