/** Static resolved matrix — used when WebGL is unavailable, fails, or motion is reduced. */
export function Fallback({ label = 'Thirty records resolved into a verified matrix' }: { label?: string }) {
  const cols = 6, rows = 5, sp = 62, x0 = 55, y0 = 40;
  const unclear = new Set([4, 11, 17, 22]);
  return (
    <div className="fallback" role="img" aria-label={label}>
      <svg viewBox="0 0 420 300" xmlns="http://www.w3.org/2000/svg">
        <rect width="420" height="300" fill="#070706" />
        {Array.from({ length: rows }).map((_, r) => <line key={r} x1={x0 - 22} x2={x0 + (cols - 1) * sp + 22} y1={y0 + r * sp} y2={y0 + r * sp} stroke="#9C968E" strokeOpacity=".18" />)}
        {Array.from({ length: 30 }).map((_, i) => {
          const c = i % cols, r = Math.floor(i / cols); const cx = x0 + c * sp, cy = y0 + r * sp; const u = unclear.has(i); const conf = u ? 0.5 : 0.9; const col = u ? '#CFCAC1' : '#FF5900';
          const ang = conf * Math.PI * 2; const ex = cx + Math.sin(ang) * 11, ey = cy - Math.cos(ang) * 11;
          return (<g key={i}><circle cx={cx} cy={cy} r="4.4" fill={col} /><path d={`M ${cx} ${cy - 11} A 11 11 0 ${ang > Math.PI ? 1 : 0} 1 ${ex} ${ey}`} stroke={col} strokeOpacity=".7" strokeWidth="1.4" fill="none" /></g>);
        })}
        <text x="22" y="286" fill="#9C968E" fontFamily="'Plex Mono', ui-monospace, monospace" fontSize="9" letterSpacing="1.4">30 RECORDS · VERIFIED MATRIX · 4 UNRESOLVED</text>
      </svg>
    </div>
  );
}
