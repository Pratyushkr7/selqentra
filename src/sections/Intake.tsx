import { useMemo, useState, type FormEvent } from 'react';
import { config, links, isConfigured } from '../config';

interface Form { email: string; company: string; product: string; cas: string; application: string; grade: string; properties: string; volume: string; destination: string; current: string; notes: string }
const empty: Form = { email: '', company: '', product: '', cas: '', application: '', grade: '', properties: '', volume: '', destination: '', current: 'Not sure', notes: '' };

export function Intake() {
  const [f, setF] = useState<Form>(empty);
  const [sent, setSent] = useState(false);
  const [copied, setCopied] = useState(false);
  const [touched, setTouched] = useState(false);
  const set = (k: keyof Form) => (e: { target: { value: string } }) => setF({ ...f, [k]: e.target.value });

  const emailOk = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(f.email);
  const valid = emailOk && f.company.trim() && f.product.trim() && f.application.trim() && f.destination.trim();

  const brief = useMemo(() => [
    'PRODUCT BRIEF: free pilot',
    '',
    `Company: ${f.company || '—'}`,
    `Contact: ${f.email || '—'}`,
    '',
    `Product: ${f.product || '—'}`,
    `CAS number: ${f.cas || '—'}`,
    `Application / purpose: ${f.application || '—'}`,
    `Grade / form: ${f.grade || '—'}`,
    `Annual volume: ${f.volume || '—'}`,
    `Delivery location: ${f.destination || '—'}`,
    f.notes ? `Notes: ${f.notes}` : '',
    '',
    'SDS / TDS attached to this email where available.',
  ].join('\n'), [f]);

  const submit = (e: FormEvent) => {
    e.preventDefault(); setTouched(true);
    if (!valid) return;
    if (isConfigured()) window.location.href = links.mailto(`Product brief: ${f.product} (${f.company})`, brief);
    setSent(true);
  };
  const copy = async () => { try { await navigator.clipboard.writeText(brief); setCopied(true); setTimeout(() => setCopied(false), 1800); } catch { /* text stays selectable below */ } };

  return (
    <div className="intake" id="brief">
      {!sent ? (
        <form onSubmit={submit} noValidate aria-describedby="intake-help">
          <p id="intake-help" className="ihelp">Fill this in and it opens as an email from your own account. Nothing is stored on this site.</p>
          <div className="grid2">
            <label>Work email<input type="email" required value={f.email} onChange={set('email')} aria-invalid={touched && !emailOk} autoComplete="email" /></label>
            <label>Company<input type="text" required value={f.company} onChange={set('company')} aria-invalid={touched && !f.company.trim()} autoComplete="organization" /></label>
            <label>Product name<input type="text" required placeholder="e.g. Sodium gluconate" value={f.product} onChange={set('product')} aria-invalid={touched && !f.product.trim()} /></label>
            <label>CAS number <span className="opt">if known</span><input type="text" placeholder="e.g. 527-07-1" value={f.cas} onChange={set('cas')} /></label>
            <label>Application / purpose<input type="text" required placeholder="e.g. paint, food, adhesive" value={f.application} onChange={set('application')} aria-invalid={touched && !f.application.trim()} /></label>
            <label>Grade / form<input type="text" placeholder="e.g. food grade, powder" value={f.grade} onChange={set('grade')} /></label>
            <label>Annual volume<input type="text" placeholder="e.g. 120 t" value={f.volume} onChange={set('volume')} /></label>
            <label>Delivery location<input type="text" required placeholder="City, country" value={f.destination} onChange={set('destination')} aria-invalid={touched && !f.destination.trim()} /></label>
          </div>
          <label>Anything else <span className="opt">optional</span><textarea rows={2} placeholder="Current supplier type, certifications needed, regions to include or avoid" value={f.notes} onChange={set('notes')} /></label>
          {touched && !valid && <p className="ierr" role="alert">Fill the five required fields (email, company, product, application and delivery location) so the landscape can be scoped.</p>}
          <div className="ctas" style={{ marginTop: 18 }}>
            <button type="submit" className="btn primary">Compose the brief<span className="arr" aria-hidden="true">→</span></button>
            <span className="inote">Opens in your mail client, addressed and filled in. Attach SDS/TDS there. Nothing is sent until you press send.</span>
          </div>
        </form>
      ) : (
        <div className="isent" role="status">
          <div className="label on">Brief composed</div>
          <p>{isConfigured() ? 'Your mail client should now hold the brief, addressed and ready. Attach the SDS or TDS before sending. If it did not open, copy the text below and send it to' : 'Copy the brief below and send it to'} {isConfigured() ? <a href={`mailto:${config.contactEmail}`}>{config.contactEmail}</a> : <span className="mono">the address in the footer</span>}.</p>
          <pre className="brief" tabIndex={0}>{brief}</pre>
          <div className="ctas">
            <button type="button" className="btn ghost sm" onClick={copy}>{copied ? 'Copied' : 'Copy brief'}</button>
            <button type="button" className="btn ghost sm" onClick={() => { setSent(false); setTouched(false); }}>Edit answers</button>
          </div>
        </div>
      )}
    </div>
  );
}
