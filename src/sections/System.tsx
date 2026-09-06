import { forwardRef, useCallback, useRef, useState } from 'react';
import { steps } from '../content/copy';
import { EvidenceDiagram } from './EvidenceDiagram';

export const System = forwardRef<HTMLElement, { active: boolean }>(function System({ active }, ref) {
  const stepsRef = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(0);
  const onStep = useCallback((i: number) => setOn(i), []);
  return (
    <section id="system" ref={ref} aria-labelledby="h-system">
      <div className="wrap">
        <div className="label reveal">02 — The verification system</div>
        <h2 id="h-system" className="h-l reveal">Every record must survive the evidence test.</h2>
        <p className="lede reveal" style={{ marginTop: 22 }}>Six questions, asked in order, each answered from a public source or marked unresolved. A record that fails early is not researched further — that time goes back into the records that matter.</p>
        <div className="evgrid">
          <EvidenceDiagram stepsRef={stepsRef} active={active} onStep={onStep} />
          <div className="steps" ref={stepsRef}>
            {steps.map((s, i) => (
              <div className={`step ${on === i ? 'on' : ''}`} key={s.n}>
                <div className="num mono">{s.n}</div>
                <div><h3>{s.t}</h3><p>{s.q}</p><div className="signal"><b>Signals</b> · {s.s}</div></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
});
