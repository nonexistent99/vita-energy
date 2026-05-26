import { ArrowLeft, Lock, LogIn } from 'lucide-react';
import type { FormEvent } from 'react';
import { useState } from 'react';
import { authenticateAdmin } from '../utils/adminAuth';

interface AdminLoginProps {
  onAuthenticated: () => void;
}

export default function AdminLogin({ onAuthenticated }: AdminLoginProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const openStorefront = () => {
    if (window.location.pathname === '/admin') {
      window.history.pushState(null, '', '/');
      window.dispatchEvent(new PopStateEvent('popstate'));
    } else {
      window.location.hash = '';
    }
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (authenticateAdmin(password)) {
      setError('');
      onAuthenticated();
      return;
    }

    setError('Senha incorreta.');
  };

  return (
    <main className="min-h-screen bg-[#f4f6f8] text-[#151423] flex items-center justify-center px-5 py-10">
      <div className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 md:p-8 shadow-sm">
        <button
          type="button"
          onClick={openStorefront}
          className="inline-flex items-center gap-2 text-sm font-black text-slate-600 hover:text-violet-700 transition-all mb-8"
        >
          <ArrowLeft size={16} />
          Voltar para vitrine
        </button>

        <div className="w-12 h-12 rounded-lg bg-violet-50 text-violet-700 flex items-center justify-center mb-5">
          <Lock size={22} />
        </div>
        <p className="text-xs uppercase tracking-[0.16em] font-black text-violet-700">Acesso restrito</p>
        <h1 className="text-3xl font-black tracking-tight mt-1">Painel admin</h1>
        <p className="text-sm text-slate-500 font-semibold mt-2">
          Entre com a senha administrativa para configurar produtos, cupons e banners.
        </p>

        <form onSubmit={submit} className="grid gap-4 mt-7">
          <label className="grid gap-2">
            <span className="text-xs uppercase tracking-[0.12em] text-slate-500 font-black">Senha</span>
            <input
              type="password"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                setError('');
              }}
              autoComplete="current-password"
              className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-base font-bold text-slate-900 outline-none focus:border-violet-500"
              placeholder="Senha do admin"
            />
          </label>

          {error && (
            <div className="rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#151423] px-5 py-3 text-sm font-black text-white hover:bg-violet-800 transition-all"
          >
            <LogIn size={17} />
            Entrar
          </button>
        </form>
      </div>
    </main>
  );
}
