---
name: Dictation number handling
description: Segments preserve Chinese numerals; comparison accepts both 一 and 1 forms
type: feature
---
Dictation segments must store Chinese characters as the video speaks them (一样, 一万三千) — never auto-converted to Arabic digits.

- `scripts/align-dictation.ts` keeps Soniox tokens raw (no CN→digit normalization) so bootstrap segments stay in Hán.
- `src/lib/pronunciationScore.ts` normalizes both target and user input to digits when scoring → both "一样" and "1样" are accepted as correct.
- `splitForCompare()` provides display chunks for the "So sánh ký tự" panel: shows original Chinese chars while matching against the normalized key. Multi-char numerals with units (一万三千) become one chunk keyed to "13000".
