interface FrontmatterResult {
  data: Record<string, unknown>;
  content: string;
}

function parseScalar(value: string): unknown {
  const trimmed = value.trim();

  if (trimmed === 'true') {
    return true;
  }

  if (trimmed === 'false') {
    return false;
  }

  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1);
  }

  return trimmed;
}

export function parseMarkdownFrontmatter(fileContents: string): FrontmatterResult {
  const match = fileContents.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);

  if (!match) {
    return {
      data: {},
      content: fileContents.trim(),
    };
  }

  const data: Record<string, unknown> = {};
  const lines = match[1].split(/\r?\n/);
  let currentArrayKey: string | null = null;

  for (const line of lines) {
    if (!line.trim()) {
      continue;
    }

    const arrayMatch = line.match(/^\s*-\s+(.+)$/);
    if (arrayMatch && currentArrayKey) {
      const existing = data[currentArrayKey];
      if (!Array.isArray(existing)) {
        throw new Error(`Invalid frontmatter array syntax near '${line}'`);
      }
      existing.push(parseScalar(arrayMatch[1]));
      continue;
    }

    const keyMatch = line.match(/^([A-Za-z][A-Za-z0-9_]*):\s*(.*)$/);
    if (!keyMatch) {
      throw new Error(`Unsupported frontmatter line: '${line}'`);
    }

    const [, key, value] = keyMatch;
    if (!value.trim()) {
      data[key] = [];
      currentArrayKey = key;
      continue;
    }

    data[key] = parseScalar(value);
    currentArrayKey = null;
  }

  return {
    data,
    content: fileContents.slice(match[0].length).trim(),
  };
}
