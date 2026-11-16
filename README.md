# dsh-vendor-quick-switch

English | [中文](#中文)

Vendor-first model switching for DeepSeek Harness, **without touching the shipped model selector**. Everything is additive: the original menu keeps its own width, anchoring, search, reasoning-effort rows, and every option other plugins append to it.

## What it does

The shipped model menu groups models by provider, so switching vendors on a long catalog means scrolling a long list. This plugin puts a **vendor index beside that menu**:

- open the model menu → the index appears next to it, attached to the menu's own rectangle;
- scroll the vendor list with the wheel;
- click a vendor → the shipped model list jumps to that vendor's group;
- drill into the model pane → the index stays, and leaves when the menu closes;
- pick a model → switching goes through the same directory and write path as the shipped selector, so the two never disagree.

A second style renders the same two levels **inside** the shipped menu instead of beside it. Choose either on the bundle page: **Plugins → 厂商快速切换 → 切换方式**. The preference is per browser.

## Why it does not break anything

- Registers only into `conversation.input.model.options`, the slot the shipped selector documents for appended root-menu options. It never replaces `conversation.input.model`.
- The panel reuses the shipped menu material tokens (`--dsw-menu-surface-fill`, `--dsw-menu-backdrop-filter`, `--dsw-elevation-prominent`), so it reads as the same surface rather than a hand-picked color.
- Presses and focus inside the panel are contained, so the shipped menu does not treat a vendor click as an outside press or as focus leaving it.
- Routes derived by vision plugins (`*-vision`, "+ 自动识图" / "+ Auto Vision") are filtered out of the vendor list. A current selection on such a route still maps back to its listed vendor.
- No provider configuration, credential, or session data is read or written.

## Install

```sh
dsh plugin --profile web add dsh-vendor-quick-switch
```

Or from the app: **Plugins → Add plugin**, then install `dsh-vendor-quick-switch`. Requires dsh `>= 0.2.2-rc.3`.

## Settings

**Plugins → 厂商快速切换 → 切换方式**

| Style | Behaviour |
|---|---|
| 侧挂面板 / Side panel | Vendor index beside the shipped menu; clicking a vendor jumps inside the shipped list. Default. |
| 菜单内展开 / In menu | The vendor and model levels render inside the shipped menu; no side surface. |

The choice is stored in this browser's `localStorage` under `dsh-vendor-quick-switch.settings`.

## Compatibility

- dsh `>= 0.2.2-rc.3` (uses the session-scoped `conversation.input.model.options` slot and `ctx.modelDirectories`).
- The panel is plain DOM over the shipped menu's rectangle; no Client package is imported, so a renamed internal class cannot break it.
- A folder-switchable model with no reasoning metadata still switches; the effort stays at the provider default and remains editable in the shipped Effort row.

## Development

```sh
npm test        # registration, boundary, and render smoke tests
npm run check   # syntax + both suites
```

`test/render.test.cjs` executes the component tree with a minimal React stand-in, so a missing translator or a hook-order mistake fails here instead of blanking the shipped menu in the browser.

## License

MIT.

---

## 中文

给 DeepSeek Harness 做**按厂商快速切换模型**，且**完全不改造原模型选择器**。插件只做加法：原菜单的宽度、吸附位置、搜索、推理等级，以及其他插件追加的选项，全部保持不变。

### 做什么

原菜单按厂商分组，厂商一多就要在长列表里翻。这个插件在原菜单**旁边**放一个厂商索引：

- 打开模型菜单 → 索引贴着菜单出现；
- 鼠标滚轮滚厂商；
- 点厂商 → 原模型列表直接跳到该厂商分组；
- 进到模型列表后索引不消失，菜单关闭时它一起收起；
- 选模型走与原选择器同一条目录和写入路径，两边永远同步。

另一个方式是**不弹侧栏**，把同样的两级结构画在原菜单内部。在插件页 **Plugins → 厂商快速切换 → 切换方式** 里选，偏好按浏览器保存。

### 为什么不会破坏原插件

- 只注册进 `conversation.input.model.options`（官方为“追加根菜单选项”提供的槽位），从不替换 `conversation.input.model`。
- 面板直接复用原菜单材质令牌（`--dsw-menu-surface-fill`、`--dsw-menu-backdrop-filter`、`--dsw-elevation-prominent`），和原菜单同一块玻璃，不是自己调的颜色。
- 侧栏内的按下与焦点被就地拦下，原菜单不会把“点厂商”当成外部点击或焦点离开。
- 识图插件派生的路由（`*-vision`、`+ 自动识图` / `+ Auto Vision`）不进厂商列表；当前选中这类路由时也能正确标回对应厂商。
- 不读写任何 provider 配置、凭据或会话数据。

### 安装

```sh
dsh plugin --profile web add dsh-vendor-quick-switch
```

或在应用内 **Plugins → Add plugin** 安装 `dsh-vendor-quick-switch`。要求 dsh `>= 0.2.2-rc.3`。

### 设置

**Plugins → 厂商快速切换 → 切换方式**

| 方式 | 行为 |
|---|---|
| 侧挂面板（默认） | 厂商索引贴在原菜单旁；点厂商在原列表内跳转。 |
| 菜单内展开 | 两级结构画在原菜单内部，不弹侧栏。 |

选择保存在本浏览器 `localStorage` 的 `dsh-vendor-quick-switch.settings` 里。

### 兼容性

- dsh `>= 0.2.2-rc.3`（使用会话级 `conversation.input.model.options` 槽位与 `ctx.modelDirectories`）。
- 面板是基于原菜单矩形的普通 DOM，不 import 任何 Client 包，内部类名重命名不会把它弄坏。
- 无推理等级的模型照样能切；等级留在 provider 默认值，之后仍可在原“推理等级”里改。

### 许可

MIT。