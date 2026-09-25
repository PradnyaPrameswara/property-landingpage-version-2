import { useState } from "react";

export default function MobileMenu({ links }: { links: { href: string; label: string }[] }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="md:hidden">
      <button aria-expanded={open} aria-controls="mobile-nav" aria-label="Menu" onClick={() => setOpen(!open)}>
        {open ? "Close" : "Menu"}
      </button>
      {open ? (
        <nav id="mobile-nav" aria-label="Mobile">
          <ul className="flex flex-col gap-4">
            {links.map((l) => (
              <li key={l.href}>
                <a href={l.href} onClick={() => setOpen(false)}>
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </div>
  );
}
