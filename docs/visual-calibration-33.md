# Final layout calibration (#33)

Evidence: settled Webflow/Astro screenshot pairs from PR #32 and the original Webflow CSS `von-falk.webflow.e19f53618.min.css`.

## Confirmed first-fold discrepancies

- Home at **700px**: Astro uses a larger hero heading (about 54px rather than the source's 2.5rem/40px), wider image gutters and left-aligned caption. Set the original heading size, source .75rem outer gutter and centered caption; rebalance the caption's reserved space.
- Projects and Team at **390px / 700px**: Astro first-fold headings and photos start roughly 30–45px too low. Restore source-like mobile gutters and intro offsets while preserving original photo intrinsic ratios.
- Blog article at **767px**: the title and image start about 80–90px below the reference due to a stacked top-padding override. Reduce the 641–767px top padding to match the screenshot geometry.
- Projects desktop: align heading font/letter-spacing and outer gutter to the exact original **6.5rem / -.5rem / 1.75rem** source CSS.

The Chromium smoke suite asserts representative geometry at 390/700/767px. These are targeted CSS changes, not full pixel equality. Compare PR #33 normalized screenshot artifacts against the PR #32 settled baseline before claiming any quantified overall gain.
