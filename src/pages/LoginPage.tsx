import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import veraLogo from "@/assets/vera-logo.png";

export default function LoginPage() {
  const { signIn, signUp } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
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
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <img src={veraLogo} alt="Vera Collection" className="h-16 w-auto mb-4" />
          <h1 className="text-xl font-bold text-foreground">Vera Collection</h1>
          <p className="text-sm text-muted-foreground">Sistem Informasi Keuangan</p>
        </div>

        <div className="glass-card rounded-xl p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            {isRegister ? "Daftar Akun" : "Masuk"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <div>
                <Label>Nama Lengkap</Label>
                <Input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Nama lengkap" required />
              </div>
            )}
            <div>
              <Label>Username</Label>
              <Input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" required />
            </div>
            <div>
              <Label>Password</Label>
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required minLength={6} />
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Memproses..." : isRegister ? "Daftar" : "Masuk"}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <button
              type="button"
              className="text-sm text-primary hover:underline"
              onClick={() => { setIsRegister(!isRegister); setError(null); }}
            >
              {isRegister ? "Sudah punya akun? Masuk" : "Belum punya akun? Daftar"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
