import { html as n, css as x, state as b, customElement as _ } from "@umbraco-cms/backoffice/external/lit";
import { UmbLitElement as f } from "@umbraco-cms/backoffice/lit-element";
var y = Object.defineProperty, w = Object.getOwnPropertyDescriptor, p = (t) => {
  throw TypeError(t);
}, m = (t, e, a, o) => {
  for (var i = o > 1 ? void 0 : o ? w(e, a) : e, s = t.length - 1, l; s >= 0; s--)
    (l = t[s]) && (i = (o ? l(e, a, i) : l(i)) || i);
  return o && i && y(e, a, i), i;
}, C = (t, e, a) => e.has(t) || p("Cannot " + a), g = (t, e, a) => e.has(t) ? p("Cannot add the same private member more than once") : e instanceof WeakSet ? e.add(t) : e.set(t, a), c = (t, e, a) => (C(t, e, "access private method"), a), r, h, d, v;
let u = class extends f {
  constructor() {
    super(...arguments), g(this, r), this._text = "";
  }
  render() {
    var e, a;
    const t = ((a = (e = this.modalContext) == null ? void 0 : e.data) == null ? void 0 : a.prompts) ?? [];
    return n`
            <umb-body-layout headline="Brew with AI">
                <uui-box>
                    ${t.length ? n`
                            <div id="alchemy-prompts">
                                ${t.map(
      (o) => n`
                                        <uui-button
                                            look="secondary"
                                            label=${o}
                                            @click=${() => c(this, r, h).call(this, o)}>
                                            ${o}
                                        </uui-button>
                                    `
    )}
                            </div>
                        ` : ""}

                    <uui-textarea
                        id="alchemy-prompt-input"
                        placeholder="Type a prompt…"
                        auto-height
                        .value=${this._text}
                        @input=${(o) => {
      this._text = o.target.value;
    }}>
                    </uui-textarea>
                </uui-box>

                <div slot="actions">
                    <uui-button
                        look="secondary"
                        label="Cancel"
                        @click=${() => c(this, r, v).call(this)}>
                        Cancel
                    </uui-button>
                    <uui-button
                        look="primary"
                        color="positive"
                        label="OK"
                        .disabled=${!this._text.trim()}
                        @click=${() => c(this, r, d).call(this)}>
                        OK
                    </uui-button>
                </div>
            </umb-body-layout>
        `;
  }
  static get styles() {
    return x`
            uui-box {
                display: block;
            }

            #alchemy-prompts {
                display: flex;
                flex-wrap: wrap;
                gap: var(--uui-size-space-2, 4px);
                margin-bottom: var(--uui-size-space-4, 12px);
            }

            #alchemy-prompts uui-button {
                --uui-button-background-color: var(--uui-color-surface-alt, #f3f3f5);
                --uui-button-background-color-hover: var(--uui-color-surface-emphasis, #e6e6ea);
            }

            uui-textarea {
                width: 100%;
                min-height: 80px;
            }

            div[slot='actions'] {
                display: flex;
                gap: var(--uui-size-space-2, 4px);
            }
        `;
  }
};
r = /* @__PURE__ */ new WeakSet();
h = function(t) {
  var e, a;
  (e = this.modalContext) == null || e.updateValue({ prompt: t }), (a = this.modalContext) == null || a.submit();
};
d = function() {
  var e, a;
  const t = this._text.trim();
  t && ((e = this.modalContext) == null || e.updateValue({ prompt: t }), (a = this.modalContext) == null || a.submit());
};
v = function() {
  var t;
  (t = this.modalContext) == null || t.reject();
};
m([
  b()
], u.prototype, "_text", 2);
u = m([
  _("alchemy-brew-modal")
], u);
const E = u;
export {
  u as AlchemyBrewModalElement,
  E as default
};
//# sourceMappingURL=alchemy-brew-modal.element-CwzndmE8.js.map
