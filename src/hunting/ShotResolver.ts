import type { Animal, Organ } from '../data/game'

export interface ShotResult {
  organ: Organ
  clean: boolean
  quality: number
  message: string
}

export function resolveShot(animal: Animal, organ: Organ, aimQuality: number): ShotResult {
  const vital = organ === 'heart' || organ === 'brain'
  const quality = Math.max(0, Math.round(aimQuality * (vital ? 1 : 0.82)))
  const clean = vital && quality >= 78

  return {
    organ,
    clean,
    quality,
    message: clean
      ? `Clean ${organ} hit. The ${animal.name} is down.`
      : `${organ} hit. Follow the trail before the weather turns.`,
  }
}
