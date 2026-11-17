# Changelog

## 1.0.3

- Clicking a vendor now scrolls the shipped list's own scroll box just far
  enough to show that vendor's group heading, so the vendor name and the models
  under it are both on screen. It never forces the heading to the very top: a
  vendor near the end of the list stops at the list's maximum scroll, and a
  heading already in view is left where it is.
- The heading lookup accepts every name a provider may appear under, including
  the host's localized account label.

## 1.0.2

- Revert the 1.0.1 attempt to bound the shipped menu. That change shortened the
  host's default model list, which is the host's to decide. The plugin now only
  bounds its own vendor column to the viewport and leaves the shipped menu's
  height, offset, and list length untouched even when it renders past the window.

## 1.0.1

- Keep the shipped menu, and with it the vendor index and the model list, inside
  the safe band. Renderers without CSS anchor positioning place that menu at the
  top-left corner and let it grow with its content, so a long model list ran past
  the bottom of the window; the menu now receives a bounded height and sits above
  the composer tool row, keeping its own internal scrolling. A menu that already
  fits is left untouched, and the original inline styles are restored on close.

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