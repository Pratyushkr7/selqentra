import { forwardRef } from 'react';
import { products } from '../content/copy';

export const Receive = forwardRef<HTMLElement>(function Receive(_, ref) {
  return (
    <section id="receive" ref={ref} aria-labelledby="h-receive">
      <div className="wrap">
        <div className="label reveal">04 — What you receive</div>
        <h2 id="h-receive" className="h-l reveal">A decision-ready audit, not another research dump.</h2>
        <p className="lede reveal" style={{ marginTop: 22 }}>Three outputs, built to be acted on the day they arrive. Previews below use fictional records.</p>
        <div className="products" role="list">
          <div className="product" role="listitem">
            <div className="ph"><h3>{products[0].t}</h3><span className="n">{products[0].n}</span></div>
            <div className="viz" aria-label="Preview of the Verified Evidence Register: fictional records with confidence bars">
              {[['R-014', 'Manufacturer', 91, 'ok'], ['R-027', 'Trader', 86, 'ok'], ['R-041', 'Unclear', 52, ''], ['R-058', 'Distributor', 88, 'ok'], ['R-072', 'Unsupported', 12, 'bad']].map(([id, cls, w, st]) => (
                <div className="row" key={id as string}><span className="id">{id}</span><span className="bar"><i style={{ ['--w' as string]: `${w}%` }} /></span><span className={`st ${st}`}>{cls}</span></div>
              ))}
            </div>
            <p>{products[0].d}</p>
          </div>
          <div className="product" role="listitem">
            <div className="ph"><h3>{products[1].t}</h3><span className="n">{products[1].n}</span></div>
            <div className="viz" aria-label="Preview of the Executive Decision Brief: dataset health and priorities, fictional figures">
              <div className="kv"><span>Dataset health · 30 records</span></div>
              <div className="health"><i className="a" style={{ ['--w' as string]: '60%' }} /><i className="b" style={{ ['--w' as string]: '13%' }} /><i className="c" style={{ ['--w' as string]: '27%' }} /></div>
              <div className="kv"><span>Verified</span><b>18</b></div>
              <div className="kv"><span>Needs review</span><b>4</b></div>
              <div className="kv"><span>Unsupported or duplicate</span><b>8</b></div>
              <div className="kv" style={{ borderBottom: 0 }}><span>Top pattern</span><b>Role misclassification</b></div>
            </div>
            <p>{products[1].d}</p>
          </div>
          <div className="product" role="listitem">
            <div className="ph"><h3>{products[2].t}</h3><span className="n">{products[2].n}</span></div>
            <div className="viz" aria-label="Preview of the Exception Queue: records separated for human review, fictional">
              <div className="q">
                <div className="hot"><span>R-041</span><span>Plant unverified</span><span>Review</span></div>
                <div className="hot"><span>R-063</span><span>Duplicate of R-019</span><span>Merge</span></div>
                <div><span>R-072</span><span>Source inaccessible</span><span>Remove</span></div>
                <div><span>R-027</span><span>Role contradicted</span><span>Reclassify</span></div>
              </div>
            </div>
            <p>{products[2].d}</p>
          </div>
        </div>
        <p className="fic-note reveal" style={{ marginTop: 14 }}>Previews are fictional and illustrate structure only.</p>
      </div>
    </section>
  );
});
