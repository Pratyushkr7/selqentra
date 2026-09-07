import { forwardRef } from 'react';
import { outputs } from '../content/copy';

export const Receive = forwardRef<HTMLElement>(function Receive(_, ref) {
  return (
    <section id="receive" ref={ref} aria-labelledby="h-receive">
      <div className="wrap">
        <div className="label reveal">04 — What you receive</div>
        <h2 id="h-receive" className="h-l reveal">A landscape you can act on, not a directory printout.</h2>
        <p className="lede reveal" style={{ marginTop: 22 }}>Three outputs, built to shorten the next conversation. Previews use fictional records.</p>
        <div className="products" role="list">
          <div className="product ember" role="listitem">
            <div className="ph"><h3>{outputs[0].t}</h3><span className="n">{outputs[0].n}</span></div>
            <div className="viz" aria-label="Preview of the Verified Source Map: fictional sources with role and confidence">
              {[['Norvane Intermediates', 'IN', 'Manufacturer', 91, 'ok'], ['Qiloma Fine Chemical', 'CN', 'Manufacturer', 84, 'ok'], ['Velmark Specialty', 'US', 'Distributor', 88, 'd'], ['Tessaro Chem Handel', 'DE', 'Trader', 86, 'bad'], ['Arundel Polymers', 'IN', 'Manufacturer', 79, 'ok']].map(([co, cc, cls, w, st]) => (
                <div className="row" key={co as string}><span className="id">{co} · {cc}</span><span className="bar"><i style={{ ['--w' as string]: `${w}%` }} /></span><span className={`st ${st}`}>{cls}</span></div>
              ))}
            </div>
            <p>{outputs[0].d}</p>
          </div>
          <div className="product line" role="listitem">
            <div className="ph"><h3>{outputs[1].t}</h3><span className="n">{outputs[1].n}</span></div>
            <div className="viz" aria-label="Preview of the Trade Flow Summary: illustrative export shares">
              <div className="kv"><span>Export share · illustrative</span></div>
              {[['China', 62], ['India', 12], ['Italy', 9], ['United States', 7], ['Germany', 5]].map(([c, w]) => (
                <div className="row" key={c as string}><span className="id" style={{ minWidth: 92 }}>{c}</span><span className="bar"><i style={{ ['--w' as string]: `${w}%` }} /></span><span className="st ok">{w}%</span></div>
              ))}
            </div>
            <p>{outputs[1].d}</p>
          </div>
          <div className="product line" role="listitem">
            <div className="ph"><h3>{outputs[2].t}</h3><span className="n">{outputs[2].n}</span></div>
            <div className="viz" aria-label="Preview of the Sourcing Recommendation: fictional">
              <div className="q">
                <div className="hot"><span>1</span><span>Norvane Intermediates · IN</span><span>Approach first</span></div>
                <div className="hot"><span>2</span><span>Qiloma Fine Chemical · CN</span><span>Approach · confirm plant</span></div>
                <div><span>3</span><span>Velmark Specialty · US</span><span>Channel for trials</span></div>
                <div><span>—</span><span>Tessaro Chem Handel · DE</span><span>Trader · price reference only</span></div>
              </div>
            </div>
            <p>{outputs[2].d}</p>
          </div>
        </div>
        <p className="fic-note reveal" style={{ marginTop: 14 }}>Previews are fictional and illustrate structure only.</p>
      </div>
    </section>
  );
});
