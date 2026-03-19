import { html as n, css as P, state as v, customElement as S } from "@umbraco-cms/backoffice/external/lit";
import { UmbLitElement as T } from "@umbraco-cms/backoffice/lit-element";
import { c as g } from "./alchemy-brew.call-api-DXW5xEF1.js";
import { UmbDocumentTypeDetailRepository as q } from "@umbraco-cms/backoffice/document-type";
var I = Object.defineProperty, F = Object.getOwnPropertyDescriptor, _ = (t) => {
  throw TypeError(t);
}, b = (t, e, s, r) => {
  for (var i = r > 1 ? void 0 : r ? F(e, s) : e, o = t.length - 1, u; o >= 0; o--)
    (u = t[o]) && (i = (r ? u(e, s, i) : u(i)) || i);
  return r && i && I(e, s, i), i;
}, w = (t, e, s) => e.has(t) || _("Cannot " + s), f = (t, e, s) => (w(t, e, "read from private field"), s ? s.call(t) : e.get(t)), W = (t, e, s) => e.has(t) ? _("Cannot add the same private member more than once") : e instanceof WeakSet ? e.add(t) : e.set(t, s), c = (t, e, s) => (w(t, e, "access private method"), s), a, h, m, x, $, A, k, C, E, B, D;
let d = class extends T {
  constructor() {
    super(...arguments), W(this, a), this._phase = "choose", this._rows = [], this._saveError = null;
  }
  render() {
    return n`
            <umb-body-layout headline="Do Alchemy">
                ${this._phase === "choose" ? c(this, a, E).call(this) : c(this, a, B).call(this)}
                <div slot="actions">
                    ${this._phase === "brewing" && f(this, a, A) && f(this, a, k) ? n`
                            <uui-button
                                look="primary"
                                color="positive"
                                label="Accept"
                                @click=${c(this, a, C)}>
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
                    <uui-button look="secondary" label="Close" @click=${c(this, a, $)}>
                        ${this._phase === "choose" ? "Cancel" : "Close"}
                    </uui-button>
                </div>
            </umb-body-layout>
        `;
  }
  static get styles() {
    return P`
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
a = /* @__PURE__ */ new WeakSet();
h = function(t) {
  var i, o, u;
  const e = (i = this.modalContext) == null ? void 0 : i.data;
  if (!e) return [];
  const s = [], r = !!((o = e.documentTypeDescription) != null && o.trim());
  (t === "everything" || !r) && s.push({
    kind: "description",
    label: "Content Type Description",
    contextAlias: "document-type-descriptions",
    targetPropertyAlias: null,
    status: "pending",
    result: null
  });
  for (const l of e.properties) {
    const p = !!((u = l.description) != null && u.trim());
    (t === "everything" || !p) && s.push({
      kind: "description",
      label: l.name || l.alias,
      contextAlias: "property-descriptions",
      targetPropertyAlias: l.alias,
      status: "pending",
      result: null
    });
  }
  return s;
};
m = async function(t) {
  var s, r;
  this._rows = c(this, a, h).call(this, t), this._phase = "brewing";
  const e = (r = (s = this.modalContext) == null ? void 0 : s.data) == null ? void 0 : r.unique;
  for (let i = 0; i < this._rows.length; i++) {
    const o = this._rows[i];
    o.status = "brewing", this._rows = [...this._rows];
    const u = o.targetPropertyAlias ? `Write a description for the "${o.label}" property` : "Write a description for this content type", l = await g(
      this,
      u,
      o.contextAlias,
      e,
      o.targetPropertyAlias ?? void 0
    );
    o.status = l ? "done" : "error", o.result = l ?? "Failed to generate", this._rows = [...this._rows];
  }
};
x = async function() {
  var i;
  const t = (i = this.modalContext) == null ? void 0 : i.data, e = t == null ? void 0 : t.unique;
  this._rows = [{
    kind: "icon",
    label: "Icon",
    contextAlias: "content-type-icons",
    targetPropertyAlias: null,
    status: "brewing",
    result: null
  }], this._phase = "brewing";
  const s = `Pick the best icon for the "${(t == null ? void 0 : t.documentTypeName) ?? "content type"}" document type`, r = await g(
    this,
    s,
    "content-type-icons",
    e
  );
  this._rows[0].status = r ? "done" : "error", this._rows[0].result = r ?? "Failed to generate", this._rows = [...this._rows];
};
$ = function() {
  var t;
  (t = this.modalContext) == null || t.reject();
};
A = function() {
  return this._rows.length > 0 && this._rows.every((t) => t.status === "done" || t.status === "error");
};
k = function() {
  return this._rows.some((t) => t.status === "done" && t.result);
};
C = async function() {
  var e, s, r, i;
  const t = (s = (e = this.modalContext) == null ? void 0 : e.data) == null ? void 0 : s.unique;
  if (t) {
    this._phase = "saving", this._saveError = null;
    try {
      const o = new q(this), { data: u } = await o.requestByUnique(t);
      if (!u) {
        this._saveError = "Could not load document type", this._phase = "brewing";
        return;
      }
      const l = structuredClone(u);
      for (const p of this._rows)
        if (!(p.status !== "done" || !p.result))
          if (p.kind === "icon")
            l.icon = p.result.trim();
          else if (!p.targetPropertyAlias)
            l.description = p.result;
          else {
            const y = (r = l.properties) == null ? void 0 : r.find((z) => z.alias === p.targetPropertyAlias);
            y && (y.description = p.result);
          }
      await o.save(l), (i = this.modalContext) == null || i.submit();
    } catch (o) {
      console.error("[Alchemy] Save failed:", o), this._saveError = "Failed to save document type", this._phase = "brewing";
    }
  }
};
E = function() {
  var i;
  const t = (i = this.modalContext) == null ? void 0 : i.data, e = c(this, a, h).call(this, "blanks").length, s = c(this, a, h).call(this, "everything").length, r = t == null ? void 0 : t.icon;
  return n`
            <uui-box>
                <p style="margin-top:0">
                    Generate AI descriptions for <strong>${(t == null ? void 0 : t.documentTypeName) ?? "this content type"}</strong>.
                </p>
                <div id="mode-buttons">
                    <uui-button
                        look="outline"
                        label="Brew The Blanks"
                        .disabled=${e === 0}
                        @click=${() => c(this, a, m).call(this, "blanks")}>
                        <uui-icon name="alchemy-brew-bottle"></uui-icon>
                        Brew The Blanks
                        <small>(${e} item${e !== 1 ? "s" : ""})</small>
                    </uui-button>
                    <uui-button
                        look="outline"
                        label="Brew Everything"
                        .disabled=${s === 0}
                        @click=${() => c(this, a, m).call(this, "everything")}>
                        <uui-icon name="alchemy-brew-bottle"></uui-icon>
                        Brew Everything
                        <small>(${s} item${s !== 1 ? "s" : ""})</small>
                    </uui-button>
                    <uui-button
                        look="outline"
                        label="Brew An Icon"
                        @click=${() => c(this, a, x).call(this)}>
                        <uui-icon name="alchemy-brew-bottle"></uui-icon>
                        Brew An Icon
                        ${r ? n`<small class="current-icon">Current: <uui-icon name="${r.split(" ")[0]}"></uui-icon></small>` : ""}
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
    (t) => n`
                            <uui-table-row>
                                <uui-table-cell class="field-cell">
                                    ${t.label}
                                </uui-table-cell>
                                <uui-table-cell class="result-cell">
                                    ${c(this, a, D).call(this, t)}
                                </uui-table-cell>
                            </uui-table-row>
                        `
  )}
                </uui-table>
            </uui-box>
        `;
};
D = function(t) {
  switch (t.status) {
    case "pending":
      return n`<span class="status-pending">Waiting…</span>`;
    case "brewing":
      return n`<span class="status-brewing"><uui-loader-circle></uui-loader-circle> Brewing…</span>`;
    case "done":
      return t.kind === "icon" && t.result ? n`<span class="status-done icon-result"><uui-icon name="${t.result}"></uui-icon> ${t.result}</span>` : n`<span class="status-done">${t.result}</span>`;
    case "error":
      return n`<span class="status-error">Failed to generate</span>`;
  }
};
b([
  v()
], d.prototype, "_phase", 2);
b([
  v()
], d.prototype, "_rows", 2);
b([
  v()
], d.prototype, "_saveError", 2);
d = b([
  S("alchemy-do-alchemy-modal")
], d);
const G = d;
export {
  d as AlchemyDoAlchemyModalElement,
  G as default
};
//# sourceMappingURL=alchemy-do-alchemy-modal.element-ky4Mgxd1.js.map
