const _ = {
  bodySerializer: (e) => JSON.stringify(
    e,
    (r, t) => typeof t == "bigint" ? t.toString() : t
  )
}, G = ({
  onRequest: e,
  onSseError: r,
  onSseEvent: t,
  responseTransformer: s,
  responseValidator: i,
  sseDefaultRetryDelay: l,
  sseMaxRetryAttempts: c,
  sseMaxRetryDelay: n,
  sseSleepFn: o,
  url: u,
  ...a
}) => {
  let d;
  const z = o ?? ((f) => new Promise((y) => setTimeout(y, f)));
  return { stream: async function* () {
    let f = l ?? 3e3, y = 0;
    const j = a.signal ?? new AbortController().signal;
    for (; !j.aborted; ) {
      y++;
      const A = a.headers instanceof Headers ? a.headers : new Headers(a.headers);
      d !== void 0 && A.set("Last-Event-ID", d);
      try {
        const S = {
          redirect: "follow",
          ...a,
          body: a.serializedBody,
          headers: A,
          signal: j
        };
        let m = new Request(u, S);
        e && (m = await e(u, S));
        const p = await (a.fetch ?? globalThis.fetch)(m);
        if (!p.ok)
          throw new Error(
            `SSE failed: ${p.status} ${p.statusText}`
          );
        if (!p.body) throw new Error("No body in SSE response");
        const w = p.body.pipeThrough(new TextDecoderStream()).getReader();
        let q = "";
        const O = () => {
          try {
            w.cancel();
          } catch {
          }
        };
        j.addEventListener("abort", O);
        try {
          for (; ; ) {
            const { done: L, value: J } = await w.read();
            if (L) break;
            q += J;
            const $ = q.split(`

`);
            q = $.pop() ?? "";
            for (const K of $) {
              const F = K.split(`
`), C = [];
              let I;
              for (const b of F)
                if (b.startsWith("data:"))
                  C.push(b.replace(/^data:\s*/, ""));
                else if (b.startsWith("event:"))
                  I = b.replace(/^event:\s*/, "");
                else if (b.startsWith("id:"))
                  d = b.replace(/^id:\s*/, "");
                else if (b.startsWith("retry:")) {
                  const U = Number.parseInt(
                    b.replace(/^retry:\s*/, ""),
                    10
                  );
                  Number.isNaN(U) || (f = U);
                }
              let x, B = !1;
              if (C.length) {
                const b = C.join(`
`);
                try {
                  x = JSON.parse(b), B = !0;
                } catch {
                  x = b;
                }
              }
              B && (i && await i(x), s && (x = await s(x))), t == null || t({
                data: x,
                event: I,
                id: d,
                retry: f
              }), C.length && (yield x);
            }
          }
        } finally {
          j.removeEventListener("abort", O), w.releaseLock();
        }
        break;
      } catch (S) {
        if (r == null || r(S), c !== void 0 && y >= c)
          break;
        const m = Math.min(
          f * 2 ** (y - 1),
          n ?? 3e4
        );
        await z(m);
      }
    }
  }() };
}, M = (e) => {
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
}, Q = (e) => {
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
}, X = (e) => {
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
}, N = ({
  allowReserved: e,
  explode: r,
  name: t,
  style: s,
  value: i
}) => {
  if (!r) {
    const n = (e ? i : i.map((o) => encodeURIComponent(o))).join(Q(s));
    switch (s) {
      case "label":
        return `.${n}`;
      case "matrix":
        return `;${t}=${n}`;
      case "simple":
        return n;
      default:
        return `${t}=${n}`;
    }
  }
  const l = M(s), c = i.map((n) => s === "label" || s === "simple" ? e ? n : encodeURIComponent(n) : T({
    allowReserved: e,
    name: t,
    value: n
  })).join(l);
  return s === "label" || s === "matrix" ? l + c : c;
}, T = ({
  allowReserved: e,
  name: r,
  value: t
}) => {
  if (t == null)
    return "";
  if (typeof t == "object")
    throw new Error(
      "Deeply-nested arrays/objects aren’t supported. Provide your own `querySerializer()` to handle these."
    );
  return `${r}=${e ? t : encodeURIComponent(t)}`;
}, P = ({
  allowReserved: e,
  explode: r,
  name: t,
  style: s,
  value: i,
  valueOnly: l
}) => {
  if (i instanceof Date)
    return l ? i.toISOString() : `${t}=${i.toISOString()}`;
  if (s !== "deepObject" && !r) {
    let o = [];
    Object.entries(i).forEach(([a, d]) => {
      o = [
        ...o,
        a,
        e ? d : encodeURIComponent(d)
      ];
    });
    const u = o.join(",");
    switch (s) {
      case "form":
        return `${t}=${u}`;
      case "label":
        return `.${u}`;
      case "matrix":
        return `;${t}=${u}`;
      default:
        return u;
    }
  }
  const c = X(s), n = Object.entries(i).map(
    ([o, u]) => T({
      allowReserved: e,
      name: s === "deepObject" ? `${t}[${o}]` : o,
      value: u
    })
  ).join(c);
  return s === "label" || s === "matrix" ? c + n : n;
}, Y = /\{[^{}]+\}/g, Z = ({ path: e, url: r }) => {
  let t = r;
  const s = r.match(Y);
  if (s)
    for (const i of s) {
      let l = !1, c = i.substring(1, i.length - 1), n = "simple";
      c.endsWith("*") && (l = !0, c = c.substring(0, c.length - 1)), c.startsWith(".") ? (c = c.substring(1), n = "label") : c.startsWith(";") && (c = c.substring(1), n = "matrix");
      const o = e[c];
      if (o == null)
        continue;
      if (Array.isArray(o)) {
        t = t.replace(
          i,
          N({ explode: l, name: c, style: n, value: o })
        );
        continue;
      }
      if (typeof o == "object") {
        t = t.replace(
          i,
          P({
            explode: l,
            name: c,
            style: n,
            value: o,
            valueOnly: !0
          })
        );
        continue;
      }
      if (n === "matrix") {
        t = t.replace(
          i,
          `;${T({
            name: c,
            value: o
          })}`
        );
        continue;
      }
      const u = encodeURIComponent(
        n === "label" ? `.${o}` : o
      );
      t = t.replace(i, u);
    }
  return t;
}, ee = ({
  baseUrl: e,
  path: r,
  query: t,
  querySerializer: s,
  url: i
}) => {
  const l = i.startsWith("/") ? i : `/${i}`;
  let c = (e ?? "") + l;
  r && (c = Z({ path: r, url: c }));
  let n = t ? s(t) : "";
  return n.startsWith("?") && (n = n.substring(1)), n && (c += `?${n}`), c;
};
function te(e) {
  const r = e.body !== void 0;
  if (r && e.bodySerializer)
    return "serializedBody" in e ? e.serializedBody !== void 0 && e.serializedBody !== "" ? e.serializedBody : null : e.body !== "" ? e.body : null;
  if (r)
    return e.body;
}
const re = async (e, r) => {
  const t = typeof r == "function" ? await r(e) : r;
  if (t)
    return e.scheme === "bearer" ? `Bearer ${t}` : e.scheme === "basic" ? `Basic ${btoa(t)}` : t;
}, W = ({
  allowReserved: e,
  array: r,
  object: t
} = {}) => (i) => {
  const l = [];
  if (i && typeof i == "object")
    for (const c in i) {
      const n = i[c];
      if (n != null)
        if (Array.isArray(n)) {
          const o = N({
            allowReserved: e,
            explode: !0,
            name: c,
            style: "form",
            value: n,
            ...r
          });
          o && l.push(o);
        } else if (typeof n == "object") {
          const o = P({
            allowReserved: e,
            explode: !0,
            name: c,
            style: "deepObject",
            value: n,
            ...t
          });
          o && l.push(o);
        } else {
          const o = T({
            allowReserved: e,
            name: c,
            value: n
          });
          o && l.push(o);
        }
    }
  return l.join("&");
}, ae = (e) => {
  var t;
  if (!e)
    return "stream";
  const r = (t = e.split(";")[0]) == null ? void 0 : t.trim();
  if (r) {
    if (r.startsWith("application/json") || r.endsWith("+json"))
      return "json";
    if (r === "multipart/form-data")
      return "formData";
    if (["application/", "audio/", "image/", "video/"].some(
      (s) => r.startsWith(s)
    ))
      return "blob";
    if (r.startsWith("text/"))
      return "text";
  }
}, se = (e, r) => {
  var t, s;
  return r ? !!(e.headers.has(r) || (t = e.query) != null && t[r] || (s = e.headers.get("Cookie")) != null && s.includes(`${r}=`)) : !1;
}, ne = async ({
  security: e,
  ...r
}) => {
  for (const t of e) {
    if (se(r, t.name))
      continue;
    const s = await re(t, r.auth);
    if (!s)
      continue;
    const i = t.name ?? "Authorization";
    switch (t.in) {
      case "query":
        r.query || (r.query = {}), r.query[i] = s;
        break;
      case "cookie":
        r.headers.append("Cookie", `${i}=${s}`);
        break;
      case "header":
      default:
        r.headers.set(i, s);
        break;
    }
  }
}, v = (e) => ee({
  baseUrl: e.baseUrl,
  path: e.path,
  query: e.query,
  querySerializer: typeof e.querySerializer == "function" ? e.querySerializer : W(e.querySerializer),
  url: e.url
}), D = (e, r) => {
  var s;
  const t = { ...e, ...r };
  return (s = t.baseUrl) != null && s.endsWith("/") && (t.baseUrl = t.baseUrl.substring(0, t.baseUrl.length - 1)), t.headers = H(e.headers, r.headers), t;
}, ie = (e) => {
  const r = [];
  return e.forEach((t, s) => {
    r.push([s, t]);
  }), r;
}, H = (...e) => {
  const r = new Headers();
  for (const t of e) {
    if (!t)
      continue;
    const s = t instanceof Headers ? ie(t) : Object.entries(t);
    for (const [i, l] of s)
      if (l === null)
        r.delete(i);
      else if (Array.isArray(l))
        for (const c of l)
          r.append(i, c);
      else l !== void 0 && r.set(
        i,
        typeof l == "object" ? JSON.stringify(l) : l
      );
  }
  return r;
};
class E {
  constructor() {
    this.fns = [];
  }
  clear() {
    this.fns = [];
  }
  eject(r) {
    const t = this.getInterceptorIndex(r);
    this.fns[t] && (this.fns[t] = null);
  }
  exists(r) {
    const t = this.getInterceptorIndex(r);
    return !!this.fns[t];
  }
  getInterceptorIndex(r) {
    return typeof r == "number" ? this.fns[r] ? r : -1 : this.fns.indexOf(r);
  }
  update(r, t) {
    const s = this.getInterceptorIndex(r);
    return this.fns[s] ? (this.fns[s] = t, r) : !1;
  }
  use(r) {
    return this.fns.push(r), this.fns.length - 1;
  }
}
const oe = () => ({
  error: new E(),
  request: new E(),
  response: new E()
}), ce = W({
  allowReserved: !1,
  array: {
    explode: !0,
    style: "form"
  },
  object: {
    explode: !0,
    style: "deepObject"
  }
}), le = {
  "Content-Type": "application/json"
}, V = (e = {}) => ({
  ..._,
  headers: le,
  parseAs: "auto",
  querySerializer: ce,
  ...e
}), fe = (e = {}) => {
  let r = D(V(), e);
  const t = () => ({ ...r }), s = (u) => (r = D(r, u), t()), i = oe(), l = async (u) => {
    const a = {
      ...r,
      ...u,
      fetch: u.fetch ?? r.fetch ?? globalThis.fetch,
      headers: H(r.headers, u.headers),
      serializedBody: void 0
    };
    a.security && await ne({
      ...a,
      security: a.security
    }), a.requestValidator && await a.requestValidator(a), a.body !== void 0 && a.bodySerializer && (a.serializedBody = a.bodySerializer(a.body)), (a.body === void 0 || a.serializedBody === "") && a.headers.delete("Content-Type");
    const d = v(a);
    return { opts: a, url: d };
  }, c = async (u) => {
    const { opts: a, url: d } = await l(u), z = {
      redirect: "follow",
      ...a,
      body: te(a)
    };
    let g = new Request(d, z);
    for (const h of i.request.fns)
      h && (g = await h(g, a));
    const k = a.fetch;
    let f = await k(g);
    for (const h of i.response.fns)
      h && (f = await h(f, g, a));
    const y = {
      request: g,
      response: f
    };
    if (f.ok) {
      const h = (a.parseAs === "auto" ? ae(f.headers.get("Content-Type")) : a.parseAs) ?? "json";
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
        return a.responseStyle === "data" ? w : {
          data: w,
          ...y
        };
      }
      let p;
      switch (h) {
        case "arrayBuffer":
        case "blob":
        case "formData":
        case "json":
        case "text":
          p = await f[h]();
          break;
        case "stream":
          return a.responseStyle === "data" ? f.body : {
            data: f.body,
            ...y
          };
      }
      return h === "json" && (a.responseValidator && await a.responseValidator(p), a.responseTransformer && (p = await a.responseTransformer(p))), a.responseStyle === "data" ? p : {
        data: p,
        ...y
      };
    }
    const j = await f.text();
    let A;
    try {
      A = JSON.parse(j);
    } catch {
    }
    const S = A ?? j;
    let m = S;
    for (const h of i.error.fns)
      h && (m = await h(S, f, g, a));
    if (m = m || {}, a.throwOnError)
      throw m;
    return a.responseStyle === "data" ? void 0 : {
      error: m,
      ...y
    };
  }, n = (u) => (a) => c({ ...a, method: u }), o = (u) => async (a) => {
    const { opts: d, url: z } = await l(a);
    return G({
      ...d,
      body: d.body,
      headers: d.headers,
      method: u,
      onRequest: async (g, k) => {
        let f = new Request(g, k);
        for (const y of i.request.fns)
          y && (f = await y(f, d));
        return f;
      },
      url: z
    });
  };
  return {
    buildUrl: v,
    connect: n("CONNECT"),
    delete: n("DELETE"),
    get: n("GET"),
    getConfig: t,
    head: n("HEAD"),
    interceptors: i,
    options: n("OPTIONS"),
    patch: n("PATCH"),
    post: n("POST"),
    put: n("PUT"),
    request: c,
    setConfig: s,
    sse: {
      connect: o("CONNECT"),
      delete: o("DELETE"),
      get: o("GET"),
      head: o("HEAD"),
      options: o("OPTIONS"),
      patch: o("PATCH"),
      post: o("POST"),
      put: o("PUT"),
      trace: o("TRACE")
    },
    trace: n("TRACE")
  };
}, R = fe(V({
  baseUrl: "https://localhost:44360"
})), ue = (e) => ((e == null ? void 0 : e.client) ?? R).post({
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
}), de = (e) => (e.client ?? R).post({
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
});
export {
  de as a,
  ue as p
};
//# sourceMappingURL=sdk.gen-BrMQUxj_.js.map
