import { UmbEntityActionBase as d } from "@umbraco-cms/backoffice/entity-action";
import { UmbModalToken as y, UMB_MODAL_MANAGER_CONTEXT as h } from "@umbraco-cms/backoffice/modal";
import { UmbDocumentTypeDetailRepository as A } from "@umbraco-cms/backoffice/document-type";
import { p as T } from "./alchemy-brew.collect-property-context-GXd57oBP.js";
const f = new y(
  "alchemy.modal.doAlchemy",
  { modal: { type: "sidebar", size: "medium" } }
);
class x extends d {
  async execute() {
    const o = this.args.unique;
    if (!o) return;
    const m = new A(this), { data: e } = await m.requestByUnique(o);
    if (!e) return;
    const l = e.containers ?? [], p = new Map(l.map((t) => [t.id, t])), s = (e.properties ?? []).map((t) => {
      var c;
      const n = (c = t.container) != null && c.id ? p.get(t.container.id) : void 0;
      return {
        name: t.name ?? "",
        alias: t.alias ?? "",
        description: t.description ?? null,
        containerName: (n == null ? void 0 : n.name) ?? null,
        containerType: (n == null ? void 0 : n.type) ?? null
      };
    }), a = e.name ?? "", r = e.description ?? null, u = this._host;
    await T(u, o, {
      documentTypeName: a,
      documentTypeAlias: e.alias ?? null,
      documentTypeDescription: r,
      isElementType: e.isElement ?? !1,
      targetPropertyAlias: "",
      allProperties: s
    });
    const i = await this.consumeContext(h, () => {
    }).asPromise();
    i == null || i.open(this, f, {
      data: {
        unique: o,
        documentTypeName: a,
        documentTypeDescription: r,
        icon: e.icon ?? null,
        properties: s
      }
    });
  }
}
export {
  x as AlchemyDocumentTypeAction,
  x as default
};
//# sourceMappingURL=alchemy-document-type.action-BDsP4Q3n.js.map
