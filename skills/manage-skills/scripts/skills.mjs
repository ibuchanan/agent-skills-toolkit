#!/usr/bin/env node
import { createRequire as So } from "node:module";
var bo = Object.defineProperty;
var g = (e, t) => () => (t || e((t = { exports: {} }).exports, t), t.exports);
var wo = (e, t, s) => {
    for (var i in t)
      bo(e, i, { get: t[i], set: s[i], enumerable: !0, configurable: !0 });
  },
  ze = So(import.meta.url);
var k = g(function (xo) {
  var Zt = Symbol.for("yaml.alias"),
    _i = Symbol.for("yaml.document"),
    it = Symbol.for("yaml.map"),
    Oi = Symbol.for("yaml.pair"),
    es = Symbol.for("yaml.scalar"),
    nt = Symbol.for("yaml.seq"),
    U = Symbol.for("yaml.node.type"),
    Co = (e) => !!e && typeof e === "object" && e[U] === Zt,
    Eo = (e) => !!e && typeof e === "object" && e[U] === _i,
    No = (e) => !!e && typeof e === "object" && e[U] === it,
    qo = (e) => !!e && typeof e === "object" && e[U] === Oi,
    Ai = (e) => !!e && typeof e === "object" && e[U] === es,
    To = (e) => !!e && typeof e === "object" && e[U] === nt;
  function ki(e) {
    if (e && typeof e === "object")
      switch (e[U]) {
        case it:
        case nt:
          return !0;
      }
    return !1;
  }
  function Lo(e) {
    if (e && typeof e === "object")
      switch (e[U]) {
        case Zt:
        case it:
        case es:
        case nt:
          return !0;
      }
    return !1;
  }
  var $o = (e) => (Ai(e) || ki(e)) && !!e.anchor;
  xo.ALIAS = Zt;
  xo.DOC = _i;
  xo.MAP = it;
  xo.NODE_TYPE = U;
  xo.PAIR = Oi;
  xo.SCALAR = es;
  xo.SEQ = nt;
  xo.hasAnchor = $o;
  xo.isAlias = Co;
  xo.isCollection = ki;
  xo.isDocument = Eo;
  xo.isMap = No;
  xo.isNode = Lo;
  xo.isPair = qo;
  xo.isScalar = Ai;
  xo.isSeq = To;
});
var Ee = g(function (Qo) {
  var L = k(),
    I = Symbol("break visit"),
    Ci = Symbol("skip children"),
    j = Symbol("remove node");
  function rt(e, t) {
    let s = Ei(t);
    if (L.isDocument(e)) {
      if (me(null, e.contents, s, Object.freeze([e])) === j) e.contents = null;
    } else me(null, e, s, Object.freeze([]));
  }
  rt.BREAK = I;
  rt.SKIP = Ci;
  rt.REMOVE = j;
  function me(e, t, s, i) {
    let n = Ni(e, t, s, i);
    if (L.isNode(n) || L.isPair(n)) return (qi(e, i, n), me(e, n, s, i));
    if (typeof n !== "symbol") {
      if (L.isCollection(t)) {
        i = Object.freeze(i.concat(t));
        for (let r = 0; r < t.items.length; ++r) {
          let o = me(r, t.items[r], s, i);
          if (typeof o === "number") r = o - 1;
          else if (o === I) return I;
          else if (o === j) t.items.splice(r, 1), (r -= 1);
        }
      } else if (L.isPair(t)) {
        i = Object.freeze(i.concat(t));
        let r = me("key", t.key, s, i);
        if (r === I) return I;
        else if (r === j) t.key = null;
        let o = me("value", t.value, s, i);
        if (o === I) return I;
        else if (o === j) t.value = null;
      }
    }
    return n;
  }
  async function ot(e, t) {
    let s = Ei(t);
    if (L.isDocument(e)) {
      if ((await ge(null, e.contents, s, Object.freeze([e]))) === j)
        e.contents = null;
    } else await ge(null, e, s, Object.freeze([]));
  }
  ot.BREAK = I;
  ot.SKIP = Ci;
  ot.REMOVE = j;
  async function ge(e, t, s, i) {
    let n = await Ni(e, t, s, i);
    if (L.isNode(n) || L.isPair(n)) return (qi(e, i, n), ge(e, n, s, i));
    if (typeof n !== "symbol") {
      if (L.isCollection(t)) {
        i = Object.freeze(i.concat(t));
        for (let r = 0; r < t.items.length; ++r) {
          let o = await ge(r, t.items[r], s, i);
          if (typeof o === "number") r = o - 1;
          else if (o === I) return I;
          else if (o === j) t.items.splice(r, 1), (r -= 1);
        }
      } else if (L.isPair(t)) {
        i = Object.freeze(i.concat(t));
        let r = await ge("key", t.key, s, i);
        if (r === I) return I;
        else if (r === j) t.key = null;
        let o = await ge("value", t.value, s, i);
        if (o === I) return I;
        else if (o === j) t.value = null;
      }
    }
    return n;
  }
  function Ei(e) {
    if (typeof e === "object" && (e.Collection || e.Node || e.Value))
      return Object.assign(
        { Alias: e.Node, Map: e.Node, Scalar: e.Node, Seq: e.Node },
        e.Value && { Map: e.Value, Scalar: e.Value, Seq: e.Value },
        e.Collection && { Map: e.Collection, Seq: e.Collection },
        e,
      );
    return e;
  }
  function Ni(e, t, s, i) {
    if (typeof s === "function") return s(e, t, i);
    if (L.isMap(t)) return s.Map?.(e, t, i);
    if (L.isSeq(t)) return s.Seq?.(e, t, i);
    if (L.isPair(t)) return s.Pair?.(e, t, i);
    if (L.isScalar(t)) return s.Scalar?.(e, t, i);
    if (L.isAlias(t)) return s.Alias?.(e, t, i);
    return;
  }
  function qi(e, t, s) {
    let i = t[t.length - 1];
    if (L.isCollection(i)) i.items[e] = s;
    else if (L.isPair(i))
      if (e === "key") i.key = s;
      else i.value = s;
    else if (L.isDocument(i)) i.contents = s;
    else {
      let n = L.isAlias(i) ? "alias" : "scalar";
      throw Error(`Cannot replace node with ${n} parent`);
    }
  }
  Qo.visit = rt;
  Qo.visitAsync = ot;
});
var ts = g(function (sa) {
  var Ti = k(),
    Zo = Ee(),
    ea = {
      "!": "%21",
      ",": "%2C",
      "[": "%5B",
      "]": "%5D",
      "{": "%7B",
      "}": "%7D",
    },
    ta = (e) => e.replace(/[!,[\]{}]/g, (t) => ea[t]);
  class M {
    constructor(e, t) {
      (this.docStart = null),
        (this.docEnd = !1),
        (this.yaml = Object.assign({}, M.defaultYaml, e)),
        (this.tags = Object.assign({}, M.defaultTags, t));
    }
    clone() {
      let e = new M(this.yaml, this.tags);
      return ((e.docStart = this.docStart), e);
    }
    atDocument() {
      let e = new M(this.yaml, this.tags);
      switch (this.yaml.version) {
        case "1.1":
          this.atNextDocument = !0;
          break;
        case "1.2":
          (this.atNextDocument = !1),
            (this.yaml = { explicit: M.defaultYaml.explicit, version: "1.2" }),
            (this.tags = Object.assign({}, M.defaultTags));
          break;
      }
      return e;
    }
    add(e, t) {
      if (this.atNextDocument)
        (this.yaml = { explicit: M.defaultYaml.explicit, version: "1.1" }),
          (this.tags = Object.assign({}, M.defaultTags)),
          (this.atNextDocument = !1);
      let s = e.trim().split(/[ \t]+/),
        i = s.shift();
      switch (i) {
        case "%TAG": {
          if (s.length !== 2) {
            if (
              (t(0, "%TAG directive should contain exactly two parts"),
              s.length < 2)
            )
              return !1;
          }
          let [n, r] = s;
          return ((this.tags[n] = r), !0);
        }
        case "%YAML": {
          if (((this.yaml.explicit = !0), s.length !== 1))
            return (
              t(0, "%YAML directive should contain exactly one part"), !1
            );
          let [n] = s;
          if (n === "1.1" || n === "1.2") return ((this.yaml.version = n), !0);
          else {
            let r = /^\d+\.\d+$/.test(n);
            return (t(6, `Unsupported YAML version ${n}`, r), !1);
          }
        }
        default:
          return (t(0, `Unknown directive ${i}`, !0), !1);
      }
    }
    tagName(e, t) {
      if (e === "!") return "!";
      if (e[0] !== "!") return (t(`Not a valid tag: ${e}`), null);
      if (e[1] === "<") {
        let r = e.slice(2, -1);
        if (r === "!" || r === "!!")
          return (
            t(`Verbatim tags aren't resolved, so ${e} is invalid.`), null
          );
        if (e[e.length - 1] !== ">") t("Verbatim tags must end with a >");
        return r;
      }
      let [, s, i] = e.match(/^(.*!)([^!]*)$/s);
      if (!i) t(`The ${e} tag has no suffix`);
      let n = this.tags[s];
      if (n)
        try {
          return n + decodeURIComponent(i);
        } catch (r) {
          return (t(String(r)), null);
        }
      if (s === "!") return e;
      return (t(`Could not resolve tag: ${e}`), null);
    }
    tagString(e) {
      for (let [t, s] of Object.entries(this.tags))
        if (e.startsWith(s)) return t + ta(e.substring(s.length));
      return e[0] === "!" ? e : `!<${e}>`;
    }
    toString(e) {
      let t = this.yaml.explicit ? [`%YAML ${this.yaml.version || "1.2"}`] : [],
        s = Object.entries(this.tags),
        i;
      if (e && s.length > 0 && Ti.isNode(e.contents)) {
        let n = {};
        Zo.visit(e.contents, (r, o) => {
          if (Ti.isNode(o) && o.tag) n[o.tag] = !0;
        }),
          (i = Object.keys(n));
      } else i = [];
      for (let [n, r] of s) {
        if (n === "!!" && r === "tag:yaml.org,2002:") continue;
        if (!e || i.some((o) => o.startsWith(r))) t.push(`%TAG ${n} ${r}`);
      }
      return t.join(`
`);
    }
  }
  M.defaultYaml = { explicit: !1, version: "1.2" };
  M.defaultTags = { "!!": "tag:yaml.org,2002:" };
  sa.Directives = M;
});
var at = g(function (aa) {
  var Li = k(),
    na = Ee();
  function ra(e) {
    if (/[\x00-\x19\s,[\]{}]/.test(e)) {
      let s = `Anchor must not contain whitespace or control characters: ${JSON.stringify(e)}`;
      throw Error(s);
    }
    return !0;
  }
  function $i(e) {
    let t = new Set();
    return (
      na.visit(e, {
        Value(s, i) {
          if (i.anchor) t.add(i.anchor);
        },
      }),
      t
    );
  }
  function xi(e, t) {
    for (let s = 1; ; ++s) {
      let i = `${e}${s}`;
      if (!t.has(i)) return i;
    }
  }
  function oa(e, t) {
    let s = [],
      i = new Map(),
      n = null;
    return {
      onAnchor: (r) => {
        s.push(r), n ?? (n = $i(e));
        let o = xi(t, n);
        return (n.add(o), o);
      },
      setAnchors: () => {
        for (let r of s) {
          let o = i.get(r);
          if (
            typeof o === "object" &&
            o.anchor &&
            (Li.isScalar(o.node) || Li.isCollection(o.node))
          )
            o.node.anchor = o.anchor;
          else {
            let a = Error(
              "Failed to resolve repeated object (this should not happen)",
            );
            throw ((a.source = r), a);
          }
        }
      },
      sourceObjects: i,
    };
  }
  aa.anchorIsValid = ra;
  aa.anchorNames = $i;
  aa.createNodeAnchors = oa;
  aa.findNewAnchor = xi;
});
var ss = g(function (ha) {
  function Ne(e, t, s, i) {
    if (i && typeof i === "object")
      if (Array.isArray(i))
        for (let n = 0, r = i.length; n < r; ++n) {
          let o = i[n],
            a = Ne(e, i, String(n), o);
          if (a === void 0) delete i[n];
          else if (a !== o) i[n] = a;
        }
      else if (i instanceof Map)
        for (let n of Array.from(i.keys())) {
          let r = i.get(n),
            o = Ne(e, i, n, r);
          if (o === void 0) i.delete(n);
          else if (o !== r) i.set(n, o);
        }
      else if (i instanceof Set)
        for (let n of Array.from(i)) {
          let r = Ne(e, i, n, n);
          if (r === void 0) i.delete(n);
          else if (r !== n) i.delete(n), i.add(r);
        }
      else
        for (let [n, r] of Object.entries(i)) {
          let o = Ne(e, i, n, r);
          if (o === void 0) delete i[n];
          else if (o !== r) i[n] = o;
        }
    return e.call(t, s, i);
  }
  ha.applyReviver = Ne;
});
var Y = g(function (ma) {
  var da = k();
  function Ii(e, t, s) {
    if (Array.isArray(e)) return e.map((i, n) => Ii(i, String(n), s));
    if (e && typeof e.toJSON === "function") {
      if (!s || !da.hasAnchor(e)) return e.toJSON(t, s);
      let i = { aliasCount: 0, count: 1, res: void 0 };
      s.anchors.set(e, i),
        (s.onCreate = (r) => {
          (i.res = r), delete s.onCreate;
        });
      let n = e.toJSON(t, s);
      if (s.onCreate) s.onCreate(n);
      return n;
    }
    if (typeof e === "bigint" && !s?.keep) return Number(e);
    return e;
  }
  ma.toJS = Ii;
});
var lt = g(function (wa) {
  var ya = ss(),
    Pi = k(),
    ba = Y();
  class Mi {
    constructor(e) {
      Object.defineProperty(this, Pi.NODE_TYPE, { value: e });
    }
    clone() {
      let e = Object.create(
        Object.getPrototypeOf(this),
        Object.getOwnPropertyDescriptors(this),
      );
      if (this.range) e.range = this.range.slice();
      return e;
    }
    toJS(e, { mapAsMap: t, maxAliasCount: s, onAnchor: i, reviver: n } = {}) {
      if (!Pi.isDocument(e)) throw TypeError("A document argument is required");
      let r = {
          anchors: new Map(),
          doc: e,
          keep: !0,
          mapAsMap: t === !0,
          mapKeyWarned: !1,
          maxAliasCount: typeof s === "number" ? s : 100,
        },
        o = ba.toJS(this, "", r);
      if (typeof i === "function")
        for (let { count: a, res: c } of r.anchors.values()) i(c, a);
      return typeof n === "function" ? ya.applyReviver(n, { "": o }, "", o) : o;
    }
  }
  wa.NodeBase = Mi;
});
var qe = g(function (ka) {
  var va = at(),
    _a = Ee(),
    ye = k(),
    Oa = lt(),
    Aa = Y();
  class Di extends Oa.NodeBase {
    constructor(e) {
      super(ye.ALIAS);
      (this.source = e),
        Object.defineProperty(this, "tag", {
          set() {
            throw Error("Alias nodes cannot have tags");
          },
        });
    }
    resolve(e, t) {
      if (t?.maxAliasCount === 0)
        throw ReferenceError("Alias resolution is disabled");
      let s;
      if (t?.aliasResolveCache) s = t.aliasResolveCache;
      else if (
        ((s = []),
        _a.visit(e, {
          Node: (n, r) => {
            if (ye.isAlias(r) || ye.hasAnchor(r)) s.push(r);
          },
        }),
        t)
      )
        t.aliasResolveCache = s;
      let i = void 0;
      for (let n of s) {
        if (n === this) break;
        if (n.anchor === this.source) i = n;
      }
      if (i && t) {
        let { anchors: n, doc: r, maxAliasCount: o } = t,
          a = n.get(i);
        if (!a) Aa.toJS(i, null, t), (a = n.get(i));
        if (a?.res === void 0)
          throw ReferenceError(
            "This should not happen: Alias anchor was not resolved?",
          );
        if (o >= 0) {
          if (((a.count += 1), a.aliasCount === 0)) a.aliasCount = ct(r, i, n);
          if (a.count * a.aliasCount > o)
            throw ReferenceError(
              "Excessive alias count indicates a resource exhaustion attack",
            );
        }
      }
      return i;
    }
    toJSON(e, t) {
      if (!t) return { source: this.source };
      let s = this.resolve(t.doc, t);
      if (!s) {
        let i = `Unresolved alias (the anchor must be set before the alias): ${this.source}`;
        throw ReferenceError(i);
      }
      return t.anchors.get(s).res;
    }
    toString(e, t, s) {
      let i = `*${this.source}`;
      if (e) {
        if (
          (va.anchorIsValid(this.source),
          e.options.verifyAliasOrder && !e.anchors.has(this.source))
        ) {
          let n = `Unresolved alias (the anchor must be set before the alias): ${this.source}`;
          throw Error(n);
        }
        if (e.implicitKey) return `${i} `;
      }
      return i;
    }
  }
  function ct(e, t, s) {
    if (ye.isAlias(t)) {
      let i = t.resolve(e),
        n = s && i && s.get(i);
      return n ? n.count * n.aliasCount : 0;
    } else if (ye.isCollection(t)) {
      let i = 0;
      for (let n of t.items) {
        let r = ct(e, n, s);
        if (r > i) i = r;
      }
      return i;
    } else if (ye.isPair(t)) {
      let i = ct(e, t.key, s),
        n = ct(e, t.value, s);
      return Math.max(i, n);
    }
    return 1;
  }
  ka.Alias = Di;
});
var N = g(function (La) {
  var Ea = k(),
    Na = lt(),
    qa = Y(),
    Ta = (e) => !e || (typeof e !== "function" && typeof e !== "object");
  class ne extends Na.NodeBase {
    constructor(e) {
      super(Ea.SCALAR);
      this.value = e;
    }
    toJSON(e, t) {
      return t?.keep ? this.value : qa.toJS(this.value, e, t);
    }
    toString() {
      return String(this.value);
    }
  }
  ne.BLOCK_FOLDED = "BLOCK_FOLDED";
  ne.BLOCK_LITERAL = "BLOCK_LITERAL";
  ne.PLAIN = "PLAIN";
  ne.QUOTE_DOUBLE = "QUOTE_DOUBLE";
  ne.QUOTE_SINGLE = "QUOTE_SINGLE";
  La.Scalar = ne;
  La.isScalarValue = Ta;
});
var Te = g(function (Fa) {
  var Ia = qe(),
    re = k(),
    Fi = N(),
    Pa = "tag:yaml.org,2002:";
  function Ma(e, t, s) {
    if (t) {
      let i = s.filter((r) => r.tag === t),
        n = i.find((r) => !r.format) ?? i[0];
      if (!n) throw Error(`Tag ${t} not found`);
      return n;
    }
    return s.find((i) => i.identify?.(e) && !i.format);
  }
  function Da(e, t, s) {
    if (re.isDocument(e)) e = e.contents;
    if (re.isNode(e)) return e;
    if (re.isPair(e)) {
      let u = s.schema[re.MAP].createNode?.(s.schema, null, s);
      return (u.items.push(e), u);
    }
    if (
      e instanceof String ||
      e instanceof Number ||
      e instanceof Boolean ||
      (typeof BigInt < "u" && e instanceof BigInt)
    )
      e = e.valueOf();
    let {
        aliasDuplicateObjects: i,
        onAnchor: n,
        onTagObj: r,
        schema: o,
        sourceObjects: a,
      } = s,
      c = void 0;
    if (i && e && typeof e === "object")
      if (((c = a.get(e)), c))
        return (c.anchor ?? (c.anchor = n(e)), new Ia.Alias(c.anchor));
      else (c = { anchor: null, node: null }), a.set(e, c);
    if (t?.startsWith("!!")) t = Pa + t.slice(2);
    let l = Ma(e, t, o.tags);
    if (!l) {
      if (e && typeof e.toJSON === "function") e = e.toJSON();
      if (!e || typeof e !== "object") {
        let u = new Fi.Scalar(e);
        if (c) c.node = u;
        return u;
      }
      l =
        e instanceof Map
          ? o[re.MAP]
          : Symbol.iterator in Object(e)
            ? o[re.SEQ]
            : o[re.MAP];
    }
    if (r) r(l), delete s.onTagObj;
    let f = l?.createNode
      ? l.createNode(s.schema, e, s)
      : typeof l?.nodeClass?.from === "function"
        ? l.nodeClass.from(s.schema, e, s)
        : new Fi.Scalar(e);
    if (t) f.tag = t;
    else if (!l.default) f.tag = l.tag;
    if (c) c.node = f;
    return f;
  }
  Fa.createNode = Da;
});
var ut = g(function (Ka) {
  var ja = Te(),
    V = k(),
    Va = lt();
  function is(e, t, s) {
    let i = s;
    for (let n = t.length - 1; n >= 0; --n) {
      let r = t[n];
      if (typeof r === "number" && Number.isInteger(r) && r >= 0) {
        let o = [];
        (o[r] = i), (i = o);
      } else i = new Map([[r, i]]);
    }
    return ja.createNode(i, void 0, {
      aliasDuplicateObjects: !1,
      keepUndefined: !1,
      onAnchor: () => {
        throw Error("This should not happen, please report a bug.");
      },
      schema: e,
      sourceObjects: new Map(),
    });
  }
  var Bi = (e) =>
    e == null || (typeof e === "object" && !!e[Symbol.iterator]().next().done);
  class ji extends Va.NodeBase {
    constructor(e, t) {
      super(e);
      Object.defineProperty(this, "schema", {
        value: t,
        configurable: !0,
        enumerable: !1,
        writable: !0,
      });
    }
    clone(e) {
      let t = Object.create(
        Object.getPrototypeOf(this),
        Object.getOwnPropertyDescriptors(this),
      );
      if (e) t.schema = e;
      if (
        ((t.items = t.items.map((s) =>
          V.isNode(s) || V.isPair(s) ? s.clone(e) : s,
        )),
        this.range)
      )
        t.range = this.range.slice();
      return t;
    }
    addIn(e, t) {
      if (Bi(e)) this.add(t);
      else {
        let [s, ...i] = e,
          n = this.get(s, !0);
        if (V.isCollection(n)) n.addIn(i, t);
        else if (n === void 0 && this.schema)
          this.set(s, is(this.schema, i, t));
        else
          throw Error(`Expected YAML collection at ${s}. Remaining path: ${i}`);
      }
    }
    deleteIn(e) {
      let [t, ...s] = e;
      if (s.length === 0) return this.delete(t);
      let i = this.get(t, !0);
      if (V.isCollection(i)) return i.deleteIn(s);
      else
        throw Error(`Expected YAML collection at ${t}. Remaining path: ${s}`);
    }
    getIn(e, t) {
      let [s, ...i] = e,
        n = this.get(s, !0);
      if (i.length === 0) return !t && V.isScalar(n) ? n.value : n;
      else return V.isCollection(n) ? n.getIn(i, t) : void 0;
    }
    hasAllNullValues(e) {
      return this.items.every((t) => {
        if (!V.isPair(t)) return !1;
        let s = t.value;
        return (
          s == null ||
          (e &&
            V.isScalar(s) &&
            s.value == null &&
            !s.commentBefore &&
            !s.comment &&
            !s.tag)
        );
      });
    }
    hasIn(e) {
      let [t, ...s] = e;
      if (s.length === 0) return this.has(t);
      let i = this.get(t, !0);
      return V.isCollection(i) ? i.hasIn(s) : !1;
    }
    setIn(e, t) {
      let [s, ...i] = e;
      if (i.length === 0) this.set(s, t);
      else {
        let n = this.get(s, !0);
        if (V.isCollection(n)) n.setIn(i, t);
        else if (n === void 0 && this.schema)
          this.set(s, is(this.schema, i, t));
        else
          throw Error(`Expected YAML collection at ${s}. Remaining path: ${i}`);
      }
    }
  }
  Ka.Collection = ji;
  Ka.collectionFromPath = is;
  Ka.isEmptyPath = Bi;
});
var Le = g(function (Ya) {
  var Wa = (e) => e.replace(/^(?!$)(?: $)?/gm, "#");
  function ns(e, t) {
    if (/^\n+$/.test(e)) return e.substring(1);
    return t ? e.replace(/^(?! *$)/gm, t) : e;
  }
  var Ga = (e, t, s) =>
    e.endsWith(`
`)
      ? ns(s, t)
      : s.includes(`
`)
        ? `
` + ns(s, t)
        : (e.endsWith(" ") ? "" : " ") + s;
  Ya.indentComment = ns;
  Ya.lineComment = Ga;
  Ya.stringifyComment = Wa;
});
var Ki = g(function (Za) {
  function za(
    e,
    t,
    s = "flow",
    {
      indentAtStart: i,
      lineWidth: n = 80,
      minContentWidth: r = 20,
      onFold: o,
      onOverflow: a,
    } = {},
  ) {
    if (!n || n < 0) return e;
    if (n < r) r = 0;
    let c = Math.max(1 + r, 1 + n - t.length);
    if (e.length <= c) return e;
    let l = [],
      f = {},
      u = n - t.length;
    if (typeof i === "number")
      if (i > n - Math.max(2, r)) l.push(0);
      else u = n - i;
    let h = void 0,
      d = void 0,
      y = !1,
      p = -1,
      m = -1,
      w = -1;
    if (s === "block") {
      if (((p = Vi(e, p, t.length)), p !== -1)) u = p + c;
    }
    for (let v; (v = e[(p += 1)]); ) {
      if (s === "quoted" && v === "\\") {
        switch (((m = p), e[p + 1])) {
          case "x":
            p += 3;
            break;
          case "u":
            p += 5;
            break;
          case "U":
            p += 9;
            break;
          default:
            p += 1;
        }
        w = p;
      }
      if (
        v ===
        `
`
      ) {
        if (s === "block") p = Vi(e, p, t.length);
        (u = p + t.length + c), (h = void 0);
      } else {
        if (
          v === " " &&
          d &&
          d !== " " &&
          d !==
            `
` &&
          d !== "\t"
        ) {
          let _ = e[p + 1];
          if (
            _ &&
            _ !== " " &&
            _ !==
              `
` &&
            _ !== "\t"
          )
            h = p;
        }
        if (p >= u)
          if (h) l.push(h), (u = h + c), (h = void 0);
          else if (s === "quoted") {
            while (d === " " || d === "\t")
              (d = v), (v = e[(p += 1)]), (y = !0);
            let _ = p > w + 1 ? p - 2 : m - 1;
            if (f[_]) return e;
            l.push(_), (f[_] = !0), (u = _ + c), (h = void 0);
          } else y = !0;
      }
      d = v;
    }
    if (y && a) a();
    if (l.length === 0) return e;
    if (o) o();
    let S = e.slice(0, l[0]);
    for (let v = 0; v < l.length; ++v) {
      let _ = l[v],
        O = l[v + 1] || e.length;
      if (_ === 0)
        S = `
${t}${e.slice(0, O)}`;
      else {
        if (s === "quoted" && f[_]) S += `${e[_]}\\`;
        S += `
${t}${e.slice(_ + 1, O)}`;
      }
    }
    return S;
  }
  function Vi(e, t, s) {
    let i = t,
      n = t + 1,
      r = e[n];
    while (r === " " || r === "\t")
      if (t < n + s) r = e[++t];
      else {
        do r = e[++t];
        while (
          r &&
          r !==
            `
`
        );
        (i = t), (n = t + 1), (r = e[n]);
      }
    return i;
  }
  Za.FOLD_BLOCK = "block";
  Za.FOLD_FLOW = "flow";
  Za.FOLD_QUOTED = "quoted";
  Za.foldFlowLines = za;
});
var xe = g(function (al) {
  var F = N(),
    J = Ki(),
    ht = (e, t) => ({
      indentAtStart: t ? e.indent.length : e.indentAtStart,
      lineWidth: e.options.lineWidth,
      minContentWidth: e.options.minContentWidth,
    }),
    pt = (e) => /^(%|---|\.\.\.)/m.test(e);
  function nl(e, t, s) {
    if (!t || t < 0) return !1;
    let i = t - s,
      n = e.length;
    if (n <= i) return !1;
    for (let r = 0, o = 0; r < n; ++r)
      if (
        e[r] ===
        `
`
      ) {
        if (r - o > i) return !0;
        if (((o = r + 1), n - o <= i)) return !1;
      }
    return !0;
  }
  function $e(e, t) {
    let s = JSON.stringify(e);
    if (t.options.doubleQuotedAsJSON) return s;
    let { implicitKey: i } = t,
      n = t.options.doubleQuotedMinMultiLineLength,
      r = t.indent || (pt(e) ? "  " : ""),
      o = "",
      a = 0;
    for (let c = 0, l = s[c]; l; l = s[++c]) {
      if (l === " " && s[c + 1] === "\\" && s[c + 2] === "n")
        (o += s.slice(a, c) + "\\ "), (c += 1), (a = c), (l = "\\");
      if (l === "\\")
        switch (s[c + 1]) {
          case "u":
            {
              o += s.slice(a, c);
              let f = s.substr(c + 2, 4);
              switch (f) {
                case "0000":
                  o += "\\0";
                  break;
                case "0007":
                  o += "\\a";
                  break;
                case "000b":
                  o += "\\v";
                  break;
                case "001b":
                  o += "\\e";
                  break;
                case "0085":
                  o += "\\N";
                  break;
                case "00a0":
                  o += "\\_";
                  break;
                case "2028":
                  o += "\\L";
                  break;
                case "2029":
                  o += "\\P";
                  break;
                default:
                  if (f.substr(0, 2) === "00") o += "\\x" + f.substr(2);
                  else o += s.substr(c, 6);
              }
              (c += 5), (a = c + 1);
            }
            break;
          case "n":
            if (i || s[c + 2] === '"' || s.length < n) c += 1;
            else {
              o +=
                s.slice(a, c) +
                `

`;
              while (s[c + 2] === "\\" && s[c + 3] === "n" && s[c + 4] !== '"')
                (o += `
`),
                  (c += 2);
              if (((o += r), s[c + 2] === " ")) o += "\\";
              (c += 1), (a = c + 1);
            }
            break;
          default:
            c += 1;
        }
    }
    return (
      (o = a ? o + s.slice(a) : s),
      i ? o : J.foldFlowLines(o, r, J.FOLD_QUOTED, ht(t, !1))
    );
  }
  function rs(e, t) {
    if (
      t.options.singleQuote === !1 ||
      (t.implicitKey &&
        e.includes(`
`)) ||
      /[ \t]\n|\n[ \t]/.test(e)
    )
      return $e(e, t);
    let s = t.indent || (pt(e) ? "  " : ""),
      i =
        "'" +
        e.replace(/'/g, "''").replace(
          /\n+/g,
          `$&
${s}`,
        ) +
        "'";
    return t.implicitKey ? i : J.foldFlowLines(i, s, J.FOLD_FLOW, ht(t, !1));
  }
  function be(e, t) {
    let { singleQuote: s } = t.options,
      i;
    if (s === !1) i = $e;
    else {
      let n = e.includes('"'),
        r = e.includes("'");
      if (n && !r) i = rs;
      else if (r && !n) i = $e;
      else i = s ? rs : $e;
    }
    return i(e, t);
  }
  var os;
  try {
    os = new RegExp(
      `(^|(?<!
))
+(?!
|$)`,
      "g",
    );
  } catch {
    os = /\n+(?!\n|$)/g;
  }
  function ft({ comment: e, type: t, value: s }, i, n, r) {
    let { blockQuote: o, commentString: a, lineWidth: c } = i.options;
    if (!o || /\n[\t ]+$/.test(s)) return be(s, i);
    let l = i.indent || (i.forceBlockIndent || pt(s) ? "  " : ""),
      f =
        o === "literal"
          ? !0
          : o === "folded" || t === F.Scalar.BLOCK_FOLDED
            ? !1
            : t === F.Scalar.BLOCK_LITERAL
              ? !0
              : !nl(s, c, l.length);
    if (!s)
      return f
        ? `|
`
        : `>
`;
    let u, h;
    for (h = s.length; h > 0; --h) {
      let O = s[h - 1];
      if (
        O !==
          `
` &&
        O !== "\t" &&
        O !== " "
      )
        break;
    }
    let d = s.substring(h),
      y = d.indexOf(`
`);
    if (y === -1) u = "-";
    else if (s === d || y !== d.length - 1) {
      if (((u = "+"), r)) r();
    } else u = "";
    if (d) {
      if (
        ((s = s.slice(0, -d.length)),
        d[d.length - 1] ===
          `
`)
      )
        d = d.slice(0, -1);
      d = d.replace(os, `$&${l}`);
    }
    let p = !1,
      m,
      w = -1;
    for (m = 0; m < s.length; ++m) {
      let O = s[m];
      if (O === " ") p = !0;
      else if (
        O ===
        `
`
      )
        w = m;
      else break;
    }
    let S = s.substring(0, w < m ? w + 1 : m);
    if (S) (s = s.substring(S.length)), (S = S.replace(/\n+/g, `$&${l}`));
    let _ = (p ? (l ? "2" : "1") : "") + u;
    if (e) {
      if (((_ += " " + a(e.replace(/ ?[\r\n]+/g, " "))), n)) n();
    }
    if (!f) {
      let O = s
          .replace(
            /\n+/g,
            `
$&`,
          )
          .replace(/(?:^|\n)([\t ].*)(?:([\n\t ]*)\n(?![\n\t ]))?/g, "$1$2")
          .replace(/\n+/g, `$&${l}`),
        A = !1,
        E = ht(i, !0);
      if (o !== "folded" && t !== F.Scalar.BLOCK_FOLDED)
        E.onOverflow = () => {
          A = !0;
        };
      let b = J.foldFlowLines(`${S}${O}${d}`, l, J.FOLD_BLOCK, E);
      if (!A)
        return `>${_}
${l}${b}`;
    }
    return (
      (s = s.replace(/\n+/g, `$&${l}`)),
      `|${_}
${l}${S}${s}${d}`
    );
  }
  function rl(e, t, s, i) {
    let { type: n, value: r } = e,
      {
        actualString: o,
        implicitKey: a,
        indent: c,
        indentStep: l,
        inFlow: f,
      } = t;
    if (
      (a &&
        r.includes(`
`)) ||
      (f && /[[\]{},]/.test(r))
    )
      return be(r, t);
    if (
      /^[\n\t ,[\]{}#&*!|>'"%@`]|^[?-]$|^[?-][ \t]|[\n:][ \t]|[ \t]\n|[\n\t ]#|[\n\t :]$/.test(
        r,
      )
    )
      return a ||
        f ||
        !r.includes(`
`)
        ? be(r, t)
        : ft(e, t, s, i);
    if (
      !a &&
      !f &&
      n !== F.Scalar.PLAIN &&
      r.includes(`
`)
    )
      return ft(e, t, s, i);
    if (pt(r)) {
      if (c === "") return ((t.forceBlockIndent = !0), ft(e, t, s, i));
      else if (a && c === l) return be(r, t);
    }
    let u = r.replace(
      /\n+/g,
      `$&
${c}`,
    );
    if (o) {
      let h = (p) =>
          p.default && p.tag !== "tag:yaml.org,2002:str" && p.test?.test(u),
        { compat: d, tags: y } = t.doc.schema;
      if (y.some(h) || d?.some(h)) return be(r, t);
    }
    return a ? u : J.foldFlowLines(u, c, J.FOLD_FLOW, ht(t, !1));
  }
  function ol(e, t, s, i) {
    let { implicitKey: n, inFlow: r } = t,
      o =
        typeof e.value === "string"
          ? e
          : Object.assign({}, e, { value: String(e.value) }),
      { type: a } = e;
    if (a !== F.Scalar.QUOTE_DOUBLE) {
      if (/[\x00-\x08\x0b-\x1f\x7f-\x9f\u{D800}-\u{DFFF}]/u.test(o.value))
        a = F.Scalar.QUOTE_DOUBLE;
    }
    let c = (f) => {
        switch (f) {
          case F.Scalar.BLOCK_FOLDED:
          case F.Scalar.BLOCK_LITERAL:
            return n || r ? be(o.value, t) : ft(o, t, s, i);
          case F.Scalar.QUOTE_DOUBLE:
            return $e(o.value, t);
          case F.Scalar.QUOTE_SINGLE:
            return rs(o.value, t);
          case F.Scalar.PLAIN:
            return rl(o, t, s, i);
          default:
            return null;
        }
      },
      l = c(a);
    if (l === null) {
      let { defaultKeyType: f, defaultStringType: u } = t.options,
        h = (n && f) || u;
      if (((l = c(h)), l === null))
        throw Error(`Unsupported default string type ${h}`);
    }
    return l;
  }
  al.stringifyString = ol;
});
var Ie = g(function (gl) {
  var cl = at(),
    Q = k(),
    ul = Le(),
    fl = xe();
  function hl(e, t) {
    let s = Object.assign(
        {
          blockQuote: !0,
          commentString: ul.stringifyComment,
          defaultKeyType: null,
          defaultStringType: "PLAIN",
          directives: null,
          doubleQuotedAsJSON: !1,
          doubleQuotedMinMultiLineLength: 40,
          falseStr: "false",
          flowCollectionPadding: !0,
          indentSeq: !0,
          lineWidth: 80,
          minContentWidth: 20,
          nullStr: "null",
          simpleKeys: !1,
          singleQuote: null,
          trailingComma: !1,
          trueStr: "true",
          verifyAliasOrder: !0,
        },
        e.schema.toStringOptions,
        t,
      ),
      i;
    switch (s.collectionStyle) {
      case "block":
        i = !1;
        break;
      case "flow":
        i = !0;
        break;
      default:
        i = null;
    }
    return {
      anchors: new Set(),
      doc: e,
      flowCollectionPadding: s.flowCollectionPadding ? " " : "",
      indent: "",
      indentStep: typeof s.indent === "number" ? " ".repeat(s.indent) : "  ",
      inFlow: i,
      options: s,
    };
  }
  function pl(e, t) {
    if (t.tag) {
      let n = e.filter((r) => r.tag === t.tag);
      if (n.length > 0) return n.find((r) => r.format === t.format) ?? n[0];
    }
    let s = void 0,
      i;
    if (Q.isScalar(t)) {
      i = t.value;
      let n = e.filter((r) => r.identify?.(i));
      if (n.length > 1) {
        let r = n.filter((o) => o.test);
        if (r.length > 0) n = r;
      }
      s = n.find((r) => r.format === t.format) ?? n.find((r) => !r.format);
    } else
      (i = t), (s = e.find((n) => n.nodeClass && i instanceof n.nodeClass));
    if (!s) {
      let n = i?.constructor?.name ?? (i === null ? "null" : typeof i);
      throw Error(`Tag not resolved for ${n} value`);
    }
    return s;
  }
  function dl(e, t, { anchors: s, doc: i }) {
    if (!i.directives) return "";
    let n = [],
      r = (Q.isScalar(e) || Q.isCollection(e)) && e.anchor;
    if (r && cl.anchorIsValid(r)) s.add(r), n.push(`&${r}`);
    let o = e.tag ?? (t.default ? null : t.tag);
    if (o) n.push(i.directives.tagString(o));
    return n.join(" ");
  }
  function ml(e, t, s, i) {
    if (Q.isPair(e)) return e.toString(t, s, i);
    if (Q.isAlias(e)) {
      if (t.doc.directives) return e.toString(t);
      if (t.resolvedAliases?.has(e))
        throw TypeError(
          "Cannot stringify circular structure without alias nodes",
        );
      else {
        if (t.resolvedAliases) t.resolvedAliases.add(e);
        else t.resolvedAliases = new Set([e]);
        e = e.resolve(t.doc);
      }
    }
    let n = void 0,
      r = Q.isNode(e) ? e : t.doc.createNode(e, { onTagObj: (c) => (n = c) });
    n ?? (n = pl(t.doc.schema.tags, r));
    let o = dl(r, n, t);
    if (o.length > 0) t.indentAtStart = (t.indentAtStart ?? 0) + o.length + 1;
    let a =
      typeof n.stringify === "function"
        ? n.stringify(r, t, s, i)
        : Q.isScalar(r)
          ? fl.stringifyString(r, t, s, i)
          : r.toString(t, s, i);
    if (!o) return a;
    return Q.isScalar(r) || a[0] === "{" || a[0] === "["
      ? `${o} ${a}`
      : `${o}
${t.indent}${a}`;
  }
  gl.createStringifyContext = hl;
  gl.stringify = ml;
});
var Ui = g(function (Sl) {
  var W = k(),
    Ri = N(),
    Hi = Ie(),
    Pe = Le();
  function wl({ key: e, value: t }, s, i, n) {
    let {
        allNullValues: r,
        doc: o,
        indent: a,
        indentStep: c,
        options: { commentString: l, indentSeq: f, simpleKeys: u },
      } = s,
      h = (W.isNode(e) && e.comment) || null;
    if (u) {
      if (h) throw Error("With simple keys, key nodes cannot have comments");
      if (W.isCollection(e) || (!W.isNode(e) && typeof e === "object"))
        throw Error(
          "With simple keys, collection cannot be used as a key value",
        );
    }
    let d =
      !u &&
      (!e ||
        (h && t == null && !s.inFlow) ||
        W.isCollection(e) ||
        (W.isScalar(e)
          ? e.type === Ri.Scalar.BLOCK_FOLDED ||
            e.type === Ri.Scalar.BLOCK_LITERAL
          : typeof e === "object"));
    s = Object.assign({}, s, {
      allNullValues: !1,
      implicitKey: !d && (u || !r),
      indent: a + c,
    });
    let y = !1,
      p = !1,
      m = Hi.stringify(
        e,
        s,
        () => (y = !0),
        () => (p = !0),
      );
    if (!d && !s.inFlow && m.length > 1024) {
      if (u)
        throw Error(
          "With simple keys, single line scalar must not span more than 1024 characters",
        );
      d = !0;
    }
    if (s.inFlow) {
      if (r || t == null) {
        if (y && i) i();
        return m === "" ? "?" : d ? `? ${m}` : m;
      }
    } else if ((r && !u) || (t == null && d)) {
      if (((m = `? ${m}`), h && !y)) m += Pe.lineComment(m, s.indent, l(h));
      else if (p && n) n();
      return m;
    }
    if (y) h = null;
    if (d) {
      if (h) m += Pe.lineComment(m, s.indent, l(h));
      m = `? ${m}
${a}:`;
    } else if (((m = `${m}:`), h)) m += Pe.lineComment(m, s.indent, l(h));
    let w, S, v;
    if (W.isNode(t))
      (w = !!t.spaceBefore), (S = t.commentBefore), (v = t.comment);
    else if (((w = !1), (S = null), (v = null), t && typeof t === "object"))
      t = o.createNode(t);
    if (((s.implicitKey = !1), !d && !h && W.isScalar(t)))
      s.indentAtStart = m.length + 1;
    if (
      ((p = !1),
      !f &&
        c.length >= 2 &&
        !s.inFlow &&
        !d &&
        W.isSeq(t) &&
        !t.flow &&
        !t.tag &&
        !t.anchor)
    )
      s.indent = s.indent.substring(2);
    let _ = !1,
      O = Hi.stringify(
        t,
        s,
        () => (_ = !0),
        () => (p = !0),
      ),
      A = " ";
    if (h || w || S) {
      if (
        ((A = w
          ? `
`
          : ""),
        S)
      ) {
        let E = l(S);
        A += `
${Pe.indentComment(E, s.indent)}`;
      }
      if (O === "" && !s.inFlow) {
        if (
          A ===
            `
` &&
          v
        )
          A = `

`;
      } else
        A += `
${s.indent}`;
    } else if (!d && W.isCollection(t)) {
      let E = O[0],
        b = O.indexOf(`
`),
        q = b !== -1,
        G = s.inFlow ?? t.flow ?? t.items.length === 0;
      if (q || !G) {
        let he = !1;
        if (q && (E === "&" || E === "!")) {
          let T = O.indexOf(" ");
          if (E === "&" && T !== -1 && T < b && O[T + 1] === "!")
            T = O.indexOf(" ", T + 1);
          if (T === -1 || b < T) he = !0;
        }
        if (!he)
          A = `
${s.indent}`;
      }
    } else if (
      O === "" ||
      O[0] ===
        `
`
    )
      A = "";
    if (((m += A + O), s.inFlow)) {
      if (_ && i) i();
    } else if (v && !_) m += Pe.lineComment(m, s.indent, l(v));
    else if (p && n) n();
    return m;
  }
  Sl.stringifyPair = wl;
});
var as = g(function (Al) {
  var Wi = ze("process");
  function _l(e, ...t) {
    if (e === "debug") console.log(...t);
  }
  function Ol(e, t) {
    if (e === "debug" || e === "warn")
      if (typeof Wi.emitWarning === "function") Wi.emitWarning(t);
      else console.warn(t);
  }
  Al.debug = _l;
  Al.warn = Ol;
});
var yt = g(function (Nl) {
  var gt = k(),
    Gi = N(),
    dt = "<<",
    mt = {
      identify: (e) =>
        e === dt || (typeof e === "symbol" && e.description === dt),
      default: "key",
      tag: "tag:yaml.org,2002:merge",
      test: /^<<$/,
      resolve: () =>
        Object.assign(new Gi.Scalar(Symbol(dt)), { addToJSMap: Yi }),
      stringify: () => dt,
    },
    El = (e, t) =>
      (mt.identify(t) ||
        (gt.isScalar(t) &&
          (!t.type || t.type === Gi.Scalar.PLAIN) &&
          mt.identify(t.value))) &&
      e?.doc.schema.tags.some((s) => s.tag === mt.tag && s.default);
  function Yi(e, t, s) {
    let i = Ji(e, s);
    if (gt.isSeq(i)) for (let n of i.items) ls(e, t, n);
    else if (Array.isArray(i)) for (let n of i) ls(e, t, n);
    else ls(e, t, i);
  }
  function ls(e, t, s) {
    let i = Ji(e, s);
    if (!gt.isMap(i)) throw Error("Merge sources must be maps or map aliases");
    let n = i.toJSON(null, e, Map);
    for (let [r, o] of n)
      if (t instanceof Map) {
        if (!t.has(r)) t.set(r, o);
      } else if (t instanceof Set) t.add(r);
      else if (!Object.prototype.hasOwnProperty.call(t, r))
        Object.defineProperty(t, r, {
          value: o,
          writable: !0,
          enumerable: !0,
          configurable: !0,
        });
    return t;
  }
  function Ji(e, t) {
    return e && gt.isAlias(t) ? t.resolve(e.doc, e) : t;
  }
  Nl.addMergeToJSMap = Yi;
  Nl.isMergeKey = El;
  Nl.merge = mt;
});
var us = g(function (Ml) {
  var $l = as(),
    Qi = yt(),
    xl = Ie(),
    Xi = k(),
    cs = Y();
  function Il(e, t, { key: s, value: i }) {
    if (Xi.isNode(s) && s.addToJSMap) s.addToJSMap(e, t, i);
    else if (Qi.isMergeKey(e, s)) Qi.addMergeToJSMap(e, t, i);
    else {
      let n = cs.toJS(s, "", e);
      if (t instanceof Map) t.set(n, cs.toJS(i, n, e));
      else if (t instanceof Set) t.add(n);
      else {
        let r = Pl(s, n, e),
          o = cs.toJS(i, r, e);
        if (r in t)
          Object.defineProperty(t, r, {
            value: o,
            writable: !0,
            enumerable: !0,
            configurable: !0,
          });
        else t[r] = o;
      }
    }
    return t;
  }
  function Pl(e, t, s) {
    if (t === null) return "";
    if (typeof t !== "object") return String(t);
    if (Xi.isNode(e) && s?.doc) {
      let i = xl.createStringifyContext(s.doc, {});
      i.anchors = new Set();
      for (let r of s.anchors.keys()) i.anchors.add(r.anchor);
      (i.inFlow = !0), (i.inStringifyKey = !0);
      let n = e.toString(i);
      if (!s.mapKeyWarned) {
        let r = JSON.stringify(n);
        if (r.length > 40) r = r.substring(0, 36) + '..."';
        $l.warn(
          s.doc.options.logLevel,
          `Keys with collection values will be stringified due to JS Object restrictions: ${r}. Set mapAsMap: true to use object keys.`,
        ),
          (s.mapKeyWarned = !0);
      }
      return n;
    }
    return JSON.stringify(t);
  }
  Ml.addPairToJSMap = Il;
});
var X = g(function (Vl) {
  var zi = Te(),
    Fl = Ui(),
    Bl = us(),
    bt = k();
  function jl(e, t, s) {
    let i = zi.createNode(e, void 0, s),
      n = zi.createNode(t, void 0, s);
    return new wt(i, n);
  }
  class wt {
    constructor(e, t = null) {
      Object.defineProperty(this, bt.NODE_TYPE, { value: bt.PAIR }),
        (this.key = e),
        (this.value = t);
    }
    clone(e) {
      let { key: t, value: s } = this;
      if (bt.isNode(t)) t = t.clone(e);
      if (bt.isNode(s)) s = s.clone(e);
      return new wt(t, s);
    }
    toJSON(e, t) {
      let s = t?.mapAsMap ? new Map() : {};
      return Bl.addPairToJSMap(t, s, this);
    }
    toString(e, t, s) {
      return e?.doc ? Fl.stringifyPair(this, e, t, s) : JSON.stringify(this);
    }
  }
  Vl.Pair = wt;
  Vl.createPair = jl;
});
var fs = g(function (Gl) {
  var oe = k(),
    Zi = Ie(),
    St = Le();
  function Hl(e, t, s) {
    return ((t.inFlow ?? e.flow) ? Wl : Ul)(e, t, s);
  }
  function Ul(
    { comment: e, items: t },
    s,
    {
      blockItemPrefix: i,
      flowChars: n,
      itemIndent: r,
      onChompKeep: o,
      onComment: a,
    },
  ) {
    let {
        indent: c,
        options: { commentString: l },
      } = s,
      f = Object.assign({}, s, { indent: r, type: null }),
      u = !1,
      h = [];
    for (let y = 0; y < t.length; ++y) {
      let p = t[y],
        m = null;
      if (oe.isNode(p)) {
        if (!u && p.spaceBefore) h.push("");
        if ((vt(s, h, p.commentBefore, u), p.comment)) m = p.comment;
      } else if (oe.isPair(p)) {
        let S = oe.isNode(p.key) ? p.key : null;
        if (S) {
          if (!u && S.spaceBefore) h.push("");
          vt(s, h, S.commentBefore, u);
        }
      }
      u = !1;
      let w = Zi.stringify(
        p,
        f,
        () => (m = null),
        () => (u = !0),
      );
      if (m) w += St.lineComment(w, r, l(m));
      if (u && m) u = !1;
      h.push(i + w);
    }
    let d;
    if (h.length === 0) d = n.start + n.end;
    else {
      d = h[0];
      for (let y = 1; y < h.length; ++y) {
        let p = h[y];
        d += p
          ? `
${c}${p}`
          : `
`;
      }
    }
    if (e) {
      if (
        ((d +=
          `
` + St.indentComment(l(e), c)),
        a)
      )
        a();
    } else if (u && o) o();
    return d;
  }
  function Wl({ items: e }, t, { flowChars: s, itemIndent: i }) {
    let {
      indent: n,
      indentStep: r,
      flowCollectionPadding: o,
      options: { commentString: a },
    } = t;
    i += r;
    let c = Object.assign({}, t, { indent: i, inFlow: !0, type: null }),
      l = !1,
      f = 0,
      u = [];
    for (let y = 0; y < e.length; ++y) {
      let p = e[y],
        m = null;
      if (oe.isNode(p)) {
        if (p.spaceBefore) u.push("");
        if ((vt(t, u, p.commentBefore, !1), p.comment)) m = p.comment;
      } else if (oe.isPair(p)) {
        let S = oe.isNode(p.key) ? p.key : null;
        if (S) {
          if (S.spaceBefore) u.push("");
          if ((vt(t, u, S.commentBefore, !1), S.comment)) l = !0;
        }
        let v = oe.isNode(p.value) ? p.value : null;
        if (v) {
          if (v.comment) m = v.comment;
          if (v.commentBefore) l = !0;
        } else if (p.value == null && S?.comment) m = S.comment;
      }
      if (m) l = !0;
      let w = Zi.stringify(p, c, () => (m = null));
      if (
        (l ||
          (l =
            u.length > f ||
            w.includes(`
`)),
        y < e.length - 1)
      )
        w += ",";
      else if (t.options.trailingComma) {
        if (t.options.lineWidth > 0)
          l ||
            (l =
              u.reduce((S, v) => S + v.length + 2, 2) + (w.length + 2) >
              t.options.lineWidth);
        if (l) w += ",";
      }
      if (m) w += St.lineComment(w, i, a(m));
      u.push(w), (f = u.length);
    }
    let { start: h, end: d } = s;
    if (u.length === 0) return h + d;
    else {
      if (!l) {
        let y = u.reduce((p, m) => p + m.length + 2, 2);
        l = t.options.lineWidth > 0 && y > t.options.lineWidth;
      }
      if (l) {
        let y = h;
        for (let p of u)
          y += p
            ? `
${r}${n}${p}`
            : `
`;
        return `${y}
${n}${d}`;
      } else return `${h}${o}${u.join(" ")}${o}${d}`;
    }
  }
  function vt({ indent: e, options: { commentString: t } }, s, i, n) {
    if (i && n) i = i.replace(/^\n+/, "");
    if (i) {
      let r = St.indentComment(t(i), e);
      s.push(r.trimStart());
    }
  }
  Gl.stringifyCollection = Hl;
});
var Z = g(function (Zl) {
  var Jl = fs(),
    Ql = us(),
    Xl = ut(),
    z = k(),
    _t = X(),
    zl = N();
  function Me(e, t) {
    let s = z.isScalar(t) ? t.value : t;
    for (let i of e)
      if (z.isPair(i)) {
        if (i.key === t || i.key === s) return i;
        if (z.isScalar(i.key) && i.key.value === s) return i;
      }
    return;
  }
  class en extends Xl.Collection {
    static get tagName() {
      return "tag:yaml.org,2002:map";
    }
    constructor(e) {
      super(z.MAP, e);
      this.items = [];
    }
    static from(e, t, s) {
      let { keepUndefined: i, replacer: n } = s,
        r = new this(e),
        o = (a, c) => {
          if (typeof n === "function") c = n.call(t, a, c);
          else if (Array.isArray(n) && !n.includes(a)) return;
          if (c !== void 0 || i) r.items.push(_t.createPair(a, c, s));
        };
      if (t instanceof Map) for (let [a, c] of t) o(a, c);
      else if (t && typeof t === "object")
        for (let a of Object.keys(t)) o(a, t[a]);
      if (typeof e.sortMapEntries === "function")
        r.items.sort(e.sortMapEntries);
      return r;
    }
    add(e, t) {
      let s;
      if (z.isPair(e)) s = e;
      else if (!e || typeof e !== "object" || !("key" in e))
        s = new _t.Pair(e, e?.value);
      else s = new _t.Pair(e.key, e.value);
      let i = Me(this.items, s.key),
        n = this.schema?.sortMapEntries;
      if (i) {
        if (!t) throw Error(`Key ${s.key} already set`);
        if (z.isScalar(i.value) && zl.isScalarValue(s.value))
          i.value.value = s.value;
        else i.value = s.value;
      } else if (n) {
        let r = this.items.findIndex((o) => n(s, o) < 0);
        if (r === -1) this.items.push(s);
        else this.items.splice(r, 0, s);
      } else this.items.push(s);
    }
    delete(e) {
      let t = Me(this.items, e);
      if (!t) return !1;
      return this.items.splice(this.items.indexOf(t), 1).length > 0;
    }
    get(e, t) {
      let i = Me(this.items, e)?.value;
      return (!t && z.isScalar(i) ? i.value : i) ?? void 0;
    }
    has(e) {
      return !!Me(this.items, e);
    }
    set(e, t) {
      this.add(new _t.Pair(e, t), !0);
    }
    toJSON(e, t, s) {
      let i = s ? new s() : t?.mapAsMap ? new Map() : {};
      if (t?.onCreate) t.onCreate(i);
      for (let n of this.items) Ql.addPairToJSMap(t, i, n);
      return i;
    }
    toString(e, t, s) {
      if (!e) return JSON.stringify(this);
      for (let i of this.items)
        if (!z.isPair(i))
          throw Error(
            `Map items must all be pairs; found ${JSON.stringify(i)} instead`,
          );
      if (!e.allNullValues && this.hasAllNullValues(!1))
        e = Object.assign({}, e, { allNullValues: !0 });
      return Jl.stringifyCollection(this, e, {
        blockItemPrefix: "",
        flowChars: { start: "{", end: "}" },
        itemIndent: e.indent || "",
        onChompKeep: s,
        onComment: t,
      });
    }
  }
  Zl.YAMLMap = en;
  Zl.findPair = Me;
});
var we = g(function (nc) {
  var sc = k(),
    tn = Z(),
    ic = {
      collection: "map",
      default: !0,
      nodeClass: tn.YAMLMap,
      tag: "tag:yaml.org,2002:map",
      resolve(e, t) {
        if (!sc.isMap(e)) t("Expected a mapping for this tag");
        return e;
      },
      createNode: (e, t, s) => tn.YAMLMap.from(e, t, s),
    };
  nc.map = ic;
});
var ee = g(function (fc) {
  var oc = Te(),
    ac = fs(),
    lc = ut(),
    At = k(),
    cc = N(),
    uc = Y();
  class sn extends lc.Collection {
    static get tagName() {
      return "tag:yaml.org,2002:seq";
    }
    constructor(e) {
      super(At.SEQ, e);
      this.items = [];
    }
    add(e) {
      this.items.push(e);
    }
    delete(e) {
      let t = Ot(e);
      if (typeof t !== "number") return !1;
      return this.items.splice(t, 1).length > 0;
    }
    get(e, t) {
      let s = Ot(e);
      if (typeof s !== "number") return;
      let i = this.items[s];
      return !t && At.isScalar(i) ? i.value : i;
    }
    has(e) {
      let t = Ot(e);
      return typeof t === "number" && t < this.items.length;
    }
    set(e, t) {
      let s = Ot(e);
      if (typeof s !== "number")
        throw Error(`Expected a valid index, not ${e}.`);
      let i = this.items[s];
      if (At.isScalar(i) && cc.isScalarValue(t)) i.value = t;
      else this.items[s] = t;
    }
    toJSON(e, t) {
      let s = [];
      if (t?.onCreate) t.onCreate(s);
      let i = 0;
      for (let n of this.items) s.push(uc.toJS(n, String(i++), t));
      return s;
    }
    toString(e, t, s) {
      if (!e) return JSON.stringify(this);
      return ac.stringifyCollection(this, e, {
        blockItemPrefix: "- ",
        flowChars: { start: "[", end: "]" },
        itemIndent: (e.indent || "") + "  ",
        onChompKeep: s,
        onComment: t,
      });
    }
    static from(e, t, s) {
      let { replacer: i } = s,
        n = new this(e);
      if (t && Symbol.iterator in Object(t)) {
        let r = 0;
        for (let o of t) {
          if (typeof i === "function") {
            let a = t instanceof Set ? o : String(r++);
            o = i.call(t, a, o);
          }
          n.items.push(oc.createNode(o, void 0, s));
        }
      }
      return n;
    }
  }
  function Ot(e) {
    let t = At.isScalar(e) ? e.value : e;
    if (t && typeof t === "string") t = Number(t);
    return typeof t === "number" && Number.isInteger(t) && t >= 0 ? t : null;
  }
  fc.YAMLSeq = sn;
});
var Se = g(function (mc) {
  var pc = k(),
    nn = ee(),
    dc = {
      collection: "seq",
      default: !0,
      nodeClass: nn.YAMLSeq,
      tag: "tag:yaml.org,2002:seq",
      resolve(e, t) {
        if (!pc.isSeq(e)) t("Expected a sequence for this tag");
        return e;
      },
      createNode: (e, t, s) => nn.YAMLSeq.from(e, t, s),
    };
  mc.seq = dc;
});
var De = g(function (wc) {
  var yc = xe(),
    bc = {
      identify: (e) => typeof e === "string",
      default: !0,
      tag: "tag:yaml.org,2002:str",
      resolve: (e) => e,
      stringify(e, t, s, i) {
        return (
          (t = Object.assign({ actualString: !0 }, t)),
          yc.stringifyString(e, t, s, i)
        );
      },
    };
  wc.string = bc;
});
var kt = g(function (vc) {
  var rn = N(),
    on = {
      identify: (e) => e == null,
      createNode: () => new rn.Scalar(null),
      default: !0,
      tag: "tag:yaml.org,2002:null",
      test: /^(?:~|[Nn]ull|NULL)?$/,
      resolve: () => new rn.Scalar(null),
      stringify: ({ source: e }, t) =>
        typeof e === "string" && on.test.test(e) ? e : t.options.nullStr,
    };
  vc.nullTag = on;
});
var hs = g(function (Ac) {
  var Oc = N(),
    an = {
      identify: (e) => typeof e === "boolean",
      default: !0,
      tag: "tag:yaml.org,2002:bool",
      test: /^(?:[Tt]rue|TRUE|[Ff]alse|FALSE)$/,
      resolve: (e) => new Oc.Scalar(e[0] === "t" || e[0] === "T"),
      stringify({ source: e, value: t }, s) {
        if (e && an.test.test(e)) {
          let i = e[0] === "t" || e[0] === "T";
          if (t === i) return e;
        }
        return t ? s.options.trueStr : s.options.falseStr;
      },
    };
  Ac.boolTag = an;
});
var ve = g(function (Ec) {
  function Cc({ format: e, minFractionDigits: t, tag: s, value: i }) {
    if (typeof i === "bigint") return String(i);
    let n = typeof i === "number" ? i : Number(i);
    if (!isFinite(n)) return isNaN(n) ? ".nan" : n < 0 ? "-.inf" : ".inf";
    let r = Object.is(i, -0) ? "-0" : JSON.stringify(i);
    if (
      !e &&
      t &&
      (!s || s === "tag:yaml.org,2002:float") &&
      /^-?\d/.test(r) &&
      !r.includes("e")
    ) {
      let o = r.indexOf(".");
      if (o < 0) (o = r.length), (r += ".");
      let a = t - (r.length - o - 1);
      while (a-- > 0) r += "0";
    }
    return r;
  }
  Ec.stringifyNumber = Cc;
});
var ds = g(function (xc) {
  var qc = N(),
    ps = ve(),
    Tc = {
      identify: (e) => typeof e === "number",
      default: !0,
      tag: "tag:yaml.org,2002:float",
      test: /^(?:[-+]?\.(?:inf|Inf|INF)|\.nan|\.NaN|\.NAN)$/,
      resolve: (e) =>
        e.slice(-3).toLowerCase() === "nan"
          ? NaN
          : e[0] === "-"
            ? Number.NEGATIVE_INFINITY
            : Number.POSITIVE_INFINITY,
      stringify: ps.stringifyNumber,
    },
    Lc = {
      identify: (e) => typeof e === "number",
      default: !0,
      tag: "tag:yaml.org,2002:float",
      format: "EXP",
      test: /^[-+]?(?:\.[0-9]+|[0-9]+(?:\.[0-9]*)?)[eE][-+]?[0-9]+$/,
      resolve: (e) => parseFloat(e),
      stringify(e) {
        let t = Number(e.value);
        return isFinite(t) ? t.toExponential() : ps.stringifyNumber(e);
      },
    },
    $c = {
      identify: (e) => typeof e === "number",
      default: !0,
      tag: "tag:yaml.org,2002:float",
      test: /^[-+]?(?:\.[0-9]+|[0-9]+\.[0-9]*)$/,
      resolve(e) {
        let t = new qc.Scalar(parseFloat(e)),
          s = e.indexOf(".");
        if (s !== -1 && e[e.length - 1] === "0")
          t.minFractionDigits = e.length - s - 1;
        return t;
      },
      stringify: ps.stringifyNumber,
    };
  xc.float = $c;
  xc.floatExp = Lc;
  xc.floatNaN = Tc;
});
var gs = g(function (jc) {
  var ln = ve(),
    Ct = (e) => typeof e === "bigint" || Number.isInteger(e),
    ms = (e, t, s, { intAsBigInt: i }) =>
      i ? BigInt(e) : parseInt(e.substring(t), s);
  function cn(e, t, s) {
    let { value: i } = e;
    if (Ct(i) && i >= 0) return s + i.toString(t);
    return ln.stringifyNumber(e);
  }
  var Dc = {
      identify: (e) => Ct(e) && e >= 0,
      default: !0,
      tag: "tag:yaml.org,2002:int",
      format: "OCT",
      test: /^0o[0-7]+$/,
      resolve: (e, t, s) => ms(e, 2, 8, s),
      stringify: (e) => cn(e, 8, "0o"),
    },
    Fc = {
      identify: Ct,
      default: !0,
      tag: "tag:yaml.org,2002:int",
      test: /^[-+]?[0-9]+$/,
      resolve: (e, t, s) => ms(e, 0, 10, s),
      stringify: ln.stringifyNumber,
    },
    Bc = {
      identify: (e) => Ct(e) && e >= 0,
      default: !0,
      tag: "tag:yaml.org,2002:int",
      format: "HEX",
      test: /^0x[0-9a-fA-F]+$/,
      resolve: (e, t, s) => ms(e, 2, 16, s),
      stringify: (e) => cn(e, 16, "0x"),
    };
  jc.int = Fc;
  jc.intHex = Bc;
  jc.intOct = Dc;
});
var un = g(function (Qc) {
  var Hc = we(),
    Uc = kt(),
    Wc = Se(),
    Gc = De(),
    Yc = hs(),
    ys = ds(),
    bs = gs(),
    Jc = [
      Hc.map,
      Wc.seq,
      Gc.string,
      Uc.nullTag,
      Yc.boolTag,
      bs.intOct,
      bs.int,
      bs.intHex,
      ys.floatNaN,
      ys.floatExp,
      ys.float,
    ];
  Qc.schema = Jc;
});
var hn = g(function (nu) {
  var zc = N(),
    Zc = we(),
    eu = Se();
  function fn(e) {
    return typeof e === "bigint" || Number.isInteger(e);
  }
  var Et = ({ value: e }) => JSON.stringify(e),
    tu = [
      {
        identify: (e) => typeof e === "string",
        default: !0,
        tag: "tag:yaml.org,2002:str",
        resolve: (e) => e,
        stringify: Et,
      },
      {
        identify: (e) => e == null,
        createNode: () => new zc.Scalar(null),
        default: !0,
        tag: "tag:yaml.org,2002:null",
        test: /^null$/,
        resolve: () => null,
        stringify: Et,
      },
      {
        identify: (e) => typeof e === "boolean",
        default: !0,
        tag: "tag:yaml.org,2002:bool",
        test: /^true$|^false$/,
        resolve: (e) => e === "true",
        stringify: Et,
      },
      {
        identify: fn,
        default: !0,
        tag: "tag:yaml.org,2002:int",
        test: /^-?(?:0|[1-9][0-9]*)$/,
        resolve: (e, t, { intAsBigInt: s }) =>
          s ? BigInt(e) : parseInt(e, 10),
        stringify: ({ value: e }) => (fn(e) ? e.toString() : JSON.stringify(e)),
      },
      {
        identify: (e) => typeof e === "number",
        default: !0,
        tag: "tag:yaml.org,2002:float",
        test: /^-?(?:0|[1-9][0-9]*)(?:\.[0-9]*)?(?:[eE][-+]?[0-9]+)?$/,
        resolve: (e) => parseFloat(e),
        stringify: Et,
      },
    ],
    su = {
      default: !0,
      tag: "",
      test: /^/,
      resolve(e, t) {
        return (t(`Unresolved plain scalar ${JSON.stringify(e)}`), e);
      },
    },
    iu = [Zc.map, eu.seq].concat(tu, su);
  nu.schema = iu;
});
var Ss = g(function (lu) {
  var Fe = ze("buffer"),
    ws = N(),
    ou = xe(),
    au = {
      identify: (e) => e instanceof Uint8Array,
      default: !1,
      tag: "tag:yaml.org,2002:binary",
      resolve(e, t) {
        if (typeof Fe.Buffer === "function") return Fe.Buffer.from(e, "base64");
        else if (typeof atob === "function") {
          let s = atob(e.replace(/[\n\r]/g, "")),
            i = new Uint8Array(s.length);
          for (let n = 0; n < s.length; ++n) i[n] = s.charCodeAt(n);
          return i;
        } else
          return (
            t(
              "This environment does not support reading binary tags; either Buffer or atob is required",
            ),
            e
          );
      },
      stringify({ comment: e, type: t, value: s }, i, n, r) {
        if (!s) return "";
        let o = s,
          a;
        if (typeof Fe.Buffer === "function")
          a =
            o instanceof Fe.Buffer
              ? o.toString("base64")
              : Fe.Buffer.from(o.buffer).toString("base64");
        else if (typeof btoa === "function") {
          let c = "";
          for (let l = 0; l < o.length; ++l) c += String.fromCharCode(o[l]);
          a = btoa(c);
        } else
          throw Error(
            "This environment does not support writing binary tags; either Buffer or btoa is required",
          );
        if (
          (t ?? (t = ws.Scalar.BLOCK_LITERAL), t !== ws.Scalar.QUOTE_DOUBLE)
        ) {
          let c = Math.max(
              i.options.lineWidth - i.indent.length,
              i.options.minContentWidth,
            ),
            l = Math.ceil(a.length / c),
            f = Array(l);
          for (let u = 0, h = 0; u < l; ++u, h += c) f[u] = a.substr(h, c);
          a = f.join(
            t === ws.Scalar.BLOCK_LITERAL
              ? `
`
              : " ",
          );
        }
        return ou.stringifyString({ comment: e, type: t, value: a }, i, n, r);
      },
    };
  lu.binary = au;
});
var qt = g(function (pu) {
  var Nt = k(),
    vs = X(),
    uu = N(),
    fu = ee();
  function pn(e, t) {
    if (Nt.isSeq(e))
      for (let s = 0; s < e.items.length; ++s) {
        let i = e.items[s];
        if (Nt.isPair(i)) continue;
        else if (Nt.isMap(i)) {
          if (i.items.length > 1)
            t("Each pair must have its own sequence indicator");
          let n = i.items[0] || new vs.Pair(new uu.Scalar(null));
          if (i.commentBefore)
            n.key.commentBefore = n.key.commentBefore
              ? `${i.commentBefore}
${n.key.commentBefore}`
              : i.commentBefore;
          if (i.comment) {
            let r = n.value ?? n.key;
            r.comment = r.comment
              ? `${i.comment}
${r.comment}`
              : i.comment;
          }
          i = n;
        }
        e.items[s] = Nt.isPair(i) ? i : new vs.Pair(i);
      }
    else t("Expected a sequence for this tag");
    return e;
  }
  function dn(e, t, s) {
    let { replacer: i } = s,
      n = new fu.YAMLSeq(e);
    n.tag = "tag:yaml.org,2002:pairs";
    let r = 0;
    if (t && Symbol.iterator in Object(t))
      for (let o of t) {
        if (typeof i === "function") o = i.call(t, String(r++), o);
        let a, c;
        if (Array.isArray(o))
          if (o.length === 2) (a = o[0]), (c = o[1]);
          else throw TypeError(`Expected [key, value] tuple: ${o}`);
        else if (o && o instanceof Object) {
          let l = Object.keys(o);
          if (l.length === 1) (a = l[0]), (c = o[a]);
          else
            throw TypeError(
              `Expected tuple with one key, not ${l.length} keys`,
            );
        } else a = o;
        n.items.push(vs.createPair(a, c, s));
      }
    return n;
  }
  var hu = {
    collection: "seq",
    default: !1,
    tag: "tag:yaml.org,2002:pairs",
    resolve: pn,
    createNode: dn,
  };
  pu.createPairs = dn;
  pu.pairs = hu;
  pu.resolvePairs = pn;
});
var Os = g(function (wu) {
  var mn = k(),
    _s = Y(),
    Be = Z(),
    yu = ee(),
    gn = qt();
  class ae extends yu.YAMLSeq {
    constructor() {
      super();
      (this.add = Be.YAMLMap.prototype.add.bind(this)),
        (this.delete = Be.YAMLMap.prototype.delete.bind(this)),
        (this.get = Be.YAMLMap.prototype.get.bind(this)),
        (this.has = Be.YAMLMap.prototype.has.bind(this)),
        (this.set = Be.YAMLMap.prototype.set.bind(this)),
        (this.tag = ae.tag);
    }
    toJSON(e, t) {
      if (!t) return super.toJSON(e);
      let s = new Map();
      if (t?.onCreate) t.onCreate(s);
      for (let i of this.items) {
        let n, r;
        if (mn.isPair(i))
          (n = _s.toJS(i.key, "", t)), (r = _s.toJS(i.value, n, t));
        else n = _s.toJS(i, "", t);
        if (s.has(n))
          throw Error("Ordered maps must not include duplicate keys");
        s.set(n, r);
      }
      return s;
    }
    static from(e, t, s) {
      let i = gn.createPairs(e, t, s),
        n = new this();
      return ((n.items = i.items), n);
    }
  }
  ae.tag = "tag:yaml.org,2002:omap";
  var bu = {
    collection: "seq",
    identify: (e) => e instanceof Map,
    nodeClass: ae,
    default: !1,
    tag: "tag:yaml.org,2002:omap",
    resolve(e, t) {
      let s = gn.resolvePairs(e, t),
        i = [];
      for (let { key: n } of s.items)
        if (mn.isScalar(n))
          if (i.includes(n.value))
            t(`Ordered maps must not include duplicate keys: ${n.value}`);
          else i.push(n.value);
      return Object.assign(new ae(), s);
    },
    createNode: (e, t, s) => ae.from(e, t, s),
  };
  wu.YAMLOMap = ae;
  wu.omap = bu;
});
var vn = g(function (_u) {
  var yn = N();
  function bn({ value: e, source: t }, s) {
    if (t && (e ? wn : Sn).test.test(t)) return t;
    return e ? s.options.trueStr : s.options.falseStr;
  }
  var wn = {
      identify: (e) => e === !0,
      default: !0,
      tag: "tag:yaml.org,2002:bool",
      test: /^(?:Y|y|[Yy]es|YES|[Tt]rue|TRUE|[Oo]n|ON)$/,
      resolve: () => new yn.Scalar(!0),
      stringify: bn,
    },
    Sn = {
      identify: (e) => e === !1,
      default: !0,
      tag: "tag:yaml.org,2002:bool",
      test: /^(?:N|n|[Nn]o|NO|[Ff]alse|FALSE|[Oo]ff|OFF)$/,
      resolve: () => new yn.Scalar(!1),
      stringify: bn,
    };
  _u.falseTag = Sn;
  _u.trueTag = wn;
});
var _n = g(function (qu) {
  var ku = N(),
    As = ve(),
    Cu = {
      identify: (e) => typeof e === "number",
      default: !0,
      tag: "tag:yaml.org,2002:float",
      test: /^(?:[-+]?\.(?:inf|Inf|INF)|\.nan|\.NaN|\.NAN)$/,
      resolve: (e) =>
        e.slice(-3).toLowerCase() === "nan"
          ? NaN
          : e[0] === "-"
            ? Number.NEGATIVE_INFINITY
            : Number.POSITIVE_INFINITY,
      stringify: As.stringifyNumber,
    },
    Eu = {
      identify: (e) => typeof e === "number",
      default: !0,
      tag: "tag:yaml.org,2002:float",
      format: "EXP",
      test: /^[-+]?(?:[0-9][0-9_]*)?(?:\.[0-9_]*)?[eE][-+]?[0-9]+$/,
      resolve: (e) => parseFloat(e.replace(/_/g, "")),
      stringify(e) {
        let t = Number(e.value);
        return isFinite(t) ? t.toExponential() : As.stringifyNumber(e);
      },
    },
    Nu = {
      identify: (e) => typeof e === "number",
      default: !0,
      tag: "tag:yaml.org,2002:float",
      test: /^[-+]?(?:[0-9][0-9_]*)?\.[0-9_]*$/,
      resolve(e) {
        let t = new ku.Scalar(parseFloat(e.replace(/_/g, ""))),
          s = e.indexOf(".");
        if (s !== -1) {
          let i = e.substring(s + 1).replace(/_/g, "");
          if (i[i.length - 1] === "0") t.minFractionDigits = i.length;
        }
        return t;
      },
      stringify: As.stringifyNumber,
    };
  qu.float = Nu;
  qu.floatExp = Eu;
  qu.floatNaN = Cu;
});
var An = g(function (Du) {
  var On = ve(),
    je = (e) => typeof e === "bigint" || Number.isInteger(e);
  function Tt(e, t, s, { intAsBigInt: i }) {
    let n = e[0];
    if (n === "-" || n === "+") t += 1;
    if (((e = e.substring(t).replace(/_/g, "")), i)) {
      switch (s) {
        case 2:
          e = `0b${e}`;
          break;
        case 8:
          e = `0o${e}`;
          break;
        case 16:
          e = `0x${e}`;
          break;
      }
      let o = BigInt(e);
      return n === "-" ? BigInt(-1) * o : o;
    }
    let r = parseInt(e, s);
    return n === "-" ? -1 * r : r;
  }
  function ks(e, t, s) {
    let { value: i } = e;
    if (je(i)) {
      let n = i.toString(t);
      return i < 0 ? "-" + s + n.substr(1) : s + n;
    }
    return On.stringifyNumber(e);
  }
  var xu = {
      identify: je,
      default: !0,
      tag: "tag:yaml.org,2002:int",
      format: "BIN",
      test: /^[-+]?0b[0-1_]+$/,
      resolve: (e, t, s) => Tt(e, 2, 2, s),
      stringify: (e) => ks(e, 2, "0b"),
    },
    Iu = {
      identify: je,
      default: !0,
      tag: "tag:yaml.org,2002:int",
      format: "OCT",
      test: /^[-+]?0[0-7_]+$/,
      resolve: (e, t, s) => Tt(e, 1, 8, s),
      stringify: (e) => ks(e, 8, "0"),
    },
    Pu = {
      identify: je,
      default: !0,
      tag: "tag:yaml.org,2002:int",
      test: /^[-+]?[0-9][0-9_]*$/,
      resolve: (e, t, s) => Tt(e, 0, 10, s),
      stringify: On.stringifyNumber,
    },
    Mu = {
      identify: je,
      default: !0,
      tag: "tag:yaml.org,2002:int",
      format: "HEX",
      test: /^[-+]?0x[0-9a-fA-F_]+$/,
      resolve: (e, t, s) => Tt(e, 2, 16, s),
      stringify: (e) => ks(e, 16, "0x"),
    };
  Du.int = Pu;
  Du.intBin = xu;
  Du.intHex = Mu;
  Du.intOct = Iu;
});
var Cs = g(function (Ru) {
  var xt = k(),
    Lt = X(),
    $t = Z();
  class le extends $t.YAMLMap {
    constructor(e) {
      super(e);
      this.tag = le.tag;
    }
    add(e) {
      let t;
      if (xt.isPair(e)) t = e;
      else if (
        e &&
        typeof e === "object" &&
        "key" in e &&
        "value" in e &&
        e.value === null
      )
        t = new Lt.Pair(e.key, null);
      else t = new Lt.Pair(e, null);
      if (!$t.findPair(this.items, t.key)) this.items.push(t);
    }
    get(e, t) {
      let s = $t.findPair(this.items, e);
      return !t && xt.isPair(s)
        ? xt.isScalar(s.key)
          ? s.key.value
          : s.key
        : s;
    }
    set(e, t) {
      if (typeof t !== "boolean")
        throw Error(
          `Expected boolean value for set(key, value) in a YAML set, not ${typeof t}`,
        );
      let s = $t.findPair(this.items, e);
      if (s && !t) this.items.splice(this.items.indexOf(s), 1);
      else if (!s && t) this.items.push(new Lt.Pair(e));
    }
    toJSON(e, t) {
      return super.toJSON(e, t, Set);
    }
    toString(e, t, s) {
      if (!e) return JSON.stringify(this);
      if (this.hasAllNullValues(!0))
        return super.toString(
          Object.assign({}, e, { allNullValues: !0 }),
          t,
          s,
        );
      else throw Error("Set items must all have null values");
    }
    static from(e, t, s) {
      let { replacer: i } = s,
        n = new this(e);
      if (t && Symbol.iterator in Object(t))
        for (let r of t) {
          if (typeof i === "function") r = i.call(t, r, r);
          n.items.push(Lt.createPair(r, null, s));
        }
      return n;
    }
  }
  le.tag = "tag:yaml.org,2002:set";
  var Ku = {
    collection: "map",
    identify: (e) => e instanceof Set,
    nodeClass: le,
    default: !1,
    tag: "tag:yaml.org,2002:set",
    createNode: (e, t, s) => le.from(e, t, s),
    resolve(e, t) {
      if (xt.isMap(e))
        if (e.hasAllNullValues(!0)) return Object.assign(new le(), e);
        else t("Set items must all have null values");
      else t("Expected a mapping for this tag");
      return e;
    },
  };
  Ru.YAMLSet = le;
  Ru.set = Ku;
});
var Ns = g(function (Ju) {
  var Wu = ve();
  function Es(e, t) {
    let s = e[0],
      i = s === "-" || s === "+" ? e.substring(1) : e,
      n = (o) => (t ? BigInt(o) : Number(o)),
      r = i
        .replace(/_/g, "")
        .split(":")
        .reduce((o, a) => o * n(60) + n(a), n(0));
    return s === "-" ? n(-1) * r : r;
  }
  function kn(e) {
    let { value: t } = e,
      s = (o) => o;
    if (typeof t === "bigint") s = (o) => BigInt(o);
    else if (isNaN(t) || !isFinite(t)) return Wu.stringifyNumber(e);
    let i = "";
    if (t < 0) (i = "-"), (t *= s(-1));
    let n = s(60),
      r = [t % n];
    if (t < 60) r.unshift(0);
    else if (((t = (t - r[0]) / n), r.unshift(t % n), t >= 60))
      (t = (t - r[0]) / n), r.unshift(t);
    return (
      i +
      r
        .map((o) => String(o).padStart(2, "0"))
        .join(":")
        .replace(/000000\d*$/, "")
    );
  }
  var Gu = {
      identify: (e) => typeof e === "bigint" || Number.isInteger(e),
      default: !0,
      tag: "tag:yaml.org,2002:int",
      format: "TIME",
      test: /^[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+$/,
      resolve: (e, t, { intAsBigInt: s }) => Es(e, s),
      stringify: kn,
    },
    Yu = {
      identify: (e) => typeof e === "number",
      default: !0,
      tag: "tag:yaml.org,2002:float",
      format: "TIME",
      test: /^[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+\.[0-9_]*$/,
      resolve: (e) => Es(e, !1),
      stringify: kn,
    },
    Cn = {
      identify: (e) => e instanceof Date,
      default: !0,
      tag: "tag:yaml.org,2002:timestamp",
      test: RegExp(
        "^([0-9]{4})-([0-9]{1,2})-([0-9]{1,2})(?:(?:t|T|[ \\t]+)([0-9]{1,2}):([0-9]{1,2}):([0-9]{1,2}(\\.[0-9]+)?)(?:[ \\t]*(Z|[-+][012]?[0-9](?::[0-9]{2})?))?)?$",
      ),
      resolve(e) {
        let t = e.match(Cn.test);
        if (!t)
          throw Error("!!timestamp expects a date, starting with yyyy-mm-dd");
        let [, s, i, n, r, o, a] = t.map(Number),
          c = t[7] ? Number((t[7] + "00").substr(1, 3)) : 0,
          l = Date.UTC(s, i - 1, n, r || 0, o || 0, a || 0, c),
          f = t[8];
        if (f && f !== "Z") {
          let u = Es(f, !1);
          if (Math.abs(u) < 30) u *= 60;
          l -= 60000 * u;
        }
        return new Date(l);
      },
      stringify: ({ value: e }) =>
        e?.toISOString().replace(/(T00:00:00)?\.000Z$/, "") ?? "",
    };
  Ju.floatTime = Yu;
  Ju.intTime = Gu;
  Ju.timestamp = Cn;
});
var Nn = g(function (uf) {
  var Zu = we(),
    ef = kt(),
    tf = Se(),
    sf = De(),
    nf = Ss(),
    En = vn(),
    qs = _n(),
    It = An(),
    rf = yt(),
    of = Os(),
    af = qt(),
    lf = Cs(),
    Ts = Ns(),
    cf = [
      Zu.map,
      tf.seq,
      sf.string,
      ef.nullTag,
      En.trueTag,
      En.falseTag,
      It.intBin,
      It.intOct,
      It.int,
      It.intHex,
      qs.floatNaN,
      qs.floatExp,
      qs.float,
      nf.binary,
      rf.merge,
      of.omap,
      af.pairs,
      lf.set,
      Ts.intTime,
      Ts.floatTime,
      Ts.timestamp,
    ];
  uf.schema = cf;
});
var Fn = g(function (wf) {
  var $n = we(),
    hf = kt(),
    xn = Se(),
    pf = De(),
    df = hs(),
    Ls = ds(),
    $s = gs(),
    mf = un(),
    gf = hn(),
    In = Ss(),
    Ve = yt(),
    Pn = Os(),
    Mn = qt(),
    qn = Nn(),
    Dn = Cs(),
    Pt = Ns(),
    Tn = new Map([
      ["core", mf.schema],
      ["failsafe", [$n.map, xn.seq, pf.string]],
      ["json", gf.schema],
      ["yaml11", qn.schema],
      ["yaml-1.1", qn.schema],
    ]),
    Ln = {
      binary: In.binary,
      bool: df.boolTag,
      float: Ls.float,
      floatExp: Ls.floatExp,
      floatNaN: Ls.floatNaN,
      floatTime: Pt.floatTime,
      int: $s.int,
      intHex: $s.intHex,
      intOct: $s.intOct,
      intTime: Pt.intTime,
      map: $n.map,
      merge: Ve.merge,
      null: hf.nullTag,
      omap: Pn.omap,
      pairs: Mn.pairs,
      seq: xn.seq,
      set: Dn.set,
      timestamp: Pt.timestamp,
    },
    yf = {
      "tag:yaml.org,2002:binary": In.binary,
      "tag:yaml.org,2002:merge": Ve.merge,
      "tag:yaml.org,2002:omap": Pn.omap,
      "tag:yaml.org,2002:pairs": Mn.pairs,
      "tag:yaml.org,2002:set": Dn.set,
      "tag:yaml.org,2002:timestamp": Pt.timestamp,
    };
  function bf(e, t, s) {
    let i = Tn.get(t);
    if (i && !e)
      return s && !i.includes(Ve.merge) ? i.concat(Ve.merge) : i.slice();
    let n = i;
    if (!n)
      if (Array.isArray(e)) n = [];
      else {
        let r = Array.from(Tn.keys())
          .filter((o) => o !== "yaml11")
          .map((o) => JSON.stringify(o))
          .join(", ");
        throw Error(
          `Unknown schema "${t}"; use one of ${r} or define customTags array`,
        );
      }
    if (Array.isArray(e)) for (let r of e) n = n.concat(r);
    else if (typeof e === "function") n = e(n.slice());
    if (s) n = n.concat(Ve.merge);
    return n.reduce((r, o) => {
      let a = typeof o === "string" ? Ln[o] : o;
      if (!a) {
        let c = JSON.stringify(o),
          l = Object.keys(Ln)
            .map((f) => JSON.stringify(f))
            .join(", ");
        throw Error(`Unknown custom tag ${c}; use one of ${l}`);
      }
      if (!r.includes(a)) r.push(a);
      return r;
    }, []);
  }
  wf.coreKnownTags = yf;
  wf.getTags = bf;
});
var Ps = g(function (Cf) {
  var xs = k(),
    _f = we(),
    Of = Se(),
    Af = De(),
    Mt = Fn(),
    kf = (e, t) => (e.key < t.key ? -1 : e.key > t.key ? 1 : 0);
  class Is {
    constructor({
      compat: e,
      customTags: t,
      merge: s,
      resolveKnownTags: i,
      schema: n,
      sortMapEntries: r,
      toStringDefaults: o,
    }) {
      (this.compat = Array.isArray(e)
        ? Mt.getTags(e, "compat")
        : e
          ? Mt.getTags(null, e)
          : null),
        (this.name = (typeof n === "string" && n) || "core"),
        (this.knownTags = i ? Mt.coreKnownTags : {}),
        (this.tags = Mt.getTags(t, this.name, s)),
        (this.toStringOptions = o ?? null),
        Object.defineProperty(this, xs.MAP, { value: _f.map }),
        Object.defineProperty(this, xs.SCALAR, { value: Af.string }),
        Object.defineProperty(this, xs.SEQ, { value: Of.seq }),
        (this.sortMapEntries =
          typeof r === "function" ? r : r === !0 ? kf : null);
    }
    clone() {
      let e = Object.create(
        Is.prototype,
        Object.getOwnPropertyDescriptors(this),
      );
      return ((e.tags = this.tags.slice()), e);
    }
  }
  Cf.Schema = Is;
});
var Bn = g(function (Tf) {
  var Nf = k(),
    Ms = Ie(),
    Ke = Le();
  function qf(e, t) {
    let s = [],
      i = t.directives === !0;
    if (t.directives !== !1 && e.directives) {
      let c = e.directives.toString(e);
      if (c) s.push(c), (i = !0);
      else if (e.directives.docStart) i = !0;
    }
    if (i) s.push("---");
    let n = Ms.createStringifyContext(e, t),
      { commentString: r } = n.options;
    if (e.commentBefore) {
      if (s.length !== 1) s.unshift("");
      let c = r(e.commentBefore);
      s.unshift(Ke.indentComment(c, ""));
    }
    let o = !1,
      a = null;
    if (e.contents) {
      if (Nf.isNode(e.contents)) {
        if (e.contents.spaceBefore && i) s.push("");
        if (e.contents.commentBefore) {
          let f = r(e.contents.commentBefore);
          s.push(Ke.indentComment(f, ""));
        }
        (n.forceBlockIndent = !!e.comment), (a = e.contents.comment);
      }
      let c = a ? void 0 : () => (o = !0),
        l = Ms.stringify(e.contents, n, () => (a = null), c);
      if (a) l += Ke.lineComment(l, "", r(a));
      if ((l[0] === "|" || l[0] === ">") && s[s.length - 1] === "---")
        s[s.length - 1] = `--- ${l}`;
      else s.push(l);
    } else s.push(Ms.stringify(e.contents, n));
    if (e.directives?.docEnd)
      if (e.comment) {
        let c = r(e.comment);
        if (
          c.includes(`
`)
        )
          s.push("..."), s.push(Ke.indentComment(c, ""));
        else s.push(`... ${c}`);
      } else s.push("...");
    else {
      let c = e.comment;
      if (c && o) c = c.replace(/^\n+/, "");
      if (c) {
        if ((!o || a) && s[s.length - 1] !== "") s.push("");
        s.push(Ke.indentComment(r(c), ""));
      }
    }
    return (
      s.join(`
`) +
      `
`
    );
  }
  Tf.stringifyDocument = qf;
});
var Re = g(function (Bf) {
  var $f = qe(),
    _e = ut(),
    D = k(),
    xf = X(),
    If = Y(),
    Pf = Ps(),
    Mf = Bn(),
    Ds = at(),
    Df = ss(),
    Ff = Te(),
    Fs = ts();
  class Bs {
    constructor(e, t, s) {
      (this.commentBefore = null),
        (this.comment = null),
        (this.errors = []),
        (this.warnings = []),
        Object.defineProperty(this, D.NODE_TYPE, { value: D.DOC });
      let i = null;
      if (typeof t === "function" || Array.isArray(t)) i = t;
      else if (s === void 0 && t) (s = t), (t = void 0);
      let n = Object.assign(
        {
          intAsBigInt: !1,
          keepSourceTokens: !1,
          logLevel: "warn",
          prettyErrors: !0,
          strict: !0,
          stringKeys: !1,
          uniqueKeys: !0,
          version: "1.2",
        },
        s,
      );
      this.options = n;
      let { version: r } = n;
      if (s?._directives) {
        if (
          ((this.directives = s._directives.atDocument()),
          this.directives.yaml.explicit)
        )
          r = this.directives.yaml.version;
      } else this.directives = new Fs.Directives({ version: r });
      this.setSchema(r, s),
        (this.contents = e === void 0 ? null : this.createNode(e, i, s));
    }
    clone() {
      let e = Object.create(Bs.prototype, { [D.NODE_TYPE]: { value: D.DOC } });
      if (
        ((e.commentBefore = this.commentBefore),
        (e.comment = this.comment),
        (e.errors = this.errors.slice()),
        (e.warnings = this.warnings.slice()),
        (e.options = Object.assign({}, this.options)),
        this.directives)
      )
        e.directives = this.directives.clone();
      if (
        ((e.schema = this.schema.clone()),
        (e.contents = D.isNode(this.contents)
          ? this.contents.clone(e.schema)
          : this.contents),
        this.range)
      )
        e.range = this.range.slice();
      return e;
    }
    add(e) {
      if (Oe(this.contents)) this.contents.add(e);
    }
    addIn(e, t) {
      if (Oe(this.contents)) this.contents.addIn(e, t);
    }
    createAlias(e, t) {
      if (!e.anchor) {
        let s = Ds.anchorNames(this);
        e.anchor = !t || s.has(t) ? Ds.findNewAnchor(t || "a", s) : t;
      }
      return new $f.Alias(e.anchor);
    }
    createNode(e, t, s) {
      let i = void 0;
      if (typeof t === "function") (e = t.call({ "": e }, "", e)), (i = t);
      else if (Array.isArray(t)) {
        let p = (w) =>
            typeof w === "number" || w instanceof String || w instanceof Number,
          m = t.filter(p).map(String);
        if (m.length > 0) t = t.concat(m);
        i = t;
      } else if (s === void 0 && t) (s = t), (t = void 0);
      let {
          aliasDuplicateObjects: n,
          anchorPrefix: r,
          flow: o,
          keepUndefined: a,
          onTagObj: c,
          tag: l,
        } = s ?? {},
        {
          onAnchor: f,
          setAnchors: u,
          sourceObjects: h,
        } = Ds.createNodeAnchors(this, r || "a"),
        d = {
          aliasDuplicateObjects: n ?? !0,
          keepUndefined: a ?? !1,
          onAnchor: f,
          onTagObj: c,
          replacer: i,
          schema: this.schema,
          sourceObjects: h,
        },
        y = Ff.createNode(e, l, d);
      if (o && D.isCollection(y)) y.flow = !0;
      return (u(), y);
    }
    createPair(e, t, s = {}) {
      let i = this.createNode(e, null, s),
        n = this.createNode(t, null, s);
      return new xf.Pair(i, n);
    }
    delete(e) {
      return Oe(this.contents) ? this.contents.delete(e) : !1;
    }
    deleteIn(e) {
      if (_e.isEmptyPath(e)) {
        if (this.contents == null) return !1;
        return ((this.contents = null), !0);
      }
      return Oe(this.contents) ? this.contents.deleteIn(e) : !1;
    }
    get(e, t) {
      return D.isCollection(this.contents) ? this.contents.get(e, t) : void 0;
    }
    getIn(e, t) {
      if (_e.isEmptyPath(e))
        return !t && D.isScalar(this.contents)
          ? this.contents.value
          : this.contents;
      return D.isCollection(this.contents) ? this.contents.getIn(e, t) : void 0;
    }
    has(e) {
      return D.isCollection(this.contents) ? this.contents.has(e) : !1;
    }
    hasIn(e) {
      if (_e.isEmptyPath(e)) return this.contents !== void 0;
      return D.isCollection(this.contents) ? this.contents.hasIn(e) : !1;
    }
    set(e, t) {
      if (this.contents == null)
        this.contents = _e.collectionFromPath(this.schema, [e], t);
      else if (Oe(this.contents)) this.contents.set(e, t);
    }
    setIn(e, t) {
      if (_e.isEmptyPath(e)) this.contents = t;
      else if (this.contents == null)
        this.contents = _e.collectionFromPath(this.schema, Array.from(e), t);
      else if (Oe(this.contents)) this.contents.setIn(e, t);
    }
    setSchema(e, t = {}) {
      if (typeof e === "number") e = String(e);
      let s;
      switch (e) {
        case "1.1":
          if (this.directives) this.directives.yaml.version = "1.1";
          else this.directives = new Fs.Directives({ version: "1.1" });
          s = { resolveKnownTags: !1, schema: "yaml-1.1" };
          break;
        case "1.2":
        case "next":
          if (this.directives) this.directives.yaml.version = e;
          else this.directives = new Fs.Directives({ version: e });
          s = { resolveKnownTags: !0, schema: "core" };
          break;
        case null:
          if (this.directives) delete this.directives;
          s = null;
          break;
        default: {
          let i = JSON.stringify(e);
          throw Error(
            `Expected '1.1', '1.2' or null as first argument, but found: ${i}`,
          );
        }
      }
      if (t.schema instanceof Object) this.schema = t.schema;
      else if (s) this.schema = new Pf.Schema(Object.assign(s, t));
      else
        throw Error(
          "With a null YAML version, the { schema: Schema } option is required",
        );
    }
    toJS({
      json: e,
      jsonArg: t,
      mapAsMap: s,
      maxAliasCount: i,
      onAnchor: n,
      reviver: r,
    } = {}) {
      let o = {
          anchors: new Map(),
          doc: this,
          keep: !e,
          mapAsMap: s === !0,
          mapKeyWarned: !1,
          maxAliasCount: typeof i === "number" ? i : 100,
        },
        a = If.toJS(this.contents, t ?? "", o);
      if (typeof n === "function")
        for (let { count: c, res: l } of o.anchors.values()) n(l, c);
      return typeof r === "function" ? Df.applyReviver(r, { "": a }, "", a) : a;
    }
    toJSON(e, t) {
      return this.toJS({ json: !0, jsonArg: e, mapAsMap: !1, onAnchor: t });
    }
    toString(e = {}) {
      if (this.errors.length > 0)
        throw Error("Document with errors cannot be stringified");
      if (
        "indent" in e &&
        (!Number.isInteger(e.indent) || Number(e.indent) <= 0)
      ) {
        let t = JSON.stringify(e.indent);
        throw Error(`"indent" option must be a positive integer, not ${t}`);
      }
      return Mf.stringifyDocument(this, e);
    }
  }
  function Oe(e) {
    if (D.isCollection(e)) return !0;
    throw Error("Expected a YAML collection as document contents");
  }
  Bf.Document = Bs;
});
var He = g(function (Kf) {
  class Dt extends Error {
    constructor(e, t, s, i) {
      super();
      (this.name = e), (this.code = s), (this.message = i), (this.pos = t);
    }
  }
  class jn extends Dt {
    constructor(e, t, s) {
      super("YAMLParseError", e, t, s);
    }
  }
  class Vn extends Dt {
    constructor(e, t, s) {
      super("YAMLWarning", e, t, s);
    }
  }
  var Vf = (e, t) => (s) => {
    if (s.pos[0] === -1) return;
    s.linePos = s.pos.map((a) => t.linePos(a));
    let { line: i, col: n } = s.linePos[0];
    s.message += ` at line ${i}, column ${n}`;
    let r = n - 1,
      o = e
        .substring(t.lineStarts[i - 1], t.lineStarts[i])
        .replace(/[\n\r]+$/, "");
    if (r >= 60 && o.length > 80) {
      let a = Math.min(r - 39, o.length - 79);
      (o = "…" + o.substring(a)), (r -= a - 1);
    }
    if (o.length > 80) o = o.substring(0, 79) + "…";
    if (i > 1 && /^ *$/.test(o.substring(0, r))) {
      let a = e.substring(t.lineStarts[i - 2], t.lineStarts[i - 1]);
      if (a.length > 80)
        a =
          a.substring(0, 79) +
          `…
`;
      o = a + o;
    }
    if (/[^ ]/.test(o)) {
      let a = 1,
        c = s.linePos[1];
      if (c?.line === i && c.col > n)
        a = Math.max(1, Math.min(c.col - n, 80 - r));
      let l = " ".repeat(r) + "^".repeat(a);
      s.message += `:

${o}
${l}
`;
    }
  };
  Kf.YAMLError = Dt;
  Kf.YAMLParseError = jn;
  Kf.YAMLWarning = Vn;
  Kf.prettifyError = Vf;
});
var Ue = g(function (Yf) {
  function Gf(
    e,
    {
      flow: t,
      indicator: s,
      next: i,
      offset: n,
      onError: r,
      parentIndent: o,
      startOnNewline: a,
    },
  ) {
    let c = !1,
      l = a,
      f = a,
      u = "",
      h = "",
      d = !1,
      y = !1,
      p = null,
      m = null,
      w = null,
      S = null,
      v = null,
      _ = null,
      O = null;
    for (let b of e) {
      if (y) {
        if (b.type !== "space" && b.type !== "newline" && b.type !== "comma")
          r(
            b.offset,
            "MISSING_CHAR",
            "Tags and anchors must be separated from the next token by white space",
          );
        y = !1;
      }
      if (p) {
        if (l && b.type !== "comment" && b.type !== "newline")
          r(p, "TAB_AS_INDENT", "Tabs are not allowed as indentation");
        p = null;
      }
      switch (b.type) {
        case "space":
          if (
            !t &&
            (s !== "doc-start" || i?.type !== "flow-collection") &&
            b.source.includes("\t")
          )
            p = b;
          f = !0;
          break;
        case "comment": {
          if (!f)
            r(
              b,
              "MISSING_CHAR",
              "Comments must be separated from other tokens by white space characters",
            );
          let q = b.source.substring(1) || " ";
          if (!u) u = q;
          else u += h + q;
          (h = ""), (l = !1);
          break;
        }
        case "newline":
          if (l) {
            if (u) u += b.source;
            else if (!_ || s !== "seq-item-ind") c = !0;
          } else h += b.source;
          if (((l = !0), (d = !0), m || w)) S = b;
          f = !0;
          break;
        case "anchor":
          if (m) r(b, "MULTIPLE_ANCHORS", "A node can have at most one anchor");
          if (b.source.endsWith(":"))
            r(
              b.offset + b.source.length - 1,
              "BAD_ALIAS",
              "Anchor ending in : is ambiguous",
              !0,
            );
          (m = b), O ?? (O = b.offset), (l = !1), (f = !1), (y = !0);
          break;
        case "tag": {
          if (w) r(b, "MULTIPLE_TAGS", "A node can have at most one tag");
          (w = b), O ?? (O = b.offset), (l = !1), (f = !1), (y = !0);
          break;
        }
        case s:
          if (m || w)
            r(
              b,
              "BAD_PROP_ORDER",
              `Anchors and tags must be after the ${b.source} indicator`,
            );
          if (_)
            r(
              b,
              "UNEXPECTED_TOKEN",
              `Unexpected ${b.source} in ${t ?? "collection"}`,
            );
          (_ = b),
            (l = s === "seq-item-ind" || s === "explicit-key-ind"),
            (f = !1);
          break;
        case "comma":
          if (t) {
            if (v) r(b, "UNEXPECTED_TOKEN", `Unexpected , in ${t}`);
            (v = b), (l = !1), (f = !1);
            break;
          }
        default:
          r(b, "UNEXPECTED_TOKEN", `Unexpected ${b.type} token`),
            (l = !1),
            (f = !1);
      }
    }
    let A = e[e.length - 1],
      E = A ? A.offset + A.source.length : n;
    if (
      y &&
      i &&
      i.type !== "space" &&
      i.type !== "newline" &&
      i.type !== "comma" &&
      (i.type !== "scalar" || i.source !== "")
    )
      r(
        i.offset,
        "MISSING_CHAR",
        "Tags and anchors must be separated from the next token by white space",
      );
    if (
      p &&
      ((l && p.indent <= o) ||
        i?.type === "block-map" ||
        i?.type === "block-seq")
    )
      r(p, "TAB_AS_INDENT", "Tabs are not allowed as indentation");
    return {
      comma: v,
      found: _,
      spaceBefore: c,
      comment: u,
      hasNewline: d,
      anchor: m,
      tag: w,
      newlineAfterProp: S,
      end: E,
      start: O ?? E,
    };
  }
  Yf.resolveProps = Gf;
});
var Ft = g(function (Qf) {
  function js(e) {
    if (!e) return null;
    switch (e.type) {
      case "alias":
      case "scalar":
      case "double-quoted-scalar":
      case "single-quoted-scalar":
        if (
          e.source.includes(`
`)
        )
          return !0;
        if (e.end) {
          for (let t of e.end) if (t.type === "newline") return !0;
        }
        return !1;
      case "flow-collection":
        for (let t of e.items) {
          for (let s of t.start) if (s.type === "newline") return !0;
          if (t.sep) {
            for (let s of t.sep) if (s.type === "newline") return !0;
          }
          if (js(t.key) || js(t.value)) return !0;
        }
        return !1;
      default:
        return !0;
    }
  }
  Qf.containsNewline = js;
});
var Vs = g(function (eh) {
  var zf = Ft();
  function Zf(e, t, s) {
    if (t?.type === "flow-collection") {
      let i = t.end[0];
      if (
        i.indent === e &&
        (i.source === "]" || i.source === "}") &&
        zf.containsNewline(t)
      )
        s(
          i,
          "BAD_INDENT",
          "Flow end indicator should be more indented than parent",
          !0,
        );
    }
  }
  eh.flowIndentCheck = Zf;
});
var Ks = g(function (ih) {
  var Kn = k();
  function sh(e, t, s) {
    let { uniqueKeys: i } = e.options;
    if (i === !1) return !1;
    let n =
      typeof i === "function"
        ? i
        : (r, o) =>
            r === o ||
            (Kn.isScalar(r) && Kn.isScalar(o) && r.value === o.value);
    return t.some((r) => n(r.key, s));
  }
  ih.mapIncludes = sh;
});
var Gn = g(function (ch) {
  var Rn = X(),
    rh = Z(),
    Hn = Ue(),
    oh = Ft(),
    Un = Vs(),
    ah = Ks(),
    Wn = "All mapping items must start at the same column";
  function lh({ composeNode: e, composeEmptyNode: t }, s, i, n, r) {
    let a = new (r?.nodeClass ?? rh.YAMLMap)(s.schema);
    if (s.atRoot) s.atRoot = !1;
    let c = i.offset,
      l = null;
    for (let f of i.items) {
      let { start: u, key: h, sep: d, value: y } = f,
        p = Hn.resolveProps(u, {
          indicator: "explicit-key-ind",
          next: h ?? d?.[0],
          offset: c,
          onError: n,
          parentIndent: i.indent,
          startOnNewline: !0,
        }),
        m = !p.found;
      if (m) {
        if (h) {
          if (h.type === "block-seq")
            n(
              c,
              "BLOCK_AS_IMPLICIT_KEY",
              "A block sequence may not be used as an implicit map key",
            );
          else if ("indent" in h && h.indent !== i.indent)
            n(c, "BAD_INDENT", Wn);
        }
        if (!p.anchor && !p.tag && !d) {
          if (((l = p.end), p.comment))
            if (a.comment)
              a.comment +=
                `
` + p.comment;
            else a.comment = p.comment;
          continue;
        }
        if (p.newlineAfterProp || oh.containsNewline(h))
          n(
            h ?? u[u.length - 1],
            "MULTILINE_IMPLICIT_KEY",
            "Implicit keys need to be on a single line",
          );
      } else if (p.found?.indent !== i.indent) n(c, "BAD_INDENT", Wn);
      s.atKey = !0;
      let w = p.end,
        S = h ? e(s, h, p, n) : t(s, w, u, null, p, n);
      if (s.schema.compat) Un.flowIndentCheck(i.indent, h, n);
      if (((s.atKey = !1), ah.mapIncludes(s, a.items, S)))
        n(w, "DUPLICATE_KEY", "Map keys must be unique");
      let v = Hn.resolveProps(d ?? [], {
        indicator: "map-value-ind",
        next: y,
        offset: S.range[2],
        onError: n,
        parentIndent: i.indent,
        startOnNewline: !h || h.type === "block-scalar",
      });
      if (((c = v.end), v.found)) {
        if (m) {
          if (y?.type === "block-map" && !v.hasNewline)
            n(
              c,
              "BLOCK_AS_IMPLICIT_KEY",
              "Nested mappings are not allowed in compact mappings",
            );
          if (s.options.strict && p.start < v.found.offset - 1024)
            n(
              S.range,
              "KEY_OVER_1024_CHARS",
              "The : indicator must be at most 1024 chars after the start of an implicit block mapping key",
            );
        }
        let _ = y ? e(s, y, v, n) : t(s, c, d, null, v, n);
        if (s.schema.compat) Un.flowIndentCheck(i.indent, y, n);
        c = _.range[2];
        let O = new Rn.Pair(S, _);
        if (s.options.keepSourceTokens) O.srcToken = f;
        a.items.push(O);
      } else {
        if (m)
          n(
            S.range,
            "MISSING_CHAR",
            "Implicit map keys need to be followed by map values",
          );
        if (v.comment)
          if (S.comment)
            S.comment +=
              `
` + v.comment;
          else S.comment = v.comment;
        let _ = new Rn.Pair(S);
        if (s.options.keepSourceTokens) _.srcToken = f;
        a.items.push(_);
      }
    }
    if (l && l < c) n(l, "IMPOSSIBLE", "Map comment with trailing content");
    return ((a.range = [i.offset, c, l ?? c]), a);
  }
  ch.resolveBlockMap = lh;
});
var Yn = g(function (mh) {
  var fh = ee(),
    hh = Ue(),
    ph = Vs();
  function dh({ composeNode: e, composeEmptyNode: t }, s, i, n, r) {
    let a = new (r?.nodeClass ?? fh.YAMLSeq)(s.schema);
    if (s.atRoot) s.atRoot = !1;
    if (s.atKey) s.atKey = !1;
    let c = i.offset,
      l = null;
    for (let { start: f, value: u } of i.items) {
      let h = hh.resolveProps(f, {
        indicator: "seq-item-ind",
        next: u,
        offset: c,
        onError: n,
        parentIndent: i.indent,
        startOnNewline: !0,
      });
      if (!h.found)
        if (h.anchor || h.tag || u)
          if (u?.type === "block-seq")
            n(
              h.end,
              "BAD_INDENT",
              "All sequence items must start at the same column",
            );
          else n(c, "MISSING_CHAR", "Sequence item without - indicator");
        else {
          if (((l = h.end), h.comment)) a.comment = h.comment;
          continue;
        }
      let d = u ? e(s, u, h, n) : t(s, h.end, f, null, h, n);
      if (s.schema.compat) ph.flowIndentCheck(i.indent, u, n);
      (c = d.range[2]), a.items.push(d);
    }
    return ((a.range = [i.offset, c, l ?? c]), a);
  }
  mh.resolveBlockSeq = dh;
});
var Ae = g(function (bh) {
  function yh(e, t, s, i) {
    let n = "";
    if (e) {
      let r = !1,
        o = "";
      for (let a of e) {
        let { source: c, type: l } = a;
        switch (l) {
          case "space":
            r = !0;
            break;
          case "comment": {
            if (s && !r)
              i(
                a,
                "MISSING_CHAR",
                "Comments must be separated from other tokens by white space characters",
              );
            let f = c.substring(1) || " ";
            if (!n) n = f;
            else n += o + f;
            o = "";
            break;
          }
          case "newline":
            if (n) o += c;
            r = !0;
            break;
          default:
            i(a, "UNEXPECTED_TOKEN", `Unexpected ${l} at node end`);
        }
        t += c.length;
      }
    }
    return { comment: n, offset: t };
  }
  bh.resolveEnd = yh;
});
var Xn = g(function (Eh) {
  var Sh = k(),
    vh = X(),
    Jn = Z(),
    _h = ee(),
    Oh = Ae(),
    Qn = Ue(),
    Ah = Ft(),
    kh = Ks(),
    Rs = "Block collections are not allowed within flow collections",
    Hs = (e) => e && (e.type === "block-map" || e.type === "block-seq");
  function Ch({ composeNode: e, composeEmptyNode: t }, s, i, n, r) {
    let o = i.start.source === "{",
      a = o ? "flow map" : "flow sequence",
      l = new (r?.nodeClass ?? (o ? Jn.YAMLMap : _h.YAMLSeq))(s.schema);
    l.flow = !0;
    let f = s.atRoot;
    if (f) s.atRoot = !1;
    if (s.atKey) s.atKey = !1;
    let u = i.offset + i.start.source.length;
    for (let m = 0; m < i.items.length; ++m) {
      let w = i.items[m],
        { start: S, key: v, sep: _, value: O } = w,
        A = Qn.resolveProps(S, {
          flow: a,
          indicator: "explicit-key-ind",
          next: v ?? _?.[0],
          offset: u,
          onError: n,
          parentIndent: i.indent,
          startOnNewline: !1,
        });
      if (!A.found) {
        if (!A.anchor && !A.tag && !_ && !O) {
          if (m === 0 && A.comma)
            n(A.comma, "UNEXPECTED_TOKEN", `Unexpected , in ${a}`);
          else if (m < i.items.length - 1)
            n(A.start, "UNEXPECTED_TOKEN", `Unexpected empty item in ${a}`);
          if (A.comment)
            if (l.comment)
              l.comment +=
                `
` + A.comment;
            else l.comment = A.comment;
          u = A.end;
          continue;
        }
        if (!o && s.options.strict && Ah.containsNewline(v))
          n(
            v,
            "MULTILINE_IMPLICIT_KEY",
            "Implicit keys of flow sequence pairs need to be on a single line",
          );
      }
      if (m === 0) {
        if (A.comma) n(A.comma, "UNEXPECTED_TOKEN", `Unexpected , in ${a}`);
      } else {
        if (!A.comma)
          n(A.start, "MISSING_CHAR", `Missing , between ${a} items`);
        if (A.comment) {
          let E = "";
          e: for (let b of S)
            switch (b.type) {
              case "comma":
              case "space":
                break;
              case "comment":
                E = b.source.substring(1);
                break e;
              default:
                break e;
            }
          if (E) {
            let b = l.items[l.items.length - 1];
            if (Sh.isPair(b)) b = b.value ?? b.key;
            if (b.comment)
              b.comment +=
                `
` + E;
            else b.comment = E;
            A.comment = A.comment.substring(E.length + 1);
          }
        }
      }
      if (!o && !_ && !A.found) {
        let E = O ? e(s, O, A, n) : t(s, A.end, _, null, A, n);
        if ((l.items.push(E), (u = E.range[2]), Hs(O)))
          n(E.range, "BLOCK_IN_FLOW", Rs);
      } else {
        s.atKey = !0;
        let E = A.end,
          b = v ? e(s, v, A, n) : t(s, E, S, null, A, n);
        if (Hs(v)) n(b.range, "BLOCK_IN_FLOW", Rs);
        s.atKey = !1;
        let q = Qn.resolveProps(_ ?? [], {
          flow: a,
          indicator: "map-value-ind",
          next: O,
          offset: b.range[2],
          onError: n,
          parentIndent: i.indent,
          startOnNewline: !1,
        });
        if (q.found) {
          if (!o && !A.found && s.options.strict) {
            if (_)
              for (let T of _) {
                if (T === q.found) break;
                if (T.type === "newline") {
                  n(
                    T,
                    "MULTILINE_IMPLICIT_KEY",
                    "Implicit keys of flow sequence pairs need to be on a single line",
                  );
                  break;
                }
              }
            if (A.start < q.found.offset - 1024)
              n(
                q.found,
                "KEY_OVER_1024_CHARS",
                "The : indicator must be at most 1024 chars after the start of an implicit flow sequence key",
              );
          }
        } else if (O)
          if ("source" in O && O.source?.[0] === ":")
            n(O, "MISSING_CHAR", `Missing space after : in ${a}`);
          else n(q.start, "MISSING_CHAR", `Missing , or : between ${a} items`);
        let G = O ? e(s, O, q, n) : q.found ? t(s, q.end, _, null, q, n) : null;
        if (G) {
          if (Hs(O)) n(G.range, "BLOCK_IN_FLOW", Rs);
        } else if (q.comment)
          if (b.comment)
            b.comment +=
              `
` + q.comment;
          else b.comment = q.comment;
        let he = new vh.Pair(b, G);
        if (s.options.keepSourceTokens) he.srcToken = w;
        if (o) {
          let T = l;
          if (kh.mapIncludes(s, T.items, b))
            n(E, "DUPLICATE_KEY", "Map keys must be unique");
          T.items.push(he);
        } else {
          let T = new Jn.YAMLMap(s.schema);
          (T.flow = !0), T.items.push(he);
          let bi = (G ?? b).range;
          (T.range = [b.range[0], bi[1], bi[2]]), l.items.push(T);
        }
        u = G ? G.range[2] : q.end;
      }
    }
    let h = o ? "}" : "]",
      [d, ...y] = i.end,
      p = u;
    if (d?.source === h) p = d.offset + d.source.length;
    else {
      let m = a[0].toUpperCase() + a.substring(1),
        w = f
          ? `${m} must end with a ${h}`
          : `${m} in block collection must be sufficiently indented and end with a ${h}`;
      if (
        (n(u, f ? "MISSING_CHAR" : "BAD_INDENT", w), d && d.source.length !== 1)
      )
        y.unshift(d);
    }
    if (y.length > 0) {
      let m = Oh.resolveEnd(y, p, s.options.strict, n);
      if (m.comment)
        if (l.comment)
          l.comment +=
            `
` + m.comment;
        else l.comment = m.comment;
      l.range = [i.offset, p, m.offset];
    } else l.range = [i.offset, p, p];
    return l;
  }
  Eh.resolveFlowCollection = Ch;
});
var zn = g(function (Dh) {
  var qh = k(),
    Th = N(),
    Lh = Z(),
    $h = ee(),
    xh = Gn(),
    Ih = Yn(),
    Ph = Xn();
  function Us(e, t, s, i, n, r) {
    let o =
        s.type === "block-map"
          ? xh.resolveBlockMap(e, t, s, i, r)
          : s.type === "block-seq"
            ? Ih.resolveBlockSeq(e, t, s, i, r)
            : Ph.resolveFlowCollection(e, t, s, i, r),
      a = o.constructor;
    if (n === "!" || n === a.tagName) return ((o.tag = a.tagName), o);
    if (n) o.tag = n;
    return o;
  }
  function Mh(e, t, s, i, n) {
    let r = i.tag,
      o = !r
        ? null
        : t.directives.tagName(r.source, (h) => n(r, "TAG_RESOLVE_FAILED", h));
    if (s.type === "block-seq") {
      let { anchor: h, newlineAfterProp: d } = i,
        y = h && r ? (h.offset > r.offset ? h : r) : (h ?? r);
      if (y && (!d || d.offset < y.offset))
        n(y, "MISSING_CHAR", "Missing newline after block sequence props");
    }
    let a =
      s.type === "block-map"
        ? "map"
        : s.type === "block-seq"
          ? "seq"
          : s.start.source === "{"
            ? "map"
            : "seq";
    if (
      !r ||
      !o ||
      o === "!" ||
      (o === Lh.YAMLMap.tagName && a === "map") ||
      (o === $h.YAMLSeq.tagName && a === "seq")
    )
      return Us(e, t, s, n, o);
    let c = t.schema.tags.find((h) => h.tag === o && h.collection === a);
    if (!c) {
      let h = t.schema.knownTags[o];
      if (h?.collection === a)
        t.schema.tags.push(Object.assign({}, h, { default: !1 })), (c = h);
      else {
        if (h)
          n(
            r,
            "BAD_COLLECTION_TYPE",
            `${h.tag} used for ${a} collection, but expects ${h.collection ?? "scalar"}`,
            !0,
          );
        else n(r, "TAG_RESOLVE_FAILED", `Unresolved tag: ${o}`, !0);
        return Us(e, t, s, n, o);
      }
    }
    let l = Us(e, t, s, n, o, c),
      f = c.resolve?.(l, (h) => n(r, "TAG_RESOLVE_FAILED", h), t.options) ?? l,
      u = qh.isNode(f) ? f : new Th.Scalar(f);
    if (((u.range = l.range), (u.tag = o), c?.format)) u.format = c.format;
    return u;
  }
  Dh.composeCollection = Mh;
});
var Gs = g(function (Kh) {
  var Ws = N();
  function Bh(e, t, s) {
    let i = t.offset,
      n = jh(t, e.options.strict, s);
    if (!n) return { value: "", type: null, comment: "", range: [i, i, i] };
    let r = n.mode === ">" ? Ws.Scalar.BLOCK_FOLDED : Ws.Scalar.BLOCK_LITERAL,
      o = t.source ? Vh(t.source) : [],
      a = o.length;
    for (let p = o.length - 1; p >= 0; --p) {
      let m = o[p][1];
      if (m === "" || m === "\r") a = p;
      else break;
    }
    if (a === 0) {
      let p =
          n.chomp === "+" && o.length > 0
            ? `
`.repeat(Math.max(1, o.length - 1))
            : "",
        m = i + n.length;
      if (t.source) m += t.source.length;
      return { value: p, type: r, comment: n.comment, range: [i, m, m] };
    }
    let c = t.indent + n.indent,
      l = t.offset + n.length,
      f = 0;
    for (let p = 0; p < a; ++p) {
      let [m, w] = o[p];
      if (w === "" || w === "\r") {
        if (n.indent === 0 && m.length > c) c = m.length;
      } else {
        if (m.length < c)
          s(
            l + m.length,
            "MISSING_CHAR",
            "Block scalars with more-indented leading empty lines must use an explicit indentation indicator",
          );
        if (n.indent === 0) c = m.length;
        if (((f = p), c === 0 && !e.atRoot))
          s(
            l,
            "BAD_INDENT",
            "Block scalar values in collections must be indented",
          );
        break;
      }
      l += m.length + w.length + 1;
    }
    for (let p = o.length - 1; p >= a; --p) if (o[p][0].length > c) a = p + 1;
    let u = "",
      h = "",
      d = !1;
    for (let p = 0; p < f; ++p)
      u +=
        o[p][0].slice(c) +
        `
`;
    for (let p = f; p < a; ++p) {
      let [m, w] = o[p];
      l += m.length + w.length + 1;
      let S = w[w.length - 1] === "\r";
      if (S) w = w.slice(0, -1);
      if (w && m.length < c) {
        let _ = `Block scalar lines must not be less indented than their ${n.indent ? "explicit indentation indicator" : "first line"}`;
        s(l - w.length - (S ? 2 : 1), "BAD_INDENT", _), (m = "");
      }
      if (r === Ws.Scalar.BLOCK_LITERAL)
        (u += h + m.slice(c) + w),
          (h = `
`);
      else if (m.length > c || w[0] === "\t") {
        if (h === " ")
          h = `
`;
        else if (
          !d &&
          h ===
            `
`
        )
          h = `

`;
        (u += h + m.slice(c) + w),
          (h = `
`),
          (d = !0);
      } else if (w === "")
        if (
          h ===
          `
`
        )
          u += `
`;
        else
          h = `
`;
      else (u += h + w), (h = " "), (d = !1);
    }
    switch (n.chomp) {
      case "-":
        break;
      case "+":
        for (let p = a; p < o.length; ++p)
          u +=
            `
` + o[p][0].slice(c);
        if (
          u[u.length - 1] !==
          `
`
        )
          u += `
`;
        break;
      default:
        u += `
`;
    }
    let y = i + n.length + t.source.length;
    return { value: u, type: r, comment: n.comment, range: [i, y, y] };
  }
  function jh({ offset: e, props: t }, s, i) {
    if (t[0].type !== "block-scalar-header")
      return (i(t[0], "IMPOSSIBLE", "Block scalar header not found"), null);
    let { source: n } = t[0],
      r = n[0],
      o = 0,
      a = "",
      c = -1;
    for (let h = 1; h < n.length; ++h) {
      let d = n[h];
      if (!a && (d === "-" || d === "+")) a = d;
      else {
        let y = Number(d);
        if (!o && y) o = y;
        else if (c === -1) c = e + h;
      }
    }
    if (c !== -1)
      i(
        c,
        "UNEXPECTED_TOKEN",
        `Block scalar header includes extra characters: ${n}`,
      );
    let l = !1,
      f = "",
      u = n.length;
    for (let h = 1; h < t.length; ++h) {
      let d = t[h];
      switch (d.type) {
        case "space":
          l = !0;
        case "newline":
          u += d.source.length;
          break;
        case "comment":
          if (s && !l)
            i(
              d,
              "MISSING_CHAR",
              "Comments must be separated from other tokens by white space characters",
            );
          (u += d.source.length), (f = d.source.substring(1));
          break;
        case "error":
          i(d, "UNEXPECTED_TOKEN", d.message), (u += d.source.length);
          break;
        default: {
          let y = `Unexpected token in block scalar header: ${d.type}`;
          i(d, "UNEXPECTED_TOKEN", y);
          let p = d.source;
          if (p && typeof p === "string") u += p.length;
        }
      }
    }
    return { mode: r, indent: o, chomp: a, comment: f, length: u };
  }
  function Vh(e) {
    let t = e.split(/\n( *)/),
      s = t[0],
      i = s.match(/^( *)/),
      r = [i?.[1] ? [i[1], s.slice(i[1].length)] : ["", s]];
    for (let o = 1; o < t.length; o += 2) r.push([t[o], t[o + 1]]);
    return r;
  }
  Kh.resolveBlockScalar = Bh;
});
var Js = g(function (zh) {
  var Ys = N(),
    Hh = Ae();
  function Uh(e, t, s) {
    let { offset: i, type: n, source: r, end: o } = e,
      a,
      c,
      l = (h, d, y) => s(i + h, d, y);
    switch (n) {
      case "scalar":
        (a = Ys.Scalar.PLAIN), (c = Wh(r, l));
        break;
      case "single-quoted-scalar":
        (a = Ys.Scalar.QUOTE_SINGLE), (c = Gh(r, l));
        break;
      case "double-quoted-scalar":
        (a = Ys.Scalar.QUOTE_DOUBLE), (c = Yh(r, l));
        break;
      default:
        return (
          s(
            e,
            "UNEXPECTED_TOKEN",
            `Expected a flow scalar value, but found: ${n}`,
          ),
          {
            value: "",
            type: null,
            comment: "",
            range: [i, i + r.length, i + r.length],
          }
        );
    }
    let f = i + r.length,
      u = Hh.resolveEnd(o, f, t, s);
    return { value: c, type: a, comment: u.comment, range: [i, f, u.offset] };
  }
  function Wh(e, t) {
    let s = "";
    switch (e[0]) {
      case "\t":
        s = "a tab character";
        break;
      case ",":
        s = "flow indicator character ,";
        break;
      case "%":
        s = "directive indicator character %";
        break;
      case "|":
      case ">": {
        s = `block scalar indicator ${e[0]}`;
        break;
      }
      case "@":
      case "`": {
        s = `reserved character ${e[0]}`;
        break;
      }
    }
    if (s) t(0, "BAD_SCALAR_START", `Plain value cannot start with ${s}`);
    return Zn(e);
  }
  function Gh(e, t) {
    if (e[e.length - 1] !== "'" || e.length === 1)
      t(e.length, "MISSING_CHAR", "Missing closing 'quote");
    return Zn(e.slice(1, -1)).replace(/''/g, "'");
  }
  function Zn(e) {
    let t = /(.*?)\r?\n/sy,
      s = t.exec(e);
    if (!s) return e;
    let i, n;
    try {
      (i = new RegExp("(?<![ \t])[ \t]+$")),
        (n = new RegExp("^[ \t]+|(?<![ \t])[ \t]+$", "g"));
    } catch {
      (i = /[ \t]+$/), (n = /^[ \t]+|[ \t]+$/g);
    }
    let r = s[1].replace(i, ""),
      o = " ",
      a = t.lastIndex;
    while ((s = t.exec(e))) {
      let l = s[1].replace(n, "");
      if (l === "")
        if (
          o ===
          `
`
        )
          r += o;
        else
          o = `
`;
      else (r += o + l), (o = " ");
      a = t.lastIndex;
    }
    let c = /[ \t]*(.*)/sy;
    return ((c.lastIndex = a), (s = c.exec(e)), r + o + (s?.[1] ?? ""));
  }
  function Yh(e, t) {
    let s = "";
    for (let i = 1; i < e.length - 1; ++i) {
      let n = e[i];
      if (
        n === "\r" &&
        e[i + 1] ===
          `
`
      )
        continue;
      if (
        n ===
        `
`
      ) {
        let { fold: r, offset: o } = Jh(e, i);
        (s += r), (i = o);
      } else if (n === "\\") {
        let r = e[++i],
          o = Qh[r];
        if (o) s += o;
        else if (
          r ===
          `
`
        ) {
          r = e[i + 1];
          while (r === " " || r === "\t") r = e[++i + 1];
        } else if (
          r === "\r" &&
          e[i + 1] ===
            `
`
        ) {
          r = e[++i + 1];
          while (r === " " || r === "\t") r = e[++i + 1];
        } else if (r === "x" || r === "u" || r === "U") {
          let a = r === "x" ? 2 : r === "u" ? 4 : 8;
          (s += Xh(e, i + 1, a, t)), (i += a);
        } else {
          let a = e.substr(i - 1, 2);
          t(i - 1, "BAD_DQ_ESCAPE", `Invalid escape sequence ${a}`), (s += a);
        }
      } else if (n === " " || n === "\t") {
        let r = i,
          o = e[i + 1];
        while (o === " " || o === "\t") o = e[++i + 1];
        if (
          o !==
            `
` &&
          !(
            o === "\r" &&
            e[i + 2] ===
              `
`
          )
        )
          s += i > r ? e.slice(r, i + 1) : n;
      } else s += n;
    }
    if (e[e.length - 1] !== '"' || e.length === 1)
      t(e.length, "MISSING_CHAR", 'Missing closing "quote');
    return s;
  }
  function Jh(e, t) {
    let s = "",
      i = e[t + 1];
    while (
      i === " " ||
      i === "\t" ||
      i ===
        `
` ||
      i === "\r"
    ) {
      if (
        i === "\r" &&
        e[t + 2] !==
          `
`
      )
        break;
      if (
        i ===
        `
`
      )
        s += `
`;
      (t += 1), (i = e[t + 1]);
    }
    if (!s) s = " ";
    return { fold: s, offset: t };
  }
  var Qh = {
    0: "\x00",
    a: "\x07",
    b: "\b",
    e: "\x1B",
    f: "\f",
    n: `
`,
    r: "\r",
    t: "\t",
    v: "\v",
    N: "",
    _: " ",
    L: "\u2028",
    P: "\u2029",
    " ": " ",
    '"': '"',
    "/": "/",
    "\\": "\\",
    "\t": "\t",
  };
  function Xh(e, t, s, i) {
    let n = e.substr(t, s),
      o = n.length === s && /^[0-9a-fA-F]+$/.test(n) ? parseInt(n, 16) : NaN;
    try {
      return String.fromCodePoint(o);
    } catch {
      let a = e.substr(t - 2, s + 2);
      return (i(t - 2, "BAD_DQ_ESCAPE", `Invalid escape sequence ${a}`), a);
    }
  }
  zh.resolveFlowScalar = Uh;
});
var tr = g(function (rp) {
  var ce = k(),
    er = N(),
    ep = Gs(),
    tp = Js();
  function sp(e, t, s, i) {
    let {
        value: n,
        type: r,
        comment: o,
        range: a,
      } = t.type === "block-scalar"
        ? ep.resolveBlockScalar(e, t, i)
        : tp.resolveFlowScalar(t, e.options.strict, i),
      c = s
        ? e.directives.tagName(s.source, (u) => i(s, "TAG_RESOLVE_FAILED", u))
        : null,
      l;
    if (e.options.stringKeys && e.atKey) l = e.schema[ce.SCALAR];
    else if (c) l = ip(e.schema, n, c, s, i);
    else if (t.type === "scalar") l = np(e, n, t, i);
    else l = e.schema[ce.SCALAR];
    let f;
    try {
      let u = l.resolve(
        n,
        (h) => i(s ?? t, "TAG_RESOLVE_FAILED", h),
        e.options,
      );
      f = ce.isScalar(u) ? u : new er.Scalar(u);
    } catch (u) {
      let h = u instanceof Error ? u.message : String(u);
      i(s ?? t, "TAG_RESOLVE_FAILED", h), (f = new er.Scalar(n));
    }
    if (((f.range = a), (f.source = n), r)) f.type = r;
    if (c) f.tag = c;
    if (l.format) f.format = l.format;
    if (o) f.comment = o;
    return f;
  }
  function ip(e, t, s, i, n) {
    if (s === "!") return e[ce.SCALAR];
    let r = [];
    for (let a of e.tags)
      if (!a.collection && a.tag === s)
        if (a.default && a.test) r.push(a);
        else return a;
    for (let a of r) if (a.test?.test(t)) return a;
    let o = e.knownTags[s];
    if (o && !o.collection)
      return (
        e.tags.push(Object.assign({}, o, { default: !1, test: void 0 })), o
      );
    return (
      n(
        i,
        "TAG_RESOLVE_FAILED",
        `Unresolved tag: ${s}`,
        s !== "tag:yaml.org,2002:str",
      ),
      e[ce.SCALAR]
    );
  }
  function np({ atKey: e, directives: t, schema: s }, i, n, r) {
    let o =
      s.tags.find(
        (a) =>
          (a.default === !0 || (e && a.default === "key")) && a.test?.test(i),
      ) || s[ce.SCALAR];
    if (s.compat) {
      let a =
        s.compat.find((c) => c.default && c.test?.test(i)) ?? s[ce.SCALAR];
      if (o.tag !== a.tag) {
        let c = t.tagString(o.tag),
          l = t.tagString(a.tag),
          f = `Value may be parsed as either ${c} or ${l}`;
        r(n, "TAG_RESOLVE_FAILED", f, !0);
      }
    }
    return o;
  }
  rp.composeScalar = sp;
});
var sr = g(function (lp) {
  function ap(e, t, s) {
    if (t) {
      s ?? (s = t.length);
      for (let i = s - 1; i >= 0; --i) {
        let n = t[i];
        switch (n.type) {
          case "space":
          case "comment":
          case "newline":
            e -= n.source.length;
            continue;
        }
        n = t[++i];
        while (n?.type === "space") (e += n.source.length), (n = t[++i]);
        break;
      }
    }
    return e;
  }
  lp.emptyScalarPosition = ap;
});
var rr = g(function (yp) {
  var up = qe(),
    fp = k(),
    hp = zn(),
    ir = tr(),
    pp = Ae(),
    dp = sr(),
    mp = { composeNode: nr, composeEmptyNode: Qs };
  function nr(e, t, s, i) {
    let n = e.atKey,
      { spaceBefore: r, comment: o, anchor: a, tag: c } = s,
      l,
      f = !0;
    switch (t.type) {
      case "alias":
        if (((l = gp(e, t, i)), a || c))
          i(t, "ALIAS_PROPS", "An alias node must not specify any properties");
        break;
      case "scalar":
      case "single-quoted-scalar":
      case "double-quoted-scalar":
      case "block-scalar":
        if (((l = ir.composeScalar(e, t, c, i)), a))
          l.anchor = a.source.substring(1);
        break;
      case "block-map":
      case "block-seq":
      case "flow-collection":
        try {
          if (((l = hp.composeCollection(mp, e, t, s, i)), a))
            l.anchor = a.source.substring(1);
        } catch (u) {
          let h = u instanceof Error ? u.message : String(u);
          i(t, "RESOURCE_EXHAUSTION", h);
        }
        break;
      default: {
        let u =
          t.type === "error"
            ? t.message
            : `Unsupported token (type: ${t.type})`;
        i(t, "UNEXPECTED_TOKEN", u), (f = !1);
      }
    }
    if ((l ?? (l = Qs(e, t.offset, void 0, null, s, i)), a && l.anchor === ""))
      i(a, "BAD_ALIAS", "Anchor cannot be an empty string");
    if (
      n &&
      e.options.stringKeys &&
      (!fp.isScalar(l) ||
        typeof l.value !== "string" ||
        (l.tag && l.tag !== "tag:yaml.org,2002:str"))
    )
      i(c ?? t, "NON_STRING_KEY", "With stringKeys, all keys must be strings");
    if (r) l.spaceBefore = !0;
    if (o)
      if (t.type === "scalar" && t.source === "") l.comment = o;
      else l.commentBefore = o;
    if (e.options.keepSourceTokens && f) l.srcToken = t;
    return l;
  }
  function Qs(
    e,
    t,
    s,
    i,
    { spaceBefore: n, comment: r, anchor: o, tag: a, end: c },
    l,
  ) {
    let f = {
        type: "scalar",
        offset: dp.emptyScalarPosition(t, s, i),
        indent: -1,
        source: "",
      },
      u = ir.composeScalar(e, f, a, l);
    if (o) {
      if (((u.anchor = o.source.substring(1)), u.anchor === ""))
        l(o, "BAD_ALIAS", "Anchor cannot be an empty string");
    }
    if (n) u.spaceBefore = !0;
    if (r) (u.comment = r), (u.range[2] = c);
    return u;
  }
  function gp({ options: e }, { offset: t, source: s, end: i }, n) {
    let r = new up.Alias(s.substring(1));
    if (r.source === "") n(t, "BAD_ALIAS", "Alias cannot be an empty string");
    if (r.source.endsWith(":"))
      n(t + s.length - 1, "BAD_ALIAS", "Alias ending in : is ambiguous", !0);
    let o = t + s.length,
      a = pp.resolveEnd(i, o, e.strict, n);
    if (((r.range = [t, o, a.offset]), a.comment)) r.comment = a.comment;
    return r;
  }
  yp.composeEmptyNode = Qs;
  yp.composeNode = nr;
});
var ar = g(function (Ap) {
  var Sp = Re(),
    or = rr(),
    vp = Ae(),
    _p = Ue();
  function Op(e, t, { offset: s, start: i, value: n, end: r }, o) {
    let a = Object.assign({ _directives: t }, e),
      c = new Sp.Document(void 0, a),
      l = {
        atKey: !1,
        atRoot: !0,
        directives: c.directives,
        options: c.options,
        schema: c.schema,
      },
      f = _p.resolveProps(i, {
        indicator: "doc-start",
        next: n ?? r?.[0],
        offset: s,
        onError: o,
        parentIndent: 0,
        startOnNewline: !0,
      });
    if (f.found) {
      if (
        ((c.directives.docStart = !0),
        n &&
          (n.type === "block-map" || n.type === "block-seq") &&
          !f.hasNewline)
      )
        o(
          f.end,
          "MISSING_CHAR",
          "Block collection cannot start on same line with directives-end marker",
        );
    }
    c.contents = n
      ? or.composeNode(l, n, f, o)
      : or.composeEmptyNode(l, f.end, i, null, f, o);
    let u = c.contents.range[2],
      h = vp.resolveEnd(r, u, !1, o);
    if (h.comment) c.comment = h.comment;
    return ((c.range = [s, u, h.offset]), c);
  }
  Ap.composeDoc = Op;
});
var Xs = g(function (Lp) {
  var Cp = ze("process"),
    Ep = ts(),
    Np = Re(),
    We = He(),
    lr = k(),
    qp = ar(),
    Tp = Ae();
  function Ge(e) {
    if (typeof e === "number") return [e, e + 1];
    if (Array.isArray(e)) return e.length === 2 ? e : [e[0], e[1]];
    let { offset: t, source: s } = e;
    return [t, t + (typeof s === "string" ? s.length : 1)];
  }
  function cr(e) {
    let t = "",
      s = !1,
      i = !1;
    for (let n = 0; n < e.length; ++n) {
      let r = e[n];
      switch (r[0]) {
        case "#":
          (t +=
            (t === ""
              ? ""
              : i
                ? `

`
                : `
`) + (r.substring(1) || " ")),
            (s = !0),
            (i = !1);
          break;
        case "%":
          if (e[n + 1]?.[0] !== "#") n += 1;
          s = !1;
          break;
        default:
          if (!s) i = !0;
          s = !1;
      }
    }
    return { comment: t, afterEmptyLine: i };
  }
  class ur {
    constructor(e = {}) {
      (this.doc = null),
        (this.atDirectives = !1),
        (this.prelude = []),
        (this.errors = []),
        (this.warnings = []),
        (this.onError = (t, s, i, n) => {
          let r = Ge(t);
          if (n) this.warnings.push(new We.YAMLWarning(r, s, i));
          else this.errors.push(new We.YAMLParseError(r, s, i));
        }),
        (this.directives = new Ep.Directives({ version: e.version || "1.2" })),
        (this.options = e);
    }
    decorate(e, t) {
      let { comment: s, afterEmptyLine: i } = cr(this.prelude);
      if (s) {
        let n = e.contents;
        if (t)
          e.comment = e.comment
            ? `${e.comment}
${s}`
            : s;
        else if (i || e.directives.docStart || !n) e.commentBefore = s;
        else if (lr.isCollection(n) && !n.flow && n.items.length > 0) {
          let r = n.items[0];
          if (lr.isPair(r)) r = r.key;
          let o = r.commentBefore;
          r.commentBefore = o
            ? `${s}
${o}`
            : s;
        } else {
          let r = n.commentBefore;
          n.commentBefore = r
            ? `${s}
${r}`
            : s;
        }
      }
      if (t) {
        for (let n = 0; n < this.errors.length; ++n)
          e.errors.push(this.errors[n]);
        for (let n = 0; n < this.warnings.length; ++n)
          e.warnings.push(this.warnings[n]);
      } else (e.errors = this.errors), (e.warnings = this.warnings);
      (this.prelude = []), (this.errors = []), (this.warnings = []);
    }
    streamInfo() {
      return {
        comment: cr(this.prelude).comment,
        directives: this.directives,
        errors: this.errors,
        warnings: this.warnings,
      };
    }
    *compose(e, t = !1, s = -1) {
      for (let i of e) yield* this.next(i);
      yield* this.end(t, s);
    }
    *next(e) {
      if (Cp.env.LOG_STREAM) console.dir(e, { depth: null });
      switch (e.type) {
        case "directive":
          this.directives.add(e.source, (t, s, i) => {
            let n = Ge(e);
            (n[0] += t), this.onError(n, "BAD_DIRECTIVE", s, i);
          }),
            this.prelude.push(e.source),
            (this.atDirectives = !0);
          break;
        case "document": {
          let t = qp.composeDoc(this.options, this.directives, e, this.onError);
          if (this.atDirectives && !t.directives.docStart)
            this.onError(
              e,
              "MISSING_CHAR",
              "Missing directives-end/doc-start indicator line",
            );
          if ((this.decorate(t, !1), this.doc)) yield this.doc;
          (this.doc = t), (this.atDirectives = !1);
          break;
        }
        case "byte-order-mark":
        case "space":
          break;
        case "comment":
        case "newline":
          this.prelude.push(e.source);
          break;
        case "error": {
          let t = e.source
              ? `${e.message}: ${JSON.stringify(e.source)}`
              : e.message,
            s = new We.YAMLParseError(Ge(e), "UNEXPECTED_TOKEN", t);
          if (this.atDirectives || !this.doc) this.errors.push(s);
          else this.doc.errors.push(s);
          break;
        }
        case "doc-end": {
          if (!this.doc) {
            this.errors.push(
              new We.YAMLParseError(
                Ge(e),
                "UNEXPECTED_TOKEN",
                "Unexpected doc-end without preceding document",
              ),
            );
            break;
          }
          this.doc.directives.docEnd = !0;
          let t = Tp.resolveEnd(
            e.end,
            e.offset + e.source.length,
            this.doc.options.strict,
            this.onError,
          );
          if ((this.decorate(this.doc, !0), t.comment)) {
            let s = this.doc.comment;
            this.doc.comment = s
              ? `${s}
${t.comment}`
              : t.comment;
          }
          this.doc.range[2] = t.offset;
          break;
        }
        default:
          this.errors.push(
            new We.YAMLParseError(
              Ge(e),
              "UNEXPECTED_TOKEN",
              `Unsupported token ${e.type}`,
            ),
          );
      }
    }
    *end(e = !1, t = -1) {
      if (this.doc)
        this.decorate(this.doc, !0), yield this.doc, (this.doc = null);
      else if (e) {
        let s = Object.assign({ _directives: this.directives }, this.options),
          i = new Np.Document(void 0, s);
        if (this.atDirectives)
          this.onError(
            t,
            "MISSING_CHAR",
            "Missing directives-end indicator line",
          );
        (i.range = [0, t, t]), this.decorate(i, !1), yield i;
      }
    }
  }
  Lp.Composer = ur;
});
var pr = g(function (jp) {
  var xp = Gs(),
    Ip = Js(),
    Pp = He(),
    fr = xe();
  function Mp(e, t = !0, s) {
    if (e) {
      let i = (n, r, o) => {
        let a = typeof n === "number" ? n : Array.isArray(n) ? n[0] : n.offset;
        if (s) s(a, r, o);
        else throw new Pp.YAMLParseError([a, a + 1], r, o);
      };
      switch (e.type) {
        case "scalar":
        case "single-quoted-scalar":
        case "double-quoted-scalar":
          return Ip.resolveFlowScalar(e, t, i);
        case "block-scalar":
          return xp.resolveBlockScalar({ options: { strict: t } }, e, i);
      }
    }
    return null;
  }
  function Dp(e, t) {
    let {
        implicitKey: s = !1,
        indent: i,
        inFlow: n = !1,
        offset: r = -1,
        type: o = "PLAIN",
      } = t,
      a = fr.stringifyString(
        { type: o, value: e },
        {
          implicitKey: s,
          indent: i > 0 ? " ".repeat(i) : "",
          inFlow: n,
          options: { blockQuote: !0, lineWidth: -1 },
        },
      ),
      c = t.end ?? [
        {
          type: "newline",
          offset: -1,
          indent: i,
          source: `
`,
        },
      ];
    switch (a[0]) {
      case "|":
      case ">": {
        let l = a.indexOf(`
`),
          f = a.substring(0, l),
          u =
            a.substring(l + 1) +
            `
`,
          h = [
            { type: "block-scalar-header", offset: r, indent: i, source: f },
          ];
        if (!hr(h, c))
          h.push({
            type: "newline",
            offset: -1,
            indent: i,
            source: `
`,
          });
        return {
          type: "block-scalar",
          offset: r,
          indent: i,
          props: h,
          source: u,
        };
      }
      case '"':
        return {
          type: "double-quoted-scalar",
          offset: r,
          indent: i,
          source: a,
          end: c,
        };
      case "'":
        return {
          type: "single-quoted-scalar",
          offset: r,
          indent: i,
          source: a,
          end: c,
        };
      default:
        return { type: "scalar", offset: r, indent: i, source: a, end: c };
    }
  }
  function Fp(e, t, s = {}) {
    let { afterKey: i = !1, implicitKey: n = !1, inFlow: r = !1, type: o } = s,
      a = "indent" in e ? e.indent : null;
    if (i && typeof a === "number") a += 2;
    if (!o)
      switch (e.type) {
        case "single-quoted-scalar":
          o = "QUOTE_SINGLE";
          break;
        case "double-quoted-scalar":
          o = "QUOTE_DOUBLE";
          break;
        case "block-scalar": {
          let l = e.props[0];
          if (l.type !== "block-scalar-header")
            throw Error("Invalid block scalar header");
          o = l.source[0] === ">" ? "BLOCK_FOLDED" : "BLOCK_LITERAL";
          break;
        }
        default:
          o = "PLAIN";
      }
    let c = fr.stringifyString(
      { type: o, value: t },
      {
        implicitKey: n || a === null,
        indent: a !== null && a > 0 ? " ".repeat(a) : "",
        inFlow: r,
        options: { blockQuote: !0, lineWidth: -1 },
      },
    );
    switch (c[0]) {
      case "|":
      case ">":
        Bp(e, c);
        break;
      case '"':
        zs(e, c, "double-quoted-scalar");
        break;
      case "'":
        zs(e, c, "single-quoted-scalar");
        break;
      default:
        zs(e, c, "scalar");
    }
  }
  function Bp(e, t) {
    let s = t.indexOf(`
`),
      i = t.substring(0, s),
      n =
        t.substring(s + 1) +
        `
`;
    if (e.type === "block-scalar") {
      let r = e.props[0];
      if (r.type !== "block-scalar-header")
        throw Error("Invalid block scalar header");
      (r.source = i), (e.source = n);
    } else {
      let { offset: r } = e,
        o = "indent" in e ? e.indent : -1,
        a = [{ type: "block-scalar-header", offset: r, indent: o, source: i }];
      if (!hr(a, "end" in e ? e.end : void 0))
        a.push({
          type: "newline",
          offset: -1,
          indent: o,
          source: `
`,
        });
      for (let c of Object.keys(e))
        if (c !== "type" && c !== "offset") delete e[c];
      Object.assign(e, {
        type: "block-scalar",
        indent: o,
        props: a,
        source: n,
      });
    }
  }
  function hr(e, t) {
    if (t)
      for (let s of t)
        switch (s.type) {
          case "space":
          case "comment":
            e.push(s);
            break;
          case "newline":
            return (e.push(s), !0);
        }
    return !1;
  }
  function zs(e, t, s) {
    switch (e.type) {
      case "scalar":
      case "double-quoted-scalar":
      case "single-quoted-scalar":
        (e.type = s), (e.source = t);
        break;
      case "block-scalar": {
        let i = e.props.slice(1),
          n = t.length;
        if (e.props[0].type === "block-scalar-header")
          n -= e.props[0].source.length;
        for (let r of i) r.offset += n;
        delete e.props, Object.assign(e, { type: s, source: t, end: i });
        break;
      }
      case "block-map":
      case "block-seq": {
        let n = {
          type: "newline",
          offset: e.offset + t.length,
          indent: e.indent,
          source: `
`,
        };
        delete e.items, Object.assign(e, { type: s, source: t, end: [n] });
        break;
      }
      default: {
        let i = "indent" in e ? e.indent : -1,
          n =
            "end" in e && Array.isArray(e.end)
              ? e.end.filter(
                  (r) =>
                    r.type === "space" ||
                    r.type === "comment" ||
                    r.type === "newline",
                )
              : [];
        for (let r of Object.keys(e))
          if (r !== "type" && r !== "offset") delete e[r];
        Object.assign(e, { type: s, indent: i, source: t, end: n });
      }
    }
  }
  jp.createScalarToken = Dp;
  jp.resolveAsScalar = Mp;
  jp.setScalarValue = Fp;
});
var dr = g(function (Up) {
  var Hp = (e) => ("type" in e ? jt(e) : Bt(e));
  function jt(e) {
    switch (e.type) {
      case "block-scalar": {
        let t = "";
        for (let s of e.props) t += jt(s);
        return t + e.source;
      }
      case "block-map":
      case "block-seq": {
        let t = "";
        for (let s of e.items) t += Bt(s);
        return t;
      }
      case "flow-collection": {
        let t = e.start.source;
        for (let s of e.items) t += Bt(s);
        for (let s of e.end) t += s.source;
        return t;
      }
      case "document": {
        let t = Bt(e);
        if (e.end) for (let s of e.end) t += s.source;
        return t;
      }
      default: {
        let t = e.source;
        if ("end" in e && e.end) for (let s of e.end) t += s.source;
        return t;
      }
    }
  }
  function Bt({ start: e, key: t, sep: s, value: i }) {
    let n = "";
    for (let r of e) n += r.source;
    if (t) n += jt(t);
    if (s) for (let r of s) n += r.source;
    if (i) n += jt(i);
    return n;
  }
  Up.stringify = Hp;
});
var yr = g(function (Yp) {
  var Zs = Symbol("break visit"),
    Gp = Symbol("skip children"),
    mr = Symbol("remove item");
  function ue(e, t) {
    if ("type" in e && e.type === "document")
      e = { start: e.start, value: e.value };
    gr(Object.freeze([]), e, t);
  }
  ue.BREAK = Zs;
  ue.SKIP = Gp;
  ue.REMOVE = mr;
  ue.itemAtPath = (e, t) => {
    let s = e;
    for (let [i, n] of t) {
      let r = s?.[i];
      if (r && "items" in r) s = r.items[n];
      else return;
    }
    return s;
  };
  ue.parentCollection = (e, t) => {
    let s = ue.itemAtPath(e, t.slice(0, -1)),
      i = t[t.length - 1][0],
      n = s?.[i];
    if (n && "items" in n) return n;
    throw Error("Parent collection not found");
  };
  function gr(e, t, s) {
    let i = s(t, e);
    if (typeof i === "symbol") return i;
    for (let n of ["key", "value"]) {
      let r = t[n];
      if (r && "items" in r) {
        for (let o = 0; o < r.items.length; ++o) {
          let a = gr(Object.freeze(e.concat([[n, o]])), r.items[o], s);
          if (typeof a === "number") o = a - 1;
          else if (a === Zs) return Zs;
          else if (a === mr) r.items.splice(o, 1), (o -= 1);
        }
        if (typeof i === "function" && n === "key") i = i(t, e);
      }
    }
    return typeof i === "function" ? i(t, e) : i;
  }
  Yp.visit = ue;
});
var Vt = g(function (sd) {
  var ei = pr(),
    Qp = dr(),
    Xp = yr(),
    ti = "\uFEFF",
    si = "\x02",
    ii = "\x18",
    ni = "\x1F",
    zp = (e) => !!e && "items" in e,
    Zp = (e) =>
      !!e &&
      (e.type === "scalar" ||
        e.type === "single-quoted-scalar" ||
        e.type === "double-quoted-scalar" ||
        e.type === "block-scalar");
  function ed(e) {
    switch (e) {
      case ti:
        return "<BOM>";
      case si:
        return "<DOC>";
      case ii:
        return "<FLOW_END>";
      case ni:
        return "<SCALAR>";
      default:
        return JSON.stringify(e);
    }
  }
  function td(e) {
    switch (e) {
      case ti:
        return "byte-order-mark";
      case si:
        return "doc-mode";
      case ii:
        return "flow-error-end";
      case ni:
        return "scalar";
      case "---":
        return "doc-start";
      case "...":
        return "doc-end";
      case "":
      case `
`:
      case `\r
`:
        return "newline";
      case "-":
        return "seq-item-ind";
      case "?":
        return "explicit-key-ind";
      case ":":
        return "map-value-ind";
      case "{":
        return "flow-map-start";
      case "}":
        return "flow-map-end";
      case "[":
        return "flow-seq-start";
      case "]":
        return "flow-seq-end";
      case ",":
        return "comma";
    }
    switch (e[0]) {
      case " ":
      case "\t":
        return "space";
      case "#":
        return "comment";
      case "%":
        return "directive-line";
      case "*":
        return "alias";
      case "&":
        return "anchor";
      case "!":
        return "tag";
      case "'":
        return "single-quoted-scalar";
      case '"':
        return "double-quoted-scalar";
      case "|":
      case ">":
        return "block-scalar-header";
    }
    return null;
  }
  sd.createScalarToken = ei.createScalarToken;
  sd.resolveAsScalar = ei.resolveAsScalar;
  sd.setScalarValue = ei.setScalarValue;
  sd.stringify = Qp.stringify;
  sd.visit = Xp.visit;
  sd.BOM = ti;
  sd.DOCUMENT = si;
  sd.FLOW_END = ii;
  sd.SCALAR = ni;
  sd.isCollection = zp;
  sd.isScalar = Zp;
  sd.prettyToken = ed;
  sd.tokenType = td;
});
var oi = g(function (bd) {
  var Ye = Vt();
  function B(e) {
    switch (e) {
      case void 0:
      case " ":
      case `
`:
      case "\r":
      case "\t":
        return !0;
      default:
        return !1;
    }
  }
  var br = new Set("0123456789ABCDEFabcdef"),
    gd = new Set(
      "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-#;/?:@&=+$_.!~*'()",
    ),
    Kt = new Set(",[]{}"),
    yd = new Set(` ,[]{}
\r	`),
    ri = (e) => !e || yd.has(e);
  class wr {
    constructor() {
      (this.atEnd = !1),
        (this.blockScalarIndent = -1),
        (this.blockScalarKeep = !1),
        (this.buffer = ""),
        (this.flowKey = !1),
        (this.flowLevel = 0),
        (this.indentNext = 0),
        (this.indentValue = 0),
        (this.lineEndPos = null),
        (this.next = null),
        (this.pos = 0);
    }
    *lex(e, t = !1) {
      if (e) {
        if (typeof e !== "string") throw TypeError("source is not a string");
        (this.buffer = this.buffer ? this.buffer + e : e),
          (this.lineEndPos = null);
      }
      this.atEnd = !t;
      let s = this.next ?? "stream";
      while (s && (t || this.hasChars(1))) s = yield* this.parseNext(s);
    }
    atLineEnd() {
      let e = this.pos,
        t = this.buffer[e];
      while (t === " " || t === "\t") t = this.buffer[++e];
      if (
        !t ||
        t === "#" ||
        t ===
          `
`
      )
        return !0;
      if (t === "\r")
        return (
          this.buffer[e + 1] ===
          `
`
        );
      return !1;
    }
    charAt(e) {
      return this.buffer[this.pos + e];
    }
    continueScalar(e) {
      let t = this.buffer[e];
      if (this.indentNext > 0) {
        let s = 0;
        while (t === " ") t = this.buffer[++s + e];
        if (t === "\r") {
          let i = this.buffer[s + e + 1];
          if (
            i ===
              `
` ||
            (!i && !this.atEnd)
          )
            return e + s + 1;
        }
        return t ===
          `
` ||
          s >= this.indentNext ||
          (!t && !this.atEnd)
          ? e + s
          : -1;
      }
      if (t === "-" || t === ".") {
        let s = this.buffer.substr(e, 3);
        if ((s === "---" || s === "...") && B(this.buffer[e + 3])) return -1;
      }
      return e;
    }
    getLine() {
      let e = this.lineEndPos;
      if (typeof e !== "number" || (e !== -1 && e < this.pos))
        (e = this.buffer.indexOf(
          `
`,
          this.pos,
        )),
          (this.lineEndPos = e);
      if (e === -1) return this.atEnd ? this.buffer.substring(this.pos) : null;
      if (this.buffer[e - 1] === "\r") e -= 1;
      return this.buffer.substring(this.pos, e);
    }
    hasChars(e) {
      return this.pos + e <= this.buffer.length;
    }
    setNext(e) {
      return (
        (this.buffer = this.buffer.substring(this.pos)),
        (this.pos = 0),
        (this.lineEndPos = null),
        (this.next = e),
        null
      );
    }
    peek(e) {
      return this.buffer.substr(this.pos, e);
    }
    *parseNext(e) {
      switch (e) {
        case "stream":
          return yield* this.parseStream();
        case "line-start":
          return yield* this.parseLineStart();
        case "block-start":
          return yield* this.parseBlockStart();
        case "doc":
          return yield* this.parseDocument();
        case "flow":
          return yield* this.parseFlowCollection();
        case "quoted-scalar":
          return yield* this.parseQuotedScalar();
        case "block-scalar":
          return yield* this.parseBlockScalar();
        case "plain-scalar":
          return yield* this.parsePlainScalar();
      }
    }
    *parseStream() {
      let e = this.getLine();
      if (e === null) return this.setNext("stream");
      if (e[0] === Ye.BOM) yield* this.pushCount(1), (e = e.substring(1));
      if (e[0] === "%") {
        let t = e.length,
          s = e.indexOf("#");
        while (s !== -1) {
          let n = e[s - 1];
          if (n === " " || n === "\t") {
            t = s - 1;
            break;
          } else s = e.indexOf("#", s + 1);
        }
        while (!0) {
          let n = e[t - 1];
          if (n === " " || n === "\t") t -= 1;
          else break;
        }
        let i = (yield* this.pushCount(t)) + (yield* this.pushSpaces(!0));
        return (
          yield* this.pushCount(e.length - i), this.pushNewline(), "stream"
        );
      }
      if (this.atLineEnd()) {
        let t = yield* this.pushSpaces(!0);
        return (
          yield* this.pushCount(e.length - t),
          yield* this.pushNewline(),
          "stream"
        );
      }
      return (yield Ye.DOCUMENT, yield* this.parseLineStart());
    }
    *parseLineStart() {
      let e = this.charAt(0);
      if (!e && !this.atEnd) return this.setNext("line-start");
      if (e === "-" || e === ".") {
        if (!this.atEnd && !this.hasChars(4)) return this.setNext("line-start");
        let t = this.peek(3);
        if ((t === "---" || t === "...") && B(this.charAt(3)))
          return (
            yield* this.pushCount(3),
            (this.indentValue = 0),
            (this.indentNext = 0),
            t === "---" ? "doc" : "stream"
          );
      }
      if (
        ((this.indentValue = yield* this.pushSpaces(!1)),
        this.indentNext > this.indentValue && !B(this.charAt(1)))
      )
        this.indentNext = this.indentValue;
      return yield* this.parseBlockStart();
    }
    *parseBlockStart() {
      let [e, t] = this.peek(2);
      if (!t && !this.atEnd) return this.setNext("block-start");
      if ((e === "-" || e === "?" || e === ":") && B(t)) {
        let s = (yield* this.pushCount(1)) + (yield* this.pushSpaces(!0));
        return (
          (this.indentNext = this.indentValue + 1),
          (this.indentValue += s),
          "block-start"
        );
      }
      return "doc";
    }
    *parseDocument() {
      yield* this.pushSpaces(!0);
      let e = this.getLine();
      if (e === null) return this.setNext("doc");
      let t = yield* this.pushIndicators();
      switch (e[t]) {
        case "#":
          yield* this.pushCount(e.length - t);
        case void 0:
          return (yield* this.pushNewline(), yield* this.parseLineStart());
        case "{":
        case "[":
          return (
            yield* this.pushCount(1),
            (this.flowKey = !1),
            (this.flowLevel = 1),
            "flow"
          );
        case "}":
        case "]":
          return (yield* this.pushCount(1), "doc");
        case "*":
          return (yield* this.pushUntil(ri), "doc");
        case '"':
        case "'":
          return yield* this.parseQuotedScalar();
        case "|":
        case ">":
          return (
            (t += yield* this.parseBlockScalarHeader()),
            (t += yield* this.pushSpaces(!0)),
            yield* this.pushCount(e.length - t),
            yield* this.pushNewline(),
            yield* this.parseBlockScalar()
          );
        default:
          return yield* this.parsePlainScalar();
      }
    }
    *parseFlowCollection() {
      let e,
        t,
        s = -1;
      do {
        if (((e = yield* this.pushNewline()), e > 0))
          (t = yield* this.pushSpaces(!1)), (this.indentValue = s = t);
        else t = 0;
        t += yield* this.pushSpaces(!0);
      } while (e + t > 0);
      let i = this.getLine();
      if (i === null) return this.setNext("flow");
      if (
        (s !== -1 && s < this.indentNext && i[0] !== "#") ||
        (s === 0 && (i.startsWith("---") || i.startsWith("...")) && B(i[3]))
      ) {
        if (
          !(
            s === this.indentNext - 1 &&
            this.flowLevel === 1 &&
            (i[0] === "]" || i[0] === "}")
          )
        )
          return (
            (this.flowLevel = 0),
            yield Ye.FLOW_END,
            yield* this.parseLineStart()
          );
      }
      let n = 0;
      while (i[n] === ",")
        (n += yield* this.pushCount(1)),
          (n += yield* this.pushSpaces(!0)),
          (this.flowKey = !1);
      switch (((n += yield* this.pushIndicators()), i[n])) {
        case void 0:
          return "flow";
        case "#":
          return (yield* this.pushCount(i.length - n), "flow");
        case "{":
        case "[":
          return (
            yield* this.pushCount(1),
            (this.flowKey = !1),
            (this.flowLevel += 1),
            "flow"
          );
        case "}":
        case "]":
          return (
            yield* this.pushCount(1),
            (this.flowKey = !0),
            (this.flowLevel -= 1),
            this.flowLevel ? "flow" : "doc"
          );
        case "*":
          return (yield* this.pushUntil(ri), "flow");
        case '"':
        case "'":
          return ((this.flowKey = !0), yield* this.parseQuotedScalar());
        case ":": {
          let r = this.charAt(1);
          if (this.flowKey || B(r) || r === ",")
            return (
              (this.flowKey = !1),
              yield* this.pushCount(1),
              yield* this.pushSpaces(!0),
              "flow"
            );
        }
        default:
          return ((this.flowKey = !1), yield* this.parsePlainScalar());
      }
    }
    *parseQuotedScalar() {
      let e = this.charAt(0),
        t = this.buffer.indexOf(e, this.pos + 1);
      if (e === "'")
        while (t !== -1 && this.buffer[t + 1] === "'")
          t = this.buffer.indexOf("'", t + 2);
      else
        while (t !== -1) {
          let n = 0;
          while (this.buffer[t - 1 - n] === "\\") n += 1;
          if (n % 2 === 0) break;
          t = this.buffer.indexOf('"', t + 1);
        }
      let s = this.buffer.substring(0, t),
        i = s.indexOf(
          `
`,
          this.pos,
        );
      if (i !== -1) {
        while (i !== -1) {
          let n = this.continueScalar(i + 1);
          if (n === -1) break;
          i = s.indexOf(
            `
`,
            n,
          );
        }
        if (i !== -1) t = i - (s[i - 1] === "\r" ? 2 : 1);
      }
      if (t === -1) {
        if (!this.atEnd) return this.setNext("quoted-scalar");
        t = this.buffer.length;
      }
      return (
        yield* this.pushToIndex(t + 1, !1), this.flowLevel ? "flow" : "doc"
      );
    }
    *parseBlockScalarHeader() {
      (this.blockScalarIndent = -1), (this.blockScalarKeep = !1);
      let e = this.pos;
      while (!0) {
        let t = this.buffer[++e];
        if (t === "+") this.blockScalarKeep = !0;
        else if (t > "0" && t <= "9") this.blockScalarIndent = Number(t) - 1;
        else if (t !== "-") break;
      }
      return yield* this.pushUntil((t) => B(t) || t === "#");
    }
    *parseBlockScalar() {
      let e = this.pos - 1,
        t = 0,
        s;
      e: for (let n = this.pos; (s = this.buffer[n]); ++n)
        switch (s) {
          case " ":
            t += 1;
            break;
          case `
`:
            (e = n), (t = 0);
            break;
          case "\r": {
            let r = this.buffer[n + 1];
            if (!r && !this.atEnd) return this.setNext("block-scalar");
            if (
              r ===
              `
`
            )
              break;
          }
          default:
            break e;
        }
      if (!s && !this.atEnd) return this.setNext("block-scalar");
      if (t >= this.indentNext) {
        if (this.blockScalarIndent === -1) this.indentNext = t;
        else
          this.indentNext =
            this.blockScalarIndent +
            (this.indentNext === 0 ? 1 : this.indentNext);
        do {
          let n = this.continueScalar(e + 1);
          if (n === -1) break;
          e = this.buffer.indexOf(
            `
`,
            n,
          );
        } while (e !== -1);
        if (e === -1) {
          if (!this.atEnd) return this.setNext("block-scalar");
          e = this.buffer.length;
        }
      }
      let i = e + 1;
      s = this.buffer[i];
      while (s === " ") s = this.buffer[++i];
      if (s === "\t") {
        while (
          s === "\t" ||
          s === " " ||
          s === "\r" ||
          s ===
            `
`
        )
          s = this.buffer[++i];
        e = i - 1;
      } else if (!this.blockScalarKeep)
        do {
          let n = e - 1,
            r = this.buffer[n];
          if (r === "\r") r = this.buffer[--n];
          let o = n;
          while (r === " ") r = this.buffer[--n];
          if (
            r ===
              `
` &&
            n >= this.pos &&
            n + 1 + t > o
          )
            e = n;
          else break;
        } while (!0);
      return (
        yield Ye.SCALAR,
        yield* this.pushToIndex(e + 1, !0),
        yield* this.parseLineStart()
      );
    }
    *parsePlainScalar() {
      let e = this.flowLevel > 0,
        t = this.pos - 1,
        s = this.pos - 1,
        i;
      while ((i = this.buffer[++s]))
        if (i === ":") {
          let n = this.buffer[s + 1];
          if (B(n) || (e && Kt.has(n))) break;
          t = s;
        } else if (B(i)) {
          let n = this.buffer[s + 1];
          if (i === "\r")
            if (
              n ===
              `
`
            )
              (s += 1),
                (i = `
`),
                (n = this.buffer[s + 1]);
            else t = s;
          if (n === "#" || (e && Kt.has(n))) break;
          if (
            i ===
            `
`
          ) {
            let r = this.continueScalar(s + 1);
            if (r === -1) break;
            s = Math.max(s, r - 2);
          }
        } else {
          if (e && Kt.has(i)) break;
          t = s;
        }
      if (!i && !this.atEnd) return this.setNext("plain-scalar");
      return (
        yield Ye.SCALAR, yield* this.pushToIndex(t + 1, !0), e ? "flow" : "doc"
      );
    }
    *pushCount(e) {
      if (e > 0)
        return (yield this.buffer.substr(this.pos, e), (this.pos += e), e);
      return 0;
    }
    *pushToIndex(e, t) {
      let s = this.buffer.slice(this.pos, e);
      if (s) return (yield s, (this.pos += s.length), s.length);
      else if (t) yield "";
      return 0;
    }
    *pushIndicators() {
      let e = 0;
      e: while (!0) {
        switch (this.charAt(0)) {
          case "!":
            (e += yield* this.pushTag()), (e += yield* this.pushSpaces(!0));
            continue e;
          case "&":
            (e += yield* this.pushUntil(ri)), (e += yield* this.pushSpaces(!0));
            continue e;
          case "-":
          case "?":
          case ":": {
            let t = this.flowLevel > 0,
              s = this.charAt(1);
            if (B(s) || (t && Kt.has(s))) {
              if (!t) this.indentNext = this.indentValue + 1;
              else if (this.flowKey) this.flowKey = !1;
              (e += yield* this.pushCount(1)),
                (e += yield* this.pushSpaces(!0));
              continue e;
            }
          }
        }
        break e;
      }
      return e;
    }
    *pushTag() {
      if (this.charAt(1) === "<") {
        let e = this.pos + 2,
          t = this.buffer[e];
        while (!B(t) && t !== ">") t = this.buffer[++e];
        return yield* this.pushToIndex(t === ">" ? e + 1 : e, !1);
      } else {
        let e = this.pos + 1,
          t = this.buffer[e];
        while (t)
          if (gd.has(t)) t = this.buffer[++e];
          else if (
            t === "%" &&
            br.has(this.buffer[e + 1]) &&
            br.has(this.buffer[e + 2])
          )
            t = this.buffer[(e += 3)];
          else break;
        return yield* this.pushToIndex(e, !1);
      }
    }
    *pushNewline() {
      let e = this.buffer[this.pos];
      if (
        e ===
        `
`
      )
        return yield* this.pushCount(1);
      else if (
        e === "\r" &&
        this.charAt(1) ===
          `
`
      )
        return yield* this.pushCount(2);
      else return 0;
    }
    *pushSpaces(e) {
      let t = this.pos - 1,
        s;
      do s = this.buffer[++t];
      while (s === " " || (e && s === "\t"));
      let i = t - this.pos;
      if (i > 0) yield this.buffer.substr(this.pos, i), (this.pos = t);
      return i;
    }
    *pushUntil(e) {
      let t = this.pos,
        s = this.buffer[t];
      while (!e(s)) s = this.buffer[++t];
      return yield* this.pushToIndex(t, !1);
    }
  }
  bd.Lexer = wr;
});
var ai = g(function (Sd) {
  class Sr {
    constructor() {
      (this.lineStarts = []),
        (this.addNewLine = (e) => this.lineStarts.push(e)),
        (this.linePos = (e) => {
          let t = 0,
            s = this.lineStarts.length;
          while (t < s) {
            let n = (t + s) >> 1;
            if (this.lineStarts[n] < e) t = n + 1;
            else s = n;
          }
          if (this.lineStarts[t] === e) return { line: t + 1, col: 1 };
          if (t === 0) return { line: 0, col: e };
          let i = this.lineStarts[t - 1];
          return { line: t, col: e - i + 1 };
        });
    }
  }
  Sd.LineCounter = Sr;
});
var li = g(function (Ad) {
  var _d = ze("process"),
    vr = Vt(),
    Od = oi();
  function te(e, t) {
    for (let s = 0; s < e.length; ++s) if (e[s].type === t) return !0;
    return !1;
  }
  function _r(e) {
    for (let t = 0; t < e.length; ++t)
      switch (e[t].type) {
        case "space":
        case "comment":
        case "newline":
          break;
        default:
          return t;
      }
    return -1;
  }
  function Ar(e) {
    switch (e?.type) {
      case "alias":
      case "scalar":
      case "single-quoted-scalar":
      case "double-quoted-scalar":
      case "flow-collection":
        return !0;
      default:
        return !1;
    }
  }
  function Rt(e) {
    switch (e.type) {
      case "document":
        return e.start;
      case "block-map": {
        let t = e.items[e.items.length - 1];
        return t.sep ?? t.start;
      }
      case "block-seq":
        return e.items[e.items.length - 1].start;
      default:
        return [];
    }
  }
  function ke(e) {
    if (e.length === 0) return [];
    let t = e.length;
    e: while (--t >= 0)
      switch (e[t].type) {
        case "doc-start":
        case "explicit-key-ind":
        case "map-value-ind":
        case "seq-item-ind":
        case "newline":
          break e;
      }
    while (e[++t]?.type === "space");
    return e.splice(t, e.length);
  }
  function Ht(e, t) {
    if (t.length < 1e5) Array.prototype.push.apply(e, t);
    else for (let s = 0; s < t.length; ++s) e.push(t[s]);
  }
  function Or(e) {
    if (e.start.type === "flow-seq-start") {
      for (let t of e.items)
        if (
          t.sep &&
          !t.value &&
          !te(t.start, "explicit-key-ind") &&
          !te(t.sep, "map-value-ind")
        ) {
          if (t.key) t.value = t.key;
          if ((delete t.key, Ar(t.value)))
            if (t.value.end) Ht(t.value.end, t.sep);
            else t.value.end = t.sep;
          else Ht(t.start, t.sep);
          delete t.sep;
        }
    }
  }
  class kr {
    constructor(e) {
      (this.atNewLine = !0),
        (this.atScalar = !1),
        (this.indent = 0),
        (this.offset = 0),
        (this.onKeyLine = !1),
        (this.stack = []),
        (this.source = ""),
        (this.type = ""),
        (this.lexer = new Od.Lexer()),
        (this.onNewLine = e);
    }
    *parse(e, t = !1) {
      if (this.onNewLine && this.offset === 0) this.onNewLine(0);
      for (let s of this.lexer.lex(e, t)) yield* this.next(s);
      if (!t) yield* this.end();
    }
    *next(e) {
      if (((this.source = e), _d.env.LOG_TOKENS))
        console.log("|", vr.prettyToken(e));
      if (this.atScalar) {
        (this.atScalar = !1), yield* this.step(), (this.offset += e.length);
        return;
      }
      let t = vr.tokenType(e);
      if (!t) {
        let s = `Not a YAML token: ${e}`;
        yield* this.pop({
          type: "error",
          offset: this.offset,
          message: s,
          source: e,
        }),
          (this.offset += e.length);
      } else if (t === "scalar")
        (this.atNewLine = !1), (this.atScalar = !0), (this.type = "scalar");
      else {
        switch (((this.type = t), yield* this.step(), t)) {
          case "newline":
            if (((this.atNewLine = !0), (this.indent = 0), this.onNewLine))
              this.onNewLine(this.offset + e.length);
            break;
          case "space":
            if (this.atNewLine && e[0] === " ") this.indent += e.length;
            break;
          case "explicit-key-ind":
          case "map-value-ind":
          case "seq-item-ind":
            if (this.atNewLine) this.indent += e.length;
            break;
          case "doc-mode":
          case "flow-error-end":
            return;
          default:
            this.atNewLine = !1;
        }
        this.offset += e.length;
      }
    }
    *end() {
      while (this.stack.length > 0) yield* this.pop();
    }
    get sourceToken() {
      return {
        type: this.type,
        offset: this.offset,
        indent: this.indent,
        source: this.source,
      };
    }
    *step() {
      let e = this.peek(1);
      if (this.type === "doc-end" && e?.type !== "doc-end") {
        while (this.stack.length > 0) yield* this.pop();
        this.stack.push({
          type: "doc-end",
          offset: this.offset,
          source: this.source,
        });
        return;
      }
      if (!e) return yield* this.stream();
      switch (e.type) {
        case "document":
          return yield* this.document(e);
        case "alias":
        case "scalar":
        case "single-quoted-scalar":
        case "double-quoted-scalar":
          return yield* this.scalar(e);
        case "block-scalar":
          return yield* this.blockScalar(e);
        case "block-map":
          return yield* this.blockMap(e);
        case "block-seq":
          return yield* this.blockSequence(e);
        case "flow-collection":
          return yield* this.flowCollection(e);
        case "doc-end":
          return yield* this.documentEnd(e);
      }
      yield* this.pop();
    }
    peek(e) {
      return this.stack[this.stack.length - e];
    }
    *pop(e) {
      let t = e ?? this.stack.pop();
      if (!t)
        yield {
          type: "error",
          offset: this.offset,
          source: "",
          message: "Tried to pop an empty stack",
        };
      else if (this.stack.length === 0) yield t;
      else {
        let s = this.peek(1);
        if (t.type === "block-scalar") t.indent = "indent" in s ? s.indent : 0;
        else if (t.type === "flow-collection" && s.type === "document")
          t.indent = 0;
        if (t.type === "flow-collection") Or(t);
        switch (s.type) {
          case "document":
            s.value = t;
            break;
          case "block-scalar":
            s.props.push(t);
            break;
          case "block-map": {
            let i = s.items[s.items.length - 1];
            if (i.value) {
              s.items.push({ start: [], key: t, sep: [] }),
                (this.onKeyLine = !0);
              return;
            } else if (i.sep) i.value = t;
            else {
              Object.assign(i, { key: t, sep: [] }),
                (this.onKeyLine = !i.explicitKey);
              return;
            }
            break;
          }
          case "block-seq": {
            let i = s.items[s.items.length - 1];
            if (i.value) s.items.push({ start: [], value: t });
            else i.value = t;
            break;
          }
          case "flow-collection": {
            let i = s.items[s.items.length - 1];
            if (!i || i.value) s.items.push({ start: [], key: t, sep: [] });
            else if (i.sep) i.value = t;
            else Object.assign(i, { key: t, sep: [] });
            return;
          }
          default:
            yield* this.pop(), yield* this.pop(t);
        }
        if (
          (s.type === "document" ||
            s.type === "block-map" ||
            s.type === "block-seq") &&
          (t.type === "block-map" || t.type === "block-seq")
        ) {
          let i = t.items[t.items.length - 1];
          if (
            i &&
            !i.sep &&
            !i.value &&
            i.start.length > 0 &&
            _r(i.start) === -1 &&
            (t.indent === 0 ||
              i.start.every((n) => n.type !== "comment" || n.indent < t.indent))
          ) {
            if (s.type === "document") s.end = i.start;
            else s.items.push({ start: i.start });
            t.items.splice(-1, 1);
          }
        }
      }
    }
    *stream() {
      switch (this.type) {
        case "directive-line":
          yield { type: "directive", offset: this.offset, source: this.source };
          return;
        case "byte-order-mark":
        case "space":
        case "comment":
        case "newline":
          yield this.sourceToken;
          return;
        case "doc-mode":
        case "doc-start": {
          let e = { type: "document", offset: this.offset, start: [] };
          if (this.type === "doc-start") e.start.push(this.sourceToken);
          this.stack.push(e);
          return;
        }
      }
      yield {
        type: "error",
        offset: this.offset,
        message: `Unexpected ${this.type} token in YAML stream`,
        source: this.source,
      };
    }
    *document(e) {
      if (e.value) return yield* this.lineEnd(e);
      switch (this.type) {
        case "doc-start": {
          if (_r(e.start) !== -1) yield* this.pop(), yield* this.step();
          else e.start.push(this.sourceToken);
          return;
        }
        case "anchor":
        case "tag":
        case "space":
        case "comment":
        case "newline":
          e.start.push(this.sourceToken);
          return;
      }
      let t = this.startBlockValue(e);
      if (t) this.stack.push(t);
      else
        yield {
          type: "error",
          offset: this.offset,
          message: `Unexpected ${this.type} token in YAML document`,
          source: this.source,
        };
    }
    *scalar(e) {
      if (this.type === "map-value-ind") {
        let t = Rt(this.peek(2)),
          s = ke(t),
          i;
        if (e.end) (i = e.end), i.push(this.sourceToken), delete e.end;
        else i = [this.sourceToken];
        let n = {
          type: "block-map",
          offset: e.offset,
          indent: e.indent,
          items: [{ start: s, key: e, sep: i }],
        };
        (this.onKeyLine = !0), (this.stack[this.stack.length - 1] = n);
      } else yield* this.lineEnd(e);
    }
    *blockScalar(e) {
      switch (this.type) {
        case "space":
        case "comment":
        case "newline":
          e.props.push(this.sourceToken);
          return;
        case "scalar":
          if (
            ((e.source = this.source),
            (this.atNewLine = !0),
            (this.indent = 0),
            this.onNewLine)
          ) {
            let t =
              this.source.indexOf(`
`) + 1;
            while (t !== 0)
              this.onNewLine(this.offset + t),
                (t =
                  this.source.indexOf(
                    `
`,
                    t,
                  ) + 1);
          }
          yield* this.pop();
          break;
        default:
          yield* this.pop(), yield* this.step();
      }
    }
    *blockMap(e) {
      let t = e.items[e.items.length - 1];
      switch (this.type) {
        case "newline":
          if (((this.onKeyLine = !1), t.value)) {
            let s = "end" in t.value ? t.value.end : void 0;
            if (
              (Array.isArray(s) ? s[s.length - 1] : void 0)?.type === "comment"
            )
              s?.push(this.sourceToken);
            else e.items.push({ start: [this.sourceToken] });
          } else if (t.sep) t.sep.push(this.sourceToken);
          else t.start.push(this.sourceToken);
          return;
        case "space":
        case "comment":
          if (t.value) e.items.push({ start: [this.sourceToken] });
          else if (t.sep) t.sep.push(this.sourceToken);
          else {
            if (this.atIndentedComment(t.start, e.indent)) {
              let i = e.items[e.items.length - 2]?.value?.end;
              if (Array.isArray(i)) {
                Ht(i, t.start), i.push(this.sourceToken), e.items.pop();
                return;
              }
            }
            t.start.push(this.sourceToken);
          }
          return;
      }
      if (this.indent >= e.indent) {
        let s = !this.onKeyLine && this.indent === e.indent,
          i = s && (t.sep || t.explicitKey) && this.type !== "seq-item-ind",
          n = [];
        if (i && t.sep && !t.value) {
          let r = [];
          for (let o = 0; o < t.sep.length; ++o) {
            let a = t.sep[o];
            switch (a.type) {
              case "newline":
                r.push(o);
                break;
              case "space":
                break;
              case "comment":
                if (a.indent > e.indent) r.length = 0;
                break;
              default:
                r.length = 0;
            }
          }
          if (r.length >= 2) n = t.sep.splice(r[1]);
        }
        switch (this.type) {
          case "anchor":
          case "tag":
            if (i || t.value)
              n.push(this.sourceToken),
                e.items.push({ start: n }),
                (this.onKeyLine = !0);
            else if (t.sep) t.sep.push(this.sourceToken);
            else t.start.push(this.sourceToken);
            return;
          case "explicit-key-ind":
            if (!t.sep && !t.explicitKey)
              t.start.push(this.sourceToken), (t.explicitKey = !0);
            else if (i || t.value)
              n.push(this.sourceToken),
                e.items.push({ start: n, explicitKey: !0 });
            else
              this.stack.push({
                type: "block-map",
                offset: this.offset,
                indent: this.indent,
                items: [{ start: [this.sourceToken], explicitKey: !0 }],
              });
            this.onKeyLine = !0;
            return;
          case "map-value-ind":
            if (t.explicitKey)
              if (!t.sep)
                if (te(t.start, "newline"))
                  Object.assign(t, { key: null, sep: [this.sourceToken] });
                else {
                  let r = ke(t.start);
                  this.stack.push({
                    type: "block-map",
                    offset: this.offset,
                    indent: this.indent,
                    items: [{ start: r, key: null, sep: [this.sourceToken] }],
                  });
                }
              else if (t.value)
                e.items.push({ start: [], key: null, sep: [this.sourceToken] });
              else if (te(t.sep, "map-value-ind"))
                this.stack.push({
                  type: "block-map",
                  offset: this.offset,
                  indent: this.indent,
                  items: [{ start: n, key: null, sep: [this.sourceToken] }],
                });
              else if (Ar(t.key) && !te(t.sep, "newline")) {
                let r = ke(t.start),
                  { key: o, sep: a } = t;
                a.push(this.sourceToken),
                  delete t.key,
                  delete t.sep,
                  this.stack.push({
                    type: "block-map",
                    offset: this.offset,
                    indent: this.indent,
                    items: [{ start: r, key: o, sep: a }],
                  });
              } else if (n.length > 0)
                t.sep = t.sep.concat(n, this.sourceToken);
              else t.sep.push(this.sourceToken);
            else if (!t.sep)
              Object.assign(t, { key: null, sep: [this.sourceToken] });
            else if (t.value || i)
              e.items.push({ start: n, key: null, sep: [this.sourceToken] });
            else if (te(t.sep, "map-value-ind"))
              this.stack.push({
                type: "block-map",
                offset: this.offset,
                indent: this.indent,
                items: [{ start: [], key: null, sep: [this.sourceToken] }],
              });
            else t.sep.push(this.sourceToken);
            this.onKeyLine = !0;
            return;
          case "alias":
          case "scalar":
          case "single-quoted-scalar":
          case "double-quoted-scalar": {
            let r = this.flowScalar(this.type);
            if (i || t.value)
              e.items.push({ start: n, key: r, sep: [] }),
                (this.onKeyLine = !0);
            else if (t.sep) this.stack.push(r);
            else Object.assign(t, { key: r, sep: [] }), (this.onKeyLine = !0);
            return;
          }
          default: {
            let r = this.startBlockValue(e);
            if (r) {
              if (r.type === "block-seq") {
                if (!t.explicitKey && t.sep && !te(t.sep, "newline")) {
                  yield* this.pop({
                    type: "error",
                    offset: this.offset,
                    message: "Unexpected block-seq-ind on same line with key",
                    source: this.source,
                  });
                  return;
                }
              } else if (s) e.items.push({ start: n });
              this.stack.push(r);
              return;
            }
          }
        }
      }
      yield* this.pop(), yield* this.step();
    }
    *blockSequence(e) {
      let t = e.items[e.items.length - 1];
      switch (this.type) {
        case "newline":
          if (t.value) {
            let s = "end" in t.value ? t.value.end : void 0;
            if (
              (Array.isArray(s) ? s[s.length - 1] : void 0)?.type === "comment"
            )
              s?.push(this.sourceToken);
            else e.items.push({ start: [this.sourceToken] });
          } else t.start.push(this.sourceToken);
          return;
        case "space":
        case "comment":
          if (t.value) e.items.push({ start: [this.sourceToken] });
          else {
            if (this.atIndentedComment(t.start, e.indent)) {
              let i = e.items[e.items.length - 2]?.value?.end;
              if (Array.isArray(i)) {
                Ht(i, t.start), i.push(this.sourceToken), e.items.pop();
                return;
              }
            }
            t.start.push(this.sourceToken);
          }
          return;
        case "anchor":
        case "tag":
          if (t.value || this.indent <= e.indent) break;
          t.start.push(this.sourceToken);
          return;
        case "seq-item-ind":
          if (this.indent !== e.indent) break;
          if (t.value || te(t.start, "seq-item-ind"))
            e.items.push({ start: [this.sourceToken] });
          else t.start.push(this.sourceToken);
          return;
      }
      if (this.indent > e.indent) {
        let s = this.startBlockValue(e);
        if (s) {
          this.stack.push(s);
          return;
        }
      }
      yield* this.pop(), yield* this.step();
    }
    *flowCollection(e) {
      let t = e.items[e.items.length - 1];
      if (this.type === "flow-error-end") {
        let s;
        do yield* this.pop(), (s = this.peek(1));
        while (s?.type === "flow-collection");
      } else if (e.end.length === 0) {
        switch (this.type) {
          case "comma":
          case "explicit-key-ind":
            if (!t || t.sep) e.items.push({ start: [this.sourceToken] });
            else t.start.push(this.sourceToken);
            return;
          case "map-value-ind":
            if (!t || t.value)
              e.items.push({ start: [], key: null, sep: [this.sourceToken] });
            else if (t.sep) t.sep.push(this.sourceToken);
            else Object.assign(t, { key: null, sep: [this.sourceToken] });
            return;
          case "space":
          case "comment":
          case "newline":
          case "anchor":
          case "tag":
            if (!t || t.value) e.items.push({ start: [this.sourceToken] });
            else if (t.sep) t.sep.push(this.sourceToken);
            else t.start.push(this.sourceToken);
            return;
          case "alias":
          case "scalar":
          case "single-quoted-scalar":
          case "double-quoted-scalar": {
            let i = this.flowScalar(this.type);
            if (!t || t.value) e.items.push({ start: [], key: i, sep: [] });
            else if (t.sep) this.stack.push(i);
            else Object.assign(t, { key: i, sep: [] });
            return;
          }
          case "flow-map-end":
          case "flow-seq-end":
            e.end.push(this.sourceToken);
            return;
        }
        let s = this.startBlockValue(e);
        if (s) this.stack.push(s);
        else yield* this.pop(), yield* this.step();
      } else {
        let s = this.peek(2);
        if (
          s.type === "block-map" &&
          ((this.type === "map-value-ind" && s.indent === e.indent) ||
            (this.type === "newline" && !s.items[s.items.length - 1].sep))
        )
          yield* this.pop(), yield* this.step();
        else if (
          this.type === "map-value-ind" &&
          s.type !== "flow-collection"
        ) {
          let i = Rt(s),
            n = ke(i);
          Or(e);
          let r = e.end.splice(1, e.end.length);
          r.push(this.sourceToken);
          let o = {
            type: "block-map",
            offset: e.offset,
            indent: e.indent,
            items: [{ start: n, key: e, sep: r }],
          };
          (this.onKeyLine = !0), (this.stack[this.stack.length - 1] = o);
        } else yield* this.lineEnd(e);
      }
    }
    flowScalar(e) {
      if (this.onNewLine) {
        let t =
          this.source.indexOf(`
`) + 1;
        while (t !== 0)
          this.onNewLine(this.offset + t),
            (t =
              this.source.indexOf(
                `
`,
                t,
              ) + 1);
      }
      return {
        type: e,
        offset: this.offset,
        indent: this.indent,
        source: this.source,
      };
    }
    startBlockValue(e) {
      switch (this.type) {
        case "alias":
        case "scalar":
        case "single-quoted-scalar":
        case "double-quoted-scalar":
          return this.flowScalar(this.type);
        case "block-scalar-header":
          return {
            type: "block-scalar",
            offset: this.offset,
            indent: this.indent,
            props: [this.sourceToken],
            source: "",
          };
        case "flow-map-start":
        case "flow-seq-start":
          return {
            type: "flow-collection",
            offset: this.offset,
            indent: this.indent,
            start: this.sourceToken,
            items: [],
            end: [],
          };
        case "seq-item-ind":
          return {
            type: "block-seq",
            offset: this.offset,
            indent: this.indent,
            items: [{ start: [this.sourceToken] }],
          };
        case "explicit-key-ind": {
          this.onKeyLine = !0;
          let t = Rt(e),
            s = ke(t);
          return (
            s.push(this.sourceToken),
            {
              type: "block-map",
              offset: this.offset,
              indent: this.indent,
              items: [{ start: s, explicitKey: !0 }],
            }
          );
        }
        case "map-value-ind": {
          this.onKeyLine = !0;
          let t = Rt(e),
            s = ke(t);
          return {
            type: "block-map",
            offset: this.offset,
            indent: this.indent,
            items: [{ start: s, key: null, sep: [this.sourceToken] }],
          };
        }
      }
      return null;
    }
    atIndentedComment(e, t) {
      if (this.type !== "comment") return !1;
      if (this.indent <= t) return !1;
      return e.every((s) => s.type === "newline" || s.type === "space");
    }
    *documentEnd(e) {
      if (this.type !== "doc-mode") {
        if (e.end) e.end.push(this.sourceToken);
        else e.end = [this.sourceToken];
        if (this.type === "newline") yield* this.pop();
      }
    }
    *lineEnd(e) {
      switch (this.type) {
        case "comma":
        case "doc-start":
        case "doc-end":
        case "flow-seq-end":
        case "flow-map-end":
        case "map-value-ind":
          yield* this.pop(), yield* this.step();
          break;
        case "newline":
          this.onKeyLine = !1;
        case "space":
        case "comment":
        default:
          if (e.end) e.end.push(this.sourceToken);
          else e.end = [this.sourceToken];
          if (this.type === "newline") yield* this.pop();
      }
    }
  }
  Ad.Parser = kr;
});
var Tr = g(function (xd) {
  var Cr = Xs(),
    Cd = Re(),
    Je = He(),
    Ed = as(),
    Nd = k(),
    qd = ai(),
    Er = li();
  function Nr(e) {
    let t = e.prettyErrors !== !1;
    return {
      lineCounter: e.lineCounter || (t && new qd.LineCounter()) || null,
      prettyErrors: t,
    };
  }
  function Td(e, t = {}) {
    let { lineCounter: s, prettyErrors: i } = Nr(t),
      n = new Er.Parser(s?.addNewLine),
      r = new Cr.Composer(t),
      o = Array.from(r.compose(n.parse(e)));
    if (i && s)
      for (let a of o)
        a.errors.forEach(Je.prettifyError(e, s)),
          a.warnings.forEach(Je.prettifyError(e, s));
    if (o.length > 0) return o;
    return Object.assign([], { empty: !0 }, r.streamInfo());
  }
  function qr(e, t = {}) {
    let { lineCounter: s, prettyErrors: i } = Nr(t),
      n = new Er.Parser(s?.addNewLine),
      r = new Cr.Composer(t),
      o = null;
    for (let a of r.compose(n.parse(e), !0, e.length))
      if (!o) o = a;
      else if (o.options.logLevel !== "silent") {
        o.errors.push(
          new Je.YAMLParseError(
            a.range.slice(0, 2),
            "MULTIPLE_DOCS",
            "Source contains multiple documents; please use YAML.parseAllDocuments()",
          ),
        );
        break;
      }
    if (i && s)
      o.errors.forEach(Je.prettifyError(e, s)),
        o.warnings.forEach(Je.prettifyError(e, s));
    return o;
  }
  function Ld(e, t, s) {
    let i = void 0;
    if (typeof t === "function") i = t;
    else if (s === void 0 && t && typeof t === "object") s = t;
    let n = qr(e, s);
    if (!n) return null;
    if (
      (n.warnings.forEach((r) => Ed.warn(n.options.logLevel, r)),
      n.errors.length > 0)
    )
      if (n.options.logLevel !== "silent") throw n.errors[0];
      else n.errors = [];
    return n.toJS(Object.assign({ reviver: i }, s));
  }
  function $d(e, t, s) {
    let i = null;
    if (typeof t === "function" || Array.isArray(t)) i = t;
    else if (s === void 0 && t) s = t;
    if (typeof s === "string") s = s.length;
    if (typeof s === "number") {
      let n = Math.round(s);
      s = n < 1 ? void 0 : n > 8 ? { indent: 8 } : { indent: n };
    }
    if (e === void 0) {
      let { keepUndefined: n } = s ?? t ?? {};
      if (!n) return;
    }
    if (Nd.isDocument(e) && !i) return e.toString(s);
    return new Cd.Document(e, i, s).toString(s);
  }
  xd.parse = Ld;
  xd.parseAllDocuments = Td;
  xd.parseDocument = qr;
  xd.stringify = $d;
});
var Wt = {};
wo(
  Wt,
  {
    Composer: () => $r,
    Document: () => xr,
    Schema: () => Ir,
    YAMLError: () => Pr,
    YAMLParseError: () => Mr,
    YAMLWarning: () => Dr,
    Alias: () => Fr,
    isAlias: () => Br,
    isCollection: () => jr,
    isDocument: () => Vr,
    isMap: () => Kr,
    isNode: () => Rr,
    isPair: () => Hr,
    isScalar: () => Ur,
    isSeq: () => Wr,
    Pair: () => Gr,
    Scalar: () => Yr,
    YAMLMap: () => Jr,
    YAMLSeq: () => Qr,
    CST: () => Xr,
    Lexer: () => zr,
    LineCounter: () => Zr,
    Parser: () => eo,
    parse: () => to,
    parseAllDocuments: () => so,
    parseDocument: () => io,
    stringify: () => no,
    visit: () => ro,
    visitAsync: () => oo,
  },
  {
    Composer: (Ly) => ($r = Ly),
    Document: (Ly) => (xr = Ly),
    Schema: (Ly) => (Ir = Ly),
    YAMLError: (Ly) => (Pr = Ly),
    YAMLParseError: (Ly) => (Mr = Ly),
    YAMLWarning: (Ly) => (Dr = Ly),
    Alias: (Ly) => (Fr = Ly),
    isAlias: (Ly) => (Br = Ly),
    isCollection: (Ly) => (jr = Ly),
    isDocument: (Ly) => (Vr = Ly),
    isMap: (Ly) => (Kr = Ly),
    isNode: (Ly) => (Rr = Ly),
    isPair: (Ly) => (Hr = Ly),
    isScalar: (Ly) => (Ur = Ly),
    isSeq: (Ly) => (Wr = Ly),
    Pair: (Ly) => (Gr = Ly),
    Scalar: (Ly) => (Yr = Ly),
    YAMLMap: (Ly) => (Jr = Ly),
    YAMLSeq: (Ly) => (Qr = Ly),
    CST: (Ly) => (Xr = Ly),
    Lexer: (Ly) => (zr = Ly),
    LineCounter: (Ly) => (Zr = Ly),
    Parser: (Ly) => (eo = Ly),
    parse: (Ly) => (to = Ly),
    parseAllDocuments: (Ly) => (so = Ly),
    parseDocument: (Ly) => (io = Ly),
    stringify: (Ly) => (no = Ly),
    visit: (Ly) => (ro = Ly),
    visitAsync: (Ly) => (oo = Ly),
  },
);
import {
  cpSync as Qd,
  existsSync as R,
  lstatSync as Xd,
  mkdirSync as zd,
  readFileSync as hi,
  readdirSync as Zd,
  rmSync as ho,
  statSync as em,
  symlinkSync as tm,
  writeFileSync as fi,
} from "node:fs";
import {
  basename as Gt,
  dirname as pi,
  join as x,
  relative as di,
  resolve as P,
} from "node:path";
import { pathToFileURL as sm } from "node:url";
class ie extends Error {
  constructor(e, t, s) {
    super(s);
    Error.captureStackTrace(this, this.constructor),
      (this.name = this.constructor.name),
      (this.code = t),
      (this.exitCode = e),
      (this.nestedError = void 0);
  }
}
class pe extends ie {
  constructor(e) {
    super(1, "commander.invalidArgument", e);
    Error.captureStackTrace(this, this.constructor),
      (this.name = this.constructor.name);
  }
}
class Ze {
  constructor(e, t) {
    switch (
      ((this.description = t || ""),
      (this.variadic = !1),
      (this.parseArg = void 0),
      (this.defaultValue = void 0),
      (this.defaultValueDescription = void 0),
      (this.argChoices = void 0),
      e[0])
    ) {
      case "<":
        (this.required = !0), (this._name = e.slice(1, -1));
        break;
      case "[":
        (this.required = !1), (this._name = e.slice(1, -1));
        break;
      default:
        (this.required = !0), (this._name = e);
        break;
    }
    if (this._name.endsWith("..."))
      (this.variadic = !0), (this._name = this._name.slice(0, -3));
  }
  name() {
    return this._name;
  }
  _collectValue(e, t) {
    if (t === this.defaultValue || !Array.isArray(t)) return [e];
    return (t.push(e), t);
  }
  default(e, t) {
    return ((this.defaultValue = e), (this.defaultValueDescription = t), this);
  }
  argParser(e) {
    return ((this.parseArg = e), this);
  }
  choices(e) {
    return (
      (this.argChoices = e.slice()),
      (this.parseArg = (t, s) => {
        if (!this.argChoices.includes(t))
          throw new pe(`Allowed choices are ${this.argChoices.join(", ")}.`);
        if (this.variadic) return this._collectValue(t, s);
        return t;
      }),
      this
    );
  }
  argRequired() {
    return ((this.required = !0), this);
  }
  argOptional() {
    return ((this.required = !1), this);
  }
}
function et(e) {
  let t = e.name() + (e.variadic === !0 ? "..." : "");
  return e.required ? "<" + t + ">" : "[" + t + "]";
}
import { EventEmitter as Ao } from "node:events";
import zt from "node:child_process";
import H from "node:path";
import st from "node:fs";
import C from "node:process";
import { stripVTControlCharacters as ko } from "node:util";
import { stripVTControlCharacters as vo } from "node:util";
class tt {
  constructor() {
    (this.helpWidth = void 0),
      (this.minWidthToWrap = 40),
      (this.sortSubcommands = !1),
      (this.sortOptions = !1),
      (this.showGlobalOptions = !1);
  }
  prepareContext(e) {
    this.helpWidth = this.helpWidth ?? e.helpWidth ?? 80;
  }
  visibleCommands(e) {
    let t = e.commands.filter((i) => !i._hidden),
      s = e._getHelpCommand();
    if (s && !s._hidden) t.push(s);
    if (this.sortSubcommands)
      t.sort((i, n) => i.name().localeCompare(n.name()));
    return t;
  }
  compareOptions(e, t) {
    let s = (i) =>
      i.short ? i.short.replace(/^-/, "") : i.long.replace(/^--/, "");
    return s(e).localeCompare(s(t));
  }
  visibleOptions(e) {
    let t = e.options.filter((i) => !i.hidden),
      s = e._getHelpOption();
    if (s && !s.hidden) {
      let i = s.short && e._findOption(s.short),
        n = s.long && e._findOption(s.long);
      if (!i && !n) t.push(s);
      else if (s.long && !n)
        t.push(
          e.createOption(s.long, s.description).helpGroup(s.helpGroupHeading),
        );
      else if (s.short && !i)
        t.push(
          e.createOption(s.short, s.description).helpGroup(s.helpGroupHeading),
        );
    }
    if (this.sortOptions) t.sort(this.compareOptions);
    return t;
  }
  visibleGlobalOptions(e) {
    if (!this.showGlobalOptions) return [];
    let t = [];
    for (let s = e.parent; s; s = s.parent) {
      let i = s.options.filter((n) => !n.hidden);
      t.push(...i);
    }
    if (this.sortOptions) t.sort(this.compareOptions);
    return t;
  }
  visibleArguments(e) {
    if (e._argsDescription)
      e.registeredArguments.forEach((t) => {
        t.description = t.description || e._argsDescription[t.name()] || "";
      });
    if (e.registeredArguments.find((t) => t.description))
      return e.registeredArguments;
    return [];
  }
  subcommandTerm(e) {
    let t = e.registeredArguments.map((s) => et(s)).join(" ");
    return (
      e._name +
      (e._aliases[0] ? "|" + e._aliases[0] : "") +
      (e.options.length ? " [options]" : "") +
      (t ? " " + t : "")
    );
  }
  optionTerm(e) {
    return e.flags;
  }
  argumentTerm(e) {
    return e.name();
  }
  longestSubcommandTermLength(e, t) {
    return t
      .visibleCommands(e)
      .reduce(
        (s, i) =>
          Math.max(
            s,
            this.displayWidth(t.styleSubcommandTerm(t.subcommandTerm(i))),
          ),
        0,
      );
  }
  longestOptionTermLength(e, t) {
    return t
      .visibleOptions(e)
      .reduce(
        (s, i) =>
          Math.max(s, this.displayWidth(t.styleOptionTerm(t.optionTerm(i)))),
        0,
      );
  }
  longestGlobalOptionTermLength(e, t) {
    return t
      .visibleGlobalOptions(e)
      .reduce(
        (s, i) =>
          Math.max(s, this.displayWidth(t.styleOptionTerm(t.optionTerm(i)))),
        0,
      );
  }
  longestArgumentTermLength(e, t) {
    return t
      .visibleArguments(e)
      .reduce(
        (s, i) =>
          Math.max(
            s,
            this.displayWidth(t.styleArgumentTerm(t.argumentTerm(i))),
          ),
        0,
      );
  }
  commandUsage(e) {
    let t = e._name;
    if (e._aliases[0]) t = t + "|" + e._aliases[0];
    let s = "";
    for (let i = e.parent; i; i = i.parent) s = i.name() + " " + s;
    return s + t + " " + e.usage();
  }
  commandDescription(e) {
    return e.description();
  }
  subcommandDescription(e) {
    return e.summary() || e.description();
  }
  optionDescription(e) {
    let t = [];
    if (e.argChoices)
      t.push(
        `choices: ${e.argChoices.map((s) => JSON.stringify(s)).join(", ")}`,
      );
    if (e.defaultValue !== void 0) {
      if (
        e.required ||
        e.optional ||
        (e.isBoolean() && typeof e.defaultValue === "boolean")
      )
        t.push(
          `default: ${e.defaultValueDescription || JSON.stringify(e.defaultValue)}`,
        );
    }
    if (e.presetArg !== void 0 && e.optional)
      t.push(`preset: ${JSON.stringify(e.presetArg)}`);
    if (e.envVar !== void 0) t.push(`env: ${e.envVar}`);
    if (t.length > 0) {
      let s = `(${t.join(", ")})`;
      if (e.description) return `${e.description} ${s}`;
      return s;
    }
    return e.description;
  }
  argumentDescription(e) {
    let t = [];
    if (e.argChoices)
      t.push(
        `choices: ${e.argChoices.map((s) => JSON.stringify(s)).join(", ")}`,
      );
    if (e.defaultValue !== void 0)
      t.push(
        `default: ${e.defaultValueDescription || JSON.stringify(e.defaultValue)}`,
      );
    if (t.length > 0) {
      let s = `(${t.join(", ")})`;
      if (e.description) return `${e.description} ${s}`;
      return s;
    }
    return e.description;
  }
  formatItemList(e, t, s) {
    if (t.length === 0) return [];
    return [s.styleTitle(e), ...t, ""];
  }
  groupItems(e, t, s) {
    let i = new Map();
    return (
      e.forEach((n) => {
        let r = s(n);
        if (!i.has(r)) i.set(r, []);
      }),
      t.forEach((n) => {
        let r = s(n);
        if (!i.has(r)) i.set(r, []);
        i.get(r).push(n);
      }),
      i
    );
  }
  formatHelp(e, t) {
    let s = t.padWidth(e, t),
      i = t.helpWidth ?? 80;
    function n(f, u) {
      return t.formatItem(f, s, u, t);
    }
    let r = [
        `${t.styleTitle("Usage:")} ${t.styleUsage(t.commandUsage(e))}`,
        "",
      ],
      o = t.commandDescription(e);
    if (o.length > 0)
      r = r.concat([t.boxWrap(t.styleCommandDescription(o), i), ""]);
    let a = t
      .visibleArguments(e)
      .map((f) =>
        n(
          t.styleArgumentTerm(t.argumentTerm(f)),
          t.styleArgumentDescription(t.argumentDescription(f)),
        ),
      );
    if (
      ((r = r.concat(this.formatItemList("Arguments:", a, t))),
      this.groupItems(
        e.options,
        t.visibleOptions(e),
        (f) => f.helpGroupHeading ?? "Options:",
      ).forEach((f, u) => {
        let h = f.map((d) =>
          n(
            t.styleOptionTerm(t.optionTerm(d)),
            t.styleOptionDescription(t.optionDescription(d)),
          ),
        );
        r = r.concat(this.formatItemList(u, h, t));
      }),
      t.showGlobalOptions)
    ) {
      let f = t
        .visibleGlobalOptions(e)
        .map((u) =>
          n(
            t.styleOptionTerm(t.optionTerm(u)),
            t.styleOptionDescription(t.optionDescription(u)),
          ),
        );
      r = r.concat(this.formatItemList("Global Options:", f, t));
    }
    return (
      this.groupItems(
        e.commands,
        t.visibleCommands(e),
        (f) => f.helpGroup() || "Commands:",
      ).forEach((f, u) => {
        let h = f.map((d) =>
          n(
            t.styleSubcommandTerm(t.subcommandTerm(d)),
            t.styleSubcommandDescription(t.subcommandDescription(d)),
          ),
        );
        r = r.concat(this.formatItemList(u, h, t));
      }),
      r.join(`
`)
    );
  }
  displayWidth(e) {
    return vo(e).length;
  }
  styleTitle(e) {
    return e;
  }
  styleUsage(e) {
    return e
      .split(" ")
      .map((t) => {
        if (t === "[options]") return this.styleOptionText(t);
        if (t === "[command]") return this.styleSubcommandText(t);
        if (t[0] === "[" || t[0] === "<") return this.styleArgumentText(t);
        return this.styleCommandText(t);
      })
      .join(" ");
  }
  styleCommandDescription(e) {
    return this.styleDescriptionText(e);
  }
  styleOptionDescription(e) {
    return this.styleDescriptionText(e);
  }
  styleSubcommandDescription(e) {
    return this.styleDescriptionText(e);
  }
  styleArgumentDescription(e) {
    return this.styleDescriptionText(e);
  }
  styleDescriptionText(e) {
    return e;
  }
  styleOptionTerm(e) {
    return this.styleOptionText(e);
  }
  styleSubcommandTerm(e) {
    return e
      .split(" ")
      .map((t) => {
        if (t === "[options]") return this.styleOptionText(t);
        if (t[0] === "[" || t[0] === "<") return this.styleArgumentText(t);
        return this.styleSubcommandText(t);
      })
      .join(" ");
  }
  styleArgumentTerm(e) {
    return this.styleArgumentText(e);
  }
  styleOptionText(e) {
    return e;
  }
  styleArgumentText(e) {
    return e;
  }
  styleSubcommandText(e) {
    return e;
  }
  styleCommandText(e) {
    return e;
  }
  padWidth(e, t) {
    return Math.max(
      t.longestOptionTermLength(e, t),
      t.longestGlobalOptionTermLength(e, t),
      t.longestSubcommandTermLength(e, t),
      t.longestArgumentTermLength(e, t),
    );
  }
  preformatted(e) {
    return /\n[^\S\r\n]/.test(e);
  }
  formatItem(e, t, s, i) {
    let r = " ".repeat(2);
    if (!s) return r + e;
    let o = e.padEnd(t + e.length - i.displayWidth(e)),
      a = 2,
      l = (this.helpWidth ?? 80) - t - a - 2,
      f;
    if (l < this.minWidthToWrap || i.preformatted(s)) f = s;
    else
      f = i.boxWrap(s, l).replace(
        /\n/g,
        `
` + " ".repeat(t + a),
      );
    return (
      r +
      o +
      " ".repeat(a) +
      f.replace(
        /\n/g,
        `
${r}`,
      )
    );
  }
  boxWrap(e, t) {
    if (t < this.minWidthToWrap) return e;
    let s = e.split(/\r\n|\n/),
      i = /[\s]*[^\s]+/g,
      n = [];
    return (
      s.forEach((r) => {
        let o = r.match(i);
        if (o === null) {
          n.push("");
          return;
        }
        let a = [o.shift()],
          c = this.displayWidth(a[0]);
        o.forEach((l) => {
          let f = this.displayWidth(l);
          if (c + f <= t) {
            a.push(l), (c += f);
            return;
          }
          n.push(a.join(""));
          let u = l.trimStart();
          (a = [u]), (c = this.displayWidth(u));
        }),
          n.push(a.join(""));
      }),
      n.join(`
`)
    );
  }
}
class Ce {
  constructor(e, t) {
    (this.flags = e),
      (this.description = t || ""),
      (this.required = e.includes("<")),
      (this.optional = e.includes("[")),
      (this.variadic = /\p{ID_Continue}\.\.\.[>\]]$/u.test(e)),
      (this.mandatory = !1);
    let s = _o(e);
    if (
      ((this.short = s.shortFlag),
      (this.long = s.longFlag),
      (this.negate = !1),
      this.long)
    )
      this.negate = this.long.startsWith("--no-");
    (this.defaultValue = void 0),
      (this.defaultValueDescription = void 0),
      (this.presetArg = void 0),
      (this.envVar = void 0),
      (this.parseArg = void 0),
      (this.hidden = !1),
      (this.argChoices = void 0),
      (this.conflictsWith = []),
      (this.implied = void 0),
      (this.helpGroupHeading = void 0);
  }
  default(e, t) {
    return ((this.defaultValue = e), (this.defaultValueDescription = t), this);
  }
  preset(e) {
    return ((this.presetArg = e), this);
  }
  conflicts(e) {
    return ((this.conflictsWith = this.conflictsWith.concat(e)), this);
  }
  implies(e) {
    let t = e;
    if (typeof e === "string") t = { [e]: !0 };
    return ((this.implied = Object.assign(this.implied || {}, t)), this);
  }
  env(e) {
    return ((this.envVar = e), this);
  }
  argParser(e) {
    return ((this.parseArg = e), this);
  }
  makeOptionMandatory(e = !0) {
    return ((this.mandatory = !!e), this);
  }
  hideHelp(e = !0) {
    return ((this.hidden = !!e), this);
  }
  _collectValue(e, t) {
    if (t === this.defaultValue || !Array.isArray(t)) return [e];
    return (t.push(e), t);
  }
  choices(e) {
    return (
      (this.argChoices = e.slice()),
      (this.parseArg = (t, s) => {
        if (!this.argChoices.includes(t))
          throw new pe(`Allowed choices are ${this.argChoices.join(", ")}.`);
        if (this.variadic) return this._collectValue(t, s);
        return t;
      }),
      this
    );
  }
  name() {
    if (this.long) return this.long.replace(/^--/, "");
    return this.short.replace(/^-/, "");
  }
  attributeName() {
    if (this.negate) return wi(this.name().replace(/^no-/, ""));
    return wi(this.name());
  }
  helpGroup(e) {
    return ((this.helpGroupHeading = e), this);
  }
  is(e) {
    return this.short === e || this.long === e;
  }
  isBoolean() {
    return !this.required && !this.optional && !this.negate;
  }
}
class Qt {
  constructor(e) {
    (this.positiveOptions = new Map()),
      (this.negativeOptions = new Map()),
      (this.dualOptions = new Set()),
      e.forEach((t) => {
        if (t.negate) this.negativeOptions.set(t.attributeName(), t);
        else this.positiveOptions.set(t.attributeName(), t);
      }),
      this.negativeOptions.forEach((t, s) => {
        if (this.positiveOptions.has(s)) this.dualOptions.add(s);
      });
  }
  valueFromOption(e, t) {
    let s = t.attributeName();
    if (!this.dualOptions.has(s)) return !0;
    let i = this.negativeOptions.get(s).presetArg,
      n = i !== void 0 ? i : !1;
    return t.negate === (n === e);
  }
}
function wi(e) {
  return e.split("-").reduce((t, s) => t + s[0].toUpperCase() + s.slice(1));
}
function _o(e) {
  let t,
    s,
    i = /^-[^-]$/,
    n = /^--[^-]/,
    r = e.split(/[ |,]+/).concat("guard");
  if (i.test(r[0])) t = r.shift();
  if (n.test(r[0])) s = r.shift();
  if (!t && i.test(r[0])) t = r.shift();
  if (!t && n.test(r[0])) (t = s), (s = r.shift());
  if (r[0].startsWith("-")) {
    let o = r[0],
      a = `option creation failed due to '${o}' in option flags '${e}'`;
    if (/^-[^-][^-]/.test(o))
      throw Error(`${a}
- a short flag is a single dash and a single character
  - either use a single dash and a single character (for a short flag)
  - or use a double dash for a long option (and can have two, like '--ws, --workspace')`);
    if (i.test(o))
      throw Error(`${a}
- too many short flags`);
    if (n.test(o))
      throw Error(`${a}
- too many long flags`);
    throw Error(`${a}
- unrecognised flag format`);
  }
  if (t === void 0 && s === void 0)
    throw Error(`option creation failed due to no flags found in '${e}'.`);
  return { shortFlag: t, longFlag: s };
}
function Oo(e, t) {
  if (Math.abs(e.length - t.length) > 3) return Math.max(e.length, t.length);
  let s = [];
  for (let i = 0; i <= e.length; i++) s[i] = [i];
  for (let i = 0; i <= t.length; i++) s[0][i] = i;
  for (let i = 1; i <= t.length; i++)
    for (let n = 1; n <= e.length; n++) {
      let r;
      if (e[n - 1] === t[i - 1]) r = 0;
      else r = 1;
      if (
        ((s[n][i] = Math.min(
          s[n - 1][i] + 1,
          s[n][i - 1] + 1,
          s[n - 1][i - 1] + r,
        )),
        n > 1 && i > 1 && e[n - 1] === t[i - 2] && e[n - 2] === t[i - 1])
      )
        s[n][i] = Math.min(s[n][i], s[n - 2][i - 2] + 1);
    }
  return s[e.length][t.length];
}
function Xt(e, t) {
  if (!t || t.length === 0) return "";
  t = Array.from(new Set(t));
  let s = e.startsWith("--");
  if (s) (e = e.slice(2)), (t = t.map((o) => o.slice(2)));
  let i = [],
    n = 3,
    r = 0.4;
  if (
    (t.forEach((o) => {
      if (o.length <= 1) return;
      let a = Oo(e, o),
        c = Math.max(e.length, o.length);
      if ((c - a) / c > r) {
        if (a < n) (n = a), (i = [o]);
        else if (a === n) i.push(o);
      }
    }),
    i.sort((o, a) => o.localeCompare(a)),
    s)
  )
    i = i.map((o) => `--${o}`);
  if (i.length > 1)
    return `
(Did you mean one of ${i.join(", ")}?)`;
  if (i.length === 1)
    return `
(Did you mean ${i[0]}?)`;
  return "";
}
class de extends Ao {
  constructor(e) {
    super();
    (this.commands = []),
      (this.options = []),
      (this.parent = null),
      (this._allowUnknownOption = !1),
      (this._allowExcessArguments = !1),
      (this.registeredArguments = []),
      (this._args = this.registeredArguments),
      (this.args = []),
      (this.rawArgs = []),
      (this.processedArgs = []),
      (this._scriptPath = null),
      (this._name = e || ""),
      (this._optionValues = {}),
      (this._optionValueSources = {}),
      (this._storeOptionsAsProperties = !1),
      (this._actionHandler = null),
      (this._executableHandler = !1),
      (this._executableFile = null),
      (this._executableDir = null),
      (this._defaultCommandName = null),
      (this._exitCallback = null),
      (this._aliases = []),
      (this._combineFlagAndOptionalValue = !0),
      (this._description = ""),
      (this._summary = ""),
      (this._argsDescription = void 0),
      (this._enablePositionalOptions = !1),
      (this._passThroughOptions = !1),
      (this._lifeCycleHooks = {}),
      (this._showHelpAfterError = !1),
      (this._showSuggestionAfterError = !0),
      (this._savedState = null),
      (this._outputConfiguration = {
        writeOut: (t) => C.stdout.write(t),
        writeErr: (t) => C.stderr.write(t),
        outputError: (t, s) => s(t),
        getOutHelpWidth: () => (C.stdout.isTTY ? C.stdout.columns : void 0),
        getErrHelpWidth: () => (C.stderr.isTTY ? C.stderr.columns : void 0),
        getOutHasColors: () =>
          vi() ?? (C.stdout.isTTY && C.stdout.hasColors?.()),
        getErrHasColors: () =>
          vi() ?? (C.stderr.isTTY && C.stderr.hasColors?.()),
        stripColor: (t) => ko(t),
      }),
      (this._hidden = !1),
      (this._helpOption = void 0),
      (this._addImplicitHelpCommand = void 0),
      (this._helpCommand = void 0),
      (this._helpConfiguration = {}),
      (this._helpGroupHeading = void 0),
      (this._defaultCommandGroup = void 0),
      (this._defaultOptionGroup = void 0);
  }
  copyInheritedSettings(e) {
    return (
      (this._outputConfiguration = e._outputConfiguration),
      (this._helpOption = e._helpOption),
      (this._helpCommand = e._helpCommand),
      (this._helpConfiguration = e._helpConfiguration),
      (this._exitCallback = e._exitCallback),
      (this._storeOptionsAsProperties = e._storeOptionsAsProperties),
      (this._combineFlagAndOptionalValue = e._combineFlagAndOptionalValue),
      (this._allowExcessArguments = e._allowExcessArguments),
      (this._enablePositionalOptions = e._enablePositionalOptions),
      (this._showHelpAfterError = e._showHelpAfterError),
      (this._showSuggestionAfterError = e._showSuggestionAfterError),
      this
    );
  }
  _getCommandAndAncestors() {
    let e = [];
    for (let t = this; t; t = t.parent) e.push(t);
    return e;
  }
  command(e, t, s) {
    let i = t,
      n = s;
    if (typeof i === "object" && i !== null) (n = i), (i = null);
    n = n || {};
    let [, r, o] = e.match(/([^ ]+) *(.*)/),
      a = this.createCommand(r);
    if (i) a.description(i), (a._executableHandler = !0);
    if (n.isDefault) this._defaultCommandName = a._name;
    if (
      ((a._hidden = !!(n.noHelp || n.hidden)),
      (a._executableFile = n.executableFile || null),
      o)
    )
      a.arguments(o);
    if (
      (this._registerCommand(a),
      (a.parent = this),
      a.copyInheritedSettings(this),
      i)
    )
      return this;
    return a;
  }
  createCommand(e) {
    return new de(e);
  }
  createHelp() {
    return Object.assign(new tt(), this.configureHelp());
  }
  configureHelp(e) {
    if (e === void 0) return this._helpConfiguration;
    return ((this._helpConfiguration = e), this);
  }
  configureOutput(e) {
    if (e === void 0) return this._outputConfiguration;
    return (
      (this._outputConfiguration = { ...this._outputConfiguration, ...e }), this
    );
  }
  showHelpAfterError(e = !0) {
    if (typeof e !== "string") e = !!e;
    return ((this._showHelpAfterError = e), this);
  }
  showSuggestionAfterError(e = !0) {
    return ((this._showSuggestionAfterError = !!e), this);
  }
  addCommand(e, t) {
    if (!e._name)
      throw Error(`Command passed to .addCommand() must have a name
- specify the name in Command constructor or using .name()`);
    if (((t = t || {}), t.isDefault)) this._defaultCommandName = e._name;
    if (t.noHelp || t.hidden) e._hidden = !0;
    return (
      this._registerCommand(e),
      (e.parent = this),
      e._checkForBrokenPassThrough(),
      this
    );
  }
  createArgument(e, t) {
    return new Ze(e, t);
  }
  argument(e, t, s, i) {
    let n = this.createArgument(e, t);
    if (typeof s === "function") n.default(i).argParser(s);
    else n.default(s);
    return (this.addArgument(n), this);
  }
  arguments(e) {
    return (
      e
        .trim()
        .split(/ +/)
        .forEach((t) => {
          this.argument(t);
        }),
      this
    );
  }
  addArgument(e) {
    let t = this.registeredArguments.slice(-1)[0];
    if (t?.variadic)
      throw Error(`only the last argument can be variadic '${t.name()}'`);
    if (e.required && e.defaultValue !== void 0 && e.parseArg === void 0)
      throw Error(
        `a default value for a required argument is never used: '${e.name()}'`,
      );
    return (this.registeredArguments.push(e), this);
  }
  helpCommand(e, t) {
    if (typeof e === "boolean") {
      if (((this._addImplicitHelpCommand = e), e && this._defaultCommandGroup))
        this._initCommandGroup(this._getHelpCommand());
      return this;
    }
    let s = e ?? "help [command]",
      [, i, n] = s.match(/([^ ]+) *(.*)/),
      r = t ?? "display help for command",
      o = this.createCommand(i);
    if ((o.helpOption(!1), n)) o.arguments(n);
    if (r) o.description(r);
    if (((this._addImplicitHelpCommand = !0), (this._helpCommand = o), e || t))
      this._initCommandGroup(o);
    return this;
  }
  addHelpCommand(e, t) {
    if (typeof e !== "object") return (this.helpCommand(e, t), this);
    return (
      (this._addImplicitHelpCommand = !0),
      (this._helpCommand = e),
      this._initCommandGroup(e),
      this
    );
  }
  _getHelpCommand() {
    if (
      this._addImplicitHelpCommand ??
      (this.commands.length &&
        !this._actionHandler &&
        !this._findCommand("help"))
    ) {
      if (this._helpCommand === void 0) this.helpCommand(void 0, void 0);
      return this._helpCommand;
    }
    return null;
  }
  hook(e, t) {
    let s = ["preSubcommand", "preAction", "postAction"];
    if (!s.includes(e))
      throw Error(`Unexpected value for event passed to hook : '${e}'.
Expecting one of '${s.join("', '")}'`);
    if (this._lifeCycleHooks[e]) this._lifeCycleHooks[e].push(t);
    else this._lifeCycleHooks[e] = [t];
    return this;
  }
  exitOverride(e) {
    if (e) this._exitCallback = e;
    else
      this._exitCallback = (t) => {
        if (t.code !== "commander.executeSubCommandAsync") throw t;
      };
    return this;
  }
  _exit(e, t, s) {
    if (this._exitCallback) this._exitCallback(new ie(e, t, s));
    C.exit(e);
  }
  action(e) {
    let t = (s) => {
      let i = this.registeredArguments.length,
        n = s.slice(0, i);
      if (this._storeOptionsAsProperties) n[i] = this;
      else n[i] = this.opts();
      return (n.push(this), e.apply(this, n));
    };
    return ((this._actionHandler = t), this);
  }
  createOption(e, t) {
    return new Ce(e, t);
  }
  _callParseArg(e, t, s, i) {
    try {
      return e.parseArg(t, s);
    } catch (n) {
      if (n.code === "commander.invalidArgument") {
        let r = `${i} ${n.message}`;
        this.error(r, { exitCode: n.exitCode, code: n.code });
      }
      throw n;
    }
  }
  _registerOption(e) {
    let t =
      (e.short && this._findOption(e.short)) ||
      (e.long && this._findOption(e.long));
    if (t) {
      let s = e.long && this._findOption(e.long) ? e.long : e.short;
      throw Error(`Cannot add option '${e.flags}'${this._name && ` to command '${this._name}'`} due to conflicting flag '${s}'
-  already used by option '${t.flags}'`);
    }
    this._initOptionGroup(e), this.options.push(e);
  }
  _registerCommand(e) {
    let t = (i) => [i.name()].concat(i.aliases()),
      s = t(e).find((i) => this._findCommand(i));
    if (s) {
      let i = t(this._findCommand(s)).join("|"),
        n = t(e).join("|");
      throw Error(`cannot add command '${n}' as already have command '${i}'`);
    }
    this._initCommandGroup(e), this.commands.push(e);
  }
  addOption(e) {
    this._registerOption(e);
    let t = e.name(),
      s = e.attributeName();
    if (e.defaultValue !== void 0)
      this.setOptionValueWithSource(s, e.defaultValue, "default");
    let i = (n, r, o) => {
      if (n == null && e.presetArg !== void 0) n = e.presetArg;
      let a = this.getOptionValue(s);
      if (n !== null && e.parseArg) n = this._callParseArg(e, n, a, r);
      else if (n !== null && e.variadic) n = e._collectValue(n, a);
      if (n == null)
        if (e.negate) n = !1;
        else if (e.isBoolean() || e.optional) n = !0;
        else n = "";
      this.setOptionValueWithSource(s, n, o);
    };
    if (
      (this.on("option:" + t, (n) => {
        let r = `error: option '${e.flags}' argument '${n}' is invalid.`;
        i(n, r, "cli");
      }),
      e.envVar)
    )
      this.on("optionEnv:" + t, (n) => {
        let r = `error: option '${e.flags}' value '${n}' from env '${e.envVar}' is invalid.`;
        i(n, r, "env");
      });
    return this;
  }
  _optionEx(e, t, s, i, n) {
    if (typeof t === "object" && t instanceof Ce)
      throw Error(
        "To add an Option object use addOption() instead of option() or requiredOption()",
      );
    let r = this.createOption(t, s);
    if ((r.makeOptionMandatory(!!e.mandatory), typeof i === "function"))
      r.default(n).argParser(i);
    else if (i instanceof RegExp) {
      let o = i;
      (i = (a, c) => {
        let l = o.exec(a);
        return l ? l[0] : c;
      }),
        r.default(n).argParser(i);
    } else r.default(i);
    return this.addOption(r);
  }
  option(e, t, s, i) {
    return this._optionEx({}, e, t, s, i);
  }
  requiredOption(e, t, s, i) {
    return this._optionEx({ mandatory: !0 }, e, t, s, i);
  }
  combineFlagAndOptionalValue(e = !0) {
    return ((this._combineFlagAndOptionalValue = !!e), this);
  }
  allowUnknownOption(e = !0) {
    return ((this._allowUnknownOption = !!e), this);
  }
  allowExcessArguments(e = !0) {
    return ((this._allowExcessArguments = !!e), this);
  }
  enablePositionalOptions(e = !0) {
    return ((this._enablePositionalOptions = !!e), this);
  }
  passThroughOptions(e = !0) {
    return (
      (this._passThroughOptions = !!e), this._checkForBrokenPassThrough(), this
    );
  }
  _checkForBrokenPassThrough() {
    if (
      this.parent &&
      this._passThroughOptions &&
      !this.parent._enablePositionalOptions
    )
      throw Error(
        `passThroughOptions cannot be used for '${this._name}' without turning on enablePositionalOptions for parent command(s)`,
      );
  }
  storeOptionsAsProperties(e = !0) {
    if (this.options.length)
      throw Error("call .storeOptionsAsProperties() before adding options");
    if (Object.keys(this._optionValues).length)
      throw Error(
        "call .storeOptionsAsProperties() before setting option values",
      );
    return ((this._storeOptionsAsProperties = !!e), this);
  }
  getOptionValue(e) {
    if (this._storeOptionsAsProperties) return this[e];
    return this._optionValues[e];
  }
  setOptionValue(e, t) {
    return this.setOptionValueWithSource(e, t, void 0);
  }
  setOptionValueWithSource(e, t, s) {
    if (this._storeOptionsAsProperties) this[e] = t;
    else this._optionValues[e] = t;
    return ((this._optionValueSources[e] = s), this);
  }
  getOptionValueSource(e) {
    return this._optionValueSources[e];
  }
  getOptionValueSourceWithGlobals(e) {
    let t;
    return (
      this._getCommandAndAncestors().forEach((s) => {
        if (Object.hasOwn(s._optionValueSources, e))
          t = s.getOptionValueSource(e);
      }),
      t
    );
  }
  _prepareUserArgs(e, t) {
    if (e !== void 0 && !Array.isArray(e))
      throw Error("first parameter to parse must be array or undefined");
    if (((t = t || {}), e === void 0 && t.from === void 0)) {
      if (C.versions?.electron) t.from = "electron";
      let i = C.execArgv ?? [];
      if (
        i.includes("-e") ||
        i.includes("--eval") ||
        i.includes("-p") ||
        i.includes("--print")
      )
        t.from = "eval";
    }
    if (e === void 0) e = C.argv;
    this.rawArgs = e.slice();
    let s;
    switch (t.from) {
      case void 0:
      case "node":
        (this._scriptPath = e[1]), (s = e.slice(2));
        break;
      case "electron":
        if (C.defaultApp) (this._scriptPath = e[1]), (s = e.slice(2));
        else s = e.slice(1);
        break;
      case "user":
        s = e.slice(0);
        break;
      case "eval":
        s = e.slice(1);
        break;
      default:
        throw Error(`unexpected parse option { from: '${t.from}' }`);
    }
    if (!this._name && this._scriptPath)
      this.nameFromFilename(this._scriptPath);
    return ((this._name = this._name || "program"), s);
  }
  parse(e, t) {
    this._prepareForParse();
    let s = this._prepareUserArgs(e, t);
    return (this._parseCommand([], s), this);
  }
  async parseAsync(e, t) {
    this._prepareForParse();
    let s = this._prepareUserArgs(e, t);
    return (await this._parseCommand([], s), this);
  }
  _prepareForParse() {
    if (this._savedState === null)
      this.options
        .filter(
          (e) =>
            e.negate &&
            e.defaultValue === void 0 &&
            this.getOptionValue(e.attributeName()) === void 0,
        )
        .forEach((e) => {
          let t = e.long.replace(/^--no-/, "--");
          if (!this._findOption(t))
            this.setOptionValueWithSource(e.attributeName(), !0, "default");
        }),
        this.saveStateBeforeParse();
    else this.restoreStateBeforeParse();
  }
  saveStateBeforeParse() {
    this._savedState = {
      _name: this._name,
      _optionValues: { ...this._optionValues },
      _optionValueSources: { ...this._optionValueSources },
    };
  }
  restoreStateBeforeParse() {
    if (this._storeOptionsAsProperties)
      throw Error(`Can not call parse again when storeOptionsAsProperties is true.
- either make a new Command for each call to parse, or stop storing options as properties`);
    (this._name = this._savedState._name),
      (this._scriptPath = null),
      (this.rawArgs = []),
      (this._optionValues = { ...this._savedState._optionValues }),
      (this._optionValueSources = { ...this._savedState._optionValueSources }),
      (this.args = []),
      (this.processedArgs = []);
  }
  _checkForMissingExecutable(e, t, s) {
    if (st.existsSync(e)) return;
    let i = t
        ? `searched for local subcommand relative to directory '${t}'`
        : "no directory for search for local subcommand, use .executableDir() to supply a custom directory",
      n = `'${e}' does not exist
 - if '${s}' is not meant to be an executable command, remove description parameter from '.command()' and use '.description()' instead
 - if the default executable name is not suitable, use the executableFile option to supply a custom name or path
 - ${i}`;
    throw Error(n);
  }
  _executeSubCommand(e, t) {
    t = t.slice();
    let s = [".js", ".ts", ".tsx", ".mjs", ".cjs"];
    function i(l, f) {
      let u = H.resolve(l, f);
      if (st.existsSync(u)) return u;
      if (s.includes(H.extname(f))) return;
      let h = s.find((d) => st.existsSync(`${u}${d}`));
      if (h) return `${u}${h}`;
      return;
    }
    this._checkForMissingMandatoryOptions(), this._checkForConflictingOptions();
    let n = e._executableFile || `${this._name}-${e._name}`,
      r = this._executableDir || "";
    if (this._scriptPath) {
      let l;
      try {
        l = st.realpathSync(this._scriptPath);
      } catch {
        l = this._scriptPath;
      }
      r = H.resolve(H.dirname(l), r);
    }
    if (r) {
      let l = i(r, n);
      if (!l && !e._executableFile && this._scriptPath) {
        let f = H.basename(this._scriptPath, H.extname(this._scriptPath));
        if (f !== this._name) l = i(r, `${f}-${e._name}`);
      }
      n = l || n;
    }
    let o = s.includes(H.extname(n)),
      a;
    if (C.platform !== "win32")
      if (o)
        t.unshift(n),
          (t = Si(C.execArgv).concat(t)),
          (a = zt.spawn(C.argv[0], t, { stdio: "inherit" }));
      else a = zt.spawn(n, t, { stdio: "inherit" });
    else
      this._checkForMissingExecutable(n, r, e._name),
        t.unshift(n),
        (t = Si(C.execArgv).concat(t)),
        (a = zt.spawn(C.execPath, t, { stdio: "inherit" }));
    if (!a.killed)
      ["SIGUSR1", "SIGUSR2", "SIGTERM", "SIGINT", "SIGHUP"].forEach((f) => {
        C.on(f, () => {
          if (a.killed === !1 && a.exitCode === null) a.kill(f);
        });
      });
    let c = this._exitCallback;
    a.on("close", (l) => {
      if (((l = l ?? 1), !c)) C.exit(l);
      else c(new ie(l, "commander.executeSubCommandAsync", "(close)"));
    }),
      a.on("error", (l) => {
        if (l.code === "ENOENT") this._checkForMissingExecutable(n, r, e._name);
        else if (l.code === "EACCES") throw Error(`'${n}' not executable`);
        if (!c) C.exit(1);
        else {
          let f = new ie(1, "commander.executeSubCommandAsync", "(error)");
          (f.nestedError = l), c(f);
        }
      }),
      (this.runningCommand = a);
  }
  _dispatchSubcommand(e, t, s) {
    let i = this._findCommand(e);
    if (!i) this.help({ error: !0 });
    i._prepareForParse();
    let n;
    return (
      (n = this._chainOrCallSubCommandHook(n, i, "preSubcommand")),
      (n = this._chainOrCall(n, () => {
        if (i._executableHandler) this._executeSubCommand(i, t.concat(s));
        else return i._parseCommand(t, s);
      })),
      n
    );
  }
  _dispatchHelpCommand(e) {
    if (!e) this.help();
    let t = this._findCommand(e);
    if (t && !t._executableHandler) t.help();
    return this._dispatchSubcommand(
      e,
      [],
      [this._getHelpOption()?.long ?? this._getHelpOption()?.short ?? "--help"],
    );
  }
  _checkNumberOfArguments() {
    if (
      (this.registeredArguments.forEach((e, t) => {
        if (e.required && this.args[t] == null) this.missingArgument(e.name());
      }),
      this.registeredArguments.length > 0 &&
        this.registeredArguments[this.registeredArguments.length - 1].variadic)
    )
      return;
    if (this.args.length > this.registeredArguments.length)
      this._excessArguments(this.args);
  }
  _processArguments() {
    let e = (s, i, n) => {
      let r = i;
      if (i !== null && s.parseArg) {
        let o = `error: command-argument value '${i}' is invalid for argument '${s.name()}'.`;
        r = this._callParseArg(s, i, n, o);
      }
      return r;
    };
    this._checkNumberOfArguments();
    let t = [];
    this.registeredArguments.forEach((s, i) => {
      let n = s.defaultValue;
      if (s.variadic) {
        if (i < this.args.length) {
          if (((n = this.args.slice(i)), s.parseArg))
            n = n.reduce((r, o) => e(s, o, r), s.defaultValue);
        } else if (n === void 0) n = [];
      } else if (i < this.args.length) {
        if (((n = this.args[i]), s.parseArg)) n = e(s, n, s.defaultValue);
      }
      t[i] = n;
    }),
      (this.processedArgs = t);
  }
  _chainOrCall(e, t) {
    if (e?.then && typeof e.then === "function") return e.then(() => t());
    return t();
  }
  _chainOrCallHooks(e, t) {
    let s = e,
      i = [];
    if (
      (this._getCommandAndAncestors()
        .reverse()
        .filter((n) => n._lifeCycleHooks[t] !== void 0)
        .forEach((n) => {
          n._lifeCycleHooks[t].forEach((r) => {
            i.push({ hookedCommand: n, callback: r });
          });
        }),
      t === "postAction")
    )
      i.reverse();
    return (
      i.forEach((n) => {
        s = this._chainOrCall(s, () => n.callback(n.hookedCommand, this));
      }),
      s
    );
  }
  _chainOrCallSubCommandHook(e, t, s) {
    let i = e;
    if (this._lifeCycleHooks[s] !== void 0)
      this._lifeCycleHooks[s].forEach((n) => {
        i = this._chainOrCall(i, () => n(this, t));
      });
    return i;
  }
  _parseCommand(e, t) {
    let s = this.parseOptions(t);
    if (
      (this._parseOptionsEnv(),
      this._parseOptionsImplied(),
      (e = e.concat(s.operands)),
      (t = s.unknown),
      (this.args = e.concat(t)),
      e && this._findCommand(e[0]))
    )
      return this._dispatchSubcommand(e[0], e.slice(1), t);
    if (this._getHelpCommand() && e[0] === this._getHelpCommand().name())
      return this._dispatchHelpCommand(e[1]);
    if (this._defaultCommandName)
      return (
        this._outputHelpIfRequested(t),
        this._dispatchSubcommand(this._defaultCommandName, e, t)
      );
    if (
      this.commands.length &&
      this.args.length === 0 &&
      !this._actionHandler &&
      !this._defaultCommandName
    )
      this.help({ error: !0 });
    this._outputHelpIfRequested(s.unknown),
      this._checkForMissingMandatoryOptions(),
      this._checkForConflictingOptions();
    let i = () => {
        if (s.unknown.length > 0) this.unknownOption(s.unknown[0]);
      },
      n = `command:${this.name()}`;
    if (this._actionHandler) {
      i(), this._processArguments();
      let r;
      if (
        ((r = this._chainOrCallHooks(r, "preAction")),
        (r = this._chainOrCall(r, () =>
          this._actionHandler(this.processedArgs),
        )),
        this.parent)
      )
        r = this._chainOrCall(r, () => {
          this.parent.emit(n, e, t);
        });
      return ((r = this._chainOrCallHooks(r, "postAction")), r);
    }
    if (this.parent?.listenerCount(n))
      i(), this._processArguments(), this.parent.emit(n, e, t);
    else if (e.length) {
      if (this._findCommand("*")) return this._dispatchSubcommand("*", e, t);
      if (this.listenerCount("command:*")) this.emit("command:*", e, t);
      else if (this.commands.length) this.unknownCommand();
      else i(), this._processArguments();
    } else if (this.commands.length) i(), this.help({ error: !0 });
    else i(), this._processArguments();
  }
  _findCommand(e) {
    if (!e) return;
    return this.commands.find((t) => t._name === e || t._aliases.includes(e));
  }
  _findOption(e) {
    return this.options.find((t) => t.is(e));
  }
  _checkForMissingMandatoryOptions() {
    this._getCommandAndAncestors().forEach((e) => {
      e.options.forEach((t) => {
        if (t.mandatory && e.getOptionValue(t.attributeName()) === void 0)
          e.missingMandatoryOptionValue(t);
      });
    });
  }
  _checkForConflictingLocalOptions() {
    let e = this.options.filter((s) => {
      let i = s.attributeName();
      if (this.getOptionValue(i) === void 0) return !1;
      return this.getOptionValueSource(i) !== "default";
    });
    e.filter((s) => s.conflictsWith.length > 0).forEach((s) => {
      let i = e.find((n) => s.conflictsWith.includes(n.attributeName()));
      if (i) this._conflictingOption(s, i);
    });
  }
  _checkForConflictingOptions() {
    this._getCommandAndAncestors().forEach((e) => {
      e._checkForConflictingLocalOptions();
    });
  }
  parseOptions(e) {
    let t = [],
      s = [],
      i = t;
    function n(l) {
      return l.length > 1 && l[0] === "-";
    }
    let r = (l) => {
        if (!/^-(\d+|\d*\.\d+)([eE][+-]?\d+)?$/.test(l)) return !1;
        return !this._getCommandAndAncestors().some((f) =>
          f.options.map((u) => u.short).some((u) => /^-\d$/.test(u)),
        );
      },
      o = null,
      a = null,
      c = 0;
    while (c < e.length || a) {
      let l = a ?? e[c++];
      if (((a = null), l === "--")) {
        if (i === s) i.push(l);
        i.push(...e.slice(c));
        break;
      }
      if (o && (!n(l) || r(l))) {
        this.emit(`option:${o.name()}`, l);
        continue;
      }
      if (((o = null), n(l))) {
        let f = this._findOption(l);
        if (f) {
          if (f.required) {
            let u = e[c++];
            if (u === void 0) this.optionMissingArgument(f);
            this.emit(`option:${f.name()}`, u);
          } else if (f.optional) {
            let u = null;
            if (c < e.length && (!n(e[c]) || r(e[c]))) u = e[c++];
            this.emit(`option:${f.name()}`, u);
          } else this.emit(`option:${f.name()}`);
          o = f.variadic ? f : null;
          continue;
        }
      }
      if (l.length > 2 && l[0] === "-" && l[1] !== "-") {
        let f = this._findOption(`-${l[1]}`);
        if (f) {
          if (f.required || (f.optional && this._combineFlagAndOptionalValue))
            this.emit(`option:${f.name()}`, l.slice(2));
          else this.emit(`option:${f.name()}`), (a = `-${l.slice(2)}`);
          continue;
        }
      }
      if (/^--[^=]+=/.test(l)) {
        let f = l.indexOf("="),
          u = this._findOption(l.slice(0, f));
        if (u && (u.required || u.optional)) {
          this.emit(`option:${u.name()}`, l.slice(f + 1));
          continue;
        }
      }
      if (i === t && n(l) && !(this.commands.length === 0 && r(l))) i = s;
      if (
        (this._enablePositionalOptions || this._passThroughOptions) &&
        t.length === 0 &&
        s.length === 0
      ) {
        if (this._findCommand(l)) {
          t.push(l), s.push(...e.slice(c));
          break;
        } else if (
          this._getHelpCommand() &&
          l === this._getHelpCommand().name()
        ) {
          t.push(l, ...e.slice(c));
          break;
        } else if (this._defaultCommandName) {
          s.push(l, ...e.slice(c));
          break;
        }
      }
      if (this._passThroughOptions) {
        i.push(l, ...e.slice(c));
        break;
      }
      i.push(l);
    }
    return { operands: t, unknown: s };
  }
  opts() {
    if (this._storeOptionsAsProperties) {
      let e = {},
        t = this.options.length;
      for (let s = 0; s < t; s++) {
        let i = this.options[s].attributeName();
        e[i] = i === this._versionOptionName ? this._version : this[i];
      }
      return e;
    }
    return this._optionValues;
  }
  optsWithGlobals() {
    return this._getCommandAndAncestors().reduce(
      (e, t) => Object.assign(e, t.opts()),
      {},
    );
  }
  error(e, t) {
    if (
      (this._outputConfiguration.outputError(
        `${e}
`,
        this._outputConfiguration.writeErr,
      ),
      typeof this._showHelpAfterError === "string")
    )
      this._outputConfiguration.writeErr(`${this._showHelpAfterError}
`);
    else if (this._showHelpAfterError)
      this._outputConfiguration.writeErr(`
`),
        this.outputHelp({ error: !0 });
    let s = t || {},
      i = s.exitCode || 1,
      n = s.code || "commander.error";
    this._exit(i, n, e);
  }
  _parseOptionsEnv() {
    this.options.forEach((e) => {
      if (e.envVar && e.envVar in C.env) {
        let t = e.attributeName();
        if (
          this.getOptionValue(t) === void 0 ||
          ["default", "config", "env"].includes(this.getOptionValueSource(t))
        )
          if (e.required || e.optional)
            this.emit(`optionEnv:${e.name()}`, C.env[e.envVar]);
          else this.emit(`optionEnv:${e.name()}`);
      }
    });
  }
  _parseOptionsImplied() {
    let e = new Qt(this.options),
      t = (s) =>
        this.getOptionValue(s) !== void 0 &&
        !["default", "implied"].includes(this.getOptionValueSource(s));
    this.options
      .filter(
        (s) =>
          s.implied !== void 0 &&
          t(s.attributeName()) &&
          e.valueFromOption(this.getOptionValue(s.attributeName()), s),
      )
      .forEach((s) => {
        Object.keys(s.implied)
          .filter((i) => !t(i))
          .forEach((i) => {
            this.setOptionValueWithSource(i, s.implied[i], "implied");
          });
      });
  }
  missingArgument(e) {
    let t = `error: missing required argument '${e}'`;
    this.error(t, { code: "commander.missingArgument" });
  }
  optionMissingArgument(e) {
    let t = `error: option '${e.flags}' argument missing`;
    this.error(t, { code: "commander.optionMissingArgument" });
  }
  missingMandatoryOptionValue(e) {
    let t = `error: required option '${e.flags}' not specified`;
    this.error(t, { code: "commander.missingMandatoryOptionValue" });
  }
  _conflictingOption(e, t) {
    let s = (r) => {
        let o = r.attributeName(),
          a = this.getOptionValue(o),
          c = this.options.find((f) => f.negate && o === f.attributeName()),
          l = this.options.find((f) => !f.negate && o === f.attributeName());
        if (
          c &&
          ((c.presetArg === void 0 && a === !1) ||
            (c.presetArg !== void 0 && a === c.presetArg))
        )
          return c;
        return l || r;
      },
      i = (r) => {
        let o = s(r),
          a = o.attributeName();
        if (this.getOptionValueSource(a) === "env")
          return `environment variable '${o.envVar}'`;
        return `option '${o.flags}'`;
      },
      n = `error: ${i(e)} cannot be used with ${i(t)}`;
    this.error(n, { code: "commander.conflictingOption" });
  }
  unknownOption(e) {
    if (this._allowUnknownOption) return;
    let t = "";
    if (e.startsWith("--") && this._showSuggestionAfterError) {
      let i = [],
        n = this;
      do {
        let r = n
          .createHelp()
          .visibleOptions(n)
          .filter((o) => o.long)
          .map((o) => o.long);
        (i = i.concat(r)), (n = n.parent);
      } while (n && !n._enablePositionalOptions);
      t = Xt(e, i);
    }
    let s = `error: unknown option '${e}'${t}`;
    this.error(s, { code: "commander.unknownOption" });
  }
  _excessArguments(e) {
    if (this._allowExcessArguments) return;
    let t = this.registeredArguments.length,
      s = t === 1 ? "" : "s",
      i = e.length,
      n = this.parent ? ` for '${this.name()}'` : "",
      r = e.join(", "),
      o = `error: too many arguments${n}. Expected ${t} argument${s} but got ${i}: ${r}.`;
    this.error(o, { code: "commander.excessArguments" });
  }
  unknownCommand() {
    let e = this.args[0],
      t = "";
    if (this._showSuggestionAfterError) {
      let i = [];
      this.createHelp()
        .visibleCommands(this)
        .forEach((n) => {
          if ((i.push(n.name()), n.alias())) i.push(n.alias());
        }),
        (t = Xt(e, i));
    }
    let s = `error: unknown command '${e}'${t}`;
    this.error(s, { code: "commander.unknownCommand" });
  }
  version(e, t, s) {
    if (e === void 0) return this._version;
    (this._version = e),
      (t = t || "-V, --version"),
      (s = s || "output the version number");
    let i = this.createOption(t, s);
    return (
      (this._versionOptionName = i.attributeName()),
      this._registerOption(i),
      this.on("option:" + i.name(), () => {
        this._outputConfiguration.writeOut(`${e}
`),
          this._exit(0, "commander.version", e);
      }),
      this
    );
  }
  description(e, t) {
    if (e === void 0 && t === void 0) return this._description;
    if (((this._description = e), t)) this._argsDescription = t;
    return this;
  }
  summary(e) {
    if (e === void 0) return this._summary;
    return ((this._summary = e), this);
  }
  alias(e) {
    if (e === void 0) return this._aliases[0];
    let t = this;
    if (
      this.commands.length !== 0 &&
      this.commands[this.commands.length - 1]._executableHandler
    )
      t = this.commands[this.commands.length - 1];
    if (e === t._name)
      throw Error("Command alias can't be the same as its name");
    let s = this.parent?._findCommand(e);
    if (s) {
      let i = [s.name()].concat(s.aliases()).join("|");
      throw Error(
        `cannot add alias '${e}' to command '${this.name()}' as already have command '${i}'`,
      );
    }
    return (t._aliases.push(e), this);
  }
  aliases(e) {
    if (e === void 0) return this._aliases;
    return (e.forEach((t) => this.alias(t)), this);
  }
  usage(e) {
    if (e === void 0) {
      if (this._usage) return this._usage;
      let t = this.registeredArguments.map((s) => et(s));
      return []
        .concat(
          this.options.length || this._helpOption !== null ? "[options]" : [],
          this.commands.length ? "[command]" : [],
          this.registeredArguments.length ? t : [],
        )
        .join(" ");
    }
    return ((this._usage = e), this);
  }
  name(e) {
    if (e === void 0) return this._name;
    return ((this._name = e), this);
  }
  helpGroup(e) {
    if (e === void 0) return this._helpGroupHeading ?? "";
    return ((this._helpGroupHeading = e), this);
  }
  commandsGroup(e) {
    if (e === void 0) return this._defaultCommandGroup ?? "";
    return ((this._defaultCommandGroup = e), this);
  }
  optionsGroup(e) {
    if (e === void 0) return this._defaultOptionGroup ?? "";
    return ((this._defaultOptionGroup = e), this);
  }
  _initOptionGroup(e) {
    if (this._defaultOptionGroup && !e.helpGroupHeading)
      e.helpGroup(this._defaultOptionGroup);
  }
  _initCommandGroup(e) {
    if (this._defaultCommandGroup && !e.helpGroup())
      e.helpGroup(this._defaultCommandGroup);
  }
  nameFromFilename(e) {
    return ((this._name = H.basename(e, H.extname(e))), this);
  }
  executableDir(e) {
    if (e === void 0) return this._executableDir;
    return ((this._executableDir = e), this);
  }
  helpInformation(e) {
    let t = this.createHelp(),
      s = this._getOutputContext(e);
    t.prepareContext({
      error: s.error,
      helpWidth: s.helpWidth,
      outputHasColors: s.hasColors,
    });
    let i = t.formatHelp(this, t);
    if (s.hasColors) return i;
    return this._outputConfiguration.stripColor(i);
  }
  _getOutputContext(e) {
    e = e || {};
    let t = !!e.error,
      s,
      i,
      n;
    if (t)
      (s = (o) => this._outputConfiguration.writeErr(o)),
        (i = this._outputConfiguration.getErrHasColors()),
        (n = this._outputConfiguration.getErrHelpWidth());
    else
      (s = (o) => this._outputConfiguration.writeOut(o)),
        (i = this._outputConfiguration.getOutHasColors()),
        (n = this._outputConfiguration.getOutHelpWidth());
    return {
      error: t,
      write: (o) => {
        if (!i) o = this._outputConfiguration.stripColor(o);
        return s(o);
      },
      hasColors: i,
      helpWidth: n,
    };
  }
  outputHelp(e) {
    let t;
    if (typeof e === "function") (t = e), (e = void 0);
    let s = this._getOutputContext(e),
      i = { error: s.error, write: s.write, command: this };
    this._getCommandAndAncestors()
      .reverse()
      .forEach((r) => r.emit("beforeAllHelp", i)),
      this.emit("beforeHelp", i);
    let n = this.helpInformation({ error: s.error });
    if (t) {
      if (((n = t(n)), typeof n !== "string" && !Buffer.isBuffer(n)))
        throw Error("outputHelp callback must return a string or a Buffer");
    }
    if ((s.write(n), this._getHelpOption()?.long))
      this.emit(this._getHelpOption().long);
    this.emit("afterHelp", i),
      this._getCommandAndAncestors().forEach((r) => r.emit("afterAllHelp", i));
  }
  helpOption(e, t) {
    if (typeof e === "boolean") {
      if (e) {
        if (this._helpOption === null) this._helpOption = void 0;
        if (this._defaultOptionGroup)
          this._initOptionGroup(this._getHelpOption());
      } else this._helpOption = null;
      return this;
    }
    if (
      ((this._helpOption = this.createOption(
        e ?? "-h, --help",
        t ?? "display help for command",
      )),
      e || t)
    )
      this._initOptionGroup(this._helpOption);
    return this;
  }
  _getHelpOption() {
    if (this._helpOption === void 0) this.helpOption(void 0, void 0);
    return this._helpOption;
  }
  addHelpOption(e) {
    return ((this._helpOption = e), this._initOptionGroup(e), this);
  }
  help(e) {
    this.outputHelp(e);
    let t = Number(C.exitCode ?? 0);
    if (t === 0 && e && typeof e !== "function" && e.error) t = 1;
    this._exit(t, "commander.help", "(outputHelp)");
  }
  addHelpText(e, t) {
    let s = ["beforeAll", "before", "after", "afterAll"];
    if (!s.includes(e))
      throw Error(`Unexpected value for position to addHelpText.
Expecting one of '${s.join("', '")}'`);
    let i = `${e}Help`;
    return (
      this.on(i, (n) => {
        let r;
        if (typeof t === "function")
          r = t({ error: n.error, command: n.command });
        else r = t;
        if (r)
          n.write(`${r}
`);
      }),
      this
    );
  }
  _outputHelpIfRequested(e) {
    let t = this._getHelpOption();
    if (t && e.find((i) => t.is(i)))
      this.outputHelp(),
        this._exit(0, "commander.helpDisplayed", "(outputHelp)");
  }
}
function Si(e) {
  return e.map((t) => {
    if (!t.startsWith("--inspect")) return t;
    let s,
      i = "127.0.0.1",
      n = "9229",
      r;
    if ((r = t.match(/^(--inspect(-brk|-wait)?)$/)) !== null) s = r[1];
    else if (
      (r = t.match(/^(--inspect(-brk|-port|-wait)?)=(\[[^\]]+\]|[^:]+)$/)) !==
      null
    )
      if (((s = r[1]), /^\d+$/.test(r[3]))) n = r[3];
      else i = r[3];
    else if (
      (r = t.match(
        /^(--inspect(-brk|-port|-wait)?)=(\[[^\]]+\]|[^:]+):(\d+)$/,
      )) !== null
    )
      (s = r[1]), (i = r[3]), (n = r[4]);
    if (s && n !== "0") return `${s}=${i}:${parseInt(n) + 1}`;
    return t;
  });
}
function vi() {
  if (
    C.env.NO_COLOR ||
    C.env.FORCE_COLOR === "0" ||
    C.env.FORCE_COLOR === "false"
  )
    return !1;
  if (C.env.FORCE_COLOR || C.env.CLICOLOR_FORCE !== void 0) return !0;
  return;
}
var hg = new de();
var Fd = Xs(),
  Bd = Re(),
  jd = Ps(),
  ci = He(),
  Vd = qe(),
  se = k(),
  Kd = X(),
  Rd = N(),
  Hd = Z(),
  Ud = ee(),
  Wd = Vt(),
  Gd = oi(),
  Yd = ai(),
  Jd = li(),
  Ut = Tr(),
  Lr = Ee();
var $r = Fd.Composer,
  xr = Bd.Document,
  Ir = jd.Schema,
  { YAMLError: Pr, YAMLParseError: Mr, YAMLWarning: Dr } = ci,
  Fr = Vd.Alias,
  {
    isAlias: Br,
    isCollection: jr,
    isDocument: Vr,
    isMap: Kr,
    isNode: Rr,
    isPair: Hr,
    isScalar: Ur,
    isSeq: Wr,
  } = se,
  Gr = Kd.Pair,
  Yr = Rd.Scalar,
  Jr = Hd.YAMLMap,
  Qr = Ud.YAMLSeq,
  Xr = Wd,
  zr = Gd.Lexer,
  Zr = Yd.LineCounter,
  eo = Jd.Parser,
  { parse: to, parseAllDocuments: so, parseDocument: io, stringify: no } = Ut,
  { visit: ro, visitAsync: oo } = Lr;
var ao = 64,
  lo = 1024,
  co = 500,
  uo = new Set([
    "name",
    "description",
    "license",
    "allowed-tools",
    "metadata",
    "compatibility",
  ]),
  Xe = class extends Error {},
  fe = class extends Error {};
function im(e) {
  if (!e || typeof e !== "object" || Array.isArray(e)) return;
  return Object.fromEntries(
    Object.entries(e).map(([t, s]) => [String(t), String(s)]),
  );
}
function nm(e) {
  return {
    license: typeof e.license === "string" ? e.license : void 0,
    compatibility:
      typeof e.compatibility === "string" ? e.compatibility : void 0,
    allowedTools:
      typeof e["allowed-tools"] === "string" ? e["allowed-tools"] : void 0,
    metadata: im(e.metadata),
  };
}
function rm(e, t) {
  let { metadata: s, body: i } = gi(e),
    n = { ...s, name: t };
  return `---
${Wt.stringify(n).trimEnd()}
---

${i}
`;
}
function mi(e) {
  for (let t of ["SKILL.md", "skill.md"]) {
    let s = x(e, t);
    if (R(s)) return s;
  }
}
function po(e) {
  let t = P(e),
    s = mi(t);
  if (!s) throw new Xe(`SKILL.md not found in ${t}`);
  return { skillFile: s, content: hi(s, "utf8") };
}
function gi(e) {
  if (!e.startsWith("---"))
    throw new Xe("SKILL.md must start with YAML frontmatter (---)");
  let t = e.split("---", 3);
  if (t.length < 3)
    throw new Xe("SKILL.md frontmatter not properly closed with ---");
  let s = t[1] ?? "",
    i = (t[2] ?? "").trim(),
    n;
  try {
    n = Wt.parse(s);
  } catch (o) {
    throw new Xe(
      `Invalid YAML in frontmatter: ${o instanceof Error ? o.message : String(o)}`,
    );
  }
  if (!n || typeof n !== "object" || Array.isArray(n))
    throw new Xe("SKILL.md frontmatter must be a YAML mapping");
  let r = { ...n };
  if (
    r.metadata &&
    typeof r.metadata === "object" &&
    !Array.isArray(r.metadata)
  )
    r.metadata = Object.fromEntries(
      Object.entries(r.metadata).map(([o, a]) => [String(o), String(a)]),
    );
  return { metadata: r, body: i };
}
function fo(e) {
  let t = P(e),
    { skillFile: s, content: i } = po(t),
    { metadata: n, body: r } = gi(i);
  if (!("name" in n))
    throw new fe("Missing required field in frontmatter: name");
  if (!("description" in n))
    throw new fe("Missing required field in frontmatter: description");
  if (typeof n.name !== "string" || !n.name.trim())
    throw new fe("Field 'name' must be a non-empty string");
  if (typeof n.description !== "string" || !n.description.trim())
    throw new fe("Field 'description' must be a non-empty string");
  if (n.license !== void 0 && typeof n.license !== "string")
    throw new fe("Field 'license' must be a string");
  if (n.compatibility !== void 0 && typeof n.compatibility !== "string")
    throw new fe("Field 'compatibility' must be a string");
  if (n["allowed-tools"] !== void 0 && typeof n["allowed-tools"] !== "string")
    throw new fe("Field 'allowed-tools' must be a string");
  let o = nm(n);
  return {
    name: n.name.trim(),
    description: n.description.trim(),
    ...o,
    rawMetadata: n,
    skillDir: t,
    skillFile: s,
    body: r,
  };
}
function om(e) {
  return e.normalize("NFKC").trim();
}
function am(e, t) {
  if (typeof e !== "string" || !e.trim())
    return ["Field 'name' must be a non-empty string"];
  let s = om(e),
    i = [];
  if (s.length > ao)
    i.push(
      `Skill name '${s}' exceeds ${ao} character limit (${s.length} chars)`,
    );
  if (s !== s.toLowerCase()) i.push(`Skill name '${s}' must be lowercase`);
  if (s.startsWith("-") || s.endsWith("-"))
    i.push("Skill name cannot start or end with a hyphen");
  if (s.includes("--")) i.push("Skill name cannot contain consecutive hyphens");
  if (![...s].every((n) => /[\p{L}\p{N}-]/u.test(n)))
    i.push(
      `Skill name '${s}' contains invalid characters. Only letters, digits, and hyphens are allowed.`,
    );
  if (Gt(t).normalize("NFKC") !== s)
    i.push(`Directory name '${Gt(t)}' must match skill name '${s}'`);
  return i;
}
function lm(e) {
  if (typeof e !== "string" || !e.trim())
    return ["Field 'description' must be a non-empty string"];
  if (e.length > lo)
    return [`Description exceeds ${lo} character limit (${e.length} chars)`];
  return [];
}
function cm(e) {
  if (typeof e !== "string") return ["Field 'compatibility' must be a string"];
  if (e.length > co)
    return [`Compatibility exceeds ${co} character limit (${e.length} chars)`];
  return [];
}
function Jt(e) {
  let t = P(e);
  if (!R(t)) return [`Path does not exist: ${t}`];
  if (!em(t).isDirectory()) return [`Not a directory: ${t}`];
  let s = mi(t);
  if (!s) return ["Missing required file: SKILL.md"];
  let i;
  try {
    ({ metadata: i } = gi(hi(s, "utf8")));
  } catch (o) {
    return [o instanceof Error ? o.message : String(o)];
  }
  let n = [],
    r = Object.keys(i).filter((o) => !uo.has(o));
  if (r.length > 0)
    n.push(
      `Unexpected fields in frontmatter: ${r.sort().join(", ")}. Only ${JSON.stringify([...uo].sort())} are allowed.`,
    );
  if (!("name" in i)) n.push("Missing required field in frontmatter: name");
  else n.push(...am(i.name, t));
  if (!("description" in i))
    n.push("Missing required field in frontmatter: description");
  else n.push(...lm(i.description));
  if ("compatibility" in i) n.push(...cm(i.compatibility));
  return n;
}
function um(e, t) {
  let s = Jt(e);
  if (!t) return s;
  return s.filter(
    (i) =>
      !i.startsWith("Directory name '") || !i.includes("must match skill name"),
  );
}
var yi = process.cwd(),
  fm = P(yi, "packages/agents/src/skills"),
  hm = ".agents/skills",
  pm = `---
name: {{SKILL_NAME}}
description: TODO describe when to use this skill and what it does.
---

# {{TITLE}}

Describe the workflow, key steps, and any guardrails here.
`,
  dm = `- description: '{{SKILL_NAME}} helps with its intended workflow'
  vars:
    skill_path: {{SKILL_PATH}}
    task: |
      TODO replace with a realistic user request that should trigger this skill.
    required_paths:
      summary: true
      recommended_actions: true
      guardrails: true
      references: true
    array_min_lengths:
      recommended_actions: 2
      guardrails: 1
      references: 1
`;
function Yt(e) {
  if (!/^[a-z0-9][a-z0-9-]*$/.test(e))
    throw Error(
      `Invalid skill name: ${e}. Use lowercase letters, numbers, and dashes only.`,
    );
}
function mm(e) {
  return e
    .split("-")
    .filter(Boolean)
    .map((t) => t[0]?.toUpperCase() + t.slice(1))
    .join(" ");
}
function Qe(e) {
  return e ? P(e) : fm;
}
function gm(e) {
  let t = P(e);
  while (!0) {
    let s = x(t, "package.json");
    if (R(s))
      try {
        let n = JSON.parse(hi(s, "utf8"));
        if (Array.isArray(n.workspaces)) return t;
      } catch {}
    let i = pi(t);
    if (i === t) return e;
    t = i;
  }
}
function ym(e) {
  return e ? P(e) : gm(yi);
}
function mo(e) {
  let t = di(yi, e);
  if (!t || t === "") return ".";
  if (t.startsWith("..")) return e;
  return t;
}
function bm(e) {
  return !P(e).startsWith("/");
}
function wm(e, t) {
  let s = t ?? hm;
  if (t && !bm(t)) return P(t);
  return P(e, s);
}
function go(e) {
  return mo(e);
}
function ui(e) {
  return mo(e);
}
function K(e) {
  zd(e, { recursive: !0 });
}
function Sm(e) {
  if (!R(e)) return [];
  return Zd(e)
    .filter((t) => mi(x(e, t)) !== void 0)
    .sort((t, s) => t.localeCompare(s));
}
function vm(e, t, s) {
  Yt(t), K(e);
  let i = x(e, t),
    n = x(i, "SKILL.md"),
    r = x(i, "evals", `${t}.yaml`);
  if (R(i) && !s) throw Error(`Skill directory already exists: ${ui(i)}`);
  K(i),
    K(x(i, "references")),
    K(x(i, "scripts")),
    K(x(i, "assets")),
    K(x(i, "evals"));
  let o = pm.replaceAll("{{SKILL_NAME}}", t).replaceAll("{{TITLE}}", mm(t)),
    a = dm
      .replaceAll("{{SKILL_NAME}}", t)
      .replaceAll(
        "{{SKILL_PATH}}",
        JSON.stringify(`src/skills/${di(e, i).replaceAll("\\", "/")}/SKILL.md`),
      );
  if (R(n) && !s) throw Error(`Refusing to overwrite existing file: ${ui(n)}`);
  if (R(r) && !s) throw Error(`Refusing to overwrite existing file: ${ui(r)}`);
  fi(n, o, "utf8"),
    fi(r, a, "utf8"),
    console.log(`Created skill scaffold at ${go(i)}`);
}
function yo(e, t, s) {
  if (R(t)) {
    if (!s) throw Error(`Destination already exists: ${t}`);
    ho(t, { recursive: !0, force: !0 });
  }
  K(pi(t)),
    Qd(e, t, {
      recursive: !0,
      dereference: !1,
      errorOnExist: !1,
      filter(i) {
        let n = di(e, i);
        if (!n) return !0;
        if (n === ".git") return !1;
        return !n.split(/[\\/]/).includes(".git");
      },
    });
}
function _m(e, t, s) {
  if (R(t) || Om(t)) {
    if (!s) throw Error(`Destination already exists: ${t}`);
    ho(t, { recursive: !0, force: !0 });
  }
  K(pi(t)), tm(e, t, "junction");
}
function Om(e) {
  try {
    return (Xd(e), !0);
  } catch {
    return !1;
  }
}
function Am(e, t) {
  let { skillFile: s, content: i } = po(e);
  fi(s, rm(i, t));
}
function km(e, t, s, i, n, r) {
  Yt(t);
  let o = x(e, t),
    a = Jt(o);
  if (a.length > 0) throw Error(`Skill is invalid: ${a.join("; ")}`);
  let c = wm(ym(s), i);
  K(c);
  let l = x(c, Gt(o));
  Tm(o, l, n, r), console.log(xm(t, l, n));
}
function Cm(e, t, s, i, n) {
  let r = P(t),
    o = um(r, s !== void 0);
  if (o.length > 0)
    throw Error(`Skill not valid at import path: ${o.join("; ")}`);
  let a = s ?? Gt(r);
  if ((Yt(a), i)) Yt(i);
  K(e);
  let c = x(e, a);
  yo(r, c, n);
  let l = i ?? s;
  if (l) Am(c, l);
  let f = Jt(c);
  if (f.length > 0) throw Error(`Imported skill is invalid: ${f.join("; ")}`);
  console.log(`Imported ${a} to ${c}`);
}
function Em(e, t) {
  if (e.includes("/") || e.includes("\\") || R(e)) return P(e);
  return x(t, e);
}
function Nm(e, t) {
  let s = Em(e, t),
    i = Jt(s);
  if (i.length > 0) {
    console.error(`Validation failed for ${s}:`);
    for (let n of i) console.error(`  - ${n}`);
    process.exitCode = 1;
    return;
  }
  console.log(`Valid skill: ${s}`);
}
function qm(e, t) {
  let s = Sm(e);
  if (t) {
    let i = s.map((n) => {
      let r = fo(x(e, n));
      return { name: n, path: x(e, n), description: r.description };
    });
    console.log(JSON.stringify(i, null, 2));
    return;
  }
  if (s.length === 0) {
    console.log(`No skills found in ${e}`);
    return;
  }
  for (let [i, n] of s.entries()) {
    let r = fo(x(e, n));
    if ((console.log(n), console.log(`  ${r.description}`), i < s.length - 1))
      console.log("");
  }
}
function Tm(e, t, s, i) {
  if (s) {
    yo(e, t, i);
    return;
  }
  _m(e, t, i);
}
function Lm(e) {
  return e ? "Copied" : "Installed";
}
function $m() {
  return "Install a skill into a local .agents/skills directory by symlink (default) or by copying.";
}
function xm(e, t, s) {
  return `${Lm(s)} ${e} to ${go(t)}`;
}
function Im() {
  return "Copy the skill directory instead of creating a symlink.";
}
function Pm(e, t, s, i) {
  km(e, t, s, i.dest, i.copy === !0, i.force === !0);
}
function Mm() {
  let e = new de();
  return (
    e
      .name("manage-skills")
      .description("Manage local skill definitions.")
      .showHelpAfterError()
      .helpCommand(!1),
    e
      .command("list")
      .description("Show available skills in this repo.")
      .option("--source <dir>", "Override the repo skills source directory.")
      .option("--json", "Emit machine-readable JSON for list.")
      .action((t) => {
        qm(Qe(t.source), t.json === !0);
      }),
    e
      .command("validate")
      .description("Validate a skill by name or path.")
      .argument("<skill>")
      .option("--source <dir>", "Override the repo skills source directory.")
      .action((t, s) => {
        Nm(t, Qe(s.source));
      }),
    e
      .command("new")
      .description(
        "Scaffold a new skill with SKILL.md and common subdirectories.",
      )
      .argument("<name>")
      .option("--source <dir>", "Override the repo skills source directory.")
      .option(
        "--force",
        "Overwrite existing files/directories when applicable.",
      )
      .action((t, s) => {
        vm(Qe(s.source), t, s.force === !0);
      }),
    e
      .command("install")
      .description($m())
      .argument("<name>")
      .argument("[target]")
      .option("--source <dir>", "Override the repo skills source directory.")
      .option(
        "--dest <path>",
        "Override install destination relative to the target repo.",
      )
      .option("--copy", Im())
      .option(
        "--force",
        "Overwrite existing files/directories when applicable.",
      )
      .action((t, s, i) => {
        Pm(Qe(i.source), t, s, i);
      }),
    e
      .command("import")
      .description(
        "Copy an external skill directory into this repo's source directory.",
      )
      .argument("<path>")
      .argument("[name]")
      .option("--source <dir>", "Override the repo skills source directory.")
      .option(
        "--override-name <name>",
        "Override the imported skill frontmatter name.",
      )
      .option(
        "--force",
        "Overwrite existing files/directories when applicable.",
      )
      .action((t, s, i) => {
        Cm(Qe(i.source), t, s, i.overrideName, i.force === !0);
      }),
    e
  );
}
async function Dm(e) {
  await Mm().parseAsync(e);
}
if (process.argv[1] && import.meta.url === sm(P(process.argv[1])).href)
  Dm(process.argv).catch((e) => {
    let t = e instanceof Error ? e.message : String(e);
    console.error(t), (process.exitCode = 1);
  });
export { Mm as buildProgram, Dm as main };
