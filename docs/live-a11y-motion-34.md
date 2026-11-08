# Live motion and accessibility QA — PR #34

Automated browser coverage now verifies navigation's scroll lock plus real DOM inert state for background landmarks, restores their accessibility on Escape, keeps keyboard focus within the menu including reverse Tab, and confirms keyboard-triggered gallery close returns focus to the thumbnail. Visible high-contrast focus outlines are explicitly defined for navigation, links, form, gallery and map controls.

Simulated reduced-motion preference must suppress reveal transforms/opacity changes and nonessential hover/menu transitions. Prior checks still cover 14 routes, internal assets/links, forms, image-alt attributes, responsive overflow, and 116 settled original/Astro screenshot files.

**Not verified automatically:** real NVDA/VoiceOver sessions, complete real-device keyboard tours, live Webflow motion accuracy for every scroll position, full-page visual equality, deployment and automatic contact delivery. Record these as remaining manual/production acceptance items rather than PASS. No Webflow runtime, Radix, React useEffect or new dependency is introduced.
