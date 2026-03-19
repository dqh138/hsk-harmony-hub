import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { allMockExams } from "@/data/mockExam1";
import { cn } from "@/lib/utils";

const MockExams = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="relative overflow-hidden border-b border-border/30 py-16">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
        <div className="container relative mx-auto px-4">
          <h1 className="font-serif text-4xl font-black gold-text sm:text-5xl">
            模拟考试
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            HSK 6 Mock Exams — Practice with real exam questions from Hanban
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {allMockExams.map((exam) => (
            <Link
              key={exam.id}
              to={`/mock-exam/${exam.id}`}
              className="group relative overflow-hidden rounded-xl border border-hsk6/30 bg-card p-6 transition-all hover:-translate-y-1 hover:border-hsk6/60 hover:shadow-xl hover:shadow-primary/10"
            >
              <div className="absolute right-4 top-4 rounded bg-hsk6 px-2 py-0.5 text-xs font-bold text-background">
                Reading
              </div>
              <h2 className="font-serif text-2xl font-black text-hsk6">
                {exam.titleZh}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">{exam.title}</p>
              <p className="mt-3 text-sm text-muted-foreground">
                {exam.sections.reading.reduce(
                  (sum, part) =>
                    sum +
                    (part.questions?.length || 0) +
                    (part.passages?.reduce((s, p) => s + p.questions.length, 0) || 0) +
                    (part.blanksPassage?.reduce((s, b) => s + b.questions.length, 0) || 0),
                  0
                )}{" "}
                questions • 4 parts
              </p>
              <div className="mt-4 text-xs font-medium text-muted-foreground transition-colors group-hover:text-foreground">
                Start practice →
              </div>
            </Link>
          ))}

          {/* Placeholder for future exams */}
          {Array.from({ length: 9 }, (_, i) => (
            <div
              key={`placeholder-${i}`}
              className="relative overflow-hidden rounded-xl border border-dashed border-border/50 bg-card/50 p-6 opacity-50"
            >
              <div className="absolute right-4 top-4 rounded bg-muted px-2 py-0.5 text-xs font-bold text-muted-foreground">
                Coming soon
              </div>
              <h2 className="font-serif text-2xl font-black text-muted-foreground">
                模拟试卷 {i + 2}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                HSK 6 Mock Exam {i + 2}
              </p>
              <p className="mt-3 text-sm text-muted-foreground">
                50 questions • 4 parts
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default MockExams;
