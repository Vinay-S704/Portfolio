import { useEffect, useRef, useState } from 'react';
import { profile } from '../data';

type Props = { onLogin: () => void };

export default function LoginScreen({ onLogin }: Props) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [time, setTime] = useState(new Date());
  const [avatarError, setAvatarError] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length === 0) {
      onLogin();
    } else {
      setError('Login incorrect. Hint: just press Enter.');
      setPassword('');
    }
  };

  const timeStr = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const dateStr = time.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <div className="crt relative flex h-screen w-screen items-center justify-center overflow-hidden bg-term-bg font-mono">
      <div className="absolute inset-0 bg-gradient-to-b from-term-bg via-[#0c1219] to-term-bg" />
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-0 right-0 h-24 bg-gradient-to-b from-transparent via-term-green/5 to-transparent animate-scanline" />
      </div>

      <div className="relative z-10 w-full max-w-md px-6">
        <div className="mb-8 text-center">
          <div className="text-term-dim text-xs tracking-widest mb-2">{dateStr}</div>
          <div className="text-5xl font-light text-term-green glow-text tabular-nums">{timeStr}</div>
        </div>

        <div className="rounded-lg border border-term-border bg-term-panel/80 backdrop-blur p-6 shadow-2xl">
          <div className="mb-6 flex flex-col items-center gap-3">
            <div className="relative h-24 w-24 overflow-hidden rounded-full border-2 border-term-green/60 shadow-[0_0_24px_rgba(126,231,135,0.25)]">
              {!avatarError && (
                <img
                  src={profile.avatar}
                  alt={profile.name}
                  className="h-full w-full object-cover"
                  onError={() => setAvatarError(true)}
                />
              )}
              {avatarError && (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-term-green to-term-cyan text-3xl font-bold text-term-bg">
                  {profile.name.charAt(0)}
                </div>
              )}
            </div>
            <div className="text-center">
              <div className="text-term-green text-base glow-text">{profile.name}</div>
              <div className="text-term-dim text-xs">{profile.role}</div>
            </div>
          </div>

          <form onSubmit={submit} className="space-y-3">
            <div className="flex items-center gap-2 border border-term-border rounded px-3 py-2 focus-within:border-term-green transition-colors">
              <span className="text-term-dim text-xs">password</span>
              <input
                ref={inputRef}
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                className="flex-1 bg-transparent outline-none text-term-green text-sm placeholder:text-term-dim/50"
                placeholder="(just press Enter)"
                autoComplete="off"
              />
            </div>
            {error && <div className="text-term-red text-xs">{error}</div>}
            <button
              type="submit"
              className="w-full rounded bg-term-green/10 border border-term-green/40 text-term-green py-2 text-sm hover:bg-term-green/20 transition-colors"
            >
              Sign In
            </button>
          </form>
          <div className="mt-4 text-center text-term-dim text-[10px]">
            Session: tty1 · {profile.hostname} · kernel {profile.kernel}
          </div>
        </div>

        <div className="mt-6 text-center text-term-dim text-xs">
          Press <span className="text-term-green">Enter</span> to enter the system
        </div>
      </div>
    </div>
  );
}
