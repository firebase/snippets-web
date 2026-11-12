// [SNIPPET_REGISTRY disabled]

// Checks that every modular snippet has a React twin and vice versa.
//
// For each `<product>-next/<file>.js` there must be a `<product>-react/<file>.jsx`
// that declares `[SNIPPETS_SUFFIX _react]` and contains exactly the same set of
// `[START <tag>]` names. Extra React files or tags are reported too. The
// script prints a diff-style report and exits non-zero on any mismatch.

import * as fs from "fs";
import * as path from "path";

// Same tag regex as separate-snippets.ts
const RE_START_SNIPPET = /\[START\s+([A-Za-z_]+)\s*\]/;
const RE_SNIPPETS_SEPARATION = /\[SNIPPETS_SEPARATION\s+enabled\]/;
const RE_REACT_SUFFIX = /\[SNIPPETS_SUFFIX\s+_react\]/;

// Modular directories that have no React counterpart.
const EXCLUDED_DIRS = new Set(["firebaseserverapp-next"]);

type SnippetFile = {
  relPath: string;
  tags: Set<string>;
  hasReactSuffix: boolean;
};

// product -> file name without extension -> file info
type SnippetTree = Map<string, Map<string, SnippetFile>>;

const problems: string[] = [];

function report(problem: string) {
  problems.push(problem);
  console.log(problem);
}

function plural(count: number, noun: string) {
  return `${count} ${noun}${count === 1 ? "" : "s"}`;
}

/**
 * Reads the snippet source files in a directory and returns them keyed by
 * their file name without extension.
 */
function readSnippetDir(dir: string, ext: string): Map<string, SnippetFile> {
  const files = new Map<string, SnippetFile>();
  for (const entry of fs.readdirSync(dir)) {
    if (!entry.endsWith(ext)) {
      continue;
    }
    const relPath = path.join(dir, entry);
    const lines = fs.readFileSync(relPath, "utf8").split("\n");
    if (!lines.some((l) => RE_SNIPPETS_SEPARATION.test(l))) {
      continue;
    }
    const tags = new Set<string>();
    for (const line of lines) {
      const m = line.match(RE_START_SNIPPET);
      if (m) {
        tags.add(m[1]);
      }
    }
    files.set(entry.slice(0, -ext.length), {
      relPath,
      tags,
      hasReactSuffix: lines.some((l) => RE_REACT_SUFFIX.test(l)),
    });
  }
  return files;
}

/**
 * Collects the snippet sources for every `<product><suffix>` directory.
 */
function readTree(dirSuffix: string, ext: string): SnippetTree {
  const tree: SnippetTree = new Map();
  for (const entry of fs.readdirSync(".")) {
    if (!entry.endsWith(dirSuffix) || EXCLUDED_DIRS.has(entry)) {
      continue;
    }
    if (!fs.statSync(entry).isDirectory()) {
      continue;
    }
    const product = entry.slice(0, -dirSuffix.length);
    tree.set(product, readSnippetDir(entry, ext));
  }
  return tree;
}

function compareFiles(next: SnippetFile, react: SnippetFile) {
  const onlyInNext = [...next.tags].filter((t) => !react.tags.has(t));
  const onlyInReact = [...react.tags].filter((t) => !next.tags.has(t));
  if (onlyInNext.length === 0 && onlyInReact.length === 0 && react.hasReactSuffix) {
    return;
  }

  console.log(`${next.relPath} <-> ${react.relPath}`);
  if (!react.hasReactSuffix) {
    report(`  ! ${react.relPath} is missing "// [SNIPPETS_SUFFIX _react]"`);
  }
  for (const tag of onlyInNext) {
    report(`  - ${tag}`);
  }
  for (const tag of onlyInReact) {
    report(`  + ${tag}`);
  }
}

function main() {
  const nextTree = readTree("-next", ".js");
  const reactTree = readTree("-react", ".jsx");

  let fileCount = 0;
  let tagCount = 0;

  for (const [product, nextFiles] of nextTree) {
    const reactDir = `${product}-react`;
    const reactFiles = reactTree.get(product);
    if (!reactFiles) {
      report(`! missing directory ${reactDir}/ (${plural(nextFiles.size, "file")})`);
      continue;
    }

    for (const [name, nextFile] of nextFiles) {
      const reactFile = reactFiles.get(name);
      if (!reactFile) {
        report(`! missing ${path.join(reactDir, name + ".jsx")} (${plural(nextFile.tags.size, "snippet")})`);
        continue;
      }
      fileCount++;
      tagCount += nextFile.tags.size;
      compareFiles(nextFile, reactFile);
    }

    for (const [name, reactFile] of reactFiles) {
      if (!nextFiles.has(name)) {
        report(`! ${reactFile.relPath} has no modular twin in ${product}-next/`);
      }
    }

    // React sources must be .jsx so that tsc parses the JSX in them.
    for (const [name, strayFile] of readSnippetDir(reactDir, ".js")) {
      report(`! ${strayFile.relPath} should be named ${name}.jsx`);
    }
  }

  for (const [product, reactFiles] of reactTree) {
    if (!nextTree.has(product)) {
      report(`! ${product}-react/ has no modular twin ${product}-next/ (${plural(reactFiles.size, "file")})`);
    }
  }

  if (problems.length > 0) {
    console.log();
    console.log(`Parity check failed: ${plural(problems.length, "problem")}.`);
    console.log(`Every *-next snippet needs a *-react twin with the same file name (.jsx) and [START] tags.`);
    process.exit(1);
  }

  console.log(`Parity check passed: ${plural(fileCount, "file pair")}, ${plural(tagCount, "snippet")}.`);
}

main();
