export interface HeadingItem {
  id: string;
  text: string;
  level: 1 | 2 | 3;
}

export function slugify(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-가-힯一-鿿]/g, '')
    .replace(/^-+|-+$/g, '') || 'heading';
}

// h1/h2/h3 태그에 id 속성 자동 삽입 (이미 id 있으면 스킵)
export function injectHeadingIds(html: string): string {
  const counter: Record<string, number> = {};
  return html.replace(
    /<(h[123])([^>]*)>([\s\S]*?)<\/\1>/gi,
    (_match, tag: string, attrs: string, inner: string) => {
      if (/\bid\s*=/i.test(attrs)) return _match;
      const text = inner.replace(/<[^>]+>/g, '').trim();
      const base = 'heading-' + slugify(text);
      counter[base] = (counter[base] ?? 0) + 1;
      const id = counter[base] > 1 ? `${base}-${counter[base]}` : base;
      return `<${tag}${attrs} id="${id}">${inner}</${tag}>`;
    },
  );
}

// 주입된 HTML(또는 원본)에서 h2 목록만 추출 (목차 전용)
export function parseH2sFromHtml(html: string): HeadingItem[] {
  const injected = injectHeadingIds(html);
  const items: HeadingItem[] = [];
  const re = /<h2[^>]*\bid="([^"]+)"[^>]*>([\s\S]*?)<\/h2>/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(injected)) !== null) {
    const text = m[2].replace(/<[^>]+>/g, '').trim();
    if (text) items.push({ level: 2, id: m[1], text });
  }
  return items;
}

// 주입된 HTML(또는 원본)에서 h1~h3 목록 추출
export function parseHeadingsFromHtml(html: string): HeadingItem[] {
  const injected = injectHeadingIds(html);
  const items: HeadingItem[] = [];
  const re = /<(h[123])[^>]*\bid="([^"]+)"[^>]*>([\s\S]*?)<\/\1>/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(injected)) !== null) {
    const text = m[3].replace(/<[^>]+>/g, '').trim();
    if (text) items.push({ level: parseInt(m[1][1]) as 1 | 2 | 3, id: m[2], text });
  }
  return items;
}
