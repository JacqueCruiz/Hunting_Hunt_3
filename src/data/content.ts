import type { Organ } from '../data/game'

export const animals = [
  { id: 'timber-bear', name: 'Timber bear', habitat: 'Pinebreak Valley', difficulty: 'Patient' },
  { id: 'red-deer', name: 'Red deer', habitat: 'Mosswater Ridge', difficulty: 'Wary' },
]

export const weapons = [
  { id: 'scout-rifle', name: 'Scout rifle', level: 1, accuracy: 0.72, description: 'A dependable field rifle.' },
  { id: 'longshot', name: 'Longshot', level: 2, accuracy: 0.9, description: 'Steadier aim and a clearer scope.' },
]

export const upgrades = [
  { id: 'stock', name: 'Balanced stock', effect: 'Less breathing sway', cost: 20 },
  { id: 'glass', name: 'Clear glass', effect: 'Better anatomy visibility', cost: 35 },
]

export const processingOrder: Organ[] = ['heart', 'brain', 'lungs', 'liver']
