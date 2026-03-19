import { html as n, css as W, state as m, customElement as F } from "@umbraco-cms/backoffice/external/lit";
import { UmbLitElement as K } from "@umbraco-cms/backoffice/lit-element";
import { c as _ } from "./alchemy-brew.call-api-xNc0KYGJ.js";
import { UmbDocumentTypeDetailRepository as M } from "@umbraco-cms/backoffice/document-type";
var O = Object.defineProperty, j = Object.getOwnPropertyDescriptor, A = (e) => {
  throw TypeError(e);
}, f = (e, t, i, a) => {
  for (var r = a > 1 ? void 0 : a ? j(t, i) : t, o = e.length - 1, u; o >= 0; o--)
    (u = e[o]) && (r = (a ? u(t, i, r) : u(r)) || r);
  return a && r && O(t, i, r), r;
}, z = (e, t, i) => t.has(e) || A("Cannot " + i), k = (e, t, i) => (z(e, t, "read from private field"), i ? i.call(e) : t.get(e)), N = (e, t, i) => t.has(e) ? A("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), l = (e, t, i) => (z(e, t, "access private method"), i), s, g, x, C, E, D, P, R, I, B, T, v, w, $, S, q, y;
let b = class extends K {
  constructor() {
    super(...arguments), N(this, s), this._phase = "choose", this._rows = [], this._saveError = null, this._rebrewRow = null, this._rebrewInstruction = "";
  }
  render() {
    return n`
            <umb-body-layout headline="Do Alchemy">
                ${this._phase === "choose" ? l(this, s, I).call(this) : l(this, s, B).call(this)}
                <div slot="actions">
                    ${this._phase === "brewing" && k(this, s, D) && k(this, s, P) ? n`
                            <uui-button
                                look="primary"
                                color="positive"
                                label="Accept"
                                @click=${l(this, s, R)}>
                                Accept
                            </uui-button>
                        ` : ""}
                    ${this._phase === "saving" ? n`
                            <uui-button look="primary" color="positive" label="Saving…" disabled>
                                <uui-loader-circle></uui-loader-circle> Saving…
                            </uui-button>
                        ` : ""}
                    ${this._phase === "saved" ? n`
                            <uui-button look="primary" color="positive" label="Saved" disabled>
                                ✓ Saved
                            </uui-button>
                        ` : ""}
                    <uui-button look="secondary" label="Close" @click=${l(this, s, E)}>
                        ${this._phase === "choose" ? "Cancel" : "Close"}
                    </uui-button>
                </div>
            </umb-body-layout>
        `;
  }
  static get styles() {
    return W`
            uui-box {
                display: block;
            }

            #mode-buttons {
                display: flex;
                flex-direction: column;
                gap: var(--uui-size-space-3, 8px);
            }

            #mode-buttons uui-button {
                width: 100%;
                --uui-button-font-size: var(--uui-type-default-size, 14px);
            }

            #mode-buttons small {
                opacity: 0.6;
                margin-left: 4px;
            }

            .overview {
                display: flex;
                flex-direction: column;
                gap: 2px;
                margin-bottom: var(--uui-size-space-4, 12px);
                padding: var(--uui-size-space-3, 8px) var(--uui-size-space-4, 12px);
                background: var(--uui-color-surface-alt, #f3f3f5);
                border-radius: var(--uui-border-radius, 3px);
                font-size: var(--uui-type-small-size, 12px);
            }

            .overview-row {
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .overview-label {
                opacity: 0.7;
            }

            .overview-filled {
                color: var(--uui-color-positive, #2bc37c);
                display: inline-flex;
                align-items: center;
                gap: 4px;
            }

            .overview-filled uui-icon {
                font-size: 14px;
            }

            .overview-blank {
                color: var(--uui-color-danger, #d42054);
                opacity: 0.8;
            }

            .overview-blank-list {
                display: flex;
                flex-wrap: wrap;
                gap: 4px;
                align-items: center;
                margin-top: 2px;
            }

            .overview-blank-item {
                background: var(--uui-color-danger, #d42054);
                color: var(--uui-color-surface, #fff);
                border-radius: 3px;
                padding: 1px 6px;
                font-size: 11px;
            }

            uui-table {
                width: 100%;
            }

            .field-cell {
                font-weight: 600;
                white-space: nowrap;
                width: 1%;
                padding-right: var(--uui-size-space-4, 12px);
            }

            .result-cell {
                word-break: break-word;
            }

            .status-pending {
                opacity: 0.4;
                font-style: italic;
            }

            .status-brewing {
                display: inline-flex;
                align-items: center;
                gap: 6px;
                color: var(--uui-color-interactive, #1b264f);
            }

            .status-brewing uui-loader-circle {
                font-size: 16px;
            }

            .status-done {
                color: var(--uui-color-positive, #2bc37c);
            }

            .result-edit {
                width: 100%;
                box-sizing: border-box;
                color: var(--uui-color-positive, #2bc37c);
                background: transparent;
                border: 1px solid var(--uui-color-border, #d8d7d9);
                border-radius: var(--uui-border-radius, 3px);
                padding: var(--uui-size-space-2, 4px) var(--uui-size-space-3, 8px);
                font-family: inherit;
                font-size: inherit;
                line-height: 1.4;
                resize: vertical;
                field-sizing: content;
            }

            .result-edit:focus {
                outline: none;
                border-color: var(--uui-color-focus, #3544b1);
            }

            .result-row {
                display: flex;
                align-items: flex-start;
                gap: 4px;
            }

            .result-row textarea {
                flex: 1;
            }

            .result-row uui-button {
                flex-shrink: 0;
                margin-top: 2px;
            }

            .result-col {
                display: flex;
                flex-direction: column;
                gap: 4px;
            }

            .rebrew-input {
                display: flex;
                gap: 4px;
                align-items: center;
            }

            .rebrew-text {
                flex: 1;
                border: 1px solid var(--uui-color-border, #d8d7d9);
                border-radius: var(--uui-border-radius, 3px);
                padding: var(--uui-size-space-1, 3px) var(--uui-size-space-3, 8px);
                font-family: inherit;
                font-size: var(--uui-type-small-size, 12px);
                background: transparent;
                color: inherit;
            }

            .rebrew-text:focus {
                outline: none;
                border-color: var(--uui-color-focus, #3544b1);
            }

            .rebrew-text::placeholder {
                opacity: 0.5;
            }

            .icon-result {
                display: inline-flex;
                align-items: center;
                gap: 8px;
            }

            .icon-result uui-icon {
                font-size: 24px;
            }

            .current-icon {
                opacity: 0.6;
                margin-left: 4px;
                display: inline-flex;
                align-items: center;
                gap: 4px;
            }

            .status-error {
                color: var(--uui-color-danger, #d42054);
                font-style: italic;
            }

            div[slot='actions'] {
                display: flex;
                gap: var(--uui-size-space-2, 4px);
            }

            .save-error {
                color: var(--uui-color-danger, #d42054);
                padding: var(--uui-size-space-3, 8px);
                margin-bottom: var(--uui-size-space-3, 8px);
                border: 1px solid var(--uui-color-danger, #d42054);
                border-radius: var(--uui-border-radius, 3px);
            }

            .save-success {
                color: var(--uui-color-positive, #2bc37c);
                padding: var(--uui-size-space-3, 8px);
                margin-bottom: var(--uui-size-space-3, 8px);
                border: 1px solid var(--uui-color-positive, #2bc37c);
                border-radius: var(--uui-border-radius, 3px);
            }
        `;
  }
};
s = /* @__PURE__ */ new WeakSet();
g = function(e) {
  var r, o, u;
  const t = (r = this.modalContext) == null ? void 0 : r.data;
  if (!t) return [];
  const i = [], a = !!((o = t.documentTypeDescription) != null && o.trim());
  (e === "everything" || !a) && i.push({
    kind: "description",
    label: "Content Type Description",
    contextAlias: "document-type-descriptions",
    targetPropertyAlias: null,
    status: "pending",
    result: null
  });
  for (const c of t.properties) {
    const p = !!((u = c.description) != null && u.trim());
    (e === "everything" || !p) && i.push({
      kind: "description",
      label: c.name || c.alias,
      contextAlias: "property-descriptions",
      targetPropertyAlias: c.alias,
      status: "pending",
      result: null
    });
  }
  return i;
};
x = async function(e) {
  var i, a;
  this._rows = l(this, s, g).call(this, e), this._phase = "brewing";
  const t = (a = (i = this.modalContext) == null ? void 0 : i.data) == null ? void 0 : a.unique;
  for (let r = 0; r < this._rows.length; r++) {
    const o = this._rows[r];
    o.status = "brewing", this._rows = [...this._rows];
    const u = o.targetPropertyAlias ? `Write a description for the "${o.label}" property` : "Write a description for this content type", c = await _(
      this,
      u,
      o.contextAlias,
      t,
      o.targetPropertyAlias ?? void 0
    );
    o.status = c ? "done" : "error", o.result = c ?? "Failed to generate", this._rows = [...this._rows];
  }
};
C = async function() {
  var r;
  const e = (r = this.modalContext) == null ? void 0 : r.data, t = e == null ? void 0 : e.unique;
  this._rows = [{
    kind: "icon",
    label: "Icon",
    contextAlias: "content-type-icons",
    targetPropertyAlias: null,
    status: "brewing",
    result: null
  }], this._phase = "brewing";
  const i = `Pick the best icon for the "${(e == null ? void 0 : e.documentTypeName) ?? "content type"}" document type`, a = await _(
    this,
    i,
    "content-type-icons",
    t
  );
  this._rows[0].status = a ? "done" : "error", this._rows[0].result = a ?? "Failed to generate", this._rows = [...this._rows];
};
E = function() {
  var e;
  (e = this.modalContext) == null || e.reject();
};
D = function() {
  return this._rows.length > 0 && this._rows.every((e) => e.status === "done" || e.status === "error");
};
P = function() {
  return this._rows.some((e) => e.status === "done" && e.result);
};
R = async function() {
  var t, i, a, r;
  const e = (i = (t = this.modalContext) == null ? void 0 : t.data) == null ? void 0 : i.unique;
  if (e) {
    this._phase = "saving", this._saveError = null;
    try {
      const o = new M(this), { data: u } = await o.requestByUnique(e);
      if (!u) {
        this._saveError = "Could not load document type", this._phase = "brewing";
        return;
      }
      const c = structuredClone(u);
      for (const p of this._rows)
        if (!(p.status !== "done" || !p.result))
          if (p.kind === "icon")
            c.icon = p.result.trim();
          else if (!p.targetPropertyAlias)
            c.description = p.result;
          else {
            const d = (a = c.properties) == null ? void 0 : a.find((h) => h.alias === p.targetPropertyAlias);
            d && (d.description = p.result);
          }
      await o.save(c), (r = this.modalContext) == null || r.submit();
    } catch (o) {
      console.error("[Alchemy] Save failed:", o), this._saveError = "Failed to save document type", this._phase = "brewing";
    }
  }
};
I = function() {
  var c, p;
  const e = (c = this.modalContext) == null ? void 0 : c.data, t = l(this, s, g).call(this, "blanks").length, i = l(this, s, g).call(this, "everything").length, a = e == null ? void 0 : e.icon, r = !!((p = e == null ? void 0 : e.documentTypeDescription) != null && p.trim()), o = (e == null ? void 0 : e.properties.filter((d) => {
    var h;
    return !!((h = d.description) != null && h.trim());
  })) ?? [], u = (e == null ? void 0 : e.properties.filter((d) => {
    var h;
    return !((h = d.description) != null && h.trim());
  })) ?? [];
  return n`
            <uui-box>
                <p style="margin-top:0">
                    Generate AI descriptions for <strong>${(e == null ? void 0 : e.documentTypeName) ?? "this content type"}</strong>.
                </p>
                <div class="overview">
                    <div class="overview-row">
                        <span class="overview-label">Description</span>
                        ${r ? n`<span class="overview-filled">✓</span>` : n`<span class="overview-blank">✗ blank</span>`}
                    </div>
                    <div class="overview-row">
                        <span class="overview-label">Icon</span>
                        ${a ? n`<span class="overview-filled"><uui-icon name="${a.split(" ")[0]}"></uui-icon> ${a.split(" ")[0]}</span>` : n`<span class="overview-blank">✗ none</span>`}
                    </div>
                    <div class="overview-row">
                        <span class="overview-label">Properties</span>
                        <span>
                            ${o.length > 0 ? n`<span class="overview-filled">${o.length} filled</span>` : ""}
                            ${o.length === 0 && u.length === 0 ? n`<span class="overview-blank">none</span>` : ""}
                        </span>
                    </div>
                    ${u.length > 0 ? n`<div class="overview-blank-list">
                            <span class="overview-blank">${u.length} blank:</span>
                            ${u.map((d) => n`<span class="overview-blank-item">${d.name || d.alias}</span>`)}
                        </div>` : ""}
                </div>
                <div id="mode-buttons">
                    <uui-button
                        look="outline"
                        label="Brew The Blanks"
                        .disabled=${t === 0}
                        @click=${() => l(this, s, x).call(this, "blanks")}>
                        <uui-icon name="alchemy-brew-bottle"></uui-icon>
                        Brew The Blanks
                        <small>(${t} item${t !== 1 ? "s" : ""})</small>
                    </uui-button>
                    <uui-button
                        look="outline"
                        label="Brew Everything"
                        .disabled=${i === 0}
                        @click=${() => l(this, s, x).call(this, "everything")}>
                        <uui-icon name="alchemy-brew-bottle"></uui-icon>
                        Brew Everything
                        <small>(${i} item${i !== 1 ? "s" : ""})</small>
                    </uui-button>
                    <uui-button
                        look="outline"
                        label="Brew An Icon"
                        @click=${() => l(this, s, C).call(this)}>
                        <uui-icon name="alchemy-brew-bottle"></uui-icon>
                        Brew An Icon
                        ${a ? n`<small class="current-icon">Current: <uui-icon name="${a.split(" ")[0]}"></uui-icon></small>` : ""}
                    </uui-button>
                </div>
            </uui-box>
        `;
};
B = function() {
  return n`
            <uui-box>
                ${this._saveError ? n`<div class="save-error">${this._saveError}</div>` : ""}
                ${this._phase === "saved" ? n`<div class="save-success">All descriptions have been saved to the document type.</div>` : ""}
                <uui-table>
                    <uui-table-head>
                        <uui-table-head-cell>Field</uui-table-head-cell>
                        <uui-table-head-cell>Result</uui-table-head-cell>
                    </uui-table-head>
                    ${this._rows.map(
    (e) => n`
                            <uui-table-row>
                                <uui-table-cell class="field-cell">
                                    ${e.label}
                                </uui-table-cell>
                                <uui-table-cell class="result-cell">
                                    ${l(this, s, q).call(this, e)}
                                </uui-table-cell>
                            </uui-table-row>
                        `
  )}
                </uui-table>
            </uui-box>
        `;
};
T = function(e, t) {
  const i = t.target;
  e.result = i.value;
};
v = async function(e) {
  var c, p, d, h;
  const t = (p = (c = this.modalContext) == null ? void 0 : c.data) == null ? void 0 : p.unique, i = e.result ?? "", a = this._rebrewInstruction.trim();
  this._rebrewRow = null, this._rebrewInstruction = "", e.status = "brewing", e.result = null, this._rows = [...this._rows];
  let r;
  e.kind === "icon" ? r = `Pick the best icon for the "${((h = (d = this.modalContext) == null ? void 0 : d.data) == null ? void 0 : h.documentTypeName) ?? "content type"}" document type` : e.targetPropertyAlias ? r = `Write a description for the "${e.label}" property` : r = "Write a description for this content type";
  let o = r;
  a && i ? o = `${r}

You previously wrote:
${i}

The user wants this adjustment:
${a}` : a && (o = `${r}

Additional instruction:
${a}`);
  const u = await _(
    this,
    o,
    e.contextAlias,
    t,
    e.targetPropertyAlias ?? void 0
  );
  e.status = u ? "done" : "error", e.result = u ?? "Failed to generate", this._rows = [...this._rows];
};
w = function(e) {
  this._rebrewRow = e, this._rebrewInstruction = "";
};
$ = function() {
  this._rebrewRow = null, this._rebrewInstruction = "";
};
S = function(e, t) {
  t.key === "Enter" && !t.shiftKey ? (t.preventDefault(), l(this, s, v).call(this, e)) : t.key === "Escape" && l(this, s, $).call(this);
};
q = function(e) {
  const t = this._rebrewRow === e;
  switch (e.status) {
    case "pending":
      return n`<span class="status-pending">Waiting…</span>`;
    case "brewing":
      return n`<span class="status-brewing"><uui-loader-circle></uui-loader-circle> Brewing…</span>`;
    case "done":
      return e.kind === "icon" && e.result ? n`<div class="result-col">
                        <div class="result-row">
                            <span class="status-done icon-result"><uui-icon name="${e.result}"></uui-icon> ${e.result}</span>
                            <uui-button compact look="default" label="Rebrew" @click=${() => t ? l(this, s, v).call(this, e) : l(this, s, w).call(this, e)}>
                                <uui-icon name="alchemy-brew-bottle"></uui-icon>
                            </uui-button>
                        </div>
                        ${t ? l(this, s, y).call(this, e) : ""}
                    </div>` : n`<div class="result-col">
                    <div class="result-row">
                        <textarea
                            class="result-edit"
                            .value=${e.result ?? ""}
                            @input=${(i) => l(this, s, T).call(this, e, i)}
                            rows="2"></textarea>
                        <uui-button compact look="default" label="Rebrew" @click=${() => t ? l(this, s, v).call(this, e) : l(this, s, w).call(this, e)}>
                            <uui-icon name="alchemy-brew-bottle"></uui-icon>
                        </uui-button>
                    </div>
                    ${t ? l(this, s, y).call(this, e) : ""}
                </div>`;
    case "error":
      return n`<div class="result-col">
                    <div class="result-row">
                        <span class="status-error">Failed to generate</span>
                        <uui-button compact look="default" label="Retry" @click=${() => t ? l(this, s, v).call(this, e) : l(this, s, w).call(this, e)}>
                            <uui-icon name="alchemy-brew-bottle"></uui-icon>
                        </uui-button>
                    </div>
                    ${t ? l(this, s, y).call(this, e) : ""}
                </div>`;
  }
};
y = function(e) {
  return n`<div class="rebrew-input">
            <input
                type="text"
                class="rebrew-text"
                placeholder="Describe your adjustment… (Enter to brew, Esc to cancel)"
                .value=${this._rebrewInstruction}
                @input=${(t) => {
    this._rebrewInstruction = t.target.value;
  }}
                @keydown=${(t) => l(this, s, S).call(this, e, t)}
            />
            <uui-button compact look="primary" label="Brew" @click=${() => l(this, s, v).call(this, e)}>
                <uui-icon name="alchemy-brew-bottle"></uui-icon>
            </uui-button>
            <uui-button compact look="default" label="Cancel" @click=${() => l(this, s, $).call(this)}>
                ✕
            </uui-button>
        </div>`;
};
f([
  m()
], b.prototype, "_phase", 2);
f([
  m()
], b.prototype, "_rows", 2);
f([
  m()
], b.prototype, "_saveError", 2);
f([
  m()
], b.prototype, "_rebrewRow", 2);
f([
  m()
], b.prototype, "_rebrewInstruction", 2);
b = f([
  F("alchemy-do-alchemy-modal")
], b);
const Y = b;
export {
  b as AlchemyDoAlchemyModalElement,
  Y as default
};
//# sourceMappingURL=alchemy-do-alchemy-modal.element-B4irs1C4.js.map
