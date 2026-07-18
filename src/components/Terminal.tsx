import { useEffect, useRef, useState } from 'react';
import {
  profile,
  projects,
  technologies,
  education,
  experience,
  achievements,
  socialLinks,
} from '../data';
import type { Project } from '../data';

type Line = { type: 'input' | 'output' | 'error' | 'success'; text: string };

const helpText = `Available commands:
  help              show this list
  whoami            identity & role
  summary           professional summary
  ls                list portfolio sections
  cat <section>     print a section (about, projects, skills, education, experience, achievements, contact)
  projects          list projects
  project <name>    details about a project
  skills            list technologies
  education         education & certifications
  experience        work history
  achievements      awards & milestones
  contact           how to reach me
  resume            full dump of everything
  neofetch          system info banner
  clear             clear the screen
  sudo <cmd>        you already have root
  exit              lock the session`;

function neofetch(): string[] {
  const lines = [
    '       _____',
    '      /     \\         ' + `${profile.name}@${profile.hostname}`,
    '     | () () |        ' + '-----------------------',
    '      \\  ^  /         ' + `OS: PortfolioOS x86_64`,
    '       |||||          ' + `Host: ${profile.hostname} Workstation`,
    '       |||||          ' + `Kernel: ${profile.kernel}`,
    '                     ' + `Uptime: ${profile.uptime}`,
    '                     ' + `Shell: bash 6.9.0`,
    '                     ' + `DE: PortfolioWM 1.0`,
    '                     ' + `Terminal: tty1`,
    '                     ' + `CPU: Intel i7-11800H @ 2.30GHz`,
    '                     ' + `Memory: 32768 MiB`,
    '                     ' + `Role: ${profile.role}`,
  ];
  return lines;
}

function sectionContent(section: string): string[] | null {
  switch (section.toLowerCase()) {
    case 'about':
    case 'whoami': {
      return [
        `${profile.name} — ${profile.role}`,
        `Location: ${profile.location}`,
        `Phone: ${profile.phone}`,
        `Email: ${profile.email}`,
        '',
        profile.summary,
        '',
        'Academic Details:',
        '  1st sem CGPA: 8.05',
        '  2nd sem CGPA: 8.42',
        '  3rd sem CGPA: 8.92',
        '  4th sem CGPA: 8.12',
      ];
    }
    case 'projects': {
      const out: string[] = ['PROJECTS', '-------'];
      projects.forEach((p) => out.push(`  ${p.name}  ${p.year}  ${p.tagline}`));
      out.push('', 'Use `project <name>` for details.');
      return out;
    }
    case 'skills': {
      const out: string[] = ['TECHNOLOGIES', '------------'];
      technologies.forEach((c) => out.push(`${c.category}: ${c.items.join(', ')}`));
      return out;
    }
    case 'education': {
      const out: string[] = ['EDUCATION & CERTIFICATIONS', '--------------------------'];
      education.forEach((e) => {
        out.push(`${e.institution} — ${e.degree} (${e.period})`);
        out.push(`  ${e.detail}`);
      });
      return out;
    }
    case 'experience': {
      const out: string[] = ['EXPERIENCE', '----------'];
      experience.forEach((e) => {
        out.push(`${e.role} @ ${e.company}  (${e.period})`);
        e.points.forEach((p) => out.push(`  - ${p}`));
      });
      return out;
    }
    case 'achievements': {
      const out: string[] = ['ACHIEVEMENTS', '------------'];
      achievements.forEach((a) => {
        out.push(`${a.title}  (${a.year})`);
        out.push(`  ${a.detail}`);
      });
      return out;
    }
    case 'contact': {
      const out: string[] = ['CONTACT', '-------'];
      socialLinks.forEach((s) => out.push(`${s.label}:    ${s.handle}`));
      return out;
    }
    default:
      return null;
  }
}

function projectDetail(name: string): string[] | null {
  const p = projects.find(
    (x) => x.name.toLowerCase() === name.toLowerCase(),
  ) as Project | undefined;
  if (!p) return null;
  return [
    `Name:        ${p.name}`,
    `Year:        ${p.year}`,
    `Tagline:     ${p.tagline}`,
    `Stack:       ${p.stack.join(', ')}`,
    p.link ? `Link:        ${p.link}` : '',
    '',
    p.description,
  ].filter(Boolean);
}

type Props = { onExit: () => void };

export default function Terminal({ onExit }: Props) {
  const [lines, setLines] = useState<Line[]>([
    { type: 'output', text: `${profile.name}@${profile.hostname} — PortfolioOS 1.0` },
    { type: 'output', text: 'Type `help` to see available commands. Try `neofetch`.' },
    { type: 'output', text: '' },
  ]);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [histIndex, setHistIndex] = useState(-1);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [lines]);

  const push = (newLines: Line[]) => setLines((l) => [...l, ...newLines]);

  const run = (raw: string) => {
    const cmd = raw.trim();
    push([{ type: 'input', text: `${profile.handle}@${profile.hostname}:~$ ${cmd}` }]);
    if (!cmd) return;

    setHistory((h) => [...h, cmd]);
    setHistIndex(-1);

    const [base, ...args] = cmd.split(/\s+/);

    const out = (text: string) => push([{ type: 'output', text }]);
    const outMany = (arr: string[]) => push(arr.map((t) => ({ type: 'output' as const, text: t })));
    const err = (text: string) => push([{ type: 'error', text }]);
    const ok = (text: string) => push([{ type: 'success' as const, text }]);

    switch (base.toLowerCase()) {
      case 'help':
        outMany(helpText.split('\n'));
        break;
      case 'whoami':
        outMany(sectionContent('about') ?? []);
        break;
      case 'summary':
        outMany([profile.summary]);
        break;
      case 'ls': {
        outMany([
          'about  projects  skills  education  experience  achievements  contact  resume  neofetch',
        ]);
        break;
      }
      case 'cat': {
        const section = args[0];
        if (!section) {
          err('usage: cat <section>');
          break;
        }
        const content = sectionContent(section);
        if (content) outMany(content);
        else err(`cat: ${section}: No such section. Try \`ls\`.`);
        break;
      }
      case 'projects':
        outMany(sectionContent('projects') ?? []);
        break;
      case 'project': {
        if (!args[0]) {
          err('usage: project <name>');
          break;
        }
        const detail = projectDetail(args.join(' '));
        if (detail) outMany(detail);
        else err(`project: ${args.join(' ')}: not found. Try \`projects\`.`);
        break;
      }
      case 'skills':
        outMany(sectionContent('skills') ?? []);
        break;
      case 'education':
        outMany(sectionContent('education') ?? []);
        break;
      case 'experience':
        outMany(sectionContent('experience') ?? []);
        break;
      case 'contact':
        outMany(sectionContent('contact') ?? []);
        break;
      case 'achievements':
        outMany(sectionContent('achievements') ?? []);
        break;
      case 'resume': {
        const all = [
          ...(sectionContent('about') ?? []),
          '',
          ...(sectionContent('experience') ?? []),
          '',
          ...(sectionContent('projects') ?? []),
          '',
          ...(sectionContent('skills') ?? []),
          '',
          ...(sectionContent('education') ?? []),
          '',
          ...(sectionContent('achievements') ?? []),
          '',
          ...(sectionContent('contact') ?? []),
        ];
        outMany(all);
        break;
      }
      case 'neofetch':
        outMany(neofetch());
        break;
      case 'clear':
        setLines([]);
        break;
      case 'sudo':
        if (args[0] === 'rm' && args.includes('-rf') && args.includes('/')) {
          err('Nice try. This portfolio is immutable.');
        } else {
          ok(`You already have root, ${profile.handle}.`);
          if (args.length) out(`(would run: ${args.join(' ')})`);
        }
        break;
      case 'echo':
        out(args.join(' '));
        break;
      case 'pwd':
        out('/home/alex');
        break;
      case 'date':
        out(new Date().toString());
        break;
      case 'exit':
        out('Logging out...');
        setTimeout(onExit, 400);
        break;
      default:
        err(`${base}: command not found. Type \`help\`.`);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      run(input);
      setInput('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length === 0) return;
      const ni = histIndex === -1 ? history.length - 1 : Math.max(0, histIndex - 1);
      setHistIndex(ni);
      setInput(history[ni]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (histIndex === -1) return;
      const ni = histIndex + 1;
      if (ni >= history.length) {
        setHistIndex(-1);
        setInput('');
      } else {
        setHistIndex(ni);
        setInput(history[ni]);
      }
    } else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault();
      setLines([]);
    }
  };

  const colorFor = (t: Line['type']) =>
    t === 'error'
      ? 'text-term-red'
      : t === 'success'
        ? 'text-term-green glow-text'
        : t === 'input'
          ? 'text-term-cyan'
          : 'text-term-green/90';

  return (
    <div
      className="flex h-full w-full flex-col bg-term-bg/95 font-mono text-[13px] leading-relaxed"
      onClick={() => inputRef.current?.focus()}
    >
      <div className="flex items-center gap-2 border-b border-term-border bg-term-panel px-3 py-2">
        <span className="h-3 w-3 rounded-full bg-term-red/80" />
        <span className="h-3 w-3 rounded-full bg-term-amber/80" />
        <span className="h-3 w-3 rounded-full bg-term-green/80" />
        <span className="ml-2 text-term-dim text-xs">
          {profile.handle}@{profile.hostname}: ~/portfolio
        </span>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-3 py-2">
        {lines.map((l, i) => (
          <div key={i} className={`whitespace-pre-wrap break-words ${colorFor(l.type)}`}>
            {l.text || '\u00a0'}
          </div>
        ))}
        <div className="flex items-center">
          <span className="text-term-cyan whitespace-nowrap">
            {profile.handle}@{profile.hostname}:~$&nbsp;
          </span>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            className="flex-1 bg-transparent outline-none text-term-green caret-term-green"
            spellCheck={false}
            autoComplete="off"
            autoFocus
          />
        </div>
      </div>
    </div>
  );
}
