import { useMemo, useState, type FormEvent } from 'react';
import { config, links, isConfigured } from '../config';

type Gen = 'LLM / AI agents' | 'Web scraping' | 'Automated research pipeline' | 'Mixed / not sure';
const GEN: Gen[] = ['LLM / AI agents', 'Web scraping', 'Automated research pipeline', 'Mixed / not sure'];

interface Form { email: string; company: string; size: string; gen: Gen; category: string; geography: string; criteria: string; link: string }
const empty: Form = { email: '', company: '', size: '', gen: 'LLM / AI agents', category: '', geography: '', criteria: '', link: '' };

export function Intake() {
  const [f, setF] = useState<Form>(empty);
  const [sent, setSent] = useState(false);
  const [copied, setCopied] = useState(false);
  const [touched, setTouched] = useState(false);
  const set = (k: keyof Form) => (e: { target: { value: string } }) => setF({ ...f, [k]: e.target.value });

  const emailOk = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(f.email);
  const valid = emailOk && f.company.trim() && f.category.trim() && f.geography.trim() && f.criteria.trim();

  const brief = useMemo(() => [
    `PILOT BRIEF — ${config.pilot.records} records / ${config.pilot.hours} hours / ${config.pilot.price}`,
    '',
    `Company: ${f.company || '—'}`,
    `Contact: ${f.email || '—'}`,
    `Dataset size (total records): ${f.size || '—'}`,
    `How records are generated: ${f.gen}`,
    `Product / category context: ${f.category || '—'}`,
    `Required geography: ${f.geography || '—'}`,
    `Acceptance criteria — what would make this useful: ${f.criteria || '—'}`,
    f.link ? `Reference link: ${f.link}` : '',
    '',
    'Please confirm scope and send the invoice. I will share the 30 records on payment.',
  ].filter((l) => l !== undefined).join('\n'), [f]);

  const submit = (e: FormEvent) => {
    e.preventDefault(); setTouched(true);
    if (!valid) return;
    if (isConfigured()) window.location.href = links.mailto(`Pilot brief — ${f.company}`, brief);
    setSent(true);
  };
  const copy = async () => { try { await navigator.clipboard.writeText(brief); setCopied(true); setTimeout(() => setCopied(false), 1800); } catch { /* clipboard unavailable — text remains selectable below */ } };

  return (
    <div className="intake" id="start">
      {!sent ? (
        <form onSubmit={submit} noValidate aria-describedby="intake-help">
          <p id="intake-help" className="ihelp">Six short answers. They become a scoping brief in your own mail client — nothing is stored here, and you send it yourself.</p>
          <div className="grid2">
            <label>Work email<input type="email" required value={f.email} onChange={set('email')} aria-invalid={touched && !emailOk} autoComplete="email" /></label>
            <label>Company<input type="text" required value={f.company} onChange={set('company')} aria-invalid={touched && !f.company.trim()} autoComplete="organization" /></label>
            <label>Dataset size (total records)<input type="text" inputMode="numeric" placeholder="e.g. 4,200" value={f.size} onChange={set('size')} /></label>
            <label>How the records are generated<select value={f.gen} onChange={set('gen')}>{GEN.map((g) => <option key={g}>{g}</option>)}</select></label>
            <label>Product or category context<input type="text" required placeholder="e.g. specialty surfactants, 48% dispersions" value={f.category} onChange={set('category')} aria-invalid={touched && !f.category.trim()} /></label>
            <label>Required geography<input type="text" required placeholder="e.g. India and China producers" value={f.geography} onChange={set('geography')} aria-invalid={touched && !f.geography.trim()} /></label>
          </div>
          <label>Acceptance criteria — what would make this useful<textarea rows={3} required placeholder="e.g. a defensible precision number on our 'manufacturer' label, and the worst 10 records explained" value={f.criteria} onChange={set('criteria')} aria-invalid={touched && !f.criteria.trim()} /></label>
          <label>Reference link <span className="opt">optional</span><input type="url" placeholder="Product page, docs, or a public sample of the data" value={f.link} onChange={set('link')} /></label>
          {touched && !valid && <p className="ierr" role="alert">Fill the five required fields — email, company, category, geography and acceptance criteria — so the brief is complete enough to scope.</p>}
          <div className="ctas" style={{ marginTop: 18 }}>
            <button type="submit" className="btn primary">Compose the pilot brief<span className="arr" aria-hidden="true">→</span></button>
            <span className="inote">Opens in your mail client, addressed and filled in. Nothing is sent until you press send.</span>
          </div>
        </form>
      ) : (
        <div className="isent" role="status">
          <div className="label on">Brief composed</div>
          <p>{isConfigured() ? 'Your mail client should now hold the brief, addressed and ready. If it did not open, copy the text below and send it to' : 'Copy the brief below and send it to'} {isConfigured() ? <a href={`mailto:${config.contactEmail}`}>{config.contactEmail}</a> : <span className="mono">the address in the footer</span>}.</p>
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
