const p = "umb-content-type-design-editor-property", s = customElements.define.bind(customElements);
customElements.define = function(t, e, i) {
  if (t === p) {
    import("./alchemy-design-editor-property.element-BiledLXQ.js").then(({ createAlchemyDesignEditorPropertyClass: n }) => {
      const o = n(e);
      s(t, o, i);
    });
    return;
  }
  s(t, e, i);
};
function m(t, e, i, n) {
  setTimeout(async () => {
    const o = t.getByAlias(e);
    if (!o) {
      m(t, e, i, n);
      return;
    }
    const c = o;
    typeof c.element == "function" && await c.element(), await customElements.whenDefined(i), await n(), t.unregister(e), t.register({
      ...o,
      element: n,
      weight: (o.weight ?? 0) + 1
    });
  }, 200);
}
const r = (t, e) => {
  e.register({
    type: "modal",
    alias: "alchemy.modal.brew",
    name: "Alchemy Brew Modal",
    element: () => import("./alchemy-brew-modal.element-CwzndmE8.js")
  }), m(
    e,
    "Umb.WorkspaceView.PropertyType.Settings",
    "umb-property-type-workspace-view-settings",
    () => import("./alchemy-property-type-settings.element-DIzFs5y7.js")
  ), m(
    e,
    "Umb.WorkspaceView.BlockType.Grid.Settings",
    "umb-block-grid-type-workspace-view",
    () => import("./alchemy-block-grid-workspace-view.element-ifc5jjE2.js")
  ), m(
    e,
    "Umb.WorkspaceView.BlockType.List.Settings",
    "umb-block-list-type-workspace-view-settings",
    () => import("./alchemy-block-list-workspace-view.element-nojXNAJ_.js")
  ), e.register({
    type: "workspaceContext",
    alias: "alchemy.workspaceContext.documentType",
    name: "Alchemy Document Type Context Observer",
    api: () => import("./alchemy-doctype-context-observer-ZzWJjXdz.js"),
    conditions: [
      {
        alias: "Umb.Condition.WorkspaceAlias",
        match: "Umb.Workspace.DocumentType"
      }
    ]
  }), import("./alchemy-content-type-header.element-IC9JdgTt.js").then(({ patchAlchemyContentTypeHeader: i }) => {
    i();
  });
};
export {
  r as onInit
};
//# sourceMappingURL=dist.js.map
