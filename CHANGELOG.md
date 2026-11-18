# Changelog

## 1.0.4

- Fixed: clicking the vendor that was already selected did nothing until some
  other vendor had been clicked first. The shipped root pane renders the current
  model's provider id on its "model" cell, so the vendor lookup treated that
  vendor's group as already on screen and returned without ever opening the
  model list. Only real model option rows count as a revealed group now, so the
  selected vendor expands on the first click, like every other vendor.
- Remaining-credit badges on vendor rows. Each source is probed on its own and
  only the ones that actually answer on this machine are used: the channel
  pack's credits RPC, the points panels, and any Magpie-compatible quota
  endpoint (own Host bridge first, then the well-known plugin routes, then
  Magpie's `/v1/magpie/quotas`). Nothing is hard-coded for one installation, and
  an absent gateway, plugin, or route simply means no badge.
- A badge is drawn only where a value is actually known. Values past three
  digits are abbreviated (`1.2k`, `3.1k`), the tooltip carries the exact value
  and its source, and amounts in different units are never added together.
- Magpie offers are matched to vendors by route and provider metadata only, so a
  model family name never decides a vendor; ambiguous matches stay hidden.
- Optional quota reads are Host-bridged, loopback-only, same-origin only,
  bounded, cached, and stripped of account identity before they reach the page.

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