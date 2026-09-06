import { forwardRef, useRef } from 'react';
import { steps } from '../content/copy';
import { useStage } from '../hooks/useStage';
import type { StageKey } from '../scene/store';

const keys: StageKey[] = ['dim', 'sort', 'product', 'evidence', 'recency', 'merge'];

function Step({ i, active }: { i: number; active: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  useStage(keys[i], ref, 'top 70%', 'bottom 60%', active);
  const s = steps[i];
  return (
    <div className="step" ref={ref}>
      <div className="num mono" data-step={i}>{s.n}</div>
      <div>
        <h3>{s.t}</h3>
        <p>{s.q}</p>
        <div className="signal"><b>Signals</b> · {s.s}</div>
      </div>
    </div>
  );
}

export const System = forwardRef<HTMLElement, { active: boolean }>(function System({ active }, ref) {
  return (
    <section id="system" ref={ref} aria-labelledby="h-system">
      <div className="label reveal">02 — The verification system</div>
      <h2 id="h-system" className="h-l reveal">Every record must survive the evidence test.</h2>
      <p className="lede reveal" style={{ marginTop: 22 }}>Six questions, asked in order, each answered from a public source or marked unresolved. A record that fails early is not researched further — that is where the time goes back into the records that matter.</p>
      <div className="steps">{steps.map((_, i) => <Step key={i} i={i} active={active} />)}</div>
    </section>
  );
});
