import { customElement as n } from "@umbraco-cms/backoffice/external/lit";
import { i as a } from "./alchemy-block-type-workspace-view.element-DlHsIGUd.js";
var u = Object.defineProperty, w = Object.getOwnPropertyDescriptor, f = (t, s, c, o) => {
  for (var e = o > 1 ? void 0 : o ? w(s, c) : s, l = t.length - 1, r; l >= 0; l--)
    (r = t[l]) && (e = (o ? r(s, c, e) : r(e)) || e);
  return o && e && u(s, c, e), e;
};
const i = customElements.get("umb-block-list-type-workspace-view-settings"), m = i.prototype.updated;
let p = class extends i {
  updated(t) {
    m == null || m.call(this, t), a(this);
  }
};
p = f([
  n("umb-alchemy-block-list-workspace-view")
], p);
const y = p;
export {
  p as AlchemyBlockListWorkspaceViewElement,
  y as default
};
//# sourceMappingURL=alchemy-block-list-workspace-view.element-0AvR9h6O.js.map
