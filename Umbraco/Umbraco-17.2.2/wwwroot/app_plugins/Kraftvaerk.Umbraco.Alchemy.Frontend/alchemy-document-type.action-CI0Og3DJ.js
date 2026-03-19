import { UmbEntityActionBase as d } from "@umbraco-cms/backoffice/entity-action";
import { UmbModalToken as y, UMB_MODAL_MANAGER_CONTEXT as h } from "@umbraco-cms/backoffice/modal";
import { UmbDocumentTypeDetailRepository as A } from "@umbraco-cms/backoffice/document-type";
import { p as T } from "./alchemy-brew.collect-property-context-Bw4lto7E.js";
const f = new y(
  "alchemy.modal.doAlchemy",
  { modal: { type: "sidebar", size: "medium" } }
);
class x extends d {
  async execute() {
    const o = this.args.unique;
    if (!o) return;
    const c = new A(this), { data: t } = await c.requestByUnique(o);
    if (!t) return;
    const l = t.containers ?? [], p = new Map(l.map((e) => [e.id, e])), s = (t.properties ?? []).map((e) => {
      var m;
      const n = (m = e.container) != null && m.id ? p.get(e.container.id) : void 0;
      return {
        name: e.name ?? "",
        alias: e.alias ?? "",
        description: e.description ?? null,
        containerName: (n == null ? void 0 : n.name) ?? null,
        containerType: (n == null ? void 0 : n.type) ?? null
      };
    }), a = t.name ?? "", r = t.description ?? null, u = this._host;
    await T(u, o, {
      documentTypeName: a,
      documentTypeAlias: t.alias ?? null,
      documentTypeDescription: r,
      isElementType: t.isElement ?? !1,
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
        properties: s
      }
    });
  }
}
export {
  x as AlchemyDocumentTypeAction,
  x as default
};
//# sourceMappingURL=alchemy-document-type.action-CI0Og3DJ.js.map
