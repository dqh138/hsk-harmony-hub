import { auth, defineMcp } from "@lovable.dev/mcp-js";
import searchVocabulary from "./tools/search-vocabulary";
import searchGrammar from "./tools/search-grammar";
import listDictationVideos from "./tools/list-dictation-videos";
import getDictationTranscript from "./tools/get-dictation-transcript";
import getProvince from "./tools/get-province";
import listSavedWords from "./tools/list-saved-words";
import saveWord from "./tools/save-word";
import listExamResults from "./tools/list-exam-results";

// The OAuth issuer must be the direct Supabase host, built from the project ref
// (inlined at build time) — never from SUPABASE_URL.
const projectRef = import.meta.env.VITE_SUPABASE_PROJECT_ID ?? "project-ref-unset";

export default defineMcp({
  name: "hsk-hub-mcp",
  title: "HSK Hub",
  version: "0.1.0",
  instructions:
    "Tools for HSK Hub, a Chinese learning platform (HSK 1-6 vocabulary and grammar, dictation videos, and a 探索中国 province guide). " +
    "Use `search_vocabulary` and `search_grammar` for study reference, `list_dictation_videos` plus `get_dictation_transcript` for listening practice material, " +
    "`get_province` for Chinese culture and geography, and `list_saved_words` / `save_word` / `list_exam_results` to work with the signed-in learner's own notebook and exam history.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [
    searchVocabulary,
    searchGrammar,
    listDictationVideos,
    getDictationTranscript,
    getProvince,
    listSavedWords,
    saveWord,
    listExamResults,
  ],
});
