import { useEffect, useState } from 'react';
import {
  Terminal as TerminalIcon,
  Folder,
  User,
  Mail,
  Cpu,
  Clock,
  X,
  Minus,
  Maximize2,
  Trophy,
  Menu,
  Power,
  Wifi,
} from 'lucide-react';
import Terminal from './Terminal';
import {
  profile,
  projects,
  technologies,
  education,
  experience,
  achievements,
  socialLinks,
} from '../data';

type AppId =
  | 'terminal'
  | 'about'
  | 'projects'
  | 'skills'
  | 'education'
  | 'experience'
  | 'achievements'
  | 'contact';

type Props = { onExit: () => void };

type WindowState = {
  id: AppId;
  title: string;
  open: boolean;
  minimized: boolean;
  maximized: boolean;
  z: number;
  position: { x: number; y: number };
};

type DragState = {
  id: AppId;
  offsetX: number;
  offsetY: number;
};

const appMeta: Record<AppId, { title: string; icon: typeof TerminalIcon }> = {
  terminal: { title: 'Terminal', icon: TerminalIcon },
  about: { title: 'About', icon: User },
  projects: { title: 'Projects', icon: Folder },
  skills: { title: 'Skills', icon: Cpu },
  education: { title: 'Education', icon: Folder },
  experience: { title: 'Experience', icon: Folder },
  achievements: { title: 'Achievements', icon: Trophy },
  contact: { title: 'Contact', icon: Mail },
};

const getInitialWindowPosition = (index: number) => {
  if (typeof window === 'undefined') return { x: 80 + index * 36, y: 80 + index * 36 };

  const maxX = Math.max(120, window.innerWidth - 360);
  const maxY = Math.max(120, window.innerHeight - 260);
  return {
    x: Math.min(120 + index * 32, maxX),
    y: Math.min(100 + index * 40, maxY),
  };
};

export default function Desktop({ onExit }: Props) {
  const [windows, setWindows] = useState<WindowState[]>(
    (Object.keys(appMeta) as AppId[]).map((id, i) => ({
      id,
      title: appMeta[id].title,
      open: id === 'about',
      minimized: false,
      maximized: false,
      z: id === 'about' ? 10 : 5 - i,
      position: getInitialWindowPosition(i),
    })),
  );
  const [topZ, setTopZ] = useState(10);
  const [clock, setClock] = useState(new Date());
  const [menuOpen, setMenuOpen] = useState(false);
  const [dragState, setDragState] = useState<DragState | null>(null);

  useEffect(() => {
    const t = setInterval(() => setClock(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const focus = (id: AppId) => {
    const nz = topZ + 1;
    setTopZ(nz);
    setWindows((ws) =>
      ws.map((w) => (w.id === id ? { ...w, z: nz, minimized: false } : w)),
    );
  };

  const openApp = (id: AppId) => {
    setWindows((ws) =>
      ws.map((w) => (w.id === id ? { ...w, open: true, minimized: false } : w)),
    );
    focus(id);
  };

  const close = (id: AppId) =>
    setWindows((ws) => ws.map((w) => (w.id === id ? { ...w, open: false } : w)));

  const minimize = (id: AppId) =>
    setWindows((ws) => ws.map((w) => (w.id === id ? { ...w, minimized: true } : w)));

  const toggleMaximize = (id: AppId) =>
    setWindows((ws) => ws.map((w) => (w.id === id ? { ...w, maximized: !w.maximized } : w)));

  useEffect(() => {
    if (!dragState) return;

    const handleMove = (event: MouseEvent) => {
      const nextX = event.clientX - dragState.offsetX;
      const nextY = event.clientY - dragState.offsetY;
      const maxX = Math.max(8, window.innerWidth - 320);
      const maxY = Math.max(28, window.innerHeight - 220);

      setWindows((ws) =>
        ws.map((w) =>
          w.id === dragState.id
            ? {
                ...w,
                position: {
                  x: Math.min(Math.max(nextX, 8), maxX),
                  y: Math.min(Math.max(nextY, 28), maxY),
                },
              }
            : w,
        ),
      );
    };

    const handleUp = () => setDragState(null);

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
    };
  }, [dragState]);

  const renderApp = (id: AppId) => {
    if (id === 'terminal') return <Terminal onExit={onExit} />;
    return <ContentPanel id={id} />;
  };

  const openApps = windows.filter((w) => w.open);

  return (
    <div className="crt relative flex h-screen w-screen flex-col overflow-hidden bg-term-bg font-mono">
      {/* Top menu bar — always visible, never covered */}
      <div className="relative z-40 flex h-9 shrink-0 items-center gap-1 border-b border-term-border bg-term-panel/95 px-2 backdrop-blur">
        <button
          onClick={() => setMenuOpen((b) => !b)}
          className="flex items-center gap-1.5 rounded px-2 py-1 text-term-green text-xs hover:bg-term-green/10 transition-colors"
        >
          <Menu size={13} />
          <span className="font-bold">{profile.name}</span>
        </button>
        <div className="mx-1 h-4 w-px bg-term-border" />
        {/* App launcher icons — always visible & clickable */}
        <div className="flex items-center gap-0.5 overflow-x-auto no-scrollbar">
          {(Object.keys(appMeta) as AppId[]).map((id) => {
            const Icon = appMeta[id].icon;
            const w = windows.find((x) => x.id === id);
            const active = w?.open && !w.minimized;
            return (
              <button
                key={id}
                onClick={() => (w?.open ? focus(id) : openApp(id))}
                className={`flex items-center gap-1.5 rounded px-2 py-1 text-xs transition-colors ${
                  active
                    ? 'bg-term-green/15 text-term-green'
                    : 'text-term-green/70 hover:bg-term-green/10 hover:text-term-green'
                }`}
                title={appMeta[id].title}
              >
                <Icon size={13} />
                <span className="hidden sm:inline">{appMeta[id].title}</span>
              </button>
            );
          })}
        </div>
        <div className="ml-auto flex items-center gap-3 text-term-dim text-xs">
          <span className="hidden md:inline text-term-green/70">{profile.name}</span>
          <div className="flex items-center gap-2">
            <Wifi size={12} className="text-term-green/80" />
            <Power size={12} className="text-term-green/80" />
          </div>
          <span className="flex items-center gap-1">
            <Clock size={12} />
            <span className="tabular-nums">
              {clock.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </span>
        </div>
      </div>

      {/* Desktop area (between menu bar and taskbar) */}
      <div className="relative flex-1 overflow-hidden">
        {/* Wallpaper */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(122,255,154,0.16),_transparent_28%),linear-gradient(135deg,_#03060a_0%,_#081118_45%,_#0d141f_100%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.05),transparent_35%,rgba(255,255,255,0.03)_70%,transparent)]" />
          <div
            className="absolute inset-0 opacity-[0.08]"
            style={{
              backgroundImage:
                'linear-gradient(rgba(126,231,135,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(126,231,135,0.6) 1px, transparent 1px)',
              backgroundSize: '52px 52px',
            }}
          />
          <div className="absolute inset-y-0 left-0 w-[28%] bg-gradient-to-r from-black/35 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/40 to-transparent" />
          <div className="absolute right-6 top-6 rounded border border-term-green/20 bg-black/20 px-3 py-2 text-[10px] uppercase tracking-[0.3em] text-term-green/70 backdrop-blur">
            secure workspace / {profile.name}
          </div>
          <div className="absolute bottom-8 left-8 rounded border border-term-border/60 bg-term-panel/40 px-4 py-3 text-sm text-term-green/80 shadow-[0_12px_40px_rgba(0,0,0,0.25)] backdrop-blur">
            <div className="text-[10px] uppercase tracking-[0.3em] text-term-dim">system status</div>
            <div className="mt-1">Cloud & Security · Python · Web Development</div>
          </div>
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-term-green/10 text-[16vw] font-bold tracking-tighter pointer-events-none select-none">
            {profile.name}
          </div>
        </div>

        {/* Desktop shortcuts / workspace hints */}
        <div className="absolute left-4 top-4 z-10 flex flex-col gap-2">
          <div className="rounded border border-term-border/60 bg-term-panel/45 px-3 py-2 text-[10px] uppercase tracking-[0.25em] text-term-dim backdrop-blur">
            quick access
          </div>
          <button
            onClick={() => openApp('about')}
            className="flex items-center gap-2 rounded border border-term-border/60 bg-term-panel/55 px-3 py-2 text-left text-xs text-term-green/80 backdrop-blur transition hover:border-term-green/40 hover:bg-term-green/10"
          >
            <User size={14} />
            About Me
          </button>
          <button
            onClick={() => openApp('terminal')}
            className="flex items-center gap-2 rounded border border-term-border/60 bg-term-panel/55 px-3 py-2 text-left text-xs text-term-green/80 backdrop-blur transition hover:border-term-green/40 hover:bg-term-green/10"
          >
            <TerminalIcon size={14} />
            Open Terminal
          </button>
        </div>

        {/* Windows */}
        {openApps.map((w) => {
          if (w.minimized) return null;
          const isTerminal = w.id === 'terminal';
          const baseWidth = isTerminal ? 'min(780px, 94vw)' : 'min(640px, 94vw)';
          const baseHeight = isTerminal
            ? 'min(560px, calc(100vh - 9rem))'
            : 'min(540px, calc(100vh - 9rem))';
          const width = w.maximized ? 'calc(100vw - 1rem)' : baseWidth;
          const height = w.maximized ? 'calc(100vh - 7rem)' : baseHeight;
          const left = w.maximized ? '0.5rem' : `${w.position.x}px`;
          const top = w.maximized ? '0.5rem' : `${w.position.y}px`;
          return (
            <div
              key={w.id}
              className="absolute fade-in"
              style={{ zIndex: w.z, width, height, left, top }}
              onMouseDown={() => focus(w.id)}
            >
              <div className="flex h-full w-full flex-col overflow-hidden rounded-lg border border-term-border bg-term-panel shadow-[0_18px_65px_rgba(0,0,0,0.45)]">
                <div
                  className={`flex items-center justify-between border-b border-term-border bg-[#0b0f16] px-3 py-2 ${dragState?.id === w.id ? 'cursor-grabbing' : 'cursor-grab'}`}
                  onMouseDown={(event) => {
                    if (w.maximized) return;
                    event.preventDefault();
                    setDragState({
                      id: w.id,
                      offsetX: event.clientX - w.position.x,
                      offsetY: event.clientY - w.position.y,
                    });
                    focus(w.id);
                  }}
                  onDoubleClick={() => toggleMaximize(w.id)}
                >
                  <div className="flex items-center gap-2 text-term-dim text-xs">
                    {(() => {
                      const Icon = appMeta[w.id].icon;
                      return <Icon size={13} />;
                    })()}
                    <span className="text-term-green/80">{w.title}</span>
                  </div>
                  <div
                    className="flex items-center gap-2"
                    onMouseDown={(e) => e.stopPropagation()}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onMouseDown={(e) => {
                        e.stopPropagation();
                        minimize(w.id);
                      }}
                      className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#f5c04a] text-[8px] text-[#7a4a00] transition hover:brightness-110"
                      aria-label="Minimize"
                    >
                      <Minus size={8} strokeWidth={3} />
                    </button>
                    <button
                      onMouseDown={(e) => {
                        e.stopPropagation();
                        toggleMaximize(w.id);
                      }}
                      className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#36c84a] text-[8px] text-[#0b5a1d] transition hover:brightness-110"
                      aria-label="Maximize"
                    >
                      <Maximize2 size={7} strokeWidth={3} />
                    </button>
                    <button
                      onMouseDown={(e) => {
                        e.stopPropagation();
                        close(w.id);
                      }}
                      className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#ff5f57] text-[8px] text-[#6d0f0a] transition hover:brightness-110"
                      aria-label="Close"
                    >
                      <X size={8} strokeWidth={3} />
                    </button>
                  </div>
                </div>
                <div className="flex-1 overflow-hidden">{renderApp(w.id)}</div>
              </div>
            </div>
          );
        })}

        {/* Dropdown menu */}
        {menuOpen && (
          <div
            className="absolute left-2 top-2 z-50 w-60 rounded-lg border border-term-border bg-term-panel/95 p-2 shadow-2xl backdrop-blur fade-in"
            onMouseLeave={() => setMenuOpen(false)}
          >
            <div className="px-2 py-1.5 text-[10px] uppercase tracking-wider text-term-dim">
              Applications
            </div>
            {(Object.keys(appMeta) as AppId[]).map((id) => {
              const Icon = appMeta[id].icon;
              return (
                <button
                  key={id}
                  onClick={() => {
                    openApp(id);
                    setMenuOpen(false);
                  }}
                  className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-xs text-term-green hover:bg-term-green/10 transition-colors"
                >
                  <Icon size={14} />
                  {appMeta[id].title}
                </button>
              );
            })}
            <div className="my-1 border-t border-term-border" />
            <button
              onClick={() => {
                onExit();
                setMenuOpen(false);
              }}
              className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-xs text-term-red hover:bg-term-red/10 transition-colors"
            >
              <Power size={14} />
              Log Out
            </button>
          </div>
        )}
      </div>

      {/* Bottom taskbar */}
      <div className="relative z-30 flex h-10 shrink-0 items-center gap-2 border-t border-term-border bg-term-panel/95 px-3 backdrop-blur">
        {openApps.map((w) => (
          <button
            key={w.id}
            onClick={() => (w.minimized ? focus(w.id) : focus(w.id))}
            className={`flex items-center gap-1.5 rounded border px-2 py-1 text-xs transition-colors ${
              w.minimized
                ? 'border-term-border text-term-dim hover:text-term-green'
                : 'border-term-green/40 bg-term-green/10 text-term-green'
            }`}
          >
            {(() => {
              const Icon = appMeta[w.id].icon;
              return <Icon size={12} />;
            })()}
            <span className="hidden sm:inline">{w.title}</span>
          </button>
        ))}
        <div className="ml-auto text-[10px] text-term-dim">
          {profile.handle}@{profile.hostname} · kernel {profile.kernel}
        </div>
      </div>
    </div>
  );
}

function ContentPanel({ id }: { id: Exclude<AppId, 'terminal'> }) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    summary: true,
    education: false,
    skills: false,
    experience: false,
    contact: false,
  });

  const toggleSection = (key: string) => {
    setExpandedSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="h-full overflow-y-auto px-4 py-3 font-mono text-[13px] text-term-green/90">
      {id === 'about' && (
        <div className="space-y-3">
          <div className="flex items-center gap-3 rounded border border-term-border bg-term-green/5 p-3">
            <img
              src={profile.avatar}
              alt={profile.name}
              className="h-16 w-16 rounded-full border border-term-green/40 object-cover"
            />
            <div>
              <h2 className="text-term-green glow-text text-base">{profile.name}</h2>
              <p className="text-term-cyan text-xs">{profile.role}</p>
              <p className="text-term-dim text-xs">{profile.location}</p>
              <p className="mt-1 text-[11px] text-term-green/80">Phone: {profile.phone} · Email: {profile.email}</p>
            </div>
          </div>

          <div className="rounded border border-term-border bg-term-green/5">
            <button
              onClick={() => toggleSection('summary')}
              className="flex w-full items-center justify-between px-3 py-2 text-left text-xs font-semibold text-term-cyan"
            >
              <span>Professional Summary</span>
              <span className="text-term-green/70">{expandedSections.summary ? '−' : '+'}</span>
            </button>
            <div className={`overflow-hidden px-3 pb-3 transition-all duration-300 ${expandedSections.summary ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'}`}>
              <p className="leading-relaxed text-term-green/85">{profile.summary}</p>
            </div>
          </div>

          <div className="rounded border border-term-border bg-term-green/5">
            <button
              onClick={() => toggleSection('education')}
              className="flex w-full items-center justify-between px-3 py-2 text-left text-xs font-semibold text-term-cyan"
            >
              <span>Education & Academic Record</span>
              <span className="text-term-green/70">{expandedSections.education ? '−' : '+'}</span>
            </button>
            <div className={`overflow-hidden px-3 pb-3 transition-all duration-300 ${expandedSections.education ? 'max-h-[700px] opacity-100' : 'max-h-0 opacity-0'}`}>
              <div className="space-y-2 text-xs text-term-green/85">
                <div className="rounded border border-term-border/70 bg-black/10 p-2">
                  <div className="text-term-cyan">ITM University Raipur</div>
                  <div className="text-term-amber">B.Tech in Computer Science & Engineering · 2023 — Present</div>
                  <div className="mt-1 text-term-green/80">Specialization in Cloud and Information Security.</div>
                </div>
                <div className="rounded border border-term-border/70 bg-black/10 p-2">
                  <div className="text-term-cyan">Academic Performance</div>
                  <div className="mt-1">1st sem CGPA: 8.05</div>
                  <div>2nd sem CGPA: 8.42</div>
                  <div>3rd sem CGPA: 8.92</div>
                  <div>4th sem CGPA: 8.12</div>
                </div>
                <div className="rounded border border-term-border/70 bg-black/10 p-2">
                  <div className="text-term-cyan">Carmel Convent Higher Secondary School, Bishrampur</div>
                  <div className="text-term-amber">Higher Secondary · 2022</div>
                  <div className="mt-1 text-term-green/80">Completed 12th with 67%.</div>
                  <div className="text-term-amber">Secondary · 2020</div>
                  <div className="mt-1 text-term-green/80">Completed 10th with 95%.</div>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded border border-term-border bg-term-green/5">
            <button
              onClick={() => toggleSection('skills')}
              className="flex w-full items-center justify-between px-3 py-2 text-left text-xs font-semibold text-term-cyan"
            >
              <span>Technical Skills</span>
              <span className="text-term-green/70">{expandedSections.skills ? '−' : '+'}</span>
            </button>
            <div className={`overflow-hidden px-3 pb-3 transition-all duration-300 ${expandedSections.skills ? 'max-h-[900px] opacity-100' : 'max-h-0 opacity-0'}`}>
              {technologies.map((c) => (
                <div key={c.category} className="mt-2 first:mt-0">
                  <div className="text-term-cyan text-[11px]">{c.category}</div>
                  <div className="mt-1 flex flex-wrap gap-1.5">
                    {c.items.map((i) => (
                      <span key={i} className="rounded border border-term-border px-2 py-0.5 text-[11px] text-term-green/90">
                        {i}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded border border-term-border bg-term-green/5">
            <button
              onClick={() => toggleSection('experience')}
              className="flex w-full items-center justify-between px-3 py-2 text-left text-xs font-semibold text-term-cyan"
            >
              <span>Experience & Projects</span>
              <span className="text-term-green/70">{expandedSections.experience ? '−' : '+'}</span>
            </button>
            <div className={`overflow-hidden px-3 pb-3 transition-all duration-300 ${expandedSections.experience ? 'max-h-[900px] opacity-100' : 'max-h-0 opacity-0'}`}>
              <div className="space-y-2">
                {experience.map((e) => (
                  <div key={e.company} className="rounded border border-term-border/70 bg-black/10 p-2 text-xs">
                    <div className="text-term-cyan">{e.role} @ {e.company}</div>
                    <div className="text-term-amber">{e.period}</div>
                    <ul className="mt-1 space-y-1 text-term-green/80">
                      {e.points.map((p) => (
                        <li key={p}>• {p}</li>
                      ))}
                    </ul>
                  </div>
                ))}
                <div className="rounded border border-term-border/70 bg-black/10 p-2 text-xs">
                  <div className="text-term-cyan">Key Projects</div>
                  <div className="mt-1 text-term-green/80">• API Performance Monitor</div>
                  <div className="text-term-green/80">• Automated Resume Parser</div>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded border border-term-border bg-term-green/5">
            <button
              onClick={() => toggleSection('contact')}
              className="flex w-full items-center justify-between px-3 py-2 text-left text-xs font-semibold text-term-cyan"
            >
              <span>Contact & Profiles</span>
              <span className="text-term-green/70">{expandedSections.contact ? '−' : '+'}</span>
            </button>
            <div className={`overflow-hidden px-3 pb-3 transition-all duration-300 ${expandedSections.contact ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'}`}>
              <div className="space-y-1 text-xs text-term-green/85">
                <div>Phone: {profile.phone}</div>
                <div>Email: {profile.email}</div>
                <div>Location: {profile.location}</div>
                {socialLinks.map((s) => (
                  <div key={s.label}>
                    <span className="text-term-dim">{s.label}: </span>
                    <a href={s.url} target="_blank" rel="noreferrer" className="text-term-cyan underline-offset-2 hover:underline">
                      {s.handle}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {id === 'projects' && (
        <div className="space-y-3">
          <h2 className="text-term-green glow-text text-base">Projects</h2>
          {projects.map((p) => (
            <div
              key={p.name}
              className="rounded border border-term-border p-3 hover:border-term-green/50 transition-colors"
            >
              <div className="flex items-baseline justify-between">
                <span className="text-term-cyan">{p.name}</span>
                <span className="text-term-dim text-xs">{p.year}</span>
              </div>
              <div className="text-xs text-term-amber">{p.tagline}</div>
              <p className="mt-1 text-xs text-term-green/80 leading-relaxed">{p.description}</p>
              <div className="mt-2 flex flex-wrap gap-1">
                {p.stack.map((s) => (
                  <span
                    key={s}
                    className="rounded bg-term-green/10 px-1.5 py-0.5 text-[10px] text-term-green"
                  >
                    {s}
                  </span>
                ))}
              </div>
              {p.link && (
                <a
                  href={p.link}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-1 inline-block text-[10px] text-term-cyan underline-offset-2 hover:underline"
                >
                  {p.link}
                </a>
              )}
            </div>
          ))}
        </div>
      )}

      {id === 'skills' && (
        <div className="space-y-3">
          <h2 className="text-term-green glow-text text-base">Technologies</h2>
          {technologies.map((c) => (
            <div key={c.category}>
              <div className="text-term-cyan text-xs">{c.category}</div>
              <div className="mt-1 flex flex-wrap gap-1.5">
                {c.items.map((i) => (
                  <span
                    key={i}
                    className="rounded border border-term-border px-2 py-0.5 text-xs text-term-green/90 hover:border-term-green/50 transition-colors"
                  >
                    {i}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {id === 'education' && (
        <div className="space-y-3">
          <h2 className="text-term-green glow-text text-base">Education & Certifications</h2>
          {education.map((e) => (
            <div key={e.institution} className="rounded border border-term-border p-3">
              <div className="text-term-cyan">{e.institution}</div>
              <div className="text-xs text-term-amber">
                {e.degree} · {e.period}
              </div>
              <p className="mt-1 text-xs text-term-green/80 leading-relaxed">{e.detail}</p>
            </div>
          ))}
        </div>
      )}

      {id === 'experience' && (
        <div className="space-y-3">
          <h2 className="text-term-green glow-text text-base">Experience</h2>
          {experience.map((e) => (
            <div key={e.company} className="rounded border border-term-border p-3">
              <div className="flex items-baseline justify-between">
                <span className="text-term-cyan">
                  {e.role} @ {e.company}
                </span>
                <span className="text-term-dim text-xs">{e.period}</span>
              </div>
              <ul className="mt-1 space-y-1">
                {e.points.map((p) => (
                  <li key={p} className="text-xs text-term-green/80 leading-relaxed">
                    <span className="text-term-amber">- </span>
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {id === 'achievements' && (
        <div className="space-y-3">
          <h2 className="text-term-green glow-text text-base">Achievements</h2>
          {achievements.map((a) => (
            <div key={a.title} className="rounded border border-term-border p-3">
              <div className="flex items-baseline justify-between">
                <span className="text-term-cyan">{a.title}</span>
                <span className="text-term-dim text-xs">{a.year}</span>
              </div>
              <p className="mt-1 text-xs text-term-green/80 leading-relaxed">{a.detail}</p>
            </div>
          ))}
        </div>
      )}

      {id === 'contact' && (
        <div className="space-y-2">
          <h2 className="text-term-green glow-text text-base">Contact</h2>
          {socialLinks.map((s) => (
            <div key={s.label} className="text-xs">
              <span className="text-term-dim">{s.label}: </span>
              <a
                href={s.url}
                target="_blank"
                rel="noreferrer"
                className="text-term-cyan hover:text-term-green transition-colors"
              >
                {s.handle}
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
