export type GamePhase = 'hunt' | 'tracking' | 'processing'
export type Organ = 'heart' | 'brain' | 'lungs' | 'liver'

export interface Animal {
  name: string
  health: number
  distance: number
  alertness: number
}

export const starterAnimal: Animal = {
  name: 'Timber bear',
  health: 100,
  distance: 84,
  alertness: 28,
}

export const organInfo: Record<Organ, { label: string; icon: string; color: string; quality: number }> = {
  heart: { label: 'Heart', icon: '♥', color: '#e87368', quality: 100 },
  brain: { label: 'Brain', icon: '✦', color: '#d19de8', quality: 100 },
  lungs: { label: 'Lungs', icon: '◉', color: '#e6a15e', quality: 72 },
  liver: { label: 'Liver', icon: '◆', color: '#b66b53', quality: 55 },
}
