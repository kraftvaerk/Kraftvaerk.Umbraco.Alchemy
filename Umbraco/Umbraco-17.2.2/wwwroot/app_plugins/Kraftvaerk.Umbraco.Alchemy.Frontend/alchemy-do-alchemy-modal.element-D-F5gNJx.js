import { html as l, css as z, state as m, customElement as B } from "@umbraco-cms/backoffice/external/lit";
import { UmbLitElement as P } from "@umbraco-cms/backoffice/lit-element";
import { c as S } from "./alchemy-brew.call-api-9xYIgl5a.js";
import { UmbDocumentTypeDetailRepository as T } from "@umbraco-cms/backoffice/document-type";
var q = Object.defineProperty, W = Object.getOwnPropertyDescriptor, g = (e) => {
  throw TypeError(e);
}, b = (e, t, s, o) => {
  for (var r = o > 1 ? void 0 : o ? W(t, s) : t, i = e.length - 1, n; i >= 0; i--)
    (n = e[i]) && (r = (o ? n(t, s, r) : n(r)) || r);
  return o && r && q(t, s, r), r;
}, _ = (e, t, s) => t.has(e) || g("Cannot " + s), f = (e, t, s) => (_(e, t, "read from private field"), s ? s.call(e) : t.get(e)), F = (e, t, s) => t.has(e) ? g("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, s), c = (e, t, s) => (_(e, t, "access private method"), s), a, h, v, w, x, $, A, C, k, E;
let d = class extends P {
  constructor() {
    super(...arguments), F(this, a), this._phase = "choose", this._rows = [], this._saveError = null;
  }
  render() {
    return l`
            <umb-body-layout headline="Do Alchemy">
                ${this._phase === "choose" ? c(this, a, C).call(this) : c(this, a, k).call(this)}
                <div slot="actions">
                    ${this._phase === "brewing" && f(this, a, x) && f(this, a, $) ? l`
                            <uui-button
                                look="primary"
                                color="positive"
                                label="Accept"
                                @click=${c(this, a, A)}>
                                Accept
                            </uui-button>
                        ` : ""}
                    ${this._phase === "saving" ? l`
                            <uui-button look="primary" color="positive" label="Saving…" disabled>
                                <uui-loader-circle></uui-loader-circle> Saving…
                            </uui-button>
                        ` : ""}
                    ${this._phase === "saved" ? l`
                            <uui-button look="primary" color="positive" label="Saved" disabled>
                                ✓ Saved
                            </uui-button>
                        ` : ""}
                    <uui-button look="secondary" label="Close" @click=${c(this, a, w)}>
                        ${this._phase === "choose" ? "Cancel" : "Close"}
                    </uui-button>
                </div>
            </umb-body-layout>
        `;
  }
  static get styles() {
    return z`
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
h = function(e) {
  var r, i, n;
  const t = (r = this.modalContext) == null ? void 0 : r.data;
  if (!t) return [];
  const s = [], o = !!((i = t.documentTypeDescription) != null && i.trim());
  (e === "everything" || !o) && s.push({
    label: "Content Type Description",
    contextAlias: "document-type-descriptions",
    targetPropertyAlias: null,
    status: "pending",
    result: null
  });
  for (const u of t.properties) {
    const p = !!((n = u.description) != null && n.trim());
    (e === "everything" || !p) && s.push({
      label: u.name || u.alias,
      contextAlias: "property-descriptions",
      targetPropertyAlias: u.alias,
      status: "pending",
      result: null
    });
  }
  return s;
};
v = async function(e) {
  var s, o;
  this._rows = c(this, a, h).call(this, e), this._phase = "brewing";
  const t = (o = (s = this.modalContext) == null ? void 0 : s.data) == null ? void 0 : o.unique;
  for (let r = 0; r < this._rows.length; r++) {
    const i = this._rows[r];
    i.status = "brewing", this._rows = [...this._rows];
    const n = i.targetPropertyAlias ? `Write a description for the "${i.label}" property` : "Write a description for this content type", u = await S(
      this,
      n,
      i.contextAlias,
      t,
      i.targetPropertyAlias ?? void 0
    );
    i.status = u ? "done" : "error", i.result = u ?? "Failed to generate", this._rows = [...this._rows];
  }
};
w = function() {
  var e;
  (e = this.modalContext) == null || e.reject();
};
x = function() {
  return this._rows.length > 0 && this._rows.every((e) => e.status === "done" || e.status === "error");
};
$ = function() {
  return this._rows.some((e) => e.status === "done" && e.result);
};
A = async function() {
  var t, s, o, r;
  const e = (s = (t = this.modalContext) == null ? void 0 : t.data) == null ? void 0 : s.unique;
  if (e) {
    this._phase = "saving", this._saveError = null;
    try {
      const i = new T(this), { data: n } = await i.requestByUnique(e);
      if (!n) {
        this._saveError = "Could not load document type", this._phase = "brewing";
        return;
      }
      const u = structuredClone(n);
      for (const p of this._rows)
        if (!(p.status !== "done" || !p.result))
          if (!p.targetPropertyAlias)
            u.description = p.result;
          else {
            const y = (o = u.properties) == null ? void 0 : o.find((D) => D.alias === p.targetPropertyAlias);
            y && (y.description = p.result);
          }
      await i.save(u), (r = this.modalContext) == null || r.submit();
    } catch (i) {
      console.error("[Alchemy] Save failed:", i), this._saveError = "Failed to save document type", this._phase = "brewing";
    }
  }
};
C = function() {
  var o;
  const e = (o = this.modalContext) == null ? void 0 : o.data, t = c(this, a, h).call(this, "blanks").length, s = c(this, a, h).call(this, "everything").length;
  return l`
            <uui-box>
                <p style="margin-top:0">
                    Generate AI descriptions for <strong>${(e == null ? void 0 : e.documentTypeName) ?? "this content type"}</strong>.
                </p>
                <div id="mode-buttons">
                    <uui-button
                        look="outline"
                        label="Brew The Blanks"
                        .disabled=${t === 0}
                        @click=${() => c(this, a, v).call(this, "blanks")}>
                        <uui-icon name="alchemy-brew-bottle"></uui-icon>
                        Brew The Blanks
                        <small>(${t} item${t !== 1 ? "s" : ""})</small>
                    </uui-button>
                    <uui-button
                        look="outline"
                        label="Brew Everything"
                        .disabled=${s === 0}
                        @click=${() => c(this, a, v).call(this, "everything")}>
                        <uui-icon name="alchemy-brew-bottle"></uui-icon>
                        Brew Everything
                        <small>(${s} item${s !== 1 ? "s" : ""})</small>
                    </uui-button>
                </div>
            </uui-box>
        `;
};
k = function() {
  return l`
            <uui-box>
                ${this._saveError ? l`<div class="save-error">${this._saveError}</div>` : ""}
                ${this._phase === "saved" ? l`<div class="save-success">All descriptions have been saved to the document type.</div>` : ""}
                <uui-table>
                    <uui-table-head>
                        <uui-table-head-cell>Field</uui-table-head-cell>
                        <uui-table-head-cell>Result</uui-table-head-cell>
                    </uui-table-head>
                    ${this._rows.map(
    (e) => l`
                            <uui-table-row>
                                <uui-table-cell class="field-cell">
                                    ${e.label}
                                </uui-table-cell>
                                <uui-table-cell class="result-cell">
                                    ${c(this, a, E).call(this, e)}
                                </uui-table-cell>
                            </uui-table-row>
                        `
  )}
                </uui-table>
            </uui-box>
        `;
};
E = function(e) {
  switch (e.status) {
    case "pending":
      return l`<span class="status-pending">Waiting…</span>`;
    case "brewing":
      return l`<span class="status-brewing"><uui-loader-circle></uui-loader-circle> Brewing…</span>`;
    case "done":
      return l`<span class="status-done">${e.result}</span>`;
    case "error":
      return l`<span class="status-error">Failed to generate</span>`;
  }
};
b([
  m()
], d.prototype, "_phase", 2);
b([
  m()
], d.prototype, "_rows", 2);
b([
  m()
], d.prototype, "_saveError", 2);
d = b([
  B("alchemy-do-alchemy-modal")
], d);
const G = d;
export {
  d as AlchemyDoAlchemyModalElement,
  G as default
};
//# sourceMappingURL=alchemy-do-alchemy-modal.element-D-F5gNJx.js.map
