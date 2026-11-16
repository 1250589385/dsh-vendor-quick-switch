# Changelog

## 1.0.0

First public release.

- Vendor index beside the shipped model menu: the list stays attached while the
  menu is open, including after drilling into the model pane.
- Clicking a vendor scrolls the shipped model list to that vendor's group and
  opens the model pane first when the menu is still on its root pane.
- In-menu mode: the same two levels rendered inside the shipped menu instead of
  a side index.
- Switching style is a per-browser preference exposed on the bundle page in
  **Plugins → 厂商快速切换**.
- Panel surfaces reuse the shipped menu material tokens
  (`--dsw-menu-surface-fill`, `--dsw-menu-backdrop-filter`,
  `--dsw-elevation-prominent`) so they match the original menu exactly.
- Placement follows the shipped menu rectangle, flips to the left when the
  right side is full, and reserves clearance for the composer tool row.
- Vision-plugin derived routes (`*-vision`, "+ 自动识图" / "+ Auto Vision") are
  filtered out of the vendor list; a current selection on such a route still
  maps back to its listed vendor.
- Presses and focus on the side index are contained so the shipped menu never
  dismisses itself when a vendor is clicked.
- The original model selector is never replaced, overridden, or disabled.