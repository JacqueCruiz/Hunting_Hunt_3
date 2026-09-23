import type { Organ } from '../data/game'

export type InventoryItem = {
  id: string
  label: string
  quality: number
  color: string
}

export type WeaponSpec = {
  id: string
  name: string
  level: number
  accuracy: number
  description: string
}

export type UpgradeSpec = {
  id: string
  name: string
  effect: string
  cost: number
}

export const startingInventory: InventoryItem[] = [
  { id: 'hide', label: 'Hide', quality: 74, color: '#dca26d' },
  { id: 'meat', label: 'Meat', quality: 68, color: '#b76553' },
]

export function getWeaponStats(level: number, weaponCatalog: WeaponSpec[]) {
  const index = Math.min(Math.max(level - 1, 0), weaponCatalog.length - 1)
  return weaponCatalog[index]
}

export function awardSuppliesFromInventory(items: InventoryItem[]) {
  return items.reduce((total, item) => total + Math.round(item.quality / 10), 0)
}

export function buildProcessingEntry(organ: Organ, quality: number, itemColor: string): InventoryItem {
  return {
    id: `${organ}-${Date.now()}`,
    label: organ[0].toUpperCase() + organ.slice(1),
    quality,
    color: itemColor,
  }
}
