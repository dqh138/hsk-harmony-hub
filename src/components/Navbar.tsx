import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { Menu, X, ChevronDown, ChevronRight, Bookmark, LogIn, LogOut, User, Layers, UserCircle2, MessageSquare, Newspaper, Headphones, GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";
import ThemeToggle from "@/components/ThemeToggle";
import logo from "@/assets/logo.png";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";


const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const [accountInfoOpen, setAccountInfoOpen] = useState(false);
  const location = useLocation();
  const { user, signOut } = useAuth();

  const isToolsActive =
    location.pathname.startsWith("/conversations") ||
    location.pathname.startsWith("/news") ||
    location.pathname.startsWith("/passive-listening") ||
    location.pathname.startsWith("/flashcards");

  const handleSignOut = async () => {
    await signOut();
    toast({ title: "Đã đăng xuất" });
  };

  const accountCreatedAt = user?.created_at
    ? new Date(user.created_at).toLocaleString("vi-VN")
    : null;
  const accountProvider =
    (user?.app_metadata as { provider?: string } | undefined)?.provider ?? "email";

  return (
    <nav className="sticky top-0 z-50 border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="HSK Hub" className="h-10 w-10 rounded-lg" />
          <span className="font-serif text-2xl font-bold gold-text">HSK Hub</span>
        </Link>

        {/* Desktop */}
        <div className="hidden items-center gap-1 md:flex">
          <Link
            to="/grammar"
            className={cn(
              "rounded-md px-3 py-2 text-sm font-bold transition-colors hover:bg-muted text-foreground",
              (location.pathname === "/grammar" || location.pathname.startsWith("/hsk/")) && "bg-muted"
            )}
          >
            语法
          </Link>

          <Link
            to="/vocabulary"
            className={cn(
              "rounded-md px-3 py-2 text-sm font-bold transition-colors hover:bg-muted text-foreground",
              location.pathname.startsWith("/vocabulary") && "bg-muted"
            )}
          >
            生词
          </Link>

          <Link
            to="/mock-exams"
            className={cn(
              "rounded-md px-3 py-2 text-sm font-bold transition-colors hover:bg-muted text-foreground",
              (location.pathname.startsWith("/mock-exams") || location.pathname.startsWith("/mock-exam/")) && "bg-muted"
            )}
          >
            模拟考试
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className={cn(
                  "flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-bold transition-colors hover:bg-muted text-foreground",
                  isToolsActive && "bg-muted"
                )}
              >
                <GraduationCap className="h-4 w-4" />
                学习工具
                <ChevronDown className="h-3.5 w-3.5 opacity-60" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="min-w-[220px]">
              <DropdownMenuItem asChild>
                <Link to="/conversations" className="cursor-pointer">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  对话 Hội thoại
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/news" className="cursor-pointer">
                  <Newspaper className="mr-2 h-4 w-4" />
                  新闻 Tin Trung Quốc
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/passive-listening" className="cursor-pointer">
                  <Headphones className="mr-2 h-4 w-4" />
                  被动听力 Nghe thụ động
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/flashcards" className="cursor-pointer">
                  <Layers className="mr-2 h-4 w-4" />
                  抽认卡 Flashcards
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Link
            to="/saved-words"
            className={cn(
              "flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-bold transition-colors hover:bg-muted text-foreground",
              location.pathname === "/saved-words" && "bg-muted"
            )}
          >
            <Bookmark className="h-4 w-4" />
            生词本
          </Link>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-bold text-foreground transition-colors hover:bg-muted"
                  title={user.email ?? "Đã đăng nhập"}
                >
                  <User className="h-4 w-4" />
                  <ChevronDown className="h-3.5 w-3.5 opacity-60" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-[220px]">
                <DropdownMenuLabel className="truncate text-xs font-normal text-muted-foreground">
                  {user.email ?? "Tài khoản"}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={() => setAccountInfoOpen(true)}>
                  <UserCircle2 className="mr-2 h-4 w-4" />
                  Thông tin tài khoản
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={handleSignOut} className="text-destructive focus:text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Đăng xuất
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-bold text-foreground transition-colors hover:bg-muted"
                  title="Tài khoản"
                >
                  <User className="h-4 w-4" />
                  <ChevronDown className="h-3.5 w-3.5 opacity-60" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-[220px]">
                <DropdownMenuItem asChild>
                  <Link to="/auth" className="cursor-pointer">
                    <LogIn className="mr-2 h-4 w-4" />
                    登录 Đăng nhập
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          <ThemeToggle />
        </div>

        {/* Mobile toggle */}
        <div className="flex items-center gap-1 md:hidden">
          <ThemeToggle />
          <button
            onClick={() => setOpen(!open)}
            className="rounded-md p-2 text-foreground"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-border/50 bg-background px-4 pb-4 md:hidden">
          <Link
            to="/grammar"
            onClick={() => setOpen(false)}
            className="block rounded-md px-3 py-2 text-sm font-bold text-foreground transition-colors hover:bg-muted"
          >
            语法
          </Link>

          <Link
            to="/vocabulary"
            onClick={() => setOpen(false)}
            className="block rounded-md px-3 py-2 text-sm font-bold text-foreground transition-colors hover:bg-muted"
          >
            生词
          </Link>

          <Link
            to="/mock-exams"
            onClick={() => setOpen(false)}
            className="block rounded-md px-3 py-2 text-sm font-bold text-foreground transition-colors hover:bg-muted"
          >
            模拟考试
          </Link>

          <Link
            to="/conversations"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-bold text-foreground transition-colors hover:bg-muted"
          >
            <MessageSquare className="h-4 w-4" />
            对话 Hội thoại
          </Link>

          <Link
            to="/news"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-bold text-foreground transition-colors hover:bg-muted"
          >
            <Newspaper className="h-4 w-4" />
            新闻 Tin Trung Quốc
          </Link>

          <Link
            to="/passive-listening"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-bold text-foreground transition-colors hover:bg-muted"
          >
            <Headphones className="h-4 w-4" />
            被动听力 Nghe thụ động
          </Link>

          <Link
            to="/saved-words"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-bold text-foreground transition-colors hover:bg-muted"
          >
            <Bookmark className="h-4 w-4" />
            生词本
          </Link>

          {user ? (
            <>
              <button
                onClick={() => {
                  setOpen(false);
                  setAccountInfoOpen(true);
                }}
                className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-bold text-foreground transition-colors hover:bg-muted"
              >
                <UserCircle2 className="h-4 w-4" />
                Thông tin tài khoản
              </button>
              <Link
                to="/flashcards"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-bold text-foreground transition-colors hover:bg-muted"
              >
                <Layers className="h-4 w-4" />
                抽认卡 Flashcards
              </Link>
              <button
                onClick={() => {
                  setOpen(false);
                  handleSignOut();
                }}
                className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-bold text-destructive transition-colors hover:bg-muted"
              >
                <LogOut className="h-4 w-4" />
                Đăng xuất
              </button>
            </>
          ) : (
            <>
              <Link
                to="/auth"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-bold text-foreground transition-colors hover:bg-muted"
              >
                <LogIn className="h-4 w-4" />
                Đăng nhập
              </Link>
              <Link
                to="/flashcards"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-bold text-foreground transition-colors hover:bg-muted"
              >
                <Layers className="h-4 w-4" />
                抽认卡 Flashcards
              </Link>
            </>
          )}
        </div>
      )}

      <Dialog open={accountInfoOpen} onOpenChange={setAccountInfoOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserCircle2 className="h-5 w-5" />
              Thông tin tài khoản
            </DialogTitle>
            <DialogDescription>Chi tiết tài khoản đăng nhập của bạn.</DialogDescription>
          </DialogHeader>
          {user && (
            <div className="space-y-3 text-sm">
              <div className="flex flex-col gap-1">
                <span className="text-xs text-muted-foreground">Email</span>
                <span className="font-medium break-all">{user.email ?? "—"}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs text-muted-foreground">Phương thức đăng nhập</span>
                <span className="font-medium capitalize">{accountProvider}</span>
              </div>
              {accountCreatedAt && (
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-muted-foreground">Ngày tạo tài khoản</span>
                  <span className="font-medium">{accountCreatedAt}</span>
                </div>
              )}
              <div className="flex flex-col gap-1">
                <span className="text-xs text-muted-foreground">User ID</span>
                <span className="font-mono text-xs break-all text-muted-foreground">{user.id}</span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </nav>
  );
};

export default Navbar;
