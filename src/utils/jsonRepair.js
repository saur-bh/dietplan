// Minimal JSON repair for common LLM issues
export function jsonRepair(str) {
  // Remove trailing commas before } or ]
  str = str.replace(/,\s*([}\]])/g, '$1');
  // Remove newlines before closing brackets
  str = str.replace(/\n(?=[}\]])/g, '');
  // Try to close unclosed brackets
  let openBraces = (str.match(/\{/g) || []).length;
  let closeBraces = (str.match(/\}/g) || []).length;
  let openBrackets = (str.match(/\[/g) || []).length;
  let closeBrackets = (str.match(/\]/g) || []).length;
  while (openBraces > closeBraces) { str += '}'; closeBraces++; }
  while (openBrackets > closeBrackets) { str += ']'; closeBrackets++; }
  return str;
}
