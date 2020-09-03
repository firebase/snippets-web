import * as cp from "child_process";
import * as fs from "fs";
import * as path from "path";

const RE_START_SNIPPET = /\[START\s+([A-Za-z_]+)\s*\]/;
const RE_END_SNIPPET = /\[END\s+([A-Za-z_]+)\s*\]/;
// TODO: Handle multiline imports?
const RE_REQUIRE = /const {(.+?)} = require\((.+?)\)/;

function isBlank(line: string) {
  return line.trim().length === 0;
}

/**
 * Turns a series of source lines into a standalone snippet file by:
 *   - Converting require statements into top-level imports.
 *   - Adjusting indentation to left-align all content
 *   - Removing any blank lines at the starts
 * @param lines the lines containing the snippet (including START/END comments)
 */
function processSnippet(lines: string[]): string {
  const importLines: string[] = [];
  const otherLines: string[] = [];

  for (const line of lines) {
    const requireMatch = line.match(RE_REQUIRE);
    if (requireMatch) {
      const asImport = `import {${requireMatch[1]}} from ${requireMatch[2]}`;
      importLines.push(asImport);
    } else {
      otherLines.push(line);
    }
  }

  // Adjust indentation of the otherLines so that they're left aligned
  const nonBlankLines = otherLines.filter((l) => !isBlank(l));
  const indentSizes = nonBlankLines.map((l) => l.length - l.trimLeft().length);
  const minIndent = Math.min(...indentSizes);

  const adjustedOtherLines: string[] = [];
  for (const line of otherLines) {
    if (isBlank(line)) {
      adjustedOtherLines.push("");
    } else {
      adjustedOtherLines.push(line.substr(minIndent));
    }
  }

  // Special case: if the first line after the comments is blank we want to remove it
  const firstNonComment = adjustedOtherLines.findIndex(
    (l) => !l.startsWith("//")
  );
  if (isBlank(otherLines[firstNonComment])) {
    adjustedOtherLines.splice(firstNonComment, 1);
  }

  // TODO: Should we add a preamble?
  const content = [...importLines, ...adjustedOtherLines].join("\n");
  return content;
}

/**
 * Lists all the files in this repository that should be checked for snippets
 */
function listSnippetFiles(): string[] {
  const output = cp
    .execSync(
      'find . -type f -name "*.js" -not -path "*node_modules*" -not -path "./snippets*"'
    )
    .toString();
  return output.split("\n").filter((x) => !isBlank(x));
}

/**
 * Collect all the snippets from a file into a map of snippet name to lines.
 * @param filePath the file path to read.
 */
function collectSnippets(filePath: string): { [name: string]: string[] } {
  const fileContents = fs.readFileSync(filePath).toString();
  const lines = fileContents.split("\n");

  let currSnippetName = "";
  let inSnippet = false;
  const snippetLines: { [name: string]: string[] } = {};
  for (const line of lines) {
    const startMatch = line.match(RE_START_SNIPPET);
    const endMatch = line.match(RE_END_SNIPPET);

    if (startMatch) {
      inSnippet = true;
      currSnippetName = startMatch[1];
      snippetLines[currSnippetName] = [];
    }

    if (inSnippet) {
      snippetLines[currSnippetName].push(line);
    }

    if (endMatch) {
      if (endMatch[1] !== currSnippetName) {
        throw new Error(
          `Snippet ${currSnippetName} in ${filePath} has unmatched START/END tags`
        );
      }
      inSnippet = false;
    }
  }

  return snippetLines;
}

async function main() {
  const fileNames = listSnippetFiles();

  for (const filePath of fileNames) {
    const fileSlug = filePath
      .replace(".js", "")
      .replace("./", "")
      .replace(/\./g, "-");
    const snippetDir = path.join("./snippets", fileSlug);

    console.log(`Processing: ${filePath} --> ${snippetDir}`);

    if (!fs.existsSync(snippetDir)) {
      fs.mkdirSync(snippetDir, { recursive: true });
    }

    const snippetLines = collectSnippets(filePath);
    for (const snippetName in snippetLines) {
      const filePath = path.join(snippetDir, `${snippetName}.js`);
      const content = processSnippet(snippetLines[snippetName]);
      fs.writeFileSync(filePath, content);
    }
  }
}

main();
