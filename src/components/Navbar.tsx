import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { HSKLevel, hskLevelTextColors } from "@/data/grammarTypes";
import { cn } from "@/lib/utils";

const levels: HSKLevel[] = [1, 2, 3, 4, 5, 6];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="sticky top-0 z-50 border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <span className="font-serif text-2xl font-bold gold-text">中文语法</span>
          <span className="hidden text-sm text-muted-foreground sm:inline">HSK Grammar</span>
        </Link>

        {/* Desktop */}
        <div className="hidden items-center gap-1 md:flex">
          {levels.map((level) => (
            <Link
              key={level}
              to={`/hsk/${level}`}
              className={cn(
                "rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted",
                hskLevelTextColors[level],
                location.pathname === `/hsk/${level}` && "bg-muted"
              )}
            >
              HSK {level}
            </Link>
          ))}
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="rounded-md p-2 text-foreground md:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-border/50 bg-background px-4 pb-4 md:hidden">
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
    </nav>
  );
};

export default Navbar;
