import { useLocation } from "react-router-dom";
import SelectionPopover from "./SelectionPopover";
import HighlightStyles from "./HighlightStyles";
import HighlightActions from "./HighlightActions";

/**
 * Selection popover, highlights and highlight-removal actions are scoped to
 * study/practice pages only — not the landing page or auth screens.
 */
const STUDY_PATTERNS = [/^\/hsk\//, /^\/vocabulary\//, /^\/mock-exam(s)?(\/|$)/, /^\/saved-words/, /^\/flashcards/];

const StudyToolsLayer = () => {
  const { pathname } = useLocation();
  const isStudy = STUDY_PATTERNS.some((re) => re.test(pathname));
  if (!isStudy) return null;

  return (
    <>
      <SelectionPopover />
      <HighlightStyles />
      <HighlightActions />
    </>
  );
};

export default StudyToolsLayer;
