import { useRef, useState } from "react";
import { Menu, X } from "lucide-react";

interface Link {
  href: string;
  label: string;
}

export default function MobileMenu({ links, currentPath }: { links: Link[]; currentPath: string }) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const previousOverflow = useRef("");
  const previousInert = useRef<Array<{ element: HTMLElement; inert: boolean }>>([]);

  function updateBackground(blocked: boolean) {
    if (blocked) {
      const background = document.querySelectorAll<HTMLElement>(
        ".vf-main, .vf-footer, .vf-header-logo, .vf-shell > a[href='#main-content']"
      );
      previousInert.current = Array.from(background, (element) => ({ element, inert: element.inert }));
      for (const { element } of previousInert.current) element.inert = true;
    } else {
      for (const { element, inert } of previousInert.current) element.inert = inert;
      previousInert.current = [];
    }
  }


  function closeMenu(restoreFocus = false) {
    document.documentElement.style.overflow = previousOverflow.current;
    updateBackground(false);
    setOpen(false);
    if (restoreFocus) triggerRef.current?.focus();
  }

  function toggleMenu() {
    if (open) {
      closeMenu(true);
      return;
    }
    previousOverflow.current = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    updateBackground(true);
    setOpen(true);
    requestAnimationFrame(() => rootRef.current?.querySelector<HTMLAnchorElement>(".vf-menu-panel a")?.focus({ preventScroll: true }));
  }

  return (
    <div
      ref={rootRef}
      className="vf-menu"
      onKeyDown={(event) => {
        if (!open) return;
        if (event.key === "Escape") {
          event.stopPropagation();
          closeMenu(true);
        }
        if (event.key === "Tab") {
          const items = Array.from(rootRef.current?.querySelectorAll<HTMLElement>("button:not([disabled]), a[href]") ?? [])
            .filter((item) => item.getClientRects().length > 0);
          const first = items[0], last = items[items.length - 1];
          if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last?.focus();
          } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first?.focus();
          }
        }
      }}
    >
      <button
        ref={triggerRef}
        type="button"
        className="vf-menu-button"
        aria-label={open ? "Close navigation" : "Open navigation"}
        aria-haspopup="dialog"
        aria-controls="vf-nav"
        aria-expanded={open}
        onClick={toggleMenu}
      >
        {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
      </button>
      <div
        className="vf-menu-panel"
        id="vf-nav"
        role="dialog"
        aria-modal={open ? "true" : undefined}
        aria-label="Main navigation"
        hidden={!open}
        onClick={(event) => {
          if (event.target === event.currentTarget) closeMenu(true);
        }}
      >
        <nav aria-label="Main navigation">
          <ul>
            {links.map(({ href, label }) => (
              <li key={href}>
                <span className="vf-menu-link-mark" aria-hidden="true" />
                <a href={href} aria-current={currentPath === href ? "page" : undefined} onClick={() => closeMenu()}>
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
