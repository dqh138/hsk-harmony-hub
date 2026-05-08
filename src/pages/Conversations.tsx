import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LEVEL_META, type ConvLevel } from "@/data/conversationTypes";
import { getConversationsByLevel } from "@/data/conversations";
import { MessageSquare } from "lucide-react";

const Conversations = () => {
  const levels: ConvLevel[] = ["beginner", "intermediate", "advanced"];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="font-serif text-3xl font-bold gold-text md:text-4xl">对话练习 · Luyện Hội thoại</h1>
          <p className="mt-2 text-muted-foreground">
            Luyện nói theo từng câu với chế độ karaoke và chấm điểm phát âm tự động.
          </p>
        </header>

        <div className="grid gap-4 md:grid-cols-3">
          {levels.map((lvl) => {
            const meta = LEVEL_META[lvl];
            const count = getConversationsByLevel(lvl).length;
            return (
              <Link key={lvl} to={`/conversations/${lvl}`}>
                <Card className="h-full transition-all hover:border-primary/60 hover:shadow-lg">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <MessageSquare className={`h-5 w-5 ${meta.color}`} />
                      <CardTitle className={`text-xl ${meta.color}`}>
                        {meta.labelZh} · {meta.label}
                      </CardTitle>
                    </div>
                    <CardDescription>{meta.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{count} bài hội thoại</p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default Conversations;
