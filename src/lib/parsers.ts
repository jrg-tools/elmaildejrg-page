function listParser({ data }: any): string {
  const recursor = (items: any[], style: 'unordered' | 'ordered' | 'checklist'): string => {
    const tag = style === 'unordered' ? 'ul' : style === 'ordered' ? 'ol' : 'ul'; // checklist still uses <ul>

    const list = items.map((item) => {
      if (!item || typeof item === 'string')
        return `<li>${item}</li>`;

      const inner = item.items?.length ? recursor(item.items, style) : '';

      let content = '';
      if (style === 'checklist') {
        const checked = item.meta?.checked ? 'checked' : '';
        content = `<label><input type="checkbox" disabled ${checked}> ${item.content || ''}</label>`;
      }
      else {
        content = item.content || '';
      }

      return `<li>${content}${inner}</li>`;
    });

    return `<${tag}>${list.join('')}</${tag}>`;
  };

  const style = data.style === 'checklist'
    ? 'checklist'
    : data.style === 'ordered'
      ? 'ordered'
      : 'unordered';

  return recursor(data.items, style);
}

export const parsers = {
  list: listParser,

  paragraph: ({ data }: any) => `<p>${data.text}</p>`,

  header: ({ data }: any) => `<h${data.level}>${data.text}</h${data.level}>`,

  quote: ({ data }: any) => `<blockquote>${data.text}</blockquote>`,

  image: ({ data }: any) => {
    const { file, caption = '', withBorder, withBackground, stretched } = data;
    const classes = [
      withBorder ? 'with-border' : '',
      withBackground ? 'with-background' : '',
      stretched ? 'stretched' : '',
    ].filter(Boolean).join(' ');
    return `<figure class="${classes}"><img src="${file.url}" alt="${caption}"/>${caption ? `<figcaption>${caption}</figcaption>` : ''}</figure>`;
  },

  embed: ({ data }: any) => {
    return `<iframe src="${data.embed}" frameborder="0" allowfullscreen></iframe>`;
  },

  table: ({ data }: any) => {
    const rows = data.content.map((row: string[], rowIndex: number) => {
      const tag = data.withHeadings && rowIndex === 0 ? 'th' : 'td';
      const cells = row.map(cell => `<${tag}>${cell}</${tag}>`).join('');
      return `<tr>${cells}</tr>`;
    }).join('');
    return `<table><tbody>${rows}</tbody></table>`;
  },
};
