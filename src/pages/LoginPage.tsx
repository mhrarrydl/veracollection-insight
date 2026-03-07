import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, LogIn, UserPlus } from "lucide-react";
import veraLogo from "@/assets/vera-logo.png";

export default function LoginPage() {
  const { signIn, signUp } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const toEmail = (user: string) => `${user.toLowerCase().trim()}@veracollection.local`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    let err: string | null;
    if (isRegister) {
      err = await signUp(toEmail(username), password, fullName);
    } else {
      err = await signIn(toEmail(username), password);
    }

    if (err) setError(err);
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[hsl(245,58%,51%)] via-[hsl(245,58%,40%)] to-[hsl(229,30%,15%)] p-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute top-1/3 left-1/4 w-64 h-64 rounded-full bg-white/3 blur-2xl" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo & Branding */}
        <div className="flex flex-col items-center mb-10">
          <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl shadow-2xl shadow-black/20 mb-6 ring-1 ring-white/20">
            <img src={veraLogo} alt="Vera Collection" className="h-20 w-auto drop-shadow-lg" />
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Vera Collection
          </h1>
          <p className="text-sm text-white/60 mt-1">Sistem Informasi Keuangan</p>
        </div>

        {/* Card */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 shadow-2xl shadow-black/20 ring-1 ring-white/20">
          <div className="flex items-center gap-2 mb-6">
            {isRegister ? (
              <UserPlus className="w-5 h-5 text-white/80" />
            ) : (
              <LogIn className="w-5 h-5 text-white/80" />
            )}
            <h2 className="text-lg font-bold text-white">
              {isRegister ? "Daftar Akun Baru" : "Masuk ke Akun"}
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {isRegister && (
              <div className="space-y-1.5">
                <Label className="text-white/80 text-sm font-medium">Nama Lengkap</Label>
                <Input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Masukkan nama lengkap"
                  required
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-white/50 focus:ring-white/20 h-11"
                />
              </div>
            )}
            <div className="space-y-1.5">
              <Label className="text-white/80 text-sm font-medium">Username</Label>
              <Input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Masukkan username"
                required
                className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-white/50 focus:ring-white/20 h-11"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-white/80 text-sm font-medium">Password</Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-white/50 focus:ring-white/20 h-11 pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-destructive/20 border border-destructive/30 rounded-lg p-3">
                <p className="text-sm text-red-200">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-11 bg-white text-[hsl(245,58%,40%)] font-bold hover:bg-white/90 transition-all shadow-lg shadow-black/10"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin" />
                  Memproses...
                </span>
              ) : isRegister ? "Daftar" : "Masuk"}
            </Button>
          </form>

          <div className="mt-6 pt-5 border-t border-white/10 text-center">
            <button
              type="button"
              className="text-sm text-white/60 hover:text-white transition-colors"
              onClick={() => { setIsRegister(!isRegister); setError(null); }}
            >
              {isRegister ? "Sudah punya akun? " : "Belum punya akun? "}
              <span className="font-semibold text-white/90 underline underline-offset-2">
                {isRegister ? "Masuk" : "Daftar"}
              </span>
            </button>
          </div>
        </div>

        <p className="text-center text-white/30 text-xs mt-6">
          © {new Date().getFullYear()} Vera Collection
        </p>
      </div>
    </div>
  );
}
