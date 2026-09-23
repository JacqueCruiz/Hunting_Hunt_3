import { useMemo, useState } from 'react'
import { organInfo, starterAnimal, type GamePhase, type Organ } from './data/game'
import { processingOrder, upgrades, weapons } from './data/content'
import { resolveShot } from './hunting/ShotResolver'
import { processPart } from './processing/CutChallenge'
import { useScopeSway } from './hooks/useScopeSway'
import { awardSuppliesFromInventory, buildProcessingEntry, getWeaponStats, startingInventory, type InventoryItem } from './game/GameState'

function AnatomyPanel({ onSelect, selected }: { onSelect: (organ: Organ) => void; selected: Organ }) {
  return <aside className="panel anatomy-panel">
    <div className="eyebrow">ANATOMY SENSE</div><h2>Vital map</h2>
    <p className="muted">Choose the organ most likely to secure a clean, profitable takedown.</p>
    <div className="organ-list">{(Object.keys(organInfo) as Organ[]).map((organ) => {
      const item = organInfo[organ]
      return <button key={organ} className={`organ-button ${selected === organ ? 'selected' : ''}`} onClick={() => onSelect(organ)}>
        <span className="organ-icon" style={{ color: item.color }}>{item.icon}</span><span><strong>{item.label}</strong><small>{organ === 'heart' || organ === 'brain' ? 'Clean takedown' : 'Resource harvest'}</small></span>
      </button>
    })}</div>
  </aside>
}

function Scope({ active, selected, onFire }: { active: boolean; selected: Organ; onFire: () => void }) {
  const sway = useScopeSway(active)
  return <div className={`scope ${active ? 'scope-active' : ''}`}>
    <div className="scope-sky"><div className="mountain mountain-back" /><div className="mountain mountain-front" /><div className="animal-silhouette" /></div>
    {active && <div className="reticle" style={{ transform: `translate(${sway.x}px, ${sway.y}px)` }}><span /><i /><b /></div>}
    <div className="scope-label">{active ? `TRACKING ${selected.toUpperCase()}` : 'PRESS AIM TO SCOUT'}</div>
    <button className="aim-button" onClick={onFire}>{active ? 'FIRE' : 'AIM DOWN SIGHTS'}</button>
  </div>
}

function TrackingScene({ onTravel }: { onTravel: () => void }) {
  return <section className="tracking-panel panel"><div className="eyebrow">FIELD TRAIL</div><h2>Blood and broken brush</h2>
    <div className="trail-card"><div className="trail-line"><span className="dot dot-1" /><span className="dot dot-2" /><span className="dot dot-3" /><span className="dot dot-4" /></div></div>
    <p className="muted">The animal crossed the ridge and headed into the pines. Follow the trail before the weather turns.</p>
    <button className="primary-button wide" onClick={onTravel}>TRAVEL TO BODY</button>
  </section>
}

function ProcessingScene({ onFinish }: { onFinish: (kept: InventoryItem[]) => void }) {
  const [index, setIndex] = useState(0)
  const [kept, setKept] = useState<InventoryItem[]>([])
  const current = processingOrder[index]
  const item = organInfo[current]

  const finishPart = () => {
    const result = processPart(current, 78 - index * 7)
    const nextPart = buildProcessingEntry(current, result.quality, item.color)
    if (result.kept) setKept((previous) => [...previous, nextPart])
    if (index < processingOrder.length - 1) { setIndex(index + 1); return }
    onFinish(kept.concat(result.kept ? [nextPart] : []))
  }

  return <main className="processing-view"><div className="processing-art"><div className="table"><div className="carcass" /></div><div className="knife" /></div>
    <section className="panel processing-card"><div className="eyebrow">HOME / PROCESSING TABLE</div><h1>Careful hands</h1><p className="muted">Follow the highlighted cut line. Quality decides what the camp can preserve.</p>
      <div className="progress"><span style={{ width: `${((index + 1) / processingOrder.length) * 100}%` }} /></div>
      <div className="current-part"><span className="large-organ" style={{ color: item.color }}>{item.icon}</span><div><div className="eyebrow">PART {index + 1} OF {processingOrder.length}</div><h2>{item.label}</h2><p className="muted">Make a steady, controlled cut.</p></div></div>
      <button className="primary-button" onClick={finishPart}>{index === processingOrder.length - 1 ? 'FINISH PROCESSING' : `CUT ${item.label.toUpperCase()}`}</button>
      <div className="kept-list">Kept: {kept.length ? kept.map((part) => part.label).join(' · ') : 'Nothing yet'}</div>
    </section>
  </main>
}

export default function App() {
  const [phase, setPhase] = useState<GamePhase>('hunt')
  const [aiming, setAiming] = useState(false)
  const [selected, setSelected] = useState<Organ>('heart')
  const [supplies, setSupplies] = useState(120)
  const [weaponLevel, setWeaponLevel] = useState(1)
  const [ownedUpgrades, setOwnedUpgrades] = useState<string[]>(['stock'])
  const [inventory, setInventory] = useState<InventoryItem[]>(startingInventory)
  const [notice, setNotice] = useState('The forest is still. Take your shot when you have a clean lane.')
  const weapon = getWeaponStats(weaponLevel, weapons)
  const phaseLabel = useMemo(() => phase === 'hunt' ? 'PINEBREAK VALLEY' : phase === 'tracking' ? 'FOLLOW THE TRAIL' : 'HOME CAMP', [phase])

  const handleUpgrade = (upgradeId: string) => {
    const upgrade = upgrades.find((item) => item.id === upgradeId)
    if (!upgrade || ownedUpgrades.includes(upgradeId)) return
    if (supplies < upgrade.cost) { setNotice(`You need ${upgrade.cost - supplies} more supplies for ${upgrade.name}.`); return }
    setSupplies((current) => current - upgrade.cost); setOwnedUpgrades((current) => [...current, upgradeId]); setNotice(`${upgrade.name} installed. ${upgrade.effect}.`)
  }

  const handleFire = () => {
    if (!aiming) { setAiming(true); setNotice(`Aiming at ${selected}. Stay calm and let the breath settle.`); return }
    const result = resolveShot(starterAnimal, selected, 82 + (weaponLevel - 1) * 8 - (ownedUpgrades.includes('stock') ? 4 : 0))
    setAiming(false); setNotice(result.message); setPhase(result.clean ? 'processing' : 'tracking')
  }

  const handleProcessingComplete = (kept: InventoryItem[]) => {
    setInventory((current) => [...current, ...kept]); setSupplies((current) => current + awardSuppliesFromInventory(kept)); setNotice(`Processing complete. ${kept.length} pieces preserved for the camp.`); setPhase('hunt')
  }

  if (phase === 'processing') return <ProcessingScene onFinish={handleProcessingComplete} />

  return <div className="app-shell"><header className="topbar"><div className="brand-mark">HH<span>3</span></div><div><div className="eyebrow">CURRENT EXPEDITION</div><strong>{phaseLabel}</strong></div><div className="resource-pill">◎ {supplies} supplies</div></header>
    <main className="game-layout"><section className="game-column"><Scope active={aiming} selected={selected} onFire={handleFire} />
      <div className="status-row"><div className="panel notice"><span className="status-dot" />{notice}</div><button className="secondary-button" onClick={() => setAiming((value) => !value)}>{aiming ? 'LOWER SCOPE' : 'READY RIFLE'}</button></div>
      {phase === 'tracking' && <TrackingScene onTravel={() => setPhase('processing')} />}
      {phase === 'hunt' && <button className="primary-button wide" onClick={() => setNotice('Good angle. Aim for a vital organ and wait for the breath to settle.')}>PLAN NEXT SHOT</button>}
    </section>
    <aside className="side-column"><AnatomyPanel selected={selected} onSelect={setSelected} />
      <div className="panel weapon-panel"><div className="eyebrow">WEAPON</div><h3>{weapon.name}</h3><p className="muted">{weapon.description}</p><div className="stat-row"><span>Accuracy</span><strong>{weapon.accuracy}</strong></div><div className="stat-row"><span>Level</span><strong>{weapon.level}</strong></div><button className="secondary-button" onClick={() => setWeaponLevel((current) => Math.min(current + 1, weapons.length))}>UPGRADE GUN</button></div>
      <div className="panel inventory-panel"><div className="eyebrow">FIELD CACHE</div><h3>Inventory</h3><div className="inventory-list">{inventory.map((item) => <div key={item.id} className="inventory-item"><span className="inventory-color" style={{ background: item.color }} /><span>{item.label}</span><strong>{item.quality}%</strong></div>)}</div></div>
      <div className="panel upgrades-panel"><div className="eyebrow">GEAR</div><h3>Upgrades</h3><div className="upgrade-list">{upgrades.map((upgrade) => <button key={upgrade.id} className={`upgrade-item ${ownedUpgrades.includes(upgrade.id) ? 'owned' : ''}`} onClick={() => handleUpgrade(upgrade.id)}><div><strong>{upgrade.name}</strong><small>{upgrade.effect}</small></div><span>{ownedUpgrades.includes(upgrade.id) ? 'Owned' : `${upgrade.cost}¢`}</span></button>)}</div></div>
    </aside></main><footer><span>WASD / TOUCH TO MOVE</span><span>ACCESSIBILITY: LARGE UI · REDUCED MOTION READY</span></footer></div>
}
