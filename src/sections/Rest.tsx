import { forwardRef } from 'react';
import { fit, method } from '../content/copy';
import { config } from '../config';
import { Intake } from './Intake';

export const Fit = forwardRef<HTMLElement>(function Fit(_, ref) {
  return (
    <section id="fit" ref={ref} aria-labelledby="h-fit">
      <div className="wrap">
      <div className="label reveal">06 · Who it is for</div>
      <h2 id="h-fit" className="h-l reveal">Built for people who buy raw materials and want to know who they are really buying from.</h2>
      <div className="fit">
        <div className="col in reveal"><h4 className="on">Best fit</h4><ul>{fit.yes.map((x) => <li key={x}>{x}</li>)}</ul></div>
        <div className="col ex reveal"><h4>Not the right fit</h4><ul>{fit.no.map((x) => <li key={x}>{x}</li>)}</ul></div>
      </div>
      </div>
    </section>
  );
});

export const Method = forwardRef<HTMLElement>(function Method(_, ref) {
  return (
    <section id="method" ref={ref} aria-labelledby="h-method">
      <div className="wrap">
      <div className="label reveal">07 · Method</div>
      <h2 id="h-method" className="h-l reveal">Six steps, every one of them evidenced.</h2>
      <ol className="method reveal" aria-label="Six-step method">
        {method.map((m) => <li key={m.t} className="m on"><b>{m.t}</b><span>{m.d}</span></li>)}
      </ol>
      </div>
    </section>
  );
});

export const Close = forwardRef<HTMLElement>(function Close(_, ref) {
  return (
    <section id="contact" className="close" ref={ref} aria-labelledby="h-close">
      <div className="wrap center">
      <div className="label reveal">05 · Start</div>
      <h2 id="h-close" className="h-xl reveal">Before your next sourcing decision,<br />see the landscape.</h2>
      <p className="lede reveal" style={{ marginTop: 24 }}>Send one material. Get back who actually makes it.</p>
      <div className="startgrid reveal">
        <Intake />
        <aside className="next" aria-label="What happens after you send the brief">
          <h3 className="label">What happens next</h3>
          <ol>
            <li><b>You send the brief.</b> It goes from your own email, with the SDS or TDS attached if you have one.</li>
            <li><b>We reply within one working day</b> to confirm scope and a delivery date.</li>
            <li><b>You get the report:</b> who makes it, who resells it, where it ships from, and who to approach first.</li>
            <li><b>A short call</b> to walk through it together.</li>
          </ol>
          <div className="contact" id="contact-details">
            <span className="label">Direct</span>
            <span><a href={`mailto:${config.contactEmail}`}>{config.contactEmail || 'contact address is set at build time'}</a></span>
            {config.bookingUrl && <span><a href={config.bookingUrl} target="_blank" rel="noopener">Book a call directly</a></span>}
            <span>Independent research practice · India · working internationally</span>
          </div>
        </aside>
      </div>
      <footer>
        <span>© {new Date().getFullYear()} Selqentra · Supplier discovery for raw materials</span>
        <span>Sample companies and figures on this page are illustrative.</span>
      </footer>
      </div>
    </section>
  );
});
