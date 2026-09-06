/** Static resolved lattice — used when WebGL is unavailable or motion is reduced. */
export function Fallback({ label = 'Resolved audit matrix — 30 records' }: { label?: string }) {
  const cols = 6, rows = 5, sp = 56, x0 = 60, y0 = 44;
  const kinds = ['m','m','t','m','u','m','m','t','m','m','m','d','m','t','m','u','m','m','t','m','m','m','u','m','t','m','m','m','t','u'];
  const color = (k: string) => (k === 'u' ? '#9277FF' : k === 'd' ? '#8792A3' : '#5577FF');
  return (
    <div className="fallback" role="img" aria-label={label}>
      <svg viewBox="0 0 420 300" xmlns="http://www.w3.org/2000/svg">
        <rect width="420" height="300" fill="#070A12" />
        {Array.from({ length: rows }).map((_, r) => (
          <line key={`h${r}`} x1={x0 - 20} x2={x0 + (cols - 1) * sp + 20} y1={y0 + r * sp} y2={y0 + r * sp} stroke="#8792A3" strokeOpacity=".16" />
        ))}
        {kinds.map((k, i) => {
          const c = i % cols, r = Math.floor(i / cols); const cx = x0 + c * sp, cy = y0 + r * sp; const conf = k === 'u' ? 0.5 : 0.9;
          const ang = conf * Math.PI * 2; const ex = cx + Math.sin(ang) * 11, ey = cy - Math.cos(ang) * 11; const large = ang > Math.PI ? 1 : 0;
          return (
            <g key={i}>
              <circle cx={cx} cy={cy} r="4.2" fill={color(k)} />
              <path d={`M ${cx} ${cy - 11} A 11 11 0 ${large} 1 ${ex} ${ey}`} stroke={color(k)} strokeOpacity=".7" strokeWidth="1.4" fill="none" />
            </g>
          );
        })}
        <text x="24" y="284" fill="#8792A3" fontFamily="'Plex Mono', ui-monospace, monospace" fontSize="9" letterSpacing="1.4">RECORDS 150 → SURVIVING 30 · UNRESOLVED 4</text>
      </svg>
    </div>
  );
}
