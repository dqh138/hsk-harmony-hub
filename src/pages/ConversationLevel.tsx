import { Link, useParams, Navigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LEVEL_META, type ConvLevel } from "@/data/conversationTypes";
import { getConversationsByLevel } from "@/data/conversations";
import { ArrowLeft, ChevronRight } from "lucide-react";

const ConversationLevel = () => {
  const { level } = useParams<{ level: string }>();

  if (!level || !["beginner", "intermediate", "advanced"].includes(level)) {
    return <Navigate to="/conversations" replace />;
  }

  const lvl = level as ConvLevel;
  const meta = LEVEL_META[lvl];
  const items = getConversationsByLevel(lvl);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <Link to="/conversations">
          <Button variant="ghost" size="sm" className="mb-4 gap-1">
            <ArrowLeft className="h-4 w-4" />
            Quay lại
          </Button>
        </Link>

        <header className="mb-6">
          <h1 className={`font-serif text-3xl font-bold ${meta.color}`}>
            {meta.labelZh} · {meta.label}
          </h1>
          <p className="mt-2 text-muted-foreground">{meta.description}</p>
        </header>

        <div className="grid gap-3 md:grid-cols-2">
          {items.map((c) => (
            <Link key={c.id} to={`/conversations/${lvl}/${c.id}`}>
              <Card className="transition-all hover:border-primary/60 hover:shadow-md">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                  <div>
                    <CardTitle className="text-lg">{c.title}</CardTitle>
                    <CardDescription>{c.titleVi}</CardDescription>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{c.lines.length} câu hội thoại</p>
                </CardContent>
              </Card>
            </Link>
          ))}
          {items.length === 0 && (
            <p className="text-muted-foreground">Chưa có bài nào ở cấp độ này.</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default ConversationLevel;
