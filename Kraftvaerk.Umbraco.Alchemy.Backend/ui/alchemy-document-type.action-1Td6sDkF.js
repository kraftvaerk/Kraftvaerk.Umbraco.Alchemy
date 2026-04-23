import { UmbEntityActionBase as u } from "@umbraco-cms/backoffice/entity-action";
import { UmbModalToken as d, UMB_MODAL_MANAGER_CONTEXT as y } from "@umbraco-cms/backoffice/modal";
import { UmbDocumentTypeDetailRepository as A } from "@umbraco-cms/backoffice/document-type";
import { p as T } from "./alchemy-brew.collect-property-context-DEp7QA2I.js";
const h = new d(
  "alchemy.modal.doAlchemy",
  { modal: { type: "sidebar", size: "medium" } }
);
class x extends u {
  async execute() {
    const o = this.args.unique;
    if (!o) return;
    const m = new A(this), { data: e } = await m.requestByUnique(o);
    if (!e) return;
    const l = e.containers ?? [], p = new Map(l.map((t) => [t.id, t])), a = (e.properties ?? []).map((t) => {
      var c;
      const n = (c = t.container) != null && c.id ? p.get(t.container.id) : void 0;
      return {
        name: t.name ?? "",
        alias: t.alias ?? "",
        description: t.description ?? null,
        containerName: (n == null ? void 0 : n.name) ?? null,
        containerType: (n == null ? void 0 : n.type) ?? null
      };
    }), s = e.name ?? "", r = e.description ?? null;
    await T(this, o, {
      documentTypeName: s,
      documentTypeAlias: e.alias ?? null,
      documentTypeDescription: r,
      isElementType: e.isElement ?? !1,
      targetPropertyAlias: "",
      allProperties: a
    });
    const i = await this.consumeContext(y, () => {
    }).asPromise();
    i == null || i.open(this, h, {
      data: {
        unique: o,
        documentTypeName: s,
        documentTypeDescription: r,
        icon: e.icon ?? null,
        properties: a
      }
    });
  }
}
export {
  x as AlchemyDocumentTypeAction,
  x as default
};
//# sourceMappingURL=alchemy-document-type.action-1Td6sDkF.js.map
