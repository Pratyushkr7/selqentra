import { links, config } from '../config';
export function Nav() {
  return (
    <nav className="nav" aria-label="Primary">
      <div className="wrap">
        <a className="brand" href="#top" aria-label="Selqentra — home">
          <span className="mark" aria-hidden="true">{Array.from({ length: 9 }).map((_, i) => <i key={i} />)}</span>
          SELQENTRA
        </a>
        <div className="links">
          <a href="#sample">Sample audit</a>
          <a href="#pilot">Pilot</a>
          <a href="#method">Method</a>
          <a className="btn primary sm" href={links.start()}>Start a {config.pilot.price} pilot</a>
        </div>
      </div>
    </nav>
  );
}
