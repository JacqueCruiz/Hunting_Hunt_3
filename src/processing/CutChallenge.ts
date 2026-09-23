import type { Organ } from '../data/game'

export interface ProcessingResult {
  organ: Organ
  quality: number
  kept: boolean
}

export function processPart(organ: Organ, cutAccuracy: number): ProcessingResult {
  return {
    organ,
    quality: Math.max(0, Math.min(100, Math.round(cutAccuracy))),
    kept: cutAccuracy >= 45,
  }
}
