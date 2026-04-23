import { html as n, css as W, state as m, customElement as F } from "@umbraco-cms/backoffice/external/lit";
import { UmbLitElement as K } from "@umbraco-cms/backoffice/lit-element";
import { c as _ } from "./alchemy-brew.call-api-C3Bu3Kal.js";
import { UmbDocumentTypeDetailRepository as M } from "@umbraco-cms/backoffice/document-type";
var O = Object.defineProperty, j = Object.getOwnPropertyDescriptor, A = (e) => {
  throw TypeError(e);
}, f = (e, t, i, o) => {
  for (var s = o > 1 ? void 0 : o ? j(t, i) : t, l = e.length - 1, c; l >= 0; l--)
    (c = e[l]) && (s = (o ? c(t, i, s) : c(s)) || s);
  return o && s && O(t, i, s), s;
}, z = (e, t, i) => t.has(e) || A("Cannot " + i), k = (e, t, i) => (z(e, t, "read from private field"), i ? i.call(e) : t.get(e)), N = (e, t, i) => t.has(e) ? A("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), a = (e, t, i) => (z(e, t, "access private method"), i), r, g, x, C, E, D, P, R, I, B, T, v, w, $, S, q, y;
let b = class extends K {
  constructor() {
    super(...arguments), N(this, r), this._phase = "choose", this._rows = [], this._saveError = null, this._rebrewRow = null, this._rebrewInstruction = "";
  }
  render() {
    return n`
            <umb-body-layout headline="Do Alchemy">
                ${this._phase === "choose" ? a(this, r, I).call(this) : a(this, r, B).call(this)}
                <div slot="actions">
                    ${this._phase === "brewing" && k(this, r, D) && k(this, r, P) ? n`
                            <uui-button
                                look="primary"
                                color="positive"
                                label="Accept"
                                @click=${a(this, r, R)}>
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
                    <uui-button look="secondary" label="Close" @click=${a(this, r, E)}>
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
r = /* @__PURE__ */ new WeakSet();
g = function(e) {
  var s, l, c;
  const t = (s = this.modalContext) == null ? void 0 : s.data;
  if (!t) return [];
  const i = [], o = !!((l = t.documentTypeDescription) != null && l.trim());
  (e === "everything" || !o) && i.push({
    kind: "description",
    label: "Content Type Description",
    contextAlias: "document-type-descriptions",
    targetPropertyAlias: null,
    status: "pending",
    result: null
  });
  for (const u of t.properties) {
    const d = !!((c = u.description) != null && c.trim());
    (e === "everything" || !d) && i.push({
      kind: "description",
      label: u.name || u.alias,
      contextAlias: "property-descriptions",
      targetPropertyAlias: u.alias,
      status: "pending",
      result: null
    });
  }
  return i;
};
x = async function(e) {
  var i, o;
  this._rows = a(this, r, g).call(this, e), this._phase = "brewing";
  const t = (o = (i = this.modalContext) == null ? void 0 : i.data) == null ? void 0 : o.unique;
  for (let s = 0; s < this._rows.length; s++) {
    const l = this._rows[s];
    l.status = "brewing", this._rows = [...this._rows];
    const c = l.targetPropertyAlias ? `Write a description for the "${l.label}" property` : "Write a description for this content type", u = await _(
      this,
      c,
      l.contextAlias,
      t,
      l.targetPropertyAlias ?? void 0
    );
    l.status = u ? "done" : "error", l.result = u ?? "Failed to generate", this._rows = [...this._rows];
  }
};
C = async function() {
  var s;
  const e = (s = this.modalContext) == null ? void 0 : s.data, t = e == null ? void 0 : e.unique;
  this._rows = [{
    kind: "icon",
    label: "Icon",
    contextAlias: "content-type-icons",
    targetPropertyAlias: null,
    status: "brewing",
    result: null
  }], this._phase = "brewing";
  const i = `Pick the best icon for the "${(e == null ? void 0 : e.documentTypeName) ?? "content type"}" document type`, o = await _(
    this,
    i,
    "content-type-icons",
    t
  );
  this._rows[0].status = o ? "done" : "error", this._rows[0].result = o ?? "Failed to generate", this._rows = [...this._rows];
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
  var t, i, o;
  const e = (i = (t = this.modalContext) == null ? void 0 : t.data) == null ? void 0 : i.unique;
  if (e) {
    this._phase = "saving", this._saveError = null;
    try {
      const s = new M(this), { data: l } = await s.requestByUnique(e);
      if (!l) {
        this._saveError = "Could not load document type", this._phase = "brewing";
        return;
      }
      const c = structuredClone(l);
      for (const u of this._rows)
        if (!(u.status !== "done" || !u.result))
          if (u.kind === "icon")
            c.icon = u.result.trim();
          else if (!u.targetPropertyAlias)
            c.description = u.result;
          else {
            const d = (o = c.properties) == null ? void 0 : o.find((p) => p.alias === u.targetPropertyAlias);
            d && (d.description = u.result);
          }
      await s.save(c), this._phase = "saved";
    } catch (s) {
      console.error("[Alchemy] Save failed:", s), this._saveError = "Failed to save document type", this._phase = "brewing";
    }
  }
};
I = function() {
  var u, d;
  const e = (u = this.modalContext) == null ? void 0 : u.data, t = a(this, r, g).call(this, "blanks").length, i = a(this, r, g).call(this, "everything").length, o = e == null ? void 0 : e.icon, s = !!((d = e == null ? void 0 : e.documentTypeDescription) != null && d.trim()), l = (e == null ? void 0 : e.properties.filter((p) => {
    var h;
    return !!((h = p.description) != null && h.trim());
  })) ?? [], c = (e == null ? void 0 : e.properties.filter((p) => {
    var h;
    return !((h = p.description) != null && h.trim());
  })) ?? [];
  return n`
            <uui-box>
                <p style="margin-top:0">
                    Generate AI descriptions for <strong>${(e == null ? void 0 : e.documentTypeName) ?? "this content type"}</strong>.
                </p>
                <div class="overview">
                    <div class="overview-row">
                        <span class="overview-label">Description</span>
                        ${s ? n`<span class="overview-filled">✓</span>` : n`<span class="overview-blank">✗ blank</span>`}
                    </div>
                    <div class="overview-row">
                        <span class="overview-label">Icon</span>
                        ${o ? n`<span class="overview-filled"><uui-icon name="${o.split(" ")[0]}"></uui-icon> ${o.split(" ")[0]}</span>` : n`<span class="overview-blank">✗ none</span>`}
                    </div>
                    <div class="overview-row">
                        <span class="overview-label">Properties</span>
                        <span>
                            ${l.length > 0 ? n`<span class="overview-filled">${l.length} filled</span>` : ""}
                            ${l.length === 0 && c.length === 0 ? n`<span class="overview-blank">none</span>` : ""}
                        </span>
                    </div>
                    ${c.length > 0 ? n`<div class="overview-blank-list">
                            <span class="overview-blank">${c.length} blank:</span>
                            ${c.map((p) => n`<span class="overview-blank-item">${p.name || p.alias}</span>`)}
                        </div>` : ""}
                </div>
                <div id="mode-buttons">
                    <uui-button
                        look="outline"
                        label="Brew The Blanks"
                        .disabled=${t === 0}
                        @click=${() => a(this, r, x).call(this, "blanks")}>
                        <uui-icon name="alchemy-brew-bottle"></uui-icon>
                        Brew The Blanks
                        <small>(${t} item${t !== 1 ? "s" : ""})</small>
                    </uui-button>
                    <uui-button
                        look="outline"
                        label="Brew Everything"
                        .disabled=${i === 0}
                        @click=${() => a(this, r, x).call(this, "everything")}>
                        <uui-icon name="alchemy-brew-bottle"></uui-icon>
                        Brew Everything
                        <small>(${i} item${i !== 1 ? "s" : ""})</small>
                    </uui-button>
                    <uui-button
                        look="outline"
                        label="Brew An Icon"
                        @click=${() => a(this, r, C).call(this)}>
                        <uui-icon name="alchemy-brew-bottle"></uui-icon>
                        Brew An Icon
                        ${o ? n`<small class="current-icon">Current: <uui-icon name="${o.split(" ")[0]}"></uui-icon></small>` : ""}
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
                                    ${a(this, r, q).call(this, e)}
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
  var u, d, p, h;
  const t = (d = (u = this.modalContext) == null ? void 0 : u.data) == null ? void 0 : d.unique, i = e.result ?? "", o = this._rebrewInstruction.trim();
  this._rebrewRow = null, this._rebrewInstruction = "", e.status = "brewing", e.result = null, this._rows = [...this._rows];
  let s;
  e.kind === "icon" ? s = `Pick the best icon for the "${((h = (p = this.modalContext) == null ? void 0 : p.data) == null ? void 0 : h.documentTypeName) ?? "content type"}" document type` : e.targetPropertyAlias ? s = `Write a description for the "${e.label}" property` : s = "Write a description for this content type";
  let l = s;
  o && i ? l = `${s}

You previously wrote:
${i}

The user wants this adjustment:
${o}` : o && (l = `${s}

Additional instruction:
${o}`);
  const c = await _(
    this,
    l,
    e.contextAlias,
    t,
    e.targetPropertyAlias ?? void 0
  );
  e.status = c ? "done" : "error", e.result = c ?? "Failed to generate", this._rows = [...this._rows];
};
w = function(e) {
  this._rebrewRow = e, this._rebrewInstruction = "";
};
$ = function() {
  this._rebrewRow = null, this._rebrewInstruction = "";
};
S = function(e, t) {
  t.key === "Enter" && !t.shiftKey ? (t.preventDefault(), a(this, r, v).call(this, e)) : t.key === "Escape" && a(this, r, $).call(this);
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
                            <uui-button compact look="default" label="Rebrew" @click=${() => t ? a(this, r, v).call(this, e) : a(this, r, w).call(this, e)}>
                                <uui-icon name="alchemy-brew-bottle"></uui-icon>
                            </uui-button>
                        </div>
                        ${t ? a(this, r, y).call(this, e) : ""}
                    </div>` : n`<div class="result-col">
                    <div class="result-row">
                        <textarea
                            class="result-edit"
                            .value=${e.result ?? ""}
                            @input=${(i) => a(this, r, T).call(this, e, i)}
                            rows="2"></textarea>
                        <uui-button compact look="default" label="Rebrew" @click=${() => t ? a(this, r, v).call(this, e) : a(this, r, w).call(this, e)}>
                            <uui-icon name="alchemy-brew-bottle"></uui-icon>
                        </uui-button>
                    </div>
                    ${t ? a(this, r, y).call(this, e) : ""}
                </div>`;
    case "error":
      return n`<div class="result-col">
                    <div class="result-row">
                        <span class="status-error">Failed to generate</span>
                        <uui-button compact look="default" label="Retry" @click=${() => t ? a(this, r, v).call(this, e) : a(this, r, w).call(this, e)}>
                            <uui-icon name="alchemy-brew-bottle"></uui-icon>
                        </uui-button>
                    </div>
                    ${t ? a(this, r, y).call(this, e) : ""}
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
                @keydown=${(t) => a(this, r, S).call(this, e, t)}
            />
            <uui-button compact look="primary" label="Brew" @click=${() => a(this, r, v).call(this, e)}>
                <uui-icon name="alchemy-brew-bottle"></uui-icon>
            </uui-button>
            <uui-button compact look="default" label="Cancel" @click=${() => a(this, r, $).call(this)}>
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
//# sourceMappingURL=alchemy-do-alchemy-modal.element-DdOmVw3N.js.map
