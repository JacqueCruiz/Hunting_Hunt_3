export class ScopeController {
  private startedAt = performance.now()

  getOffset(now = performance.now(), amplitude = 8) {
    const elapsed = (now - this.startedAt) / 1000
    return {
      x: Math.sin(elapsed * 1.55) * amplitude + Math.sin(elapsed * 3.1) * 1.5,
      y: Math.cos(elapsed * 1.2) * amplitude * 0.7,
    }
  }
}
