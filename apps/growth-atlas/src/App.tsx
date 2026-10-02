import { useState, useEffect, useMemo, useRef } from "react";
import { Dialog } from "@base-ui/react/dialog";
import { Tabs } from "@base-ui/react/tabs";
import { Accordion } from "@base-ui/react/accordion";
import {
  Search,
  Bookmark,
  Grid2X2,
  List,
  SlidersHorizontal,
  X,
  Monitor,
  Smartphone,
  RotateCcw,
  Copy,
  Check,
  Download,
  BookOpen,
  Layers,
  Menu,
  Code2,
  Link2,
  Route,
  Library,
  Info,
  FileText,
} from "lucide-react";
import {
  patterns,
  categories,
  brief,
  evidence,
  journeys,
  resolvePattern,
  type CuratedPattern,
  type Evidence,
} from "./curation";
import JourneyView, { PatternPreview } from "./JourneyView";
import Thumbnail from "./Thumbnail";
import { Pick, copyText, download } from "./ui";
import { implementationFiles, usageCode } from "./implementation";
const savedKey = "growth-atlas:saved:v1";
function initialSaved(): number[] {
  try {
    const data = JSON.parse(localStorage.getItem(savedKey) || "[]");
    return Array.isArray(data)
      ? [
          ...new Set(
            data
              .map((x) => resolvePattern(x)?.id)
              .filter((x): x is number => !!x),
          ),
        ]
      : [];
  } catch {
    return [];
  }
}
function route() {
  const [type, ...parts] = location.hash.replace(/^#/, "").split("/");
  return { type, value: parts.join("/") };
}
function fromHash() {
  const r = route();
  return r.type === "pattern" ? resolvePattern(r.value) : null;
}
function SourceCard({ source }: { source: Evidence }) {
  return (
    <article className="source-card">
      <div className="source-heading">
        <span className="product-monogram">{source.product[0]}</span>
        <div>
          <strong>{source.product}</strong>
          <small>
            {source.evidenceType} · Reviewed {source.checkedAt}
          </small>
        </div>
      </div>
      <a href={source.url} target="_blank" rel="noreferrer">
        {source.title}
        <Link2 size={14} />
      </a>
      <p>{source.observed}</p>
      <div className="source-limit">
        <span>EVIDENCE LIMIT</span>
        {source.limits}
      </div>
    </article>
  );
}
export default function App() {
  const initialRoute = route();
  const [section, setSection] = useState(
      initialRoute.type === "journey"
        ? "journeys"
        : initialRoute.type === "sources"
          ? "sources"
          : "patterns",
    ),
    [category, setCategory] = useState("All stages"),
    [query, setQuery] = useState(""),
    [format, setFormat] = useState("All formats"),
    [persona, setPersona] = useState("All roles"),
    [model, setModel] = useState("All models"),
    [view, setView] = useState("grid"),
    [saved, setSaved] = useState(initialSaved),
    [selected, setSelected] = useState<CuratedPattern | null>(fromHash),
    [activeJourney, setActiveJourney] = useState(
      initialRoute.type === "journey" ? initialRoute.value : "",
    ),
    [mobile, setMobile] = useState(false),
    [revision, setRevision] = useState(0),
    [toast, setToast] = useState(""),
    [menu, setMenu] = useState(false),
    [about, setAbout] = useState(false),
    [sort, setSort] = useState("Lifecycle order"),
    [filterOpen, setFilterOpen] = useState(false),
    [tab, setTab] = useState("demo"),
    [codeFile, setCodeFile] = useState("Usage");
  const searchRef = useRef<HTMLInputElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const productCount = new Set(evidence.map((s) => s.product)).size;
  const filtered = useMemo(
    () =>
      patterns
        .filter(
          (p) =>
            (category === "All stages" || p.category === category) &&
            (section !== "saved" || saved.includes(p.id)) &&
            (format === "All formats" || p.format === format) &&
            (persona === "All roles" || p.persona === persona) &&
            (model === "All models" || p.models.includes(model)) &&
            `${p.title} ${p.job} ${p.trigger} ${p.category} ${p.description} ${p.metric} ${p.variants.join(" ")} ${p.sources.map((s) => s.product).join(" ")}`
              .toLowerCase()
              .includes(query.toLowerCase()),
        )
        .sort((a, b) =>
          sort === "A–Z" ? a.title.localeCompare(b.title) : a.id - b.id,
        ),
    [category, query, format, persona, model, section, saved, sort],
  );
  useEffect(() => {
    const fn = () => {
      const r = route();
      setSelected(fromHash());
      if (r.type === "journey") {
        setSection("journeys");
        setActiveJourney(r.value);
      } else if (r.type === "sources") {
        setSection("sources");
        setActiveJourney("");
      } else if (r.type === "journeys") {
        setSection("journeys");
        setActiveJourney("");
      } else if (r.type === "saved") {
        setSection("saved");
        setActiveJourney("");
      } else if (r.type !== "pattern") {
        setSection("patterns");
        setActiveJourney("");
      }
      setRevision(0);
      setTab("demo");
    };
    window.addEventListener("hashchange", fn);
    window.addEventListener("popstate", fn);
    return () => {
      window.removeEventListener("hashchange", fn);
      window.removeEventListener("popstate", fn);
    };
  }, []);
  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if (
        ((e.metaKey || e.ctrlKey) && e.key === "k") ||
        (e.key === "/" &&
          !["INPUT", "TEXTAREA", "SELECT"].includes(
            (e.target as HTMLElement).tagName,
          ) &&
          !selected)
      ) {
        e.preventDefault();
        setSection("patterns");
        setActiveJourney("");
        setTimeout(() => searchRef.current?.focus(), 0);
      }
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [selected]);
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 4500);
    return () => clearTimeout(t);
  }, [toast]);
  function save(id: number) {
    const updated = saved.includes(id)
      ? saved.filter((x) => x !== id)
      : [...saved, id];
    setSaved(updated);
    try {
      localStorage.setItem(savedKey, JSON.stringify(updated));
      setToast(
        updated.includes(id)
          ? "Saved to your reference shelf"
          : "Removed from saved patterns",
      );
    } catch {
      setToast("Saved for this session. Browser storage is unavailable.");
    }
  }
  function open(p: CuratedPattern) {
    returnFocus.current = document.activeElement as HTMLElement;
    setSelected(p);
    setTab("demo");
    setCodeFile("Usage");
    setRevision(0);
    history.pushState(null, "", `#pattern/${p.slug}`);
  }
  function close() {
    setSelected(null);
    history.replaceState(
      null,
      "",
      activeJourney ? `#journey/${activeJourney}` : `#${section}`,
    );
    setTimeout(() => returnFocus.current?.focus(), 0);
  }
  function navigate(next: string) {
    setSection(next);
    setActiveJourney("");
    setMenu(false);
    setQuery("");
    history.pushState(null, "", `#${next}`);
    window.scrollTo({ top: 0 });
  }
  function chooseCategory(name: string) {
    setCategory(name);
    setSection("patterns");
    setActiveJourney("");
    setMenu(false);
    history.replaceState(null, "", "#patterns");
  }
  function resetFilters() {
    setCategory("All stages");
    setQuery("");
    setFormat("All formats");
    setPersona("All roles");
    setModel("All models");
  }
  function openJourney(id: string) {
    setSection("journeys");
    setActiveJourney(id);
    history.pushState(null, "", `#journey/${id}`);
    window.scrollTo({ top: 0 });
  }
  useEffect(() => {
    const context = (
      document as Document & {
        modelContext?: { registerTool: (t: unknown, o: unknown) => unknown };
      }
    ).modelContext;
    if (!context?.registerTool) return;
    const abort = new AbortController();
    const tools = [
      {
        name: "search_growth_patterns",
        description:
          "Search documented growth patterns and show matching results in the visible library.",
        inputSchema: {
          type: "object",
          properties: { query: { type: "string" } },
          required: ["query"],
          additionalProperties: false,
        },
        annotations: { readOnlyHint: false },
        execute: (input: unknown) => {
          const q = (input as { query?: unknown })?.query;
          if (typeof q !== "string") throw new Error("query must be a string");
          resetFilters();
          setSection("patterns");
          setActiveJourney("");
          setQuery(q);
          return patterns
            .filter((p) =>
              `${p.title} ${p.job} ${p.description}`
                .toLowerCase()
                .includes(q.toLowerCase()),
            )
            .map(({ id, title, job }) => ({ id, title, job }));
        },
      },
      {
        name: "open_growth_pattern",
        description:
          "Open a pattern for inspection. No demo action is completed.",
        inputSchema: {
          type: "object",
          properties: { id: { type: "integer" } },
          required: ["id"],
          additionalProperties: false,
        },
        annotations: { readOnlyHint: false },
        execute: (input: unknown) => {
          const id = (input as { id?: unknown })?.id;
          if (typeof id !== "number") throw new Error("id must be a number");
          const p = resolvePattern(id);
          if (!p) throw new Error("Pattern not in the curated collection");
          open(p);
          return { id: p.id, title: p.title, status: "opened" };
        },
      },
    ];
    for (const tool of tools) {
      try {
        Promise.resolve(
          context.registerTool(tool, { signal: abort.signal }),
        ).catch(() => {});
      } catch {}
    }
    return () => abort.abort();
  }, []);
  const sidebar = (
    <>
      <a
        className="brand"
        href="#patterns"
        onClick={(e) => {
          e.preventDefault();
          navigate("patterns");
          resetFilters();
        }}
      >
        <span className="brand-mark">
          <i />
          <i />
          <i />
        </span>
        <span>
          Growth Atlas
          <span className="brand-caption">THE WORKING REFERENCE</span>
        </span>
      </a>
      <div className="sidebar-section">
        <span className="nav-label">YOUR REFERENCE LIBRARY</span>
        {[
          {
            id: "patterns",
            label: "Patterns",
            icon: Grid2X2,
            count: patterns.length,
          },
          {
            id: "journeys",
            label: "Connected journeys",
            icon: Route,
            count: journeys.length,
          },
          {
            id: "sources",
            label: "Product evidence",
            icon: BookOpen,
            count: productCount,
          },
          {
            id: "saved",
            label: "Saved patterns",
            icon: Bookmark,
            count: saved.length,
          },
        ].map((x) => (
          <button
            key={x.id}
            className={`nav-item ${section === x.id ? "active" : ""}`}
            onClick={() => navigate(x.id)}
          >
            <x.icon size={17} />
            {x.label}
            <span>{x.count}</span>
          </button>
        ))}
      </div>
      <div className="sidebar-section lifecycle">
        <span className="nav-label">CUSTOMER LIFECYCLE</span>
        <button
          className={`nav-item ${section === "patterns" && category === "All stages" ? "active" : ""}`}
          onClick={() => chooseCategory("All stages")}
        >
          All stages<span>{patterns.length}</span>
        </button>
        {categories
          .filter((c) => patterns.some((p) => p.category === c.name))
          .map((c) => (
            <button
              key={c.name}
              className={`nav-item ${section === "patterns" && category === c.name ? "active" : ""}`}
              onClick={() => chooseCategory(c.name)}
            >
              {c.name}
              <span>
                {patterns.filter((p) => p.category === c.name).length}
              </span>
            </button>
          ))}
      </div>
      <div className="sidebar-bottom">
        <div className="sidebar-note">
          <p>
            Documented examples.
            <br />
            <strong>Decisions you can adapt.</strong>
          </p>
          <span>Original grayscale demos built with Base UI.</span>
        </div>
        <button
          className="about-link"
          onClick={() => {
            setAbout(true);
            setMenu(false);
          }}
        >
          <Info size={16} />
          How to use this library
        </button>
        <div className="sidebar-footer">
          <span>Research edition</span>
          <span>02 OCT 2026</span>
        </div>
      </div>
    </>
  );
  const journey = journeys.find((x) => x.id === activeJourney);
  const selectedIndex = selected
    ? patterns.findIndex((p) => p.id === selected.id)
    : -1;
  return (
    <>
      <a className="skip-link" href="#content">
        Skip to the collection
      </a>
      <aside className="sidebar">{sidebar}</aside>
      <header className="mobile-header">
        <a
          href="#patterns"
          className="mobile-brand"
          onClick={(e) => {
            e.preventDefault();
            navigate("patterns");
          }}
        >
          <span className="brand-mark">
            <i />
            <i />
            <i />
          </span>
          Growth Atlas
        </a>
        <button
          className="icon-button"
          onClick={() => setMenu(true)}
          aria-label="Open navigation"
        >
          <Menu size={22} />
        </button>
      </header>
      <Dialog.Root open={menu} onOpenChange={setMenu}>
        <Dialog.Portal>
          <Dialog.Backdrop className="modal-backdrop" />
          <Dialog.Popup className="mobile-nav">
            <Dialog.Title className="sr-only">Library navigation</Dialog.Title>
            <Dialog.Close
              className="icon-button nav-close"
              aria-label="Close navigation"
            >
              <X size={20} />
            </Dialog.Close>
            {sidebar}
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>
      <main className="main research-edition" id="content">
        <div className="topbar">
          <span>A WORKING REFERENCE FOR B2B SAAS DESIGN</span>
          <button onClick={() => setAbout(true)}>
            Research & interpretation
            <Info size={14} />
          </button>
        </div>
        {journey ? (
          <JourneyView
            key={journey.id}
            journey={journey}
            onExit={() => navigate("journeys")}
            onPattern={(id) => open(patterns.find((p) => p.id === id)!)}
          />
        ) : (
          <>
            <section className="collection-intro">
              <div>
                <span className="eyebrow">
                  {section === "journeys"
                    ? "DESIGN THE WHOLE EXPERIENCE"
                    : section === "sources"
                      ? "TRACE THE UNDERLYING BEHAVIOR"
                      : section === "saved"
                        ? "YOUR PERSONAL REFERENCE SHELF"
                        : "PATTERNS FOR REAL PRODUCT DECISIONS"}
                </span>
                <h1>
                  {section === "journeys"
                    ? "See how the pieces work together."
                    : section === "sources"
                      ? "Grounded in documented products."
                      : section === "saved"
                        ? "Keep the useful ones close."
                        : "Find a better way forward."}
                </h1>
                <p>
                  {section === "journeys"
                    ? "Follow a complete flow. Workspace details, plan choices, and outcomes carry from one step into the next."
                    : section === "sources"
                      ? "Official product references, reviewed and linked. The demos are original interpretations; documentation does not prove a conversion lift."
                      : section === "saved"
                        ? "Your saved patterns stay in this browser. Use them to build a brief, compare alternatives, or start an implementation."
                        : "Explore the decision, inspect the states, and adapt the implementation to your own product."}
                </p>
              </div>
              <div className="collection-stats">
                <strong>
                  {section === "journeys"
                    ? journeys.length
                    : section === "sources"
                      ? productCount
                      : section === "saved"
                        ? saved.length
                        : patterns.length}
                </strong>
                <span>
                  {section === "journeys"
                    ? "connected journeys"
                    : section === "sources"
                      ? "products referenced"
                      : section === "saved"
                        ? "saved patterns"
                        : "curated patterns"}
                </span>
                <small>
                  {section === "sources"
                    ? `${evidence.length} reviewed references`
                    : `${productCount} products · ${journeys.length} journeys`}
                </small>
              </div>
            </section>
            {section === "journeys" ? (
              <div className="journey-grid">
                {journeys.map((j, i) => (
                  <article className="journey-card" key={j.id}>
                    <div className="journey-card-top">
                      <span>J{String(i + 1).padStart(2, "0")}</span>
                      <span>
                        {j.ids.length} steps · {j.persona}
                      </span>
                    </div>
                    <h2>{j.title}</h2>
                    <p>{j.description}</p>
                    <ol>
                      {j.ids.map((id) => (
                        <li key={id}>
                          {patterns.find((p) => p.id === id)!.title}
                        </li>
                      ))}
                    </ol>
                    <button
                      className="primary"
                      onClick={() => openJourney(j.id)}
                    >
                      Explore journey
                    </button>
                  </article>
                ))}
              </div>
            ) : section === "sources" ? (
              <>
                <div className="evidence-method">
                  <strong>How to read the evidence</strong>
                  <p>
                    “Documented” means the linked official page describes that
                    behavior. “Design rationale” is our interpretation. Product
                    documentation may lag the interface; every source includes a
                    review date and limitation. Pricing, plans, and availability
                    can change.
                  </p>
                </div>
                <label className="search-field source-search">
                  <Search size={18} />
                  <input
                    aria-label="Search product evidence"
                    placeholder="Search products or documented behavior"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </label>
                <div className="sources-grid">
                  {evidence
                    .filter((s) =>
                      `${s.product} ${s.title} ${s.observed}`
                        .toLowerCase()
                        .includes(query.toLowerCase()),
                    )
                    .map((s) => (
                      <SourceCard key={s.id} source={s} />
                    ))}
                </div>
                {!evidence.some((s) =>
                  `${s.product} ${s.title} ${s.observed}`
                    .toLowerCase()
                    .includes(query.toLowerCase()),
                ) && (
                  <div className="empty-results">
                    <h3>No matching references.</h3>
                    <button className="secondary" onClick={() => setQuery("")}>
                      Clear search
                    </button>
                  </div>
                )}
              </>
            ) : (
              <section className="catalog v2-catalog">
                <div className="toolbar">
                  <div className="search-field">
                    <Search size={18} />
                    <input
                      ref={searchRef}
                      placeholder="Search a job, pattern, or product…"
                      aria-label="Search patterns"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                    />
                    {query ? (
                      <button
                        className="icon-button"
                        aria-label="Clear search"
                        onClick={() => setQuery("")}
                      >
                        <X size={16} />
                      </button>
                    ) : (
                      <kbd>/</kbd>
                    )}
                  </div>
                  <button
                    className={`filter-button ${filterOpen ? "active" : ""}`}
                    onClick={() => setFilterOpen(!filterOpen)}
                    aria-expanded={filterOpen}
                    aria-label="Filters"
                  >
                    <SlidersHorizontal size={17} />
                    <span>Filters</span>
                    {[
                      format !== "All formats",
                      persona !== "All roles",
                      model !== "All models",
                    ].filter(Boolean).length > 0 && (
                      <b>
                        {
                          [
                            format !== "All formats",
                            persona !== "All roles",
                            model !== "All models",
                          ].filter(Boolean).length
                        }
                      </b>
                    )}
                  </button>
                  <div className="view-switch">
                    <button
                      onClick={() => setView("grid")}
                      className={view === "grid" ? "active" : ""}
                      aria-label="Grid view"
                      aria-pressed={view === "grid"}
                    >
                      <Grid2X2 size={17} />
                    </button>
                    <button
                      onClick={() => setView("list")}
                      className={view === "list" ? "active" : ""}
                      aria-label="List view"
                      aria-pressed={view === "list"}
                    >
                      <List size={18} />
                    </button>
                  </div>
                </div>
                {filterOpen && (
                  <div className="filter-panel">
                    <Pick
                      label="User role"
                      value={persona}
                      options={[
                        "All roles",
                        "Builder",
                        "Collaborator",
                        "Workspace admin",
                        "Buyer",
                      ]}
                      onChange={setPersona}
                    />
                    <Pick
                      label="Business model"
                      value={model}
                      options={[
                        "All models",
                        "Freemium",
                        "Seat-based",
                        "Usage-based",
                        "Sales-assisted",
                      ]}
                      onChange={setModel}
                    />
                    <Pick
                      label="Format"
                      value={format}
                      options={[
                        "All formats",
                        "Flow",
                        "Component",
                        "UX pattern",
                      ]}
                      onChange={setFormat}
                    />
                    <Pick
                      label="Order"
                      value={sort}
                      options={["Lifecycle order", "A–Z"]}
                      onChange={setSort}
                    />
                    <button className="text-button" onClick={resetFilters}>
                      Clear filters
                    </button>
                  </div>
                )}
                <div
                  className="category-pills"
                  aria-label="Filter by lifecycle"
                >
                  {["All stages", ...categories.map((c) => c.name)].map((c) => (
                    <button
                      key={c}
                      className={category === c ? "active" : ""}
                      onClick={() => setCategory(c)}
                    >
                      {c}
                    </button>
                  ))}
                </div>
                <div className="results-bar">
                  <span>
                    {filtered.length} patterns
                    {category !== "All stages" ? ` · ${category}` : ""}
                  </span>
                  <span>Responsive · Base UI · Reusable source</span>
                </div>
                {filtered.length === 0 ? (
                  <div className="empty-results">
                    <Bookmark size={28} />
                    <h3>
                      {section === "saved" && !saved.length
                        ? "Your reference shelf starts here."
                        : "No patterns match these filters."}
                    </h3>
                    <p>
                      {section === "saved"
                        ? "Use a pattern’s bookmark button to keep it in this browser."
                        : "Try a broader job, product name, or lifecycle stage."}
                    </p>
                    <button
                      className="primary"
                      onClick={() => {
                        resetFilters();
                        setSection("patterns");
                      }}
                    >
                      Explore the collection
                    </button>
                  </div>
                ) : view === "grid" ? (
                  <div className="pattern-grid">
                    {filtered.map((p) => (
                      <article className="pattern-card" key={p.id}>
                        <button
                          className="card-open"
                          onClick={() => open(p)}
                          aria-label={`Explore ${p.title}`}
                        >
                          <Thumbnail p={p} />
                          <span className="preview-overlay">
                            Explore pattern
                          </span>
                        </button>
                        <div className="card-body">
                          <div className="card-meta">
                            <span>{p.category}</span>
                            <span>GA–{String(p.id).padStart(3, "0")}</span>
                          </div>
                          <div className="card-title">
                            <button onClick={() => open(p)}>
                              <h3>{p.title}</h3>
                            </button>
                            <button
                              className={`bookmark-button ${saved.includes(p.id) ? "saved" : ""}`}
                              onClick={() => save(p.id)}
                              aria-label={`${saved.includes(p.id) ? "Unsave" : "Save"} ${p.title}`}
                              aria-pressed={saved.includes(p.id)}
                            >
                              <Bookmark size={18} />
                            </button>
                          </div>
                          <p>{p.job}</p>
                          <div className="card-evidence">
                            {p.sources.length ? (
                              <>
                                <BookOpen size={13} />
                                <span>
                                  {[...new Set(p.sources.map((s) => s.product))]
                                    .slice(0, 2)
                                    .join(" · ")}
                                  {new Set(p.sources.map((s) => s.product))
                                    .size > 2
                                    ? " +"
                                    : ""}
                                </span>
                              </>
                            ) : (
                              <span>
                                Editorial pattern · evidence being reviewed
                              </span>
                            )}
                          </div>
                          <div className="card-footer">
                            <span>{p.format}</span>
                            <span>
                              {p.states.length} states <Smartphone size={13} />
                            </span>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                ) : (
                  <div className="pattern-list">
                    <div className="list-head">
                      <span>ID</span>
                      <span>USER JOB / PATTERN</span>
                      <span>ROLE</span>
                      <span>STAGE</span>
                      <span />
                    </div>
                    {filtered.map((p) => (
                      <div className="list-row" key={p.id}>
                        <span className="list-id">
                          {String(p.id).padStart(3, "0")}
                        </span>
                        <button onClick={() => open(p)}>
                          <strong>{p.job}</strong>
                          <small>{p.title}</small>
                        </button>
                        <span>{p.persona}</span>
                        <span>{p.category}</span>
                        <button
                          className={`bookmark-button ${saved.includes(p.id) ? "saved" : ""}`}
                          onClick={() => save(p.id)}
                          aria-label={`${saved.includes(p.id) ? "Unsave" : "Save"} ${p.title}`}
                        >
                          <Bookmark size={17} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            )}
          </>
        )}
        <footer className="page-footer">
          <span className="brand-mark small">
            <i />
            <i />
            <i />
          </span>
          <p>
            Growth Atlas · Research edition
            <br />
            <span>Documented behavior. Original demos. No uplift claims.</span>
          </p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            Back to top
          </button>
        </footer>
      </main>
      <Dialog.Root
        open={!!selected}
        onOpenChange={(v) => {
          if (!v) close();
        }}
      >
        <Dialog.Portal>
          <Dialog.Backdrop className="modal-backdrop" />
          <Dialog.Popup className="pattern-dialog v2-dialog">
            {selected && (
              <>
                <div className="detail-top">
                  <div className="detail-breadcrumb">
                    <span>GROWTH ATLAS</span>
                    <span>/</span>
                    <span>GA–{String(selected.id).padStart(3, "0")}</span>
                  </div>
                  <div>
                    <button
                      className={`icon-button ${saved.includes(selected.id) ? "is-saved" : ""}`}
                      onClick={() => save(selected.id)}
                      aria-label={
                        saved.includes(selected.id)
                          ? "Unsave pattern"
                          : "Save pattern"
                      }
                    >
                      <Bookmark size={18} />
                    </button>
                    <Dialog.Close
                      className="icon-button"
                      aria-label="Close pattern"
                    >
                      <X size={21} />
                    </Dialog.Close>
                  </div>
                </div>
                <div className="detail-title">
                  <span className="eyebrow">
                    {selected.category} · {selected.format} · {selected.persona}
                  </span>
                  <Dialog.Title>{selected.title}</Dialog.Title>
                  <Dialog.Description>
                    {selected.description}
                  </Dialog.Description>
                  <div className="trigger-line">
                    <strong>Trigger</strong>
                    <span>{selected.trigger}</span>
                  </div>
                </div>
                <Tabs.Root value={tab} onValueChange={(v) => setTab(String(v))}>
                  <div className="detail-controls">
                    <Tabs.List className="detail-tabs">
                      <Tabs.Tab value="demo">Live pattern</Tabs.Tab>
                      <Tabs.Tab value="notes">Design rationale</Tabs.Tab>
                      <Tabs.Tab value="evidence">
                        References <span>{selected.sources.length}</span>
                      </Tabs.Tab>
                      <Tabs.Tab value="code">Use in code</Tabs.Tab>
                    </Tabs.List>
                    <div className="device-tools">
                      <button
                        className={!mobile ? "active" : ""}
                        onClick={() => setMobile(false)}
                        aria-pressed={!mobile}
                        aria-label="Desktop preview"
                      >
                        <Monitor size={17} />
                      </button>
                      <button
                        className={mobile ? "active" : ""}
                        onClick={() => setMobile(true)}
                        aria-pressed={mobile}
                        aria-label="Mobile preview"
                      >
                        <Smartphone size={17} />
                      </button>
                      <button
                        onClick={() => {
                          setRevision((n) => n + 1);
                          setToast("Pattern reset");
                        }}
                        aria-label="Reset demo"
                      >
                        <RotateCcw size={17} />
                      </button>
                    </div>
                  </div>
                  <Tabs.Panel value="demo" className="v2-preview-panel">
                    <div className="preview-layout">
                      <div className="preview-working">
                        <div className="sandbox-label">
                          <span>ORIGINAL INTERACTIVE INTERPRETATION</span>
                          <span>{mobile ? "MOBILE WIDTH" : "RESPONSIVE"}</span>
                        </div>
                        <div
                          className={`v2-preview-frame ${mobile ? "narrow" : ""}`}
                        >
                          <PatternPreview
                            key={`${selected.id}-${revision}`}
                            id={selected.id}
                          />
                        </div>
                        <p className="sandbox-footnote">
                          Local prototype. No accounts, emails, payments, or
                          external permissions are changed.
                        </p>
                      </div>
                      <aside className="pattern-state-guide">
                        <span className="eyebrow">EXPLORE THE BEHAVIOR</span>
                        <h3>{selected.job}</h3>
                        <ol>
                          {selected.states.map((s) => (
                            <li key={s}>{s}</li>
                          ))}
                        </ol>
                        <p>
                          Open <strong>Explore conditions</strong> to inspect
                          request loading, recoverable errors, and role
                          restrictions. Form values stay intact during retries.
                        </p>
                        <div className="mini-guidance">
                          <strong>Watch for</strong>
                          <p>{selected.guardrail}</p>
                        </div>
                      </aside>
                    </div>
                  </Tabs.Panel>
                  <Tabs.Panel value="notes" className="notes-panel">
                    <div className="note-lead">
                      <span className="eyebrow">
                        EDITORIAL DESIGN RATIONALE
                      </span>
                      <h3>{selected.insight}</h3>
                    </div>
                    <div className="notes-grid">
                      <section>
                        <span className="note-number">01</span>
                        <h4>Use it when</h4>
                        <p>
                          {selected.trigger}. The user’s job is to{" "}
                          {selected.job.charAt(0).toLowerCase() +
                            selected.job.slice(1)}
                          .
                        </p>
                      </section>
                      <section>
                        <span className="note-number">02</span>
                        <h4>Consider another approach when</h4>
                        <p>{selected.avoid}</p>
                      </section>
                      <section>
                        <span className="note-number">03</span>
                        <h4>Measure downstream value</h4>
                        <p>
                          {selected.metric}. Establish your own baseline and
                          monitor task completion, support burden, and
                          retention. The cited examples do not establish a
                          causal uplift.
                        </p>
                      </section>
                      <section>
                        <span className="note-number">04</span>
                        <h4>Respect the user’s decision</h4>
                        <p>{selected.guardrail}</p>
                      </section>
                    </div>
                    <div className="alternative-patterns">
                      <span className="eyebrow">COMPARE ALTERNATIVES</span>
                      {selected.alternatives
                        .map((id) => patterns.find((p) => p.id === id))
                        .filter((p): p is CuratedPattern => !!p)
                        .map((p) => (
                          <button key={p.id} onClick={() => open(p)}>
                            <span>{p.title}</span>
                            <small>{p.job}</small>
                          </button>
                        ))}
                    </div>
                    {selected.variants.length > 0 && (
                      <Accordion.Root className="notes-accordion">
                        <Accordion.Item>
                          <Accordion.Header>
                            <Accordion.Trigger>
                              Variants consolidated into this pattern{" "}
                              <span>{selected.variants.length}</span>
                            </Accordion.Trigger>
                          </Accordion.Header>
                          <Accordion.Panel>
                            <p>
                              {selected.variants.join(" · ")}. These share the
                              same core decision or interaction. Adapt the
                              trigger and copy to the relevant situation.
                            </p>
                          </Accordion.Panel>
                        </Accordion.Item>
                      </Accordion.Root>
                    )}
                    <div className="related-journeys">
                      <span className="eyebrow">
                        SEE IT IN A CONNECTED JOURNEY
                      </span>
                      {journeys
                        .filter((j) => j.ids.includes(selected.id))
                        .map((j) => (
                          <button
                            key={j.id}
                            onClick={() => {
                              close();
                              openJourney(j.id);
                            }}
                          >
                            <Route size={16} />
                            {j.title}
                            <small>{j.ids.length} steps</small>
                          </button>
                        ))}
                    </div>
                    <div className="notes-actions">
                      <button
                        className="primary"
                        onClick={async () =>
                          setToast(
                            (await copyText(brief(selected)))
                              ? "Design brief copied"
                              : "Copy unavailable. Download the brief instead.",
                          )
                        }
                      >
                        <Copy size={16} />
                        Copy brief
                      </button>
                      <button
                        className="secondary"
                        onClick={() =>
                          download(
                            `${selected.slug}-brief.md`,
                            brief(selected),
                            "text/markdown",
                          )
                        }
                      >
                        <Download size={16} />
                        Download brief
                      </button>
                    </div>
                  </Tabs.Panel>
                  <Tabs.Panel value="evidence" className="evidence-panel">
                    <div className="evidence-method">
                      <strong>
                        Documentation supports the behavior, not a performance
                        claim.
                      </strong>
                      <p>
                        These are source-supported product behaviors. The
                        grayscale demo, rationale, and state design are our
                        original interpretation; they do not reproduce the
                        referenced interfaces.
                      </p>
                    </div>
                    {selected.sources.length === 0 && (
                      <p className="evidence-method">
                        This recovery flow is an editorial design proposal. No
                        direct product reference has been verified for it yet.
                      </p>
                    )}
                    <div className="sources-grid">
                      {selected.sources.map((s) => (
                        <SourceCard key={s.id} source={s} />
                      ))}
                    </div>
                  </Tabs.Panel>
                  <Tabs.Panel value="code" className="code-panel">
                    <div className="code-intro">
                      <div>
                        <span className="eyebrow">
                          REUSABLE REACT + BASE UI
                        </span>
                        <h3>Start with the working implementation.</h3>
                        <p>
                          Download a runnable project containing this pattern,
                          its configuration, the shared controls, responsive
                          styles, and local request-state simulator.
                        </p>
                      </div>
                      <a
                        className="primary"
                        href={`${import.meta.env.BASE_URL}source/${selected.slug}.zip`}
                        download
                      >
                        <Download size={16} />
                        Download source
                      </a>
                    </div>
                    <div className="code-boundary">
                      <strong>Integration boundary</strong>
                      <p>
                        Replace the local request simulator with your API.
                        Enforce authorization and validation on the server.
                        Payments, invitations, identity verification, and
                        provider connections need real backend confirmation
                        before reporting success.
                      </p>
                    </div>
                    <div className="code-toolbar">
                      <Pick
                        label="Source file"
                        value={codeFile}
                        options={["Usage", ...Object.keys(implementationFiles)]}
                        onChange={setCodeFile}
                      />
                      <button
                        className="secondary"
                        onClick={async () =>
                          setToast(
                            (await copyText(
                              codeFile === "Usage"
                                ? usageCode(selected)
                                : implementationFiles[codeFile],
                            ))
                              ? "Source copied"
                              : "Copy unavailable. Download the source package instead.",
                          )
                        }
                      >
                        <Copy size={15} />
                        Copy source
                      </button>
                    </div>
                    <pre className="source-code" tabIndex={0}>
                      <code>
                        {codeFile === "Usage"
                          ? usageCode(selected)
                          : implementationFiles[codeFile]}
                      </code>
                    </pre>
                    <p className="source-notice">
                      The package includes real component source and a Vite app.
                      Run <code>npm install</code>, then{" "}
                      <code>npm run dev</code>. It is an editable prototype, not
                      a connected production service.
                    </p>
                  </Tabs.Panel>
                </Tabs.Root>
                <div className="detail-bottom">
                  <button
                    className="text-button"
                    disabled={selectedIndex === 0}
                    onClick={() => open(patterns[selectedIndex - 1])}
                  >
                    Previous pattern
                  </button>
                  <span>
                    {selectedIndex + 1} of {patterns.length}
                  </span>
                  <button
                    className="text-button"
                    disabled={selectedIndex === patterns.length - 1}
                    onClick={() => open(patterns[selectedIndex + 1])}
                  >
                    Next pattern
                  </button>
                </div>
              </>
            )}
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>
      <Dialog.Root open={about} onOpenChange={setAbout}>
        <Dialog.Portal>
          <Dialog.Backdrop className="modal-backdrop" />
          <Dialog.Popup className="about-dialog">
            <Dialog.Close
              className="icon-button about-close"
              aria-label="Close about"
            >
              <X size={20} />
            </Dialog.Close>
            <span className="eyebrow">HOW TO USE GROWTH ATLAS</span>
            <Dialog.Title>
              A reference for your next design decision.
            </Dialog.Title>
            <Dialog.Description>
              Choose a user job, inspect the interaction, trace its documented
              references, and adapt the source to your product.
            </Dialog.Description>
            <div className="about-points">
              <p>
                <strong>A curated collection.</strong> {patterns.length}{" "}
                distinct patterns replace the previous count-driven index.
                Related variants are grouped, and saved entries for consolidated
                variants resolve to their canonical pattern.
              </p>
              <p>
                <strong>Evidence has boundaries.</strong> Official documentation
                supports the observed behavior. Our design rationale and
                original demos are interpretations. No measured growth uplift is
                claimed.
              </p>
              <p>
                <strong>Explore the whole journey.</strong> {journeys.length}{" "}
                connected flows preserve local workspace, plan, seat, and
                project context between steps. You can backtrack, skip
                deliberately, and export a walkthrough.
              </p>
              <p>
                <strong>Reuse real source.</strong> Each pattern has a runnable
                React package with Base UI controls. Connect your own services
                and permissions before production use.
              </p>
              <p>
                <strong>Your data stays here.</strong> Bookmarks persist in this
                browser. Demo and journey state are local and temporary. No real
                messages, charges, accounts, or connections are created.
              </p>
            </div>
            <button className="primary" onClick={() => setAbout(false)}>
              Back to the library
            </button>
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>
      {toast && (
        <div className="toast" role="status">
          <Check size={16} />
          {toast}
          <button
            className="icon-button"
            aria-label="Dismiss notification"
            onClick={() => setToast("")}
          >
            <X size={14} />
          </button>
        </div>
      )}
    </>
  );
}
