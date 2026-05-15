import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import {
  Github, Linkedin, Mail, Award, ExternalLink, MapPin, ArrowRight,
  Database, BarChart3, Brain, Wrench, Code2, Send, Briefcase, GraduationCap,
  Sparkles, Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { ProjectVisual, type VisualKind } from "@/components/ProjectVisual";

export const Route = createFileRoute("/")({
  component: Portfolio,
  head: () => ({
    meta: [
      { title: "Ishika Khapekar — Data Analyst | ML | Power BI | Python" },
      { name: "description", content: "Portfolio of Ishika Khapekar — Data Science & Analytics professional turning raw data into clear decisions." },
    ],
  }),
});

const NAV = ["About", "Projects", "Experience", "Education", "Certifications", "Skills", "Contact"];

type Project = {
  kind: VisualKind;
  title: string;
  desc: string;
  insight: string;
  tech: string[];
  url: string;
};

const PROJECTS: Project[] = [
  { kind: "amazon", title: "Amazon Prime Analytics", desc: "Exploratory analysis of Amazon Prime catalogue — content trends, ratings & genre mix.", insight: "Analysed 9,600+ titles. Drama & International Movies dominate ~38% of catalogue; TV-MA content surged post-2018. Ratings cluster between 6.2–7.5 across top genres.", tech: ["Python", "Pandas", "Matplotlib", "Seaborn"], url: "https://github.com/IshikaKhapekar/amazon-prime-analytics" },
  { kind: "nike", title: "Nike India Analytics", desc: "Sales & product performance breakdown for Nike India with category-level KPIs.", insight: "Footwear contributes ~62% of revenue with running shoes leading. Discounted SKUs convert 2.3× higher; Mumbai & Bengaluru drive 41% of total online sales.", tech: ["Python", "Plotly", "EDA"], url: "https://github.com/IshikaKhapekar/nike-india-analytics" },
  { kind: "health", title: "Health Infrastructure India", desc: "State-wise public-health infrastructure analysis using government open data.", insight: "Identified 12 states below WHO bed-to-population ratio. Rural sub-centre coverage gap correlates 0.71 with maternal mortality. Built KPI dashboard for policy briefs.", tech: ["Python", "Power BI", "SQL"], url: "https://github.com/IshikaKhapekar/health-infrastructure-india" },
  { kind: "education", title: "Education Dropout India", desc: "Identifying drivers of school dropout across Indian states with ML classification.", insight: "Random Forest classifier reached 87% accuracy. Top SHAP drivers: female literacy rate, distance to school, and household income — actionable signals for targeted interventions.", tech: ["Scikit-learn", "Random Forest", "SHAP"], url: "https://github.com/IshikaKhapekar/education-dropout-india" },
  { kind: "demand", title: "Demand Forecasting & Inventory", desc: "End-to-end demand forecasting with Power BI dashboards for inventory planning.", insight: "Forecast model cut projected stock-outs by 28% and excess inventory by 19%. Power BI dashboards enable category managers to re-order weekly with confidence intervals.", tech: ["Power BI", "DAX", "Forecasting"], url: "https://github.com/IshikaKhapekar/data-analysis-demand-forecasting-powerbi-project" },
  { kind: "unemployment", title: "Unemployment Analysis India", desc: "Regional & temporal unemployment patterns with interactive visual storytelling.", insight: "COVID-19 spike of 23.5% in May 2020 traced via Folium choropleth. Urban unemployment recovered 2× faster than rural. Tripura & Haryana flagged as persistent hotspots.", tech: ["Python", "Folium", "Plotly"], url: "https://github.com/IshikaKhapekar/unemployment-analysis-india" },
  { kind: "crop", title: "Crop Yield Forecasting", desc: "ML pipeline forecasting crop yields from agricultural & weather features.", insight: "XGBoost model achieved R² = 0.91 across 7 crops. Rainfall and soil-pH explain 64% of variance. PCA cut feature dimensionality by 40% with no accuracy loss.", tech: ["XGBoost", "Scikit-learn", "PCA"], url: "https://github.com/IshikaKhapekar/crop-yield-forecasting" },
  { kind: "spotify", title: "Spotify Dashboard", desc: "Interactive Spotify streaming dashboard surfacing artist, track & mood insights.", insight: "Tracks with energy > 0.7 and danceability > 0.65 average 2.1× more streams. Mood-based DAX measures let users slice by valence — useful for playlist curation.", tech: ["Power BI", "DAX", "ETL"], url: "https://github.com/IshikaKhapekar/Spotify-Dashboard" },
];

const SKILL_CARDS = [
  { name: "Python", icon: Code2 },
  { name: "SQL", icon: Database },
  { name: "Machine Learning", icon: Brain },
  { name: "Power BI", icon: BarChart3 },
  { name: "Matplotlib", icon: BarChart3 },
  { name: "Seaborn", icon: BarChart3 },
  { name: "MS Excel", icon: Wrench },
  { name: "Jupyter", icon: Code2 },
  { name: "Google Colab", icon: Code2 },
  { name: "Git", icon: Wrench },
  { name: "GitHub", icon: Github },
  { name: "Flask", icon: Wrench },
  { name: "Figma", icon: Wrench },
  { name: "MySQL", icon: Database },
];

const CERTS = [
  { name: "Python for Data Science, AI & Development", issuer: "IBM · Coursera", url: "https://www.credly.com/badges/a6dab83a-7cf1-4a7f-8cdc-d08c61ce018f" },
  { name: "Databases and SQL for Data Science with Python", issuer: "IBM · Coursera", url: "https://www.credly.com/badges/2c9a8e64-8776-46b6-9e09-7b0ab2c8cd4f" },
  { name: "Excel Essentials for Data Analytics", issuer: "IBM · Coursera", url: "https://www.credly.com/badges/84e81941-4952-4262-a5ef-72519d4a0564" },
];

function HeroVisual() {
  // Abstract data-orbit / constellation network — purely visual, no labels.
  const nodes = [
    { x: 150, y: 150, r: 9 },
    { x: 60, y: 70, r: 4 },
    { x: 240, y: 80, r: 5 },
    { x: 70, y: 230, r: 4 },
    { x: 250, y: 220, r: 5 },
    { x: 150, y: 40, r: 3.5 },
    { x: 40, y: 150, r: 3.5 },
    { x: 260, y: 150, r: 3.5 },
    { x: 150, y: 260, r: 3.5 },
    { x: 100, y: 110, r: 3 },
    { x: 200, y: 110, r: 3 },
    { x: 100, y: 200, r: 3 },
    { x: 200, y: 200, r: 3 },
  ];
  const edges: Array<[number, number]> = [
    [0, 1], [0, 2], [0, 3], [0, 4], [0, 9], [0, 10], [0, 11], [0, 12],
    [1, 5], [2, 5], [1, 6], [3, 6], [2, 7], [4, 7], [3, 8], [4, 8],
    [9, 10], [11, 12], [9, 11], [10, 12],
  ];
  return (
    <div className="relative mx-auto w-full max-w-md">
      <div className="absolute -inset-6 rounded-[2rem] bg-gradient-to-tr from-primary/30 via-accent/20 to-transparent opacity-70 blur-2xl" />
      <div className="relative aspect-square overflow-hidden rounded-2xl border border-primary/20 bg-card/80 shadow-[0_20px_60px_-20px_oklch(0.78_0.16_200/0.4)] backdrop-blur-xl">
        <svg viewBox="0 0 300 300" className="h-full w-full">
          <defs>
            <radialGradient id="hero-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="oklch(0.78 0.16 200)" stopOpacity="0.35" />
              <stop offset="100%" stopColor="oklch(0.78 0.16 200)" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx="150" cy="150" r="140" fill="url(#hero-glow)" />

          {/* orbit rings */}
          {[60, 100, 140].map((r, i) => (
            <motion.circle
              key={r}
              cx="150" cy="150" r={r}
              fill="none"
              stroke="oklch(0.78 0.16 200)"
              strokeOpacity={0.18 - i * 0.04}
              strokeDasharray="3 6"
              initial={{ rotate: 0 }}
              animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
              transition={{ duration: 30 + i * 10, repeat: Infinity, ease: "linear" }}
              style={{ transformOrigin: "150px 150px" }}
            />
          ))}

          {/* edges */}
          {edges.map(([a, b], i) => (
            <motion.line
              key={i}
              x1={nodes[a].x} y1={nodes[a].y}
              x2={nodes[b].x} y2={nodes[b].y}
              stroke="oklch(0.78 0.16 200)"
              strokeOpacity={0.35}
              strokeWidth={1}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.2, delay: 0.3 + i * 0.04 }}
            />
          ))}

          {/* pulse along edges */}
          {edges.slice(0, 8).map(([a, b], i) => (
            <motion.circle
              key={`p-${i}`}
              r={2.2}
              fill="oklch(0.78 0.16 200)"
              initial={{ cx: nodes[a].x, cy: nodes[a].y, opacity: 0 }}
              animate={{
                cx: [nodes[a].x, nodes[b].x],
                cy: [nodes[a].y, nodes[b].y],
                opacity: [0, 1, 0],
              }}
              transition={{ duration: 2.2, repeat: Infinity, delay: i * 0.35, ease: "easeInOut" }}
            />
          ))}

          {/* nodes */}
          {nodes.map((n, i) => (
            <motion.circle
              key={i}
              cx={n.x} cy={n.y} r={n.r}
              fill={i === 0 ? "oklch(0.78 0.16 200)" : "oklch(0.65 0.2 280)"}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 + i * 0.05 }}
            />
          ))}

          {/* center pulse */}
          <motion.circle
            cx="150" cy="150" r="12"
            fill="none"
            stroke="oklch(0.78 0.16 200)"
            strokeWidth={1.5}
            initial={{ scale: 1, opacity: 0.7 }}
            animate={{ scale: 3, opacity: 0 }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut" }}
          />
        </svg>
      </div>
    </div>
  );
}

function ParticleBg() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-primary/20 blur-[120px]" />
      <div className="absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-accent/15 blur-[120px]" />
      <svg className="absolute inset-0 h-full w-full opacity-[0.15]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" className="text-primary" />
      </svg>
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.span
          key={i}
          className="absolute h-1 w-1 rounded-full bg-primary"
          style={{ left: `${(i * 53) % 100}%`, top: `${(i * 37) % 100}%` }}
          animate={{ y: [0, -30, 0], opacity: [0.2, 1, 0.2] }}
          transition={{ duration: 4 + (i % 5), repeat: Infinity, delay: i * 0.2 }}
        />
      ))}
    </div>
  );
}

function Section({ id, children, className = "" }: { id: string; children: React.ReactNode; className?: string }) {
  return (
    <section id={id} className={`scroll-mt-20 px-6 py-24 md:px-12 lg:px-20 ${className}`}>
      <div className="mx-auto max-w-6xl">{children}</div>
    </section>
  );
}

function SectionTitle({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="mb-12"
    >
      <p className="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-primary">{eyebrow}</p>
      <h2 className="text-3xl font-bold tracking-tight md:text-4xl">{title}</h2>
      <div className="mt-4 h-1 w-16 rounded-full bg-gradient-to-r from-primary to-accent" />
    </motion.div>
  );
}

function Portfolio() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<Project | null>(null);
  const [sending, setSending] = useState(false);

  const onContact = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const name = String(fd.get("name") || "").trim();
    const email = String(fd.get("email") || "").trim();
    const message = String(fd.get("message") || "").trim();
    if (!name || !email || !message) {
      toast.error("Please fill all fields.");
      return;
    }
    setSending(true);
    try {
      // 1) Store submission in Netlify Forms (visible in Netlify dashboard, exportable as CSV/spreadsheet)
      const params = new URLSearchParams();
      params.append("form-name", "contact");
      params.append("name", name);
      params.append("email", email);
      params.append("message", message);
      const netlifyRes = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params.toString(),
      });

      // 2) Also email a copy via FormSubmit (best-effort, non-blocking on failure)
      fetch("https://formsubmit.co/ajax/ishikakhapekar6@gmail.com", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name, email, message,
          _subject: `Portfolio message from ${name}`,
          _captcha: "false",
          _template: "table",
        }),
      }).catch(() => {});

      if (!netlifyRes.ok && netlifyRes.status !== 200) throw new Error("send failed");
      toast.success("Message sent! I'll reply soon.");
      form.reset();
    } catch {
      const subject = encodeURIComponent(`Portfolio message from ${name}`);
      const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);
      window.location.href = `mailto:ishikakhapekar6@gmail.com?subject=${subject}&body=${body}`;
      toast.message("Opened your email client as a fallback.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-background font-sans text-foreground antialiased">
      <Toaster theme="dark" position="top-center" />

      {/* NAV */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-border/50 bg-background/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 md:px-12">
          <a href="#hero" className="text-lg font-bold tracking-tight">
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Portfolio</span>
          </a>
          <nav className="hidden items-center gap-7 text-sm md:flex">
            {NAV.map((s) => (
              <a key={s} href={`#${s.toLowerCase()}`} className="text-muted-foreground transition-colors hover:text-primary">
                {s}
              </a>
            ))}
          </nav>
          <button className="md:hidden" onClick={() => setOpen(!open)} aria-label="Menu">
            <div className="space-y-1.5">
              <span className="block h-0.5 w-6 bg-foreground" />
              <span className="block h-0.5 w-6 bg-foreground" />
              <span className="block h-0.5 w-6 bg-foreground" />
            </div>
          </button>
        </div>
        {open && (
          <nav className="flex flex-col gap-2 border-t border-border/50 bg-background/95 px-6 py-4 md:hidden">
            {NAV.map((s) => (
              <a key={s} href={`#${s.toLowerCase()}`} onClick={() => setOpen(false)} className="py-2 text-sm text-muted-foreground hover:text-primary">
                {s}
              </a>
            ))}
          </nav>
        )}
      </header>

      {/* HERO */}
      <section id="hero" className="relative flex min-h-screen items-center px-6 pt-24 md:px-12 lg:px-20">
        <ParticleBg />
        <div className="relative mx-auto grid w-full max-w-6xl gap-10 md:grid-cols-[1.1fr_1fr] md:items-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <Badge className="mb-5 border border-primary/30 bg-primary/10 text-primary hover:bg-primary/15">
              <MapPin className="mr-1 h-3 w-3" /> Nagpur, Maharashtra · India
            </Badge>
            <h1 className="text-4xl font-bold leading-[1.05] tracking-tight md:text-6xl lg:text-7xl">
              Ishika <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">Khapekar</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg text-muted-foreground md:text-xl">
              Turning raw data into clear decisions —{" "}
              <span className="text-foreground">Python · SQL · Power BI · Machine Learning · Data Analysis</span>
            </p>
            <p className="mt-3 text-sm text-muted-foreground">
              B.Tech CSE · CGPA 8.3 · Ex-Data Analyst Intern @ Cojag Smart Technology
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="group bg-primary text-primary-foreground shadow-[0_0_30px_-5px_oklch(0.78_0.16_200/0.5)] hover:bg-primary/90">
                <a href="#projects">View My Work <ArrowRight className="transition-transform group-hover:translate-x-1" /></a>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-primary/40 hover:bg-primary/10 hover:text-primary">
                <a
                  href="/resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink /> View Resume
                </a>
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <HeroVisual />
          </motion.div>
        </div>
      </section>

      {/* ABOUT */}
      <Section id="about">
        <SectionTitle eyebrow="About" title="About Me" />
        <motion.p
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl text-lg leading-relaxed text-muted-foreground"
        >
          I'm a Data Science & Analytics enthusiast who finds stories hiding inside spreadsheets and
          turns them into decisions people can act on. Fluent in{" "}
          <span className="text-foreground">Python, Machine Learning, Power BI, and SQL</span>, I love the
          moment a messy dataset finally clicks into a clean dashboard or a model that actually predicts.
          My curiosity has taken me across <span className="text-primary">agricultural forecasting,
          labour-market analysis, public-health analytics, and education quality assessment</span> —
          always chasing the same goal: making numbers speak in plain English.
        </motion.p>
      </Section>

      {/* PROJECTS */}
      <Section id="projects" className="bg-secondary/20">
        <SectionTitle eyebrow="Projects" title="Selected Work" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {PROJECTS.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.1 }}
              whileHover={{ y: -6 }}
              className="group relative flex flex-col overflow-hidden rounded-xl border border-border/60 bg-card/60 backdrop-blur-sm transition-all hover:border-primary/60 hover:shadow-[0_10px_40px_-10px_oklch(0.78_0.16_200/0.5)]"
            >
              <ProjectVisual kind={p.kind} />
              <div className="flex flex-1 flex-col p-5">
                <h3 className="font-semibold transition-colors group-hover:text-primary">{p.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{p.desc}</p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {p.tech.map((t) => (
                    <span key={t} className="rounded-md bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">{t}</span>
                  ))}
                </div>
                <button
                  onClick={() => setActive(p)}
                  className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
                >
                  View Project <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* PROJECT DIALOG */}
      <Dialog open={!!active} onOpenChange={(o) => !o && setActive(null)}>
        <DialogContent className="max-w-2xl border-border/60 bg-card/95 p-0 backdrop-blur-xl">
          {active && (
            <>
              <ProjectVisual kind={active.kind} />
              <div className="p-6">
                <DialogHeader>
                  <DialogTitle className="text-2xl">{active.title}</DialogTitle>
                  <DialogDescription className="text-muted-foreground">{active.desc}</DialogDescription>
                </DialogHeader>
                <div className="mt-5 rounded-lg border border-primary/20 bg-primary/5 p-4">
                  <div className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
                    <Sparkles className="h-3.5 w-3.5" /> Key Insight
                  </div>
                  <p className="text-sm leading-relaxed text-foreground/90">{active.insight}</p>
                </div>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {active.tech.map((t) => (
                    <span key={t} className="rounded-md bg-secondary px-2 py-0.5 text-[11px] font-medium text-foreground/80">{t}</span>
                  ))}
                </div>
                <div className="mt-6 flex justify-end">
                  <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
                    <a href={active.url} target="_blank" rel="noreferrer">
                      <Github className="h-4 w-4" /> View on GitHub <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* EXPERIENCE */}
      <Section id="experience">
        <SectionTitle eyebrow="Experience" title="Where I've Worked" />
        <div className="relative border-l-2 border-primary/30 pl-8">
          <div className="absolute -left-[9px] top-2 h-4 w-4 rounded-full bg-primary shadow-[0_0_20px_oklch(0.78_0.16_200/0.8)]" />
          <motion.div
            initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Card className="border-border/60 bg-card/60 p-6 backdrop-blur-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-primary">
                    <Briefcase className="h-4 w-4" />
                    <span className="text-xs font-medium uppercase tracking-wider">Internship</span>
                  </div>
                  <h3 className="mt-2 text-xl font-semibold">Data Analyst Intern</h3>
                  <p className="text-muted-foreground">Cojag Smart Technology · Nagpur</p>
                </div>
                <span className="whitespace-nowrap rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs text-primary">
                  Jun 2025 – Dec 2025
                </span>
              </div>
              <ul className="mt-4 space-y-2.5 text-sm leading-relaxed text-muted-foreground">
                <li>• Cleaned and structured <span className="text-foreground">5,000+ records</span> maintaining high data accuracy for internal reporting — directly supporting data consolidation and cleaning workflows critical to business operations.</li>
                <li>• Performed quantitative analysis identifying operational inefficiencies across departments — presented findings via <span className="text-foreground">Power BI dashboards</span> to management stakeholders at multiple reporting levels.</li>
                <li>• Built interactive data visualisation UI supporting real-time decision-making and billing query resolution for cross-functional engineering teams.</li>
                <li>• Collaborated proactively with cross-functional teams aligning analytical outputs with business objectives, demonstrating flexibility across simultaneous workstreams.</li>
                <li>• Worked with annotating <span className="text-foreground">2,000+ images</span> for detection.</li>
                <li>• Used these annotated images for detection by modelling them first and then deploying for inference — projects contributed to include <span className="text-foreground">Licence Plate Detection</span> and <span className="text-foreground">Weed Detection</span>.</li>
              </ul>
            </Card>
          </motion.div>
        </div>
      </Section>

      {/* EDUCATION */}
      <Section id="education" className="bg-secondary/20">
        <SectionTitle eyebrow="Education" title="Academic Background" />
        <div className="grid gap-6 md:grid-cols-2">
          {[
            { d: "2022 – 2026", t: "B.Tech, Computer Science Engineering", o: "G H Raisoni University, Nagpur", m: "CGPA: 8.3 / 10" },
            { d: "2020 – 2022", t: "Class XII", o: "Prerna Junior College, Nagpur", m: "88%" },
          ].map((e, i) => (
            <motion.div key={e.t} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
              <Card className="h-full border-border/60 bg-card/60 p-6 backdrop-blur-sm transition-all hover:border-primary/50">
                <GraduationCap className="h-6 w-6 text-primary" />
                <p className="mt-3 text-xs uppercase tracking-wider text-muted-foreground">{e.d}</p>
                <h3 className="mt-2 text-lg font-semibold">{e.t}</h3>
                <p className="text-sm text-muted-foreground">{e.o}</p>
                <p className="mt-3 inline-block rounded-md bg-primary/10 px-2 py-1 text-sm font-medium text-primary">{e.m}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* CERTIFICATIONS */}
      <Section id="certifications">
        <SectionTitle eyebrow="Certifications" title="Verified Credentials" />
        <div className="grid gap-5 md:grid-cols-3">
          {CERTS.map((c, i) => (
            <motion.a
              key={c.name}
              href={c.url}
              target="_blank" rel="noreferrer"
              initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group rounded-xl border border-border/60 bg-card/60 p-6 backdrop-blur-sm transition-all hover:-translate-y-1 hover:border-primary/60 hover:shadow-[0_10px_30px_-10px_oklch(0.78_0.16_200/0.5)]"
            >
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary/30 to-accent/20">
                <Award className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-sm font-semibold leading-snug">{c.name}</h3>
              <p className="mt-2 text-xs text-muted-foreground">{c.issuer}</p>
              <div className="mt-4 inline-flex items-center gap-1 text-xs text-primary opacity-0 transition-opacity group-hover:opacity-100">
                Verify on Credly <ExternalLink className="h-3 w-3" />
              </div>
            </motion.a>
          ))}
        </div>
      </Section>

      {/* SKILLS / TOOLBOX */}
      <Section id="skills" className="bg-secondary/20">
        <SectionTitle eyebrow="Skills" title="Toolbox" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4">
          {SKILL_CARDS.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: (i % 8) * 0.04 }}
                whileHover={{ y: -4 }}
                className="group flex items-center gap-3 rounded-xl border border-border/60 bg-card/60 p-4 backdrop-blur-sm transition-all hover:border-primary/60 hover:shadow-[0_8px_24px_-12px_oklch(0.78_0.16_200/0.5)]"
              >
                <div className="rounded-lg bg-primary/15 p-2 text-primary transition-transform group-hover:scale-110">
                  <Icon className="h-5 w-5" />
                </div>
                <span className="text-sm font-medium">{s.name}</span>
              </motion.div>
            );
          })}
        </div>
      </Section>

      {/* CONTACT */}
      <Section id="contact">
        <SectionTitle eyebrow="Contact" title="Let's Connect" />
        <div className="grid gap-10 md:grid-cols-2">
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Have a project, role, or collaboration in mind? Drop a message — I usually respond within a day.
            </p>
            <div className="space-y-3">
              <a href="mailto:ishikakhapekar6@gmail.com" className="flex items-center gap-3 rounded-lg border border-border/60 bg-card/60 p-3 transition-all hover:border-primary hover:text-primary">
                <Mail className="h-4 w-4 text-primary" /> ishikakhapekar6@gmail.com
              </a>
              <a href="https://www.linkedin.com/in/ishika-khapekar-a068182ab" target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded-lg border border-border/60 bg-card/60 p-3 transition-all hover:border-primary hover:text-primary">
                <Linkedin className="h-4 w-4 text-primary" /> linkedin.com/in/ishika-khapekar
              </a>
              <a href="https://github.com/IshikaKhapekar" target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded-lg border border-border/60 bg-card/60 p-3 transition-all hover:border-primary hover:text-primary">
                <Github className="h-4 w-4 text-primary" /> github.com/IshikaKhapekar
              </a>
              <a href="https://www.credly.com/users/ishika-khapekar/badges#credly" target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded-lg border border-border/60 bg-card/60 p-3 transition-all hover:border-primary hover:text-primary">
                <Award className="h-4 w-4 text-primary" /> credly.com/users/ishika-khapekar
              </a>
            </div>
          </div>

          <Card className="border-border/60 bg-card/60 p-6 backdrop-blur-sm">
            <form
              name="contact"
              method="POST"
              data-netlify="true"
              netlify-honeypot="bot-field"
              onSubmit={onContact}
              className="space-y-4"
            >
              <input type="hidden" name="form-name" value="contact" />
              <p className="hidden">
                <label>Don't fill this out: <input name="bot-field" /></label>
              </p>
              <div>
                <label className="mb-1.5 block text-sm font-medium">Name</label>
                <Input name="name" required maxLength={100} placeholder="Your name" className="bg-background/50" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">Email</label>
                <Input name="email" type="email" required maxLength={255} placeholder="you@example.com" className="bg-background/50" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">Message</label>
                <Textarea name="message" required maxLength={1000} rows={4} placeholder="Tell me about your project…" className="bg-background/50" />
              </div>
              <Button type="submit" disabled={sending} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                {sending ? <><Loader2 className="h-4 w-4 animate-spin" /> Sending…</> : <><Send className="h-4 w-4" /> Send Message</>}
              </Button>
            </form>
          </Card>
        </div>
      </Section>

      {/* FOOTER */}
      <footer className="border-t border-border/50 px-6 py-10 md:px-12">
        <div className="mx-auto max-w-6xl text-center">
          <p className="text-sm text-muted-foreground">
            Designed & built with data in mind — Ishika Khapekar © 2026
          </p>
        </div>
      </footer>
    </div>
  );
}
