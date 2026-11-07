import { useState } from "react";
import { Menu, X } from "lucide-react";

interface Link {
  href: string;
  label: string;
}

export default function MobileMenu({ links, currentPath }: { links: Link[]; currentPath: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="vf-menu" onKeyDown={(event) => {
      if (event.key === "Escape") setOpen(false);
    }}>
      <button
        type="button"
        className="vf-menu-button"
        aria-label={open ? "Close navigation" : "Open navigation"}
        aria-controls="vf-nav"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
      </button>
      {open && (
        <div className="vf-menu-panel" id="vf-nav">
          <nav aria-label="Main navigation">
            <ul>
              {links.map(({ href, label }) => (
                <li key={href}>
                  <a
                    href={href}
                    aria-current={currentPath === href ? "page" : undefined}
                    onClick={() => setOpen(false)}
                  >{label}</a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}
    </div>
  );
}
