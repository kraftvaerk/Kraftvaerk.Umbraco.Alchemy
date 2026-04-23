import { UMB_AUTH_CONTEXT as R } from "@umbraco-cms/backoffice/auth";
const X = {
  bodySerializer: (e) => JSON.stringify(
    e,
    (t, r) => typeof r == "bigint" ? r.toString() : r
  )
}, Y = ({
  onRequest: e,
  onSseError: t,
  onSseEvent: r,
  responseTransformer: a,
  responseValidator: s,
  sseDefaultRetryDelay: c,
  sseMaxRetryAttempts: o,
  sseMaxRetryDelay: n,
  sseSleepFn: l,
  url: u,
  ...i
}) => {
  let d;
  const S = l ?? ((f) => new Promise((p) => setTimeout(p, f)));
  return { stream: async function* () {
    let f = c ?? 3e3, p = 0;
    const A = i.signal ?? new AbortController().signal;
    for (; !A.aborted; ) {
      p++;
      const j = i.headers instanceof Headers ? i.headers : new Headers(i.headers);
      d !== void 0 && j.set("Last-Event-ID", d);
      try {
        const k = {
          redirect: "follow",
          ...i,
          body: i.serializedBody,
          headers: j,
          signal: A
        };
        let b = new Request(u, k);
        e && (b = await e(u, k));
        const y = await (i.fetch ?? globalThis.fetch)(b);
        if (!y.ok)
          throw new Error(
            `SSE failed: ${y.status} ${y.statusText}`
          );
        if (!y.body) throw new Error("No body in SSE response");
        const w = y.body.pipeThrough(new TextDecoderStream()).getReader();
        let U = "";
        const I = () => {
          try {
            w.cancel();
          } catch {
          }
        };
        A.addEventListener("abort", I);
        try {
          for (; ; ) {
            const { done: G, value: J } = await w.read();
            if (G) break;
            U += J;
            const $ = U.split(`

`);
            U = $.pop() ?? "";
            for (const F of $) {
              const Q = F.split(`
`), C = [];
              let D;
              for (const m of Q)
                if (m.startsWith("data:"))
                  C.push(m.replace(/^data:\s*/, ""));
                else if (m.startsWith("event:"))
                  D = m.replace(/^event:\s*/, "");
                else if (m.startsWith("id:"))
                  d = m.replace(/^id:\s*/, "");
                else if (m.startsWith("retry:")) {
                  const P = Number.parseInt(
                    m.replace(/^retry:\s*/, ""),
                    10
                  );
                  Number.isNaN(P) || (f = P);
                }
              let T, v = !1;
              if (C.length) {
                const m = C.join(`
`);
                try {
                  T = JSON.parse(m), v = !0;
                } catch {
                  T = m;
                }
              }
              v && (s && await s(T), a && (T = await a(T))), r == null || r({
                data: T,
                event: D,
                id: d,
                retry: f
              }), C.length && (yield T);
            }
          }
        } finally {
          A.removeEventListener("abort", I), w.releaseLock();
        }
        break;
      } catch (k) {
        if (t == null || t(k), o !== void 0 && p >= o)
          break;
        const b = Math.min(
          f * 2 ** (p - 1),
          n ?? 3e4
        );
        await S(b);
      }
    }
  }() };
}, Z = (e) => {
  switch (e) {
    case "label":
      return ".";
    case "matrix":
      return ";";
    case "simple":
      return ",";
    default:
      return "&";
  }
}, ee = (e) => {
  switch (e) {
    case "form":
      return ",";
    case "pipeDelimited":
      return "|";
    case "spaceDelimited":
      return "%20";
    default:
      return ",";
  }
}, te = (e) => {
  switch (e) {
    case "label":
      return ".";
    case "matrix":
      return ";";
    case "simple":
      return ",";
    default:
      return "&";
  }
}, H = ({
  allowReserved: e,
  explode: t,
  name: r,
  style: a,
  value: s
}) => {
  if (!t) {
    const n = (e ? s : s.map((l) => encodeURIComponent(l))).join(ee(a));
    switch (a) {
      case "label":
        return `.${n}`;
      case "matrix":
        return `;${r}=${n}`;
      case "simple":
        return n;
      default:
        return `${r}=${n}`;
    }
  }
  const c = Z(a), o = s.map((n) => a === "label" || a === "simple" ? e ? n : encodeURIComponent(n) : x({
    allowReserved: e,
    name: r,
    value: n
  })).join(c);
  return a === "label" || a === "matrix" ? c + o : o;
}, x = ({
  allowReserved: e,
  name: t,
  value: r
}) => {
  if (r == null)
    return "";
  if (typeof r == "object")
    throw new Error(
      "Deeply-nested arrays/objects aren’t supported. Provide your own `querySerializer()` to handle these."
    );
  return `${t}=${e ? r : encodeURIComponent(r)}`;
}, _ = ({
  allowReserved: e,
  explode: t,
  name: r,
  style: a,
  value: s,
  valueOnly: c
}) => {
  if (s instanceof Date)
    return c ? s.toISOString() : `${r}=${s.toISOString()}`;
  if (a !== "deepObject" && !t) {
    let l = [];
    Object.entries(s).forEach(([i, d]) => {
      l = [
        ...l,
        i,
        e ? d : encodeURIComponent(d)
      ];
    });
    const u = l.join(",");
    switch (a) {
      case "form":
        return `${r}=${u}`;
      case "label":
        return `.${u}`;
      case "matrix":
        return `;${r}=${u}`;
      default:
        return u;
    }
  }
  const o = te(a), n = Object.entries(s).map(
    ([l, u]) => x({
      allowReserved: e,
      name: a === "deepObject" ? `${r}[${l}]` : l,
      value: u
    })
  ).join(o);
  return a === "label" || a === "matrix" ? o + n : n;
}, re = /\{[^{}]+\}/g, ae = ({ path: e, url: t }) => {
  let r = t;
  const a = t.match(re);
  if (a)
    for (const s of a) {
      let c = !1, o = s.substring(1, s.length - 1), n = "simple";
      o.endsWith("*") && (c = !0, o = o.substring(0, o.length - 1)), o.startsWith(".") ? (o = o.substring(1), n = "label") : o.startsWith(";") && (o = o.substring(1), n = "matrix");
      const l = e[o];
      if (l == null)
        continue;
      if (Array.isArray(l)) {
        r = r.replace(
          s,
          H({ explode: c, name: o, style: n, value: l })
        );
        continue;
      }
      if (typeof l == "object") {
        r = r.replace(
          s,
          _({
            explode: c,
            name: o,
            style: n,
            value: l,
            valueOnly: !0
          })
        );
        continue;
      }
      if (n === "matrix") {
        r = r.replace(
          s,
          `;${x({
            name: o,
            value: l
          })}`
        );
        continue;
      }
      const u = encodeURIComponent(
        n === "label" ? `.${l}` : l
      );
      r = r.replace(s, u);
    }
  return r;
}, se = ({
  baseUrl: e,
  path: t,
  query: r,
  querySerializer: a,
  url: s
}) => {
  const c = s.startsWith("/") ? s : `/${s}`;
  let o = (e ?? "") + c;
  t && (o = ae({ path: t, url: o }));
  let n = r ? a(r) : "";
  return n.startsWith("?") && (n = n.substring(1)), n && (o += `?${n}`), o;
};
function ne(e) {
  const t = e.body !== void 0;
  if (t && e.bodySerializer)
    return "serializedBody" in e ? e.serializedBody !== void 0 && e.serializedBody !== "" ? e.serializedBody : null : e.body !== "" ? e.body : null;
  if (t)
    return e.body;
}
const ie = async (e, t) => {
  const r = typeof t == "function" ? await t(e) : t;
  if (r)
    return e.scheme === "bearer" ? `Bearer ${r}` : e.scheme === "basic" ? `Basic ${btoa(r)}` : r;
}, K = ({
  allowReserved: e,
  array: t,
  object: r
} = {}) => (s) => {
  const c = [];
  if (s && typeof s == "object")
    for (const o in s) {
      const n = s[o];
      if (n != null)
        if (Array.isArray(n)) {
          const l = H({
            allowReserved: e,
            explode: !0,
            name: o,
            style: "form",
            value: n,
            ...t
          });
          l && c.push(l);
        } else if (typeof n == "object") {
          const l = _({
            allowReserved: e,
            explode: !0,
            name: o,
            style: "deepObject",
            value: n,
            ...r
          });
          l && c.push(l);
        } else {
          const l = x({
            allowReserved: e,
            name: o,
            value: n
          });
          l && c.push(l);
        }
    }
  return c.join("&");
}, oe = (e) => {
  var r;
  if (!e)
    return "stream";
  const t = (r = e.split(";")[0]) == null ? void 0 : r.trim();
  if (t) {
    if (t.startsWith("application/json") || t.endsWith("+json"))
      return "json";
    if (t === "multipart/form-data")
      return "formData";
    if (["application/", "audio/", "image/", "video/"].some(
      (a) => t.startsWith(a)
    ))
      return "blob";
    if (t.startsWith("text/"))
      return "text";
  }
}, ce = (e, t) => {
  var r, a;
  return t ? !!(e.headers.has(t) || (r = e.query) != null && r[t] || (a = e.headers.get("Cookie")) != null && a.includes(`${t}=`)) : !1;
}, le = async ({
  security: e,
  ...t
}) => {
  for (const r of e) {
    if (ce(t, r.name))
      continue;
    const a = await ie(r, t.auth);
    if (!a)
      continue;
    const s = r.name ?? "Authorization";
    switch (r.in) {
      case "query":
        t.query || (t.query = {}), t.query[s] = a;
        break;
      case "cookie":
        t.headers.append("Cookie", `${s}=${a}`);
        break;
      case "header":
      default:
        t.headers.set(s, a);
        break;
    }
  }
}, N = (e) => se({
  baseUrl: e.baseUrl,
  path: e.path,
  query: e.query,
  querySerializer: typeof e.querySerializer == "function" ? e.querySerializer : K(e.querySerializer),
  url: e.url
}), W = (e, t) => {
  var a;
  const r = { ...e, ...t };
  return (a = r.baseUrl) != null && a.endsWith("/") && (r.baseUrl = r.baseUrl.substring(0, r.baseUrl.length - 1)), r.headers = L(e.headers, t.headers), r;
}, fe = (e) => {
  const t = [];
  return e.forEach((r, a) => {
    t.push([a, r]);
  }), t;
}, L = (...e) => {
  const t = new Headers();
  for (const r of e) {
    if (!r)
      continue;
    const a = r instanceof Headers ? fe(r) : Object.entries(r);
    for (const [s, c] of a)
      if (c === null)
        t.delete(s);
      else if (Array.isArray(c))
        for (const o of c)
          t.append(s, o);
      else c !== void 0 && t.set(
        s,
        typeof c == "object" ? JSON.stringify(c) : c
      );
  }
  return t;
};
class B {
  constructor() {
    this.fns = [];
  }
  clear() {
    this.fns = [];
  }
  eject(t) {
    const r = this.getInterceptorIndex(t);
    this.fns[r] && (this.fns[r] = null);
  }
  exists(t) {
    const r = this.getInterceptorIndex(t);
    return !!this.fns[r];
  }
  getInterceptorIndex(t) {
    return typeof t == "number" ? this.fns[t] ? t : -1 : this.fns.indexOf(t);
  }
  update(t, r) {
    const a = this.getInterceptorIndex(t);
    return this.fns[a] ? (this.fns[a] = r, t) : !1;
  }
  use(t) {
    return this.fns.push(t), this.fns.length - 1;
  }
}
const ue = () => ({
  error: new B(),
  request: new B(),
  response: new B()
}), de = K({
  allowReserved: !1,
  array: {
    explode: !0,
    style: "form"
  },
  object: {
    explode: !0,
    style: "deepObject"
  }
}), he = {
  "Content-Type": "application/json"
}, M = (e = {}) => ({
  ...X,
  headers: he,
  parseAs: "auto",
  querySerializer: de,
  ...e
}), pe = (e = {}) => {
  let t = W(M(), e);
  const r = () => ({ ...t }), a = (u) => (t = W(t, u), r()), s = ue(), c = async (u) => {
    const i = {
      ...t,
      ...u,
      fetch: u.fetch ?? t.fetch ?? globalThis.fetch,
      headers: L(t.headers, u.headers),
      serializedBody: void 0
    };
    i.security && await le({
      ...i,
      security: i.security
    }), i.requestValidator && await i.requestValidator(i), i.body !== void 0 && i.bodySerializer && (i.serializedBody = i.bodySerializer(i.body)), (i.body === void 0 || i.serializedBody === "") && i.headers.delete("Content-Type");
    const d = N(i);
    return { opts: i, url: d };
  }, o = async (u) => {
    const { opts: i, url: d } = await c(u), S = {
      redirect: "follow",
      ...i,
      body: ne(i)
    };
    let g = new Request(d, S);
    for (const h of s.request.fns)
      h && (g = await h(g, i));
    const z = i.fetch;
    let f = await z(g);
    for (const h of s.response.fns)
      h && (f = await h(f, g, i));
    const p = {
      request: g,
      response: f
    };
    if (f.ok) {
      const h = (i.parseAs === "auto" ? oe(f.headers.get("Content-Type")) : i.parseAs) ?? "json";
      if (f.status === 204 || f.headers.get("Content-Length") === "0") {
        let w;
        switch (h) {
          case "arrayBuffer":
          case "blob":
          case "text":
            w = await f[h]();
            break;
          case "formData":
            w = new FormData();
            break;
          case "stream":
            w = f.body;
            break;
          case "json":
          default:
            w = {};
            break;
        }
        return i.responseStyle === "data" ? w : {
          data: w,
          ...p
        };
      }
      let y;
      switch (h) {
        case "arrayBuffer":
        case "blob":
        case "formData":
        case "json":
        case "text":
          y = await f[h]();
          break;
        case "stream":
          return i.responseStyle === "data" ? f.body : {
            data: f.body,
            ...p
          };
      }
      return h === "json" && (i.responseValidator && await i.responseValidator(y), i.responseTransformer && (y = await i.responseTransformer(y))), i.responseStyle === "data" ? y : {
        data: y,
        ...p
      };
    }
    const A = await f.text();
    let j;
    try {
      j = JSON.parse(A);
    } catch {
    }
    const k = j ?? A;
    let b = k;
    for (const h of s.error.fns)
      h && (b = await h(k, f, g, i));
    if (b = b || {}, i.throwOnError)
      throw b;
    return i.responseStyle === "data" ? void 0 : {
      error: b,
      ...p
    };
  }, n = (u) => (i) => o({ ...i, method: u }), l = (u) => async (i) => {
    const { opts: d, url: S } = await c(i);
    return Y({
      ...d,
      body: d.body,
      headers: d.headers,
      method: u,
      onRequest: async (g, z) => {
        let f = new Request(g, z);
        for (const p of s.request.fns)
          p && (f = await p(f, d));
        return f;
      },
      url: S
    });
  };
  return {
    buildUrl: N,
    connect: n("CONNECT"),
    delete: n("DELETE"),
    get: n("GET"),
    getConfig: r,
    head: n("HEAD"),
    interceptors: s,
    options: n("OPTIONS"),
    patch: n("PATCH"),
    post: n("POST"),
    put: n("PUT"),
    request: o,
    setConfig: a,
    sse: {
      connect: l("CONNECT"),
      delete: l("DELETE"),
      get: l("GET"),
      head: l("HEAD"),
      options: l("OPTIONS"),
      patch: l("PATCH"),
      post: l("POST"),
      put: l("PUT"),
      trace: l("TRACE")
    },
    trace: n("TRACE")
  };
}, q = pe(M({
  baseUrl: "https://localhost:44359"
})), we = (e) => ((e == null ? void 0 : e.client) ?? q).post({
  security: [
    {
      scheme: "bearer",
      type: "http"
    }
  ],
  url: "/api/v1/Kraftvaerk.Umbraco.Alchemy/brew",
  ...e,
  headers: {
    "Content-Type": "application/json",
    ...e == null ? void 0 : e.headers
  }
}), ge = (e) => (e.client ?? q).post({
  security: [
    {
      scheme: "bearer",
      type: "http"
    }
  ],
  url: "/api/v1/Kraftvaerk.Umbraco.Alchemy/brew/context/{key}",
  ...e,
  headers: {
    "Content-Type": "application/json",
    ...e.headers
  }
}), ye = (e) => ((e == null ? void 0 : e.client) ?? q).get({
  security: [
    {
      scheme: "bearer",
      type: "http"
    }
  ],
  url: "/api/v1/Kraftvaerk.Umbraco.Alchemy/options",
  ...e
}), me = "umb-content-type-design-editor-property";
let E = !1;
const V = customElements.define.bind(customElements);
customElements.define = function(e, t, r) {
  if (e === me && E) {
    import("./alchemy-design-editor-property.element-Dl3iJwps.js").then(({ createAlchemyDesignEditorPropertyClass: a }) => {
      const s = a(t);
      V(e, s, r);
    });
    return;
  }
  V(e, t, r);
};
function O(e, t, r, a, s = 0) {
  s >= 50 || setTimeout(async () => {
    const c = e.getByAlias(t);
    if (!c) {
      O(e, t, r, a, s + 1);
      return;
    }
    const o = c;
    typeof o.element == "function" && await o.element(), await customElements.whenDefined(r), await a(), e.unregister(t), e.register({
      ...c,
      element: a,
      weight: (c.weight ?? 0) + 1
    });
  }, 200);
}
const Ae = async (e, t) => {
  var a;
  try {
    const s = await e.getContext(R), c = (a = s == null ? void 0 : s.getOpenApiConfiguration) == null ? void 0 : a.call(s), o = typeof (c == null ? void 0 : c.token) == "function" ? await c.token() : c == null ? void 0 : c.token, { data: n } = await ye({
      baseUrl: window.location.origin,
      auth: o
    });
    E = (n == null ? void 0 : n.experimentalButtons) ?? !1;
  } catch {
    E = !1;
  }
  t.register({
    type: "icons",
    alias: "alchemy.icons",
    name: "Alchemy Icons",
    js: () => import("./icons-B1cglzSv.js")
  }), t.register({
    type: "modal",
    alias: "alchemy.modal.brew",
    name: "Alchemy Brew Modal",
    element: () => import("./alchemy-brew-modal.element-CwzndmE8.js")
  }), t.register({
    type: "modal",
    alias: "alchemy.modal.doAlchemy",
    name: "Alchemy Do Alchemy Modal",
    element: () => import("./alchemy-do-alchemy-modal.element-DdOmVw3N.js")
  }), E && O(
    t,
    "Umb.WorkspaceView.PropertyType.Settings",
    "umb-property-type-workspace-view-settings",
    () => import("./alchemy-property-type-settings.element-DADoaq9y.js")
  ), O(
    t,
    "Umb.WorkspaceView.BlockType.Grid.Settings",
    "umb-block-grid-type-workspace-view",
    () => import("./alchemy-block-grid-workspace-view.element-DOCxIT-n.js")
  ), O(
    t,
    "Umb.WorkspaceView.BlockType.List.Settings",
    "umb-block-list-type-workspace-view-settings",
    () => import("./alchemy-block-list-workspace-view.element-Dwr4yOUG.js")
  ), t.register({
    type: "workspaceContext",
    alias: "alchemy.workspaceContext.documentType",
    name: "Alchemy Document Type Context Observer",
    api: () => import("./alchemy-doctype-context-observer-ByGB2Tyh.js"),
    conditions: [
      {
        alias: "Umb.Condition.WorkspaceAlias",
        match: "Umb.Workspace.DocumentType"
      }
    ]
  }), E && import("./alchemy-content-type-header.element-B5SAyAWR.js").then(({ patchAlchemyContentTypeHeader: s }) => {
    s();
  });
  const r = {
    type: "entityAction",
    kind: "default",
    alias: "Alchemy.EntityAction.DocumentType",
    name: "Do Alchemy",
    weight: 10,
    api: () => import("./alchemy-document-type.action-1Td6sDkF.js"),
    forEntityTypes: ["document-type"],
    meta: {
      icon: "alchemy-brew-bottle",
      label: "Do Alchemy"
    }
  };
  t.register(r);
};
export {
  we as a,
  Ae as o,
  ge as p
};
//# sourceMappingURL=index-CdUCYFDh.js.map
