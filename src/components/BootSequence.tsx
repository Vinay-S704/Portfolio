import { useEffect, useRef, useState } from 'react';
import { bootLines, profile } from '../data';

type Props = { onComplete: () => void };

export default function BootSequence({ onComplete }: Props) {
  const [visible, setVisible] = useState<string[]>([]);
  const [showCursor, setShowCursor] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const indexRef = useRef(0);

  useEffect(() => {
    let cancelled = false;
    let timers: ReturnType<typeof setTimeout>[] = [];

    const runNext = () => {
      if (cancelled) return;
      const i = indexRef.current;
      if (i >= bootLines.length) {
        setShowCursor(true);
        timers.push(setTimeout(onComplete, 900));
        return;
      }
      const line = bootLines[i];
      timers.push(
        setTimeout(() => {
          if (cancelled) return;
          setVisible((v) => [...v, line.text]);
          indexRef.current = i + 1;
          runNext();
        }, line.delay),
      );
    };

    runNext();
    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, [onComplete]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [visible]);

  const colorFor = (line: string) => {
    if (line.includes('Reached target') || line.includes('Started')) return 'text-term-green glow-text';
    if (line.includes('Starting')) return 'text-term-cyan';
    if (line.includes('warn', 0) || line.includes('WARN')) return 'text-term-amber';
    return 'text-term-dim';
  };

  return (
    <div className="crt relative h-screen w-screen overflow-hidden bg-term-bg font-mono text-sm leading-relaxed">
      <div
        ref={containerRef}
        className="absolute inset-0 overflow-y-auto px-4 py-3 sm:px-8 sm:py-6"
      >
        <div className="mb-3 text-term-green glow-text">
          Booting {profile.hostname} — Linux {profile.kernel}
        </div>
        {visible.map((line, i) => (
          <div key={i} className={`whitespace-pre-wrap break-words ${colorFor(line)}`}>
            {line}
          </div>
        ))}
        {showCursor && (
          <div className="mt-1 text-term-green glow-text">
            <span className="text-term-dim">portfolio login: </span>
            <span className="inline-block w-2 h-4 bg-term-green align-middle animate-blink" />
          </div>
        )}
      </div>
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-0 right-0 h-24 bg-gradient-to-b from-transparent via-term-green/5 to-transparent animate-scanline" />
      </div>
    </div>
  );
}
