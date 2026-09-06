import { forwardRef } from 'react';
import { receive } from '../content/copy';

export const Receive = forwardRef<HTMLElement>(function Receive(_, ref) {
  return (
    <section id="receive" ref={ref} aria-labelledby="h-receive">
      <div className="label reveal">04 — What you receive</div>
      <h2 id="h-receive" className="h-l reveal">A decision-ready audit, not another research dump.</h2>
      <div className="delivs">
        <div className="deliv reveal">
          <div className="hd"><span className="label on">Deliverable 01</span><span className="fic-note">Preview · fictional rows</span></div>
          <h3>Audited spreadsheet</h3>
          <div className="sheet" aria-label="Preview of the audited spreadsheet, fictional rows">
            <table>
              <thead><tr><th>ID</th><th>Original record</th><th>Normalized identity</th><th>Role</th><th>Spec match</th><th>Conf.</th><th>Action</th></tr></thead>
              <tbody>
                <tr><td>R-014</td><td>Norvane Intermed.</td><td>Norvane Intermediates Ltd</td><td className="ok">Manufacturer</td><td>Exact</td><td>0.91</td><td>Accept</td></tr>
                <tr><td>R-027</td><td>Tessaro Chem</td><td>Tessaro Chem Handel GmbH</td><td>Trader</td><td>Family</td><td>0.86</td><td>Reclassify</td></tr>
                <tr><td>R-041</td><td>Qiloma Fine Chem</td><td>Qiloma Fine Chemical Co.</td><td className="rv">Unclear</td><td>Exact</td><td>0.52</td><td>Review</td></tr>
                <tr><td>R-072</td><td>Brisko Materials</td><td>— not resolved —</td><td className="no">Unsupported</td><td>None</td><td>0.12</td><td>Remove</td></tr>
              </tbody>
            </table>
          </div>
          <ul>{receive.sheet.map((x) => <li key={x}>{x}</li>)}</ul>
        </div>
        <div className="deliv reveal">
          <div className="hd"><span className="label on">Deliverable 02</span><span className="fic-note">Preview · fictional figures</span></div>
          <h3>Executive findings PDF</h3>
          <div className="pdf" aria-label="Preview of the two-page executive findings PDF, fictional figures">
            <div className="page">
              <div className="pt">Executive findings · 1 / 2</div>
              <div className="ph">Dataset health: 30 records audited</div>
              <div className="bar"><i style={{ width: '60%', background: '#5577FF' }} /><i style={{ width: '13%', background: '#9277FF' }} /><i style={{ width: '27%', background: '#8792A3' }} /></div>
              <div className="kv"><span>Verified</span><b>18</b></div>
              <div className="kv"><span>Needs review</span><b>4</b></div>
              <div className="kv"><span>Unsupported or duplicate</span><b>8</b></div>
              <div className="ln" />
              <div className="pt">Most common failure modes</div>
              <div className="txt"><i /><i /><i /></div>
            </div>
            <div className="page">
              <div className="pt">Executive findings · 2 / 2</div>
              <div className="ph">Remediation priorities</div>
              <div className="kv"><span>1. Role misclassification</span><b>5 records</b></div>
              <div className="kv"><span>2. Duplicate entities</span><b>2 pairs</b></div>
              <div className="kv"><span>3. Stale sources</span><b>6 records</b></div>
              <div className="ln" />
              <div className="pt">Structural gaps</div>
              <div className="txt"><i /><i /><i /></div>
              <div className="pt" style={{ marginTop: 'auto' }}>Fictional preview</div>
            </div>
          </div>
          <ul>{receive.pdf.map((x) => <li key={x}>{x}</li>)}</ul>
        </div>
      </div>
    </section>
  );
});
