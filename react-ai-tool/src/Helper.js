// Check if the line is a heading (starts with # or is wrapped in **)
export function checkHeading(str) {
  const trimmed = str.trim();
  return (
    trimmed.startsWith("#") ||
    (trimmed.startsWith("**") && trimmed.endsWith("**"))
  );
}

// Clean up ALL markdown symbols (###, **, and starting *)
export function replaceHeadingStarts(str) {
  return str
    .replace(/^#+\s*/, "") // Remove ### headings
    .replace(/\*\*/g, "") // Remove all ** bold markers
    .replace(/^\*\s+/, "") // Remove leading bullets like "* "
    .trim();
}
