import { forwardRef } from 'react';
import { fit, method } from '../content/copy';
import { config } from '../config';
import { Intake } from './Intake';

export const Fit = forwardRef<HTMLElement>(function Fit(_, ref) {
  return (
    <section id="fit" ref={ref} aria-labelledby="h-fit">
      <div className="label reveal">06 — Who it is for</div>
      <h2 id="h-fit" className="h-l reveal">Built for teams scaling supplier intelligence.</h2>
      <div className="fit">
        <div className="col in reveal"><h4 className="on">Best fit</h4><ul>{fit.yes.map((x) => <li key={x}>{x}</li>)}</ul></div>
        <div className="col ex reveal"><h4>Not the right fit</h4><ul>{fit.no.map((x) => <li key={x}>{x}</li>)}</ul></div>
      </div>
    </section>
  );
});

export const Method = forwardRef<HTMLElement>(function Method(_, ref) {
  return (
    <section id="method" ref={ref} aria-labelledby="h-method">
      <div className="label reveal">07 — Method</div>
      <h2 id="h-method" className="h-l reveal">A small engagement with a rigorous finish.</h2>
      <ol className="method reveal" aria-label="Six-stage workflow">
        {method.map((m, i) => <li key={m.t} className={`m ${i < 5 ? 'on' : ''}`}><b>{m.t}</b><span>{m.d}</span></li>)}
      </ol>
    </section>
  );
});

export const Close = forwardRef<HTMLElement>(function Close(_, ref) {
  return (
    <section id="contact" className="close" ref={ref} aria-labelledby="h-close">
      <div className="label reveal">08 — Start</div>
      <h2 id="h-close" className="h-xl reveal">Before you scale the dataset,<br />verify the ground truth.</h2>
      <p className="lede reveal" style={{ marginTop: 24 }}>Start with {config.pilot.records} records. See what survives.</p>
      <div className="startgrid reveal">
        <Intake />
        <aside className="next" aria-label="What happens after you send the brief">
          <h3 className="label">What happens next</h3>
          <ol>
            <li><b>You send the brief.</b> It arrives from your own mail client, so there is no form data held anywhere.</li>
            <li><b>Scope confirmed within one working day.</b> I reply with the sample design — random or stratified — and an invoice for {config.pilot.price}.</li>
            <li><b>You pay and share the {config.pilot.records} records.</b> The {config.pilot.hours}-hour clock starts when both have arrived.</li>
            <li><b>Delivery.</b> Audited sheet, two-page PDF, and one clarification round. Unresolved records are listed as unresolved.</li>
          </ol>
          <div className="contact" id="contact-details">
            <span className="label">Direct</span>
            <span><a href={`mailto:${config.contactEmail}`}>{config.contactEmail || 'contact address is set at build time'}</a></span>
            <span>Independent research practice · India · working internationally · replies within one working day</span>
          </div>
        </aside>
      </div>
      <footer>
        <span>© {new Date().getFullYear()} Selqentra · Independent supply-market research</span>
        <span>No claims about real companies appear on this page. Sample entities are fictional.</span>
      </footer>
    </section>
  );
});
