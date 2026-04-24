// SuperMemo SM-2 algorithm
// quality: 0=Again(forgot), 3=Hard, 4=Good, 5=Easy

export interface SrsState {
  ease_factor: number;
  interval_days: number;
  repetitions: number;
}

export interface SrsResult extends SrsState {
  due_at: string; // ISO
  lapsed: boolean;
}

export function nextSrs(prev: SrsState, quality: number): SrsResult {
  let { ease_factor, interval_days, repetitions } = prev;
  let lapsed = false;

  if (quality < 3) {
    // forgot — restart
    repetitions = 0;
    interval_days = 1;
    lapsed = true;
  } else {
    if (repetitions === 0) interval_days = 1;
    else if (repetitions === 1) interval_days = 3;
    else interval_days = Math.round(interval_days * ease_factor);
    repetitions += 1;
  }

  // Update ease factor (SM-2 formula)
  ease_factor = ease_factor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  if (ease_factor < 1.3) ease_factor = 1.3;

  const due = new Date();
  due.setDate(due.getDate() + interval_days);
  // Round to start of day for predictable scheduling
  due.setHours(3, 0, 0, 0);

  return {
    ease_factor: Number(ease_factor.toFixed(3)),
    interval_days,
    repetitions,
    due_at: due.toISOString(),
    lapsed,
  };
}

export const QUALITY_LABELS: { value: number; label: string; hint: string; tone: string }[] = [
  { value: 0, label: "Quên", hint: "Học lại hôm nay", tone: "destructive" },
  { value: 3, label: "Khó", hint: "Sớm gặp lại", tone: "warning" },
  { value: 4, label: "Tốt", hint: "Đúng lịch", tone: "primary" },
  { value: 5, label: "Dễ", hint: "Giãn cách dài hơn", tone: "success" },
];
