import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { Menu, X, ChevronDown, Bookmark, LogIn, LogOut, User } from "lucide-react";
import { HSKLevel, hskLevelTextColors } from "@/data/grammarTypes";
import { cn } from "@/lib/utils";
import ThemeToggle from "@/components/ThemeToggle";
import logo from "@/assets/logo.png";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

const levels: HSKLevel[] = [1, 2, 3, 4, 5, 6];

const NavDropdown = ({
  label,
  children,
  isActive,
}: {
  label: string;
  children: React.ReactNode;
  isActive: boolean;
}) => {
  return (
    <div className="relative group">
      <button
        className={cn(
          "flex items-center gap-1 rounded-md px-3 py-2 text-sm font-bold transition-colors hover:bg-muted text-foreground",
          isActive && "bg-muted"
        )}
      >
        {label}
        <ChevronDown className="h-3.5 w-3.5 opacity-60 transition-transform group-hover:rotate-180" />
      </button>
      <div className="invisible absolute left-0 top-full z-50 min-w-[160px] rounded-lg border border-border bg-popover p-1.5 shadow-xl opacity-0 transition-all group-hover:visible group-hover:opacity-100">
        {children}
      </div>
    </div>
  );
};

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [grammarOpen, setGrammarOpen] = useState(false);
  const [vocabOpen, setVocabOpen] = useState(false);
  const [examOpen, setExamOpen] = useState(false);
  const location = useLocation();
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    toast({ title: "Đã đăng xuất" });
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="HSK Hub" className="h-10 w-10 rounded-lg" />
          <span className="font-serif text-2xl font-bold gold-text">HSK Hub</span>
        </Link>

        {/* Desktop */}
        <div className="hidden items-center gap-1 md:flex">
          <NavDropdown
            label="语法"
            isActive={location.pathname.startsWith("/hsk/")}
          >
            {levels.map((level) => (
              <Link
                key={level}
                to={`/hsk/${level}`}
                className={cn(
                  "block rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted",
                  hskLevelTextColors[level],
                  location.pathname === `/hsk/${level}` && "bg-muted"
                )}
              >
                HSK {level}
              </Link>
            ))}
          </NavDropdown>

          <NavDropdown
            label="生词"
            isActive={location.pathname.startsWith("/vocabulary/")}
          >
            {levels.map((level) => (
              <Link
                key={level}
                to={`/vocabulary/${level}`}
                className={cn(
                  "block rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted",
                  hskLevelTextColors[level],
                  location.pathname === `/vocabulary/${level}` && "bg-muted"
                )}
              >
                HSK {level}
              </Link>
            ))}
          </NavDropdown>

          <NavDropdown
            label="模拟考试"
            isActive={location.pathname.startsWith("/mock-exam")}
          >
            {levels.map((level) => (
              <Link
                key={level}
                to={`/mock-exams?level=${level}`}
                className={cn(
                  "block rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted",
                  hskLevelTextColors[level],
                  location.pathname.startsWith("/mock-exam") && location.search === `?level=${level}` && "bg-muted"
                )}
              >
                HSK {level}
              </Link>
            ))}
          </NavDropdown>

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
            <button
              onClick={handleSignOut}
              className="flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-bold text-foreground transition-colors hover:bg-muted"
              title={user.email ?? "Đã đăng nhập"}
            >
              <User className="h-4 w-4" />
              <LogOut className="h-3.5 w-3.5 opacity-70" />
            </button>
          ) : (
            <Link
              to="/auth"
              className={cn(
                "flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-bold transition-colors hover:bg-muted text-foreground",
                location.pathname === "/auth" && "bg-muted"
              )}
            >
              <LogIn className="h-4 w-4" />
              登录
            </Link>
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
          {/* Grammar section */}
          <button
            onClick={() => setGrammarOpen(!grammarOpen)}
            className="flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-bold text-foreground transition-colors hover:bg-muted"
          >
            语法
            <ChevronDown className={cn("h-4 w-4 transition-transform", grammarOpen && "rotate-180")} />
          </button>
          {grammarOpen && (
            <div className="ml-3 border-l border-border/50 pl-2">
              {levels.map((level) => (
                <Link
                  key={level}
                  to={`/hsk/${level}`}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "block rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted",
                    hskLevelTextColors[level]
                  )}
                >
                  HSK {level}
                </Link>
              ))}
            </div>
          )}

          {/* Vocabulary section */}
          <button
            onClick={() => setVocabOpen(!vocabOpen)}
            className="flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-bold text-foreground transition-colors hover:bg-muted"
          >
            生词
            <ChevronDown className={cn("h-4 w-4 transition-transform", vocabOpen && "rotate-180")} />
          </button>
          {vocabOpen && (
            <div className="ml-3 border-l border-border/50 pl-2">
              {levels.map((level) => (
                <Link
                  key={level}
                  to={`/vocabulary/${level}`}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "block rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted",
                    hskLevelTextColors[level]
                  )}
                >
                  HSK {level}
                </Link>
              ))}
            </div>
          )}

          {/* Mock exams section */}
          <button
            onClick={() => setExamOpen(!examOpen)}
            className="flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-bold text-foreground transition-colors hover:bg-muted"
          >
            模拟考试
            <ChevronDown className={cn("h-4 w-4 transition-transform", examOpen && "rotate-180")} />
          </button>
          {examOpen && (
            <div className="ml-3 border-l border-border/50 pl-2">
              {levels.map((level) => (
                <Link
                  key={level}
                  to={`/mock-exams?level=${level}`}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "block rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted",
                    hskLevelTextColors[level]
                  )}
                >
                  HSK {level}
                </Link>
              ))}
            </div>
          )}

          <Link
            to="/saved-words"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-bold text-foreground transition-colors hover:bg-muted"
          >
            <Bookmark className="h-4 w-4" />
            生词本
          </Link>

          {user ? (
            <button
              onClick={() => {
                setOpen(false);
                handleSignOut();
              }}
              className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-bold text-foreground transition-colors hover:bg-muted"
            >
              <LogOut className="h-4 w-4" />
              Đăng xuất ({user.email})
            </button>
          ) : (
            <Link
              to="/auth"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-bold text-foreground transition-colors hover:bg-muted"
            >
              <LogIn className="h-4 w-4" />
              Đăng nhập
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
