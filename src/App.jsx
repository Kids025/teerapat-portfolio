import { createContext, useContext, useState, useEffect, useRef, useCallback } from "react";
import {
  Sun, Moon, Monitor, Palette, RotateCcw, Menu, X, ChevronLeft, ChevronRight, ArrowUpRight, ArrowDown,
  ArrowUp, Play, Copy, Check, Download, Image as ImageIcon, Youtube, Facebook, Instagram, Mail, Music2,
} from "lucide-react";
import {
  site, person, links, ui, accents, sections as S, categories, projects, videos, photoGroups, photos,
  beforeAfter, channels, skills, tools, education, about,
} from "./content.js";

/* ============================ helpers ============================ */
const Ctx = createContext(null);
const useL = () => useContext(Ctx);
const tr = (v, l) => (v == null ? "" : typeof v === "string" ? v : v[l] || v.en || v.th || v.zh || "");
const reduced = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
const LANGS = [["th", "TH"], ["en", "EN"], ["zh", "中文"]];
const LANG_ATTR = { th: "th", en: "en", zh: "zh-Hans" };
const scrollToId = (id) => document.getElementById(id)?.scrollIntoView({ behavior: reduced() ? "auto" : "smooth" });
const ytId = (u) => (String(u || "").match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{11})/) || [])[1] || "";
const ytThumb = (u) => (ytId(u) ? `https://i.ytimg.com/vi/${ytId(u)}/hqdefault.jpg` : "");
const ytEmbed = (u) => `https://www.youtube-nocookie.com/embed/${ytId(u)}?autoplay=1&rel=0`;
const mediaThumb = (m) => (m.type === "image" ? m.src : m.type === "video" ? m.poster : ytThumb(m.src));

function usePref(key, def, valid) {
  const [v, setV] = useState(() => {
    try { const s = localStorage.getItem(key); return valid.includes(s) ? s : def; } catch { return def; }
  });
  const set = useCallback((x) => {
    setV(x == null ? def : x);
    try { x == null ? localStorage.removeItem(key) : localStorage.setItem(key, x); } catch {}
  }, [key, def]);
  return [v, set];
}

/* ---------- reveal on scroll (IntersectionObserver) ---------- */
let io;
const getIO = () => (io ||= new IntersectionObserver((es) => es.forEach((e) => {
  if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
}), { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }));

function R({ as: T = "div", className = "", delay = 0, style, children, ...p }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    if (!("IntersectionObserver" in window)) { el.classList.add("in"); return; }
    getIO().observe(el);
    return () => io && io.unobserve(el);
  }, []);
  return <T ref={ref} className={`rv ${className}`} style={{ "--d": `${delay}ms`, ...style }} {...p}>{children}</T>;
}

/* ---------- image with graceful fallback ---------- */
function Img({ src, alt = "", className = "", eager, ...p }) {
  const [bad, setBad] = useState(false);
  useEffect(() => setBad(false), [src]);
  if (!src || bad) return <div className={`ph ${className}`} role="img" aria-label={alt}><ImageIcon size={30} strokeWidth={1.2} /></div>;
  return <img src={src} alt={alt} className={className} loading={eager ? "eager" : "lazy"} decoding="async" onError={() => setBad(true)} {...p} />;
}

/* ============== section + background-photo system ============== */
function Bg({ bg, mode, eager }) {
  const [bad, setBad] = useState(false);
  const px = useRef(null);
  useEffect(() => setBad(false), [bg.src]);
  useEffect(() => {
    if (!bg.parallax || reduced()) return;
    const el = px.current; if (!el) return;
    let raf = 0;
    const run = () => {
      raf = 0;
      const r = el.parentElement.getBoundingClientRect();
      el.style.setProperty("--py", ((r.top + r.height / 2 - innerHeight / 2) * -0.07).toFixed(1) + "px");
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(run); };
    run(); addEventListener("scroll", on, { passive: true }); addEventListener("resize", on);
    return () => { removeEventListener("scroll", on); removeEventListener("resize", on); cancelAnimationFrame(raf); };
  }, [bg.parallax]);
  const pos = bg.position || "center";
  const style = {
    "--pos": pos, "--pos-m": bg.mobilePosition || pos,
    "--op": bg.opacity ?? (mode === "faded" ? 0.3 : 1),
    "--ov": bg.overlay ?? (mode === "overlay" ? 0.5 : 0),
  };
  return (
    <div className="bgl" style={style} aria-hidden="true">
      <div className={`bgp${bg.parallax ? " px" : ""}`} ref={px}>
        {bg.src && !bad ? (
          <picture>
            {bg.mobileSrc && <source media="(max-width: 700px)" srcSet={bg.mobileSrc} />}
            <img src={bg.src} alt="" className={bg.zoom ? "zoom" : ""} loading={eager ? "eager" : "lazy"}
              fetchpriority={eager ? "high" : undefined} decoding="async" onError={() => setBad(true)} />
          </picture>
        ) : (<div className="ph"><ImageIcon size={36} strokeWidth={1} /></div>)}
      </div>
      <div className="bgo" />
    </div>
  );
}

function Section({ id, className = "", eager, children }) {
  const cfg = S[id]; const bg = cfg.background || {}; const mode = bg.mode || "none";
  const tone = bg.tone || (mode === "cover" || mode === "overlay" ? "light" : "auto");
  const el = mode === "none" ? null : <Bg bg={bg} mode={mode} eager={eager} />;
  return (
    <section id={id} className={`sec m-${mode} tone-${tone} s-${bg.side || "right"} al-${bg.align || "left"} ${cfg.alt ? "alt" : ""} ${className}`}>
      {mode === "split"
        ? <div className="split"><figure className="split-fig">{el}</figure><div className="split-body">{children}</div></div>
        : <>{el}<div className="sec-in">{children}</div></>}
    </section>
  );
}

function Head({ id }) {
  const { t } = useL(); const c = S[id];
  return (
    <div className="head">
      {c.eyebrow && <R as="p" className="eyebrow">{t(c.eyebrow)}</R>}
      <R as="h2" className="h2" delay={70}>{t(c.title)}</R>
      {c.text && <R as="p" className="lead" delay={140}>{t(c.text)}</R>}
    </div>
  );
}

/* ============================ nav + controls ============================ */
function Controls({ P }) {
  const { u, t } = useL();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return;
    const f = (e) => { if (!ref.current?.contains(e.target)) setOpen(false); };
    const k = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", f); document.addEventListener("keydown", k);
    return () => { document.removeEventListener("pointerdown", f); document.removeEventListener("keydown", k); };
  }, [open]);
  const themes = [["light", Sun, "themeLight"], ["dark", Moon, "themeDark"], ["system", Monitor, "themeSystem"]];
  return (
    <div className="ctl">
      <div className="seg" role="group" aria-label={u("language")}>
        {LANGS.map(([k, l]) => <button key={k} lang={LANG_ATTR[k]} aria-pressed={P.lang === k} onClick={() => P.setLang(k)}>{l}</button>)}
      </div>
      <div className="seg" role="group" aria-label={u("theme")}>
        {themes.map(([k, I, n]) => (
          <button key={k} aria-pressed={P.theme === k} aria-label={u(n)} title={u(n)} onClick={() => P.setTheme(k)}><I size={15} /></button>
        ))}
      </div>
      <div className="acc" ref={ref}>
        <button className="icon" aria-label={u("accent")} aria-expanded={open} onClick={() => setOpen(!open)}><Palette size={17} /></button>
        {open && (
          <div className="acc-pop" role="group" aria-label={u("accent")}>
            {accents.map((a) => (
              <button key={a.id} className="dot" style={{ background: a.color }} aria-pressed={P.accent === a.id}
                aria-label={t(a.label)} title={t(a.label)} onClick={() => P.setAccent(a.id)} />
            ))}
            <button className="icon" aria-label={u("reset")} title={u("reset")} onClick={P.resetAccent}><RotateCcw size={15} /></button>
          </div>
        )}
      </div>
    </div>
  );
}

function Nav({ P, items, onDark }) {
  const { u, t } = useL();
  const [sc, setSc] = useState(false);
  const [menu, setMenu] = useState(false);
  const [active, setActive] = useState("");
  useEffect(() => {
    const f = () => setSc(scrollY > 40); f();
    addEventListener("scroll", f, { passive: true });
    return () => removeEventListener("scroll", f);
  }, []);
  useEffect(() => {
    const o = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && setActive(e.target.id)), { rootMargin: "-45% 0px -50% 0px" });
    items.forEach((i) => { const el = document.getElementById(i.id); el && o.observe(el); });
    return () => o.disconnect();
  }, [items.map((i) => i.id).join()]);
  const go = (e, id) => { e.preventDefault(); setMenu(false); scrollToId(id); };
  const solid = sc || menu;
  return (
    <>
      <header className={`nav${solid ? " sc" : ""}${!solid && onDark ? " dk" : ""}`}>
        <div className="nav-in">
          <a href="#top" className="logo" onClick={(e) => { e.preventDefault(); setMenu(false); scrollTo({ top: 0, behavior: reduced() ? "auto" : "smooth" }); }}>{person.brand}</a>
          <nav className="nav-links" aria-label="Main">
            {items.map((i) => <a key={i.id} href={`#${i.id}`} className={active === i.id ? "on" : ""} onClick={(e) => go(e, i.id)}>{t(i.label)}</a>)}
          </nav>
          <div className="nav-ctl"><Controls P={P} /></div>
          <button className="icon burger" aria-label={u("menu")} aria-expanded={menu} onClick={() => setMenu(!menu)}>{menu ? <X size={22} /> : <Menu size={22} />}</button>
        </div>
      </header>
      <div className={`mnav${menu ? " open" : ""}`}>
        {items.map((i) => <a key={i.id} href={`#${i.id}`} onClick={(e) => go(e, i.id)}>{t(i.label)}</a>)}
        <Controls P={P} />
      </div>
    </>
  );
}

/* ============================ overlays ============================ */
function Overlay({ className, onClose, blocked, label, children }) {
  const [on, setOn] = useState(false);
  const closing = useRef(false);
  const close = useCallback(() => {
    if (closing.current) return;
    closing.current = true; setOn(false);
    setTimeout(onClose, reduced() ? 0 : 320);
  }, [onClose]);
  useEffect(() => {
    const prev = document.activeElement;
    const id = setTimeout(() => setOn(true), 20);
    return () => { clearTimeout(id); prev && prev.focus && prev.focus(); };
  }, []);
  useEffect(() => {
    const k = (e) => { if (!blocked && e.key === "Escape") { e.preventDefault(); close(); } };
    addEventListener("keydown", k);
    return () => removeEventListener("keydown", k);
  }, [blocked, close]);
  return <div className={`ov ${className}${on ? " on" : ""}`} role="dialog" aria-modal="true" aria-label={label}>{children(close)}</div>;
}

function Viewer({ items, start, onClose }) {
  const { t, u } = useL();
  const [i, setI] = useState(start);
  const [err, setErr] = useState(false);
  const videoRef = useRef(null);
  const x0 = useRef(null);
  const n = items.length, it = items[i];
  const go = useCallback((d) => setI((v) => (v + d + n) % n), [n]);
  useEffect(() => setErr(false), [i]);
  useEffect(() => {
    const k = (e) => { if (e.key === "ArrowRight") go(1); if (e.key === "ArrowLeft") go(-1); };
    addEventListener("keydown", k); return () => removeEventListener("keydown", k);
  }, [go]);
  useEffect(() => {
    const video = videoRef.current;
    if (!video || it.type !== "video") return;

    const safePlay = () => {
      video.volume = 1;
      video.muted = false;
      video.play().catch(() => {
        video.muted = true;
      });
    };

    safePlay();
  }, [i, it.type]);
  const cap = t(it.caption) || t(it.alt);
  return (
    <Overlay className="vw" onClose={onClose} label={cap || "Viewer"}>
      {(close) => (
        <>
          <div className="vw-top">
            <span>{i + 1} / {n}</span>
            <button className="icon" autoFocus onClick={close} aria-label={u("close")}><X size={24} /></button>
          </div>
          <div className="vw-stage" onTouchStart={(e) => (x0.current = e.touches[0].clientX)}
            onTouchEnd={(e) => { if (x0.current == null) return; const d = e.changedTouches[0].clientX - x0.current; if (Math.abs(d) > 50 && n > 1) go(d < 0 ? 1 : -1); x0.current = null; }}>
            {n > 1 && <button className="vw-nav l" onClick={() => go(-1)} aria-label={u("prev")}><ChevronLeft size={30} /></button>}
            <div className="vw-media" key={i}>
              {it.type === "image" && <Img src={it.src} alt={cap} eager />}
              {it.type === "video" && (err ? <p className="miss">{u("missingMedia")}</p>
                : <video ref={videoRef} src={it.src} poster={it.poster} controls playsInline preload="metadata" onLoadedData={() => {
                    const video = videoRef.current;
                    if (!video) return;
                    video.volume = 1;
                    video.muted = false;
                  }} onError={() => setErr(true)} />)}
              {it.type === "youtube" && <iframe src={ytEmbed(it.src)} title={cap || "YouTube"} allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen />}
            </div>
            {n > 1 && <button className="vw-nav r" onClick={() => go(1)} aria-label={u("next")}><ChevronRight size={30} /></button>}
          </div>
          <p className="vw-cap">{cap}</p>
        </>
      )}
    </Overlay>
  );
}

function ProjectModal({ id, ids, onChange, onClose, openViewer, blocked }) {
  const { t, u } = useL();
  const ref = useRef(null);
  const p = projects.find((x) => x.id === id);
  const idx = ids.indexOf(id), n = ids.length;
  const step = useCallback((d) => onChange(ids[(idx + d + n) % n]), [ids, idx, n, onChange]);
  useEffect(() => { ref.current && ref.current.scrollTo({ top: 0 }); }, [id]);
  useEffect(() => {
    if (blocked || n < 2) return;
    const k = (e) => { if (e.key === "ArrowRight") step(1); if (e.key === "ArrowLeft") step(-1); };
    addEventListener("keydown", k); return () => removeEventListener("keydown", k);
  }, [blocked, n, step]);
  if (!p) return null;
  const cat = t(categories.find((c) => c.id === p.category)?.label) || p.category;
  return (
    <Overlay className="pm" onClose={onClose} blocked={blocked} label={t(p.title)}>
      {(close) => (
        <div className="pm-panel" ref={ref}>
          <div className="pm-bar">
            <span className="pm-count">{n > 1 ? `${idx + 1} / ${n}` : ""}</span>
            <div className="pm-btns">
              {n > 1 && <button className="icon" onClick={() => step(-1)} aria-label={u("prev")}><ChevronLeft size={22} /></button>}
              {n > 1 && <button className="icon" onClick={() => step(1)} aria-label={u("next")}><ChevronRight size={22} /></button>}
              <button className="icon" autoFocus onClick={close} aria-label={u("close")}><X size={22} /></button>
            </div>
          </div>
          <div className="pm-in">
            <p className="eyebrow">{cat} · {p.year}{p.sample ? ` · ${u("sample")}` : ""}</p>
            <h2 className="h2">{t(p.title)}</h2>
            <p className="lead">{t(p.description)}</p>
            {p.tools?.length > 0 && <div className="chips" aria-label={u("tools")}>{p.tools.map((x) => <span className="chip" key={x}>{x}</span>)}</div>}
            <div className="pm-gal">
              {p.media.map((m, k) => (
                <button key={k} className={`pm-it hv mfill${k === 0 ? " first" : ""}`} onClick={() => openViewer(p.media, k)}
                  aria-label={t(m.caption) || t(m.alt) || u("fullscreen")}>
                  <Img src={mediaThumb(m)} alt={t(m.alt) || t(m.caption)} />
                  {m.type !== "image" && <span className="play"><Play size={26} fill="currentColor" /></span>}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </Overlay>
  );
}

/* ============================ sections ============================ */
function Hero() {
  const { t, u } = useL(); const H = S.hero;
  return (
    <Section id="hero" className="hero" eager>
      <div className="hero-in">
        <p className="eyebrow rise" style={{ "--d": "100ms" }}>{u("role")}</p>
        <h1 className="brand" aria-label={person.brand}>
          {[...person.brand].map((c, i) => <span key={i} aria-hidden="true" style={{ "--i": i }}>{c}</span>)}
        </h1>
        <p className="hero-hl rise" style={{ "--d": "800ms" }}>{t(H.headline)}</p>
        <p className="lead rise" style={{ "--d": "950ms" }}>{t(H.intro)}</p>
        <div className="acts rise" style={{ "--d": "1100ms" }}>
          <a className="btn" href={`#${H.ctaTarget || "projects"}`} onClick={(e) => { e.preventDefault(); scrollToId(H.ctaTarget || "projects"); }}>
            {u("explore")} <ArrowDown size={18} />
          </a>
        </div>
      </div>
      <div className="scrl" aria-hidden="true"><span>{u("scroll")}</span><i /></div>
    </Section>
  );
}

function About({ openViewer }) {
  const { t, u } = useL();
  const ed = education[0];
  const items = about.photos.map((p) => ({ type: "image", src: p.src, alt: p.alt }));
  const facts = ed ? [["school", ed.school], ["department", ed.department], ["year", ed.level]] : [];
  return (
    <Section id="about">
      <Head id="about" />
      <R className="names" delay={80}>
        <p className="nm-th">{person.nameTh}</p>
        <p className="nm-en">{person.nameEn}</p>
      </R>
      <R as="p" className="body" delay={120}>{t(about.body)}</R>
      <R as="dl" className="facts" delay={160}>
        {facts.map(([k, v]) => <div key={k}><dt>{u(k)}</dt><dd>{t(v)}</dd></div>)}
      </R>
      <div className="chips">
        {skills.filter((s) => s.group === "primary").map((s, i) => <span className="chip" key={i}>{t(s.name)}</span>)}
      </div>
      {about.photos.length > 0 && (
        <div className="astrip full">
          {about.photos.map((p, i) => (
            <R key={i} as="button" delay={i * 90} className="astrip-i hv mfill" onClick={() => openViewer(items, i)} aria-label={`${u("fullscreen")}: ${t(p.alt)}`}>
              <Img src={p.src} alt={t(p.alt)} />
            </R>
          ))}
        </div>
      )}
    </Section>
  );
}

function Projects({ open }) {
  const { t, u } = useL();
  const [cat, setCat] = useState("all");
  const cats = categories.filter((c) => projects.some((p) => p.category === c.id));
  const list = projects.filter((p) => cat === "all" || p.category === cat);
  const ids = list.map((p) => p.id);
  return (
    <Section id="projects">
      <Head id="projects" />
      {cats.length > 1 && (
        <div className="flt" role="group" aria-label={t(S.projects.title)}>
          <button aria-pressed={cat === "all"} onClick={() => setCat("all")}>{u("all")}</button>
          {cats.map((c) => <button key={c.id} aria-pressed={cat === c.id} onClick={() => setCat(c.id)}>{t(c.label)}</button>)}
        </div>
      )}
      <div className="pgrid">
        {list.map((p, i) => <Card key={p.id} p={p} lg={i === 0 && list.length % 2 === 1} onOpen={() => open(p.id, ids)} />)}
      </div>
    </Section>
  );
}

function Card({ p, lg, onOpen }) {
  const { t, u } = useL();
  const cover = p.cover || p.media.map(mediaThumb).find(Boolean) || "";
  const cat = t(categories.find((c) => c.id === p.category)?.label) || p.category;
  const move = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
  };
  return (
    <R as="button" className={`pc hv${lg ? " lg" : ""}`} onClick={onOpen} onMouseMove={move}>
      <div className="mfill"><Img src={cover} alt={t(p.title)} /></div>
      <div className="pc-shade" />
      {p.sample && <span className="badge">{u("sample")}</span>}
      <div className="pc-txt">
        <span className="pc-meta">{cat} · {p.year}</span>
        <h3>{t(p.title)}</h3>
        <p>{t(p.description)}</p>
        <span className="pc-more">{u("viewProject")} <ArrowUpRight size={16} /></span>
      </div>
    </R>
  );
}

function Videos({ openViewer }) {
  const { t, u } = useL();
  const items = videos.map((v) => (v.youtube ? { type: "youtube", src: v.youtube, caption: v.title } : { type: "video", src: v.src, poster: v.thumb, caption: v.title }));
  return (
    <Section id="video">
      <Head id="video" />
      <div className="vgrid">
        {videos.map((v, i) => (
          <R key={v.id} as="button" className={`vc hv${i === 0 && videos.length % 2 === 1 ? " lg" : ""}`} onClick={() => openViewer(items, i)} aria-label={`${u("play")}: ${t(v.title)}`}>
            <div className="vc-img mfill">
              <Img src={v.thumb || ytThumb(v.youtube)} alt={t(v.title)} />
              <span className="play"><Play size={28} fill="currentColor" /></span>
              {v.sample && <span className="badge">{u("sample")}</span>}
            </div>
            <h3>{t(v.title)}</h3>
            <p>{t(v.description)}</p>
          </R>
        ))}
      </div>
    </Section>
  );
}

function Compare() {
  const { u } = useL();
  const [v, setV] = useState(50);
  return (
    <R className="cmp">
      <h3 className="h3">{u("compareTitle")}</h3>
      <div className="cmp-box" style={{ "--v": `${v}%` }}>
        <div className="mfill"><Img src={beforeAfter.after} alt={u("after")} /></div>
        <div className="cmp-b mfill"><Img src={beforeAfter.before} alt={u("before")} /></div>
        <span className="cmp-l l">{u("before")}</span><span className="cmp-l r">{u("after")}</span>
        <div className="cmp-bar" />
        <input type="range" min="0" max="100" value={v} onChange={(e) => setV(+e.target.value)} aria-label={u("compareHint")} />
      </div>
    </R>
  );
}

function Photos({ openViewer }) {
  const { t, u } = useL();
  const [g, setG] = useState("all");
  const list = photos.filter((p) => g === "all" || p.group === g);
  const items = list.map((p) => ({ type: "image", src: p.src, alt: p.alt, caption: p.caption }));
  const gs = photoGroups.filter((x) => photos.some((p) => p.group === x.id));
  return (
    <Section id="photo">
      <Head id="photo" />
      {gs.length > 1 && (
        <div className="flt" role="group" aria-label={t(S.photo.title)}>
          <button aria-pressed={g === "all"} onClick={() => setG("all")}>{u("all")}</button>
          {gs.map((x) => <button key={x.id} aria-pressed={g === x.id} onClick={() => setG(x.id)}>{t(x.label)}</button>)}
        </div>
      )}
      <div className="pg">
        {list.map((p, i) => (
          <R key={p.src + i} as="button" className={`pg-i hv mfill l-${p.layout || "std"}`} onClick={() => openViewer(items, i)} aria-label={`${u("fullscreen")}: ${t(p.alt)}`}>
            <Img src={p.src} alt={t(p.alt)} />
          </R>
        ))}
      </div>
      {beforeAfter.before && beforeAfter.after && <Compare />}
    </Section>
  );
}

function Channels() {
  const { t, u } = useL();
  return (
    <Section id="youtube">
      <Head id="youtube" />
      <div className="ygrid">
        {channels.map((c, i) => (
          <R key={c.id} className="yc" delay={i * 90}>
            <div className="yc-img mfill"><Img src={c.thumb} alt={c.name} /></div>
            <div className="yc-b">
              <h3>{c.name}</h3>
              <p>{t(c.description)}</p>
              <a className="btn" href={c.url} target="_blank" rel="noopener noreferrer"><Youtube size={18} /> {u("openChannel")} <ArrowUpRight size={16} /></a>
            </div>
          </R>
        ))}
      </div>
    </Section>
  );
}

function Skills() {
  const { t, u } = useL();
  const prim = skills.filter((s) => s.group === "primary");
  const more = skills.filter((s) => s.group !== "primary");
  return (
    <Section id="skills">
      <Head id="skills" />
      <R as="h3" className="h3">{u("skillsPrimary")}</R>
      <ul className="sk-big">
        {prim.map((s, i) => (
          <R as="li" key={i} delay={i * 70}>
            <span className="sk-name">{t(s.name)}</span>
            {s.note && <span className="sk-note">{t(s.note)}</span>}
          </R>
        ))}
      </ul>
      {more.length > 0 && (
        <R className="sk-more">
          <h3 className="h3">{u("skillsMore")}</h3>
          <div className="chips">
            {more.map((s, i) => (
              <span className="chip" key={i}>{t(s.name)}{s.level === "beginner" && <em> · {u("levelBeginner")}</em>}</span>
            ))}
          </div>
        </R>
      )}
      {tools.length > 0 && (
        <R className="sk-more">
          <h3 className="h3">{u("toolsTitle")}</h3>
          <div className="chips">{tools.map((x) => <span className="chip" key={x}>{x}</span>)}</div>
        </R>
      )}
      <div id="education" className="edu">
        <R as="h3" className="h3">{u("educationTitle")}</R>
        {education.map((e, i) => (
          <R key={i} className="edu-i">
            <p className="edu-s">{t(e.school)}</p>
            <p className="edu-d">{t(e.department)} · {t(e.level)}</p>
          </R>
        ))}
      </div>
    </Section>
  );
}

function Contact() {
  const { u } = useL();
  const [copied, setCopied] = useState(false);
  const rows = [
    [Youtube, links.youtube, u("youtube")], [Music2, links.youtubeMusic, u("youtubeMusic")],
    [Facebook, links.facebook, "Facebook"], [Instagram, links.instagram, "Instagram"],
  ].filter((r) => r[1]);
  const copy = async () => {
    try { await navigator.clipboard.writeText(links.email); }
    catch { const ta = document.createElement("textarea"); ta.value = links.email; document.body.appendChild(ta); ta.select(); document.execCommand("copy"); ta.remove(); }
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };
  return (
    <Section id="contact">
      <Head id="contact" />
      <div className="cl-list">
        {rows.map(([I, href, label], i) => (
          <R key={label} as="a" className="cl" delay={i * 60} href={href} target="_blank" rel="noopener noreferrer">
            <span><I size={26} /> {label}</span><ArrowUpRight size={24} />
          </R>
        ))}
        {links.email && (
          <R className="cl cl-mail">
            <a href={`mailto:${links.email}`}><Mail size={26} /> {links.email}</a>
            <button className="btn ghost" onClick={copy}>{copied ? <Check size={16} /> : <Copy size={16} />} {copied ? u("copied") : u("copyEmail")}</button>
          </R>
        )}
      </div>
      {links.resume && (
        <div className="acts rs"><a className="btn" href={links.resume} download><Download size={18} /> {u("downloadResume")}</a></div>
      )}
      <p className="sr" aria-live="polite">{copied ? u("copied") : ""}</p>
    </Section>
  );
}

function Footer() {
  const { u } = useL();
  const [show, setShow] = useState(false);
  useEffect(() => {
    const f = () => setShow(scrollY > 800); f();
    addEventListener("scroll", f, { passive: true }); return () => removeEventListener("scroll", f);
  }, []);
  return (
    <>
      <footer className="ft"><span>© {new Date().getFullYear()} {person.nameEn}</span><span>{u("footer")}</span></footer>
      <button className={`top${show ? " show" : ""}`} aria-label={u("backToTop")} title={u("backToTop")}
        onClick={() => scrollTo({ top: 0, behavior: reduced() ? "auto" : "smooth" })}><ArrowUp size={20} /></button>
    </>
  );
}

/* ============================ app ============================ */
export default function App() {
  const D = site.defaults;
  const [lang, setLang] = usePref("tp-lang", D.lang, ["th", "en", "zh"]);
  const [theme, setThemeRaw] = usePref("tp-theme", D.theme, ["light", "dark", "system"]);
  const [accent, setAccent] = usePref("tp-accent", D.accent, accents.map((a) => a.id));
  const [modal, setModal] = useState(null); // { id, ids }
  const [viewer, setViewer] = useState(null); // { items, start }

  const t = useCallback((v) => tr(v, lang), [lang]);
  const u = useCallback((k) => tr(ui[k], lang) || k, [lang]);

  const setTheme = (x) => {
    const r = document.documentElement;
    r.classList.add("theming"); setThemeRaw(x); setTimeout(() => r.classList.remove("theming"), 500);
  };

  useEffect(() => {
    const r = document.documentElement, mq = matchMedia("(prefers-color-scheme: dark)");
    const apply = () => { r.dataset.theme = theme === "dark" || (theme === "system" && mq.matches) ? "dark" : "light"; };
    apply(); mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, [theme]);
  useEffect(() => { document.documentElement.dataset.accent = accent; }, [accent]);
  useEffect(() => {
    document.documentElement.lang = LANG_ATTR[lang];
    const ti = tr(site.title, lang), de = tr(site.description, lang);
    document.title = ti;
    const m = (s, a, v) => document.querySelector(s)?.setAttribute(a, v);
    m('meta[name="description"]', "content", de);
    m('meta[property="og:title"]', "content", ti);
    m('meta[property="og:description"]', "content", de);
    m('meta[property="og:image"]', "content", site.ogImage);
    m('link[rel="icon"]', "href", site.favicon);
  }, [lang]);
  useEffect(() => { document.body.style.overflow = modal || viewer ? "hidden" : ""; }, [modal, viewer]);

  const vis = (id) => S[id] && S[id].visible !== false;
  const openViewer = useCallback((items, start) => setViewer({ items, start }), []);
  const openProject = useCallback((id, ids) => setModal({ id, ids }), []);
  const P = { lang, setLang, theme, setTheme, accent, setAccent, resetAccent: () => setAccent(null) };

  const items = site.order.filter((id) => vis(id) && S[id].nav).map((id) => ({ id, label: S[id].nav }));
  const hb = S.hero.background || {};
  const heroTone = hb.tone || (hb.mode === "cover" || hb.mode === "overlay" ? "light" : "auto");
  const view = {
    hero: <Hero />, about: <About openViewer={openViewer} />, projects: <Projects open={openProject} />,
    video: <Videos openViewer={openViewer} />, photo: <Photos openViewer={openViewer} />,
    youtube: <Channels />, skills: <Skills />, contact: <Contact />,
  };

  return (
    <Ctx.Provider value={{ lang, t, u }}>
      <Nav P={P} items={items} onDark={vis("hero") && heroTone === "light"} />
      <main id="top">{site.order.filter(vis).map((id) => <span key={id} className="slot" style={{ display: "contents" }}>{view[id]}</span>)}</main>
      <Footer />
      {modal && <ProjectModal id={modal.id} ids={modal.ids} blocked={!!viewer} onChange={(id) => setModal({ ...modal, id })} onClose={() => setModal(null)} openViewer={openViewer} />}
      {viewer && <Viewer items={viewer.items} start={viewer.start} onClose={() => setViewer(null)} />}
    </Ctx.Provider>
  );
}
