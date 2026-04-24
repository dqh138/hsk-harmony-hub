import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { useAuth } from "@/contexts/AuthContext";

const REMEMBER_KEY = "hskhub:remember-session";

// Move session from localStorage -> sessionStorage when "remember" is OFF.
// Supabase client persists to localStorage by default; we migrate after auth
// so closing the tab clears the session.
const applyRememberPreference = (remember: boolean) => {
  try {
    if (remember) {
      localStorage.setItem(REMEMBER_KEY, "1");
      // Restore from sessionStorage if it lived there from a previous session
      for (let i = 0; i < sessionStorage.length; i++) {
        const k = sessionStorage.key(i);
        if (k && k.startsWith("sb-") && k.endsWith("-auth-token")) {
          const v = sessionStorage.getItem(k);
          if (v && !localStorage.getItem(k)) localStorage.setItem(k, v);
        }
      }
      return;
    }
    localStorage.removeItem(REMEMBER_KEY);
    // Move every supabase auth token key to sessionStorage
    const keysToMove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith("sb-") && k.endsWith("-auth-token")) keysToMove.push(k);
    }
    for (const k of keysToMove) {
      const v = localStorage.getItem(k);
      if (v) sessionStorage.setItem(k, v);
      localStorage.removeItem(k);
    }
  } catch {
    /* storage may be unavailable */
  }
};

const emailSchema = z.string().trim().email("Email không hợp lệ").max(255);
const passwordSchema = z
  .string()
  .min(6, "Mật khẩu tối thiểu 6 ký tự")
  .max(72, "Mật khẩu tối đa 72 ký tự");

const Auth = () => {
  const { session, loading } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [remember, setRemember] = useState<boolean>(() => {
    try {
      return localStorage.getItem(REMEMBER_KEY) === "1";
    } catch {
      return false;
    }
  });

  // Handle OAuth code/error landing on /auth (or accidental landing on /)
  useEffect(() => {
    const url = new URL(window.location.href);
    const code = url.searchParams.get("code");
    const errDesc = url.searchParams.get("error_description");
    if (errDesc) {
      toast({ title: "Đăng nhập Google thất bại", description: errDesc, variant: "destructive" });
      url.searchParams.delete("error");
      url.searchParams.delete("error_description");
      window.history.replaceState({}, "", url.pathname + url.search + url.hash);
      return;
    }
    if (code) {
      // Strip the code from URL immediately to avoid 404 on refresh
      url.searchParams.delete("code");
      url.searchParams.delete("state");
      window.history.replaceState({}, "", url.pathname + url.search + url.hash);
      supabase.auth.exchangeCodeForSession(code).then(({ error }) => {
        if (error) {
          toast({ title: "Lỗi xác thực", description: error.message, variant: "destructive" });
        }
      });
    }
  }, []);

  useEffect(() => {
    if (!loading && session) navigate("/saved-words", { replace: true });
  }, [session, loading, navigate]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const eParsed = emailSchema.safeParse(email);
      const pParsed = passwordSchema.safeParse(password);
      if (!eParsed.success) throw new Error(eParsed.error.issues[0].message);
      if (!pParsed.success) throw new Error(pParsed.error.issues[0].message);

      const { error } = await supabase.auth.signInWithPassword({
        email: eParsed.data,
        password: pParsed.data,
      });
      if (error) throw error;
      toast({ title: "Đăng nhập thành công" });
      navigate("/saved-words", { replace: true });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Đăng nhập thất bại";
      toast({ title: "Lỗi", description: msg, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const eParsed = emailSchema.safeParse(email);
      const pParsed = passwordSchema.safeParse(password);
      if (!eParsed.success) throw new Error(eParsed.error.issues[0].message);
      if (!pParsed.success) throw new Error(pParsed.error.issues[0].message);

      const { error } = await supabase.auth.signUp({
        email: eParsed.data,
        password: pParsed.data,
        options: {
          emailRedirectTo: window.location.origin,
          data: { display_name: displayName.trim() || undefined },
        },
      });
      if (error) throw error;
      toast({ title: "Tạo tài khoản thành công", description: "Đang đăng nhập..." });
      navigate("/saved-words", { replace: true });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Đăng ký thất bại";
      toast({ title: "Lỗi", description: msg, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogle = async () => {
    setSubmitting(true);
    try {
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin,
      });
      if (result.error) {
        const msg = result.error instanceof Error ? result.error.message : "Đăng nhập Google thất bại";
        toast({ title: "Lỗi", description: msg, variant: "destructive" });
        setSubmitting(false);
        return;
      }
      if (result.redirected) return;
      navigate("/saved-words", { replace: true });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Lỗi không xác định";
      toast({ title: "Lỗi", description: msg, variant: "destructive" });
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen relative z-10">
      <Navbar />
      <div className="container mx-auto flex items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md p-6">
          <h1 className="mb-1 font-serif text-2xl font-bold gold-text">欢迎</h1>
          <p className="mb-6 text-sm text-muted-foreground">
            Đăng nhập để đồng bộ 生词本 trên mọi thiết bị.
          </p>

          <Button
            type="button"
            variant="outline"
            className="mb-4 w-full"
            onClick={handleGoogle}
            disabled={submitting}
          >
            <svg className="mr-2 h-4 w-4" viewBox="0 0 48 48">
              <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.6-6 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.5 29.3 4.5 24 4.5 12.7 4.5 3.5 13.7 3.5 25S12.7 45.5 24 45.5c11.3 0 20.5-9.2 20.5-20.5 0-1.5-.2-3-.4-4.5z"/>
              <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19 13 24 13c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.5 29.3 4.5 24 4.5 16.3 4.5 9.7 8.7 6.3 14.7z"/>
              <path fill="#4CAF50" d="M24 45.5c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 36.6 26.7 37.5 24 37.5c-5.3 0-9.7-3.4-11.3-8l-6.5 5C9.6 41.2 16.2 45.5 24 45.5z"/>
              <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4-4.1 5.3l6.2 5.2c-.4.4 6.6-4.8 6.6-13.5 0-1.5-.2-3-.4-4.5z"/>
            </svg>
            Đăng nhập với Google
          </Button>

          <div className="relative mb-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-card px-2 text-muted-foreground">hoặc</span>
            </div>
          </div>

          <Tabs defaultValue="signin">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Đăng nhập</TabsTrigger>
              <TabsTrigger value="signup">Đăng ký</TabsTrigger>
            </TabsList>

            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="space-y-3 pt-3">
                <div>
                  <Label htmlFor="signin-email">Email</Label>
                  <Input
                    id="signin-email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="signin-password">Mật khẩu</Label>
                  <Input
                    id="signin-password"
                    type="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={submitting}>
                  {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Đăng nhập
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-3 pt-3">
                <div>
                  <Label htmlFor="signup-name">Tên hiển thị (tuỳ chọn)</Label>
                  <Input
                    id="signup-name"
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    maxLength={50}
                  />
                </div>
                <div>
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="signup-password">Mật khẩu</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={submitting}>
                  {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Tạo tài khoản
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <p className="mt-4 text-center text-xs text-muted-foreground">
            <Link to="/" className="hover:underline">
              ← Quay lại trang chính
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
