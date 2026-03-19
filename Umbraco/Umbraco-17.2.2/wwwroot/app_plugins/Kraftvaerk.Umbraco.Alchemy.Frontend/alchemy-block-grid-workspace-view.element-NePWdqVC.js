import { customElement as a } from "@umbraco-cms/backoffice/external/lit";
import { i as n } from "./alchemy-block-type-workspace-view.element-BEBwwHqb.js";
var u = Object.defineProperty, w = Object.getOwnPropertyDescriptor, f = (t, r, c, o) => {
  for (var e = o > 1 ? void 0 : o ? w(r, c) : r, s = t.length - 1, l; s >= 0; s--)
    (l = t[s]) && (e = (o ? l(r, c, e) : l(e)) || e);
  return o && e && u(r, c, e), e;
};
const i = customElements.get("umb-block-grid-type-workspace-view"), m = i.prototype.updated;
let p = class extends i {
  updated(t) {
    m == null || m.call(this, t), n(this);
  }
};
p = f([
  a("umb-alchemy-block-grid-workspace-view")
], p);
const d = p;
export {
  p as AlchemyBlockGridWorkspaceViewElement,
  d as default
};
//# sourceMappingURL=alchemy-block-grid-workspace-view.element-NePWdqVC.js.map
