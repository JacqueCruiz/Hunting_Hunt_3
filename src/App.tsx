import { useMemo, useState } from 'react'
import { organInfo, starterAnimal, type GamePhase, type Organ } from './data/game'
import { processingOrder } from './data/content'
import { resolveShot } from './hunting/ShotResolver'
import { processPart } from './processing/CutChallenge'
import { useScopeSway } from './hooks/useScopeSway'

function AnatomyPanel({ onSelect, selected }: { onSelect: (organ: Organ) => void; selected: Organ }) {
  return <aside className="anatomy-panel panel">
    <div className="eyebrow">ANATOMY SENSE</div>
    <h2>Vital map</h2>
    <p className="muted">Choose a target zone before taking the shot.</p>
    <div className="organ-list">
      {(Object.keys(organInfo) as Organ[]).map((organ) => {
        const item = organInfo[organ]
        return <button key={organ} className={`organ-button ${selected === organ ? 'selected' : ''}`} onClick={() => onSelect(organ)}>
          <span className="organ-icon" style={{ color: item.color }}>{item.icon}</span>
          <span><strong>{item.label}</strong><small>{organ === 'heart' || organ === 'brain' ? 'Clean takedown' : 'Harvest target'}</small></span>
        </button>
      })}
    </div>
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

function ProcessingScene({ onFinish }: { onFinish: () => void }) {
  const [index, setIndex] = useState(0)
  const [kept, setKept] = useState<Organ[]>([])
  const current = processingOrder[index]
  const item = organInfo[current]
  const finishPart = () => {
    const result = processPart(current, 78 - index * 7)
    if (result.kept) setKept((previous) => [...previous, current])
    if (index < processingOrder.length - 1) setIndex(index + 1)
    else onFinish()
  }

  return <main className="processing-view">
    <div className="processing-art"><div className="table"><div className="carcass" /></div><div className="knife" /></div>
    <section className="panel processing-card">
      <div className="eyebrow">HOME / PROCESSING TABLE</div>
      <h1>Careful hands</h1>
      <p className="muted">Follow the highlighted cut line. Quality affects what you can keep.</p>
      <div className="progress"><span style={{ width: `${((index + 1) / processingOrder.length) * 100}%` }} /></div>
      <div className="current-part"><span className="large-organ" style={{ color: item.color }}>{item.icon}</span><div><div className="eyebrow">PART {index + 1} OF {processingOrder.length}</div><h2>{item.label}</h2><p className="muted">Make a steady, controlled cut.</p></div></div>
      <button className="primary-button" onClick={finishPart}>{index === processingOrder.length - 1 ? 'FINISH PROCESSING' : `CUT ${item.label.toUpperCase()}`}</button>
      <div className="kept-list">Kept: {kept.length ? kept.map((part) => organInfo[part].label).join(' · ') : 'Nothing yet'}</div>
    </section>
  </main>
}

export default function App() {
  const [phase, setPhase] = useState<GamePhase>('hunt')
  const [aiming, setAiming] = useState(false)
  const [selected, setSelected] = useState<Organ>('heart')
  const [notice, setNotice] = useState('The valley is quiet. Find your angle.')
  const [shotQuality, setShotQuality] = useState<number | null>(null)

  const fire = () => {
    if (!aiming) { setAiming(true); return }
    const result = resolveShot(starterAnimal, selected, 82)
    setShotQuality(result.quality)
    setNotice(result.message)
    setPhase(result.clean ? 'processing' : 'tracking')
  }

  const phaseLabel = useMemo(() => phase === 'hunt' ? 'PINEBREAK VALLEY' : phase === 'tracking' ? 'FOLLOW THE TRAIL' : 'HOME CAMP', [phase])
  if (phase === 'processing') return <ProcessingScene onFinish={() => { setNotice(`Processing complete. Final shot quality: ${shotQuality}%.`); setPhase('hunt'); setShotQuality(null) }} />

  return <div className="app-shell">
    <header className="topbar"><div className="brand-mark">HH<span>3</span></div><div><div className="eyebrow">CURRENT EXPEDITION</div><strong>{phaseLabel}</strong></div><div className="resource-pill">◎ 120 supplies</div></header>
    <main className="game-layout">
      <section className="game-column"><Scope active={aiming} selected={selected} onFire={fire} /><div className="status-row"><div className="panel notice"><span className="status-dot" />{notice}</div><button className="secondary-button" onClick={() => setAiming((value) => !value)}>{aiming ? 'LOWER SCOPE' : 'READY RIFLE'}</button></div>{phase === 'tracking' && <button className="primary-button wide" onClick={() => setPhase('processing')}>TRAVEL TO THE BODY →</button>}</section>
      <AnatomyPanel selected={selected} onSelect={setSelected} />
    </main>
    <footer><span>WASD / TOUCH TO MOVE</span><span>ACCESSIBILITY: LARGE UI · REDUCED MOTION READY</span></footer>
  </div>
}
