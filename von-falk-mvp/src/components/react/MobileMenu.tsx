import { useRef, useState } from "react";
import { Menu, X } from "lucide-react";

interface Link {
  href: string;
  label: string;
}

export default function MobileMenu({ links, currentPath }: { links: Link[]; currentPath: string }) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  return (
    <div
      className="vf-menu"
      onKeyDown={(event) => {
        if (event.key === "Escape" && open) {
          event.stopPropagation();
          setOpen(false);
          triggerRef.current?.focus();
        }
      }}
      onBlur={(event) => {
        if (open && !event.currentTarget.contains(event.relatedTarget)) setOpen(false);
      }}
    >
      <button
        ref={triggerRef}
        type="button"
        className="vf-menu-button"
        aria-label={open ? "Close navigation" : "Open navigation"}
        aria-haspopup="true"
        aria-controls="vf-nav"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
      </button>
      <div
        className="vf-menu-panel"
        id="vf-nav"
        hidden={!open}
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            setOpen(false);
            triggerRef.current?.focus();
          }
        }}
      >
        <nav aria-label="Main navigation">
          <ul>
            {links.map(({ href, label }) => (
              <li key={href}>
                <span className="vf-menu-link-mark" aria-hidden="true" />
                <a
                  href={href}
                  aria-current={currentPath === href ? "page" : undefined}
                  onClick={() => setOpen(false)}
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}
