import type { ReactNode } from "react";

type LineKind = "text" | "ol" | "ul" | "empty";

function getLineKind(line: string): LineKind {
  const trimmed = line.trim();
  if (!trimmed) return "empty";
  if (/^\d+\.\s/.test(trimmed)) return "ol";
  if (/^[-*]\s/.test(trimmed)) return "ul";
  return "text";
}

function stripPrefix(line: string): string {
  return line.trim().replace(/^(\d+\.\s*|[-*]\s*)/, "");
}

function renderInline(text: string): ReactNode[] {
  const parts: ReactNode[] = [];
  const regex = /\*\*(.*?)\*\*/g;
  let lastIndex = 0;
  let match;
  let k = 0;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    parts.push(<strong key={k++}>{match[1]}</strong>);
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length > 0 ? parts : [text];
}

export function ChatMarkdown({ content }: { content: string }) {
  const lines = content.split("\n");
  const elements: ReactNode[] = [];
  let i = 0;
  let key = 0;

  while (i < lines.length) {
    const kind = getLineKind(lines[i]);

    if (kind === "empty") {
      i++;
      continue;
    }

    if (kind === "ol") {
      const items: string[] = [];
      while (i < lines.length && getLineKind(lines[i]) === "ol") {
        items.push(stripPrefix(lines[i]));
        i++;
      }
      elements.push(
        <ol key={key++}>
          {items.map((item, j) => (
            <li key={j}>{renderInline(item)}</li>
          ))}
        </ol>
      );
      continue;
    }

    if (kind === "ul") {
      const items: string[] = [];
      while (i < lines.length && getLineKind(lines[i]) === "ul") {
        items.push(stripPrefix(lines[i]));
        i++;
      }
      elements.push(
        <ul key={key++}>
          {items.map((item, j) => (
            <li key={j}>{renderInline(item)}</li>
          ))}
        </ul>
      );
      continue;
    }

    const textLines: string[] = [];
    while (i < lines.length && getLineKind(lines[i]) === "text") {
      textLines.push(lines[i].trim());
      i++;
    }
    elements.push(<p key={key++}>{renderInline(textLines.join(" "))}</p>);
  }

  return <>{elements}</>;
}
