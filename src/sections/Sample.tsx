import { forwardRef, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import { sample, filters, type Rec } from '../content/sample';

const statusTag = (r: Rec) => r.status === 'verified' ? <span className="tag ok">Classified</span> : r.status === 'review' ? <span className="tag rev">Open question</span> : <span className="tag bad">Unverifiable</span>;

export const Sample = forwardRef<HTMLElement>(function Sample(_, ref) {
  const [f, setF] = useState<string>('all');
  const [open, setOpen] = useState<string | null>(null);
  const rowsRef = useRef<(HTMLTableRowElement | null)[]>([]);
  const rows = useMemo(() => sample.filter(filters.find((x) => x.id === f)!.test), [f]);

  const onKey = (e: KeyboardEvent<HTMLTableRowElement>, i: number, id: string) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setOpen(open === id ? null : id); }
    if (e.key === 'ArrowDown') { e.preventDefault(); rowsRef.current[i + 1]?.focus(); }
    if (e.key === 'ArrowUp') { e.preventDefault(); rowsRef.current[i - 1]?.focus(); }
  };

  return (
    <section id="sample" ref={ref} aria-labelledby="h-sample">
      <div className="wrap">
      <div className="label reveal">02 · Sample</div>
      <h2 id="h-sample" className="h-l reveal">See what you get before you ask for it.</h2>
      <p className="lede reveal" style={{ marginTop: 22 }}>Six companies in the format of a real report. Click any company to see the evidence behind its label, right where it sits.</p>
      <div className="demo-tag reveal" role="note"><i aria-hidden="true" />Example layout · company names are fictional</div>

      <div className="filters reveal" role="group" aria-label="Filter records">
        {filters.map((x) => { const n = sample.filter(x.test).length; return (
          <button key={x.id} className="chip" aria-pressed={f === x.id} onClick={() => { setF(x.id); setOpen(null); }}>{x.label}<span className="cnt">{n}</span></button>
        ); })}
      </div>

      <div className="twrap reveal">
        <table className="audit">
          <thead><tr>
            <th scope="col">Source</th><th scope="col" className="hide-c">Country</th><th scope="col" className="hide-m">Presents as</th><th scope="col">Classified as</th><th scope="col" className="hide-m">Product match</th><th scope="col" className="hide-c">Evidence</th><th scope="col" className="hide-m">Confidence</th><th scope="col" className="hide-m">Status</th><th scope="col">Recommended use</th>
          </tr></thead>
          <tbody>
            {rows.length === 0 && <tr><td colSpan={7} className="empty">No records match this filter.</td></tr>}
            {rows.map((r, i) => {
              const isOpen = open === r.id;
              return (
                <FragmentRow key={r.id} r={r} i={i} isOpen={isOpen} onKey={onKey} toggle={() => setOpen(isOpen ? null : r.id)} rowsRef={rowsRef} />
              );
            })}
          </tbody>
        </table>
      </div>
      </div>
    </section>
  );
});

function FragmentRow({ r, i, isOpen, onKey, toggle, rowsRef }: { r: Rec; i: number; isOpen: boolean; onKey: (e: KeyboardEvent<HTMLTableRowElement>, i: number, id: string) => void; toggle: () => void; rowsRef: React.MutableRefObject<(HTMLTableRowElement | null)[]> }) {
  const low = r.confidence < 0.6;
  return (
    <>
      <tr className={`rec ${isOpen ? 'sel' : ''}`} tabIndex={0} aria-expanded={isOpen} aria-controls={`ev-${r.id}`} onClick={toggle} onKeyDown={(e) => onKey(e, i, r.id)} ref={(el) => { rowsRef.current[i] = el; }}>
        <td><div className="co">{r.company}<small>{r.id} · {r.country}</small></div></td>
        <td className="m hide-c">{r.country}</td>
        <td className="m hide-m">{r.claimed}</td>
        <td><span className={`tag ${r.verified === 'Manufacturer' || r.verified === 'Distributor' ? 'ok' : r.verified === 'Unsupported' ? 'bad' : r.verified === 'Trader' ? '' : 'rev'}`}>{r.verified}</span></td>
        <td className="m hide-m">{r.product}</td>
        <td className="m hide-c">{r.evidence}</td>
        <td className="hide-m"><span className={`conf ${low ? 'low' : ''}`}><span className="bar"><i style={{ width: `${Math.round(r.confidence * 100)}%` }} /></span><span className="n">{r.confidence.toFixed(2)}</span></span></td>
        <td className="hide-m">{statusTag(r)}{r.risk !== '—' && <div className="m" style={{ marginTop: 6 }}>{r.risk}</div>}</td>
        <td style={{ maxWidth: 260 }}>{r.action}</td>
      </tr>
      {isOpen && (
        <tr className="trailrow" id={`ev-${r.id}`}>
          <td colSpan={9}>
            <div className="trail" role="list" aria-label={`Evidence trail for ${r.company}`}>
              {r.trail.map((e, k) => (
                <div key={k} className={`ev ${e.type === 'supports' ? 'sup' : e.type === 'contradicts' ? 'con' : ''}`} role="listitem">
                  <span className="d">{e.date}</span><span className="t">{e.kind}</span><span className="x">{e.note} <span className="label" style={{ fontSize: 10, marginLeft: 6 }}>{e.type}</span></span>
                </div>
              ))}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
