function listParser({ data }: any): string {
  const recursor = (items: any[], style: 'unordered' | 'ordered' | 'checklist'): string => {
    const tag = style === 'ordered' ? 'ol' : 'ul';

    const listItems = items.map((item) => {
      if (!item || typeof item === 'string') {
        return `<li>${item}</li>`;
      }

      let content = '';
      if (style === 'checklist') {
        const checked = item.meta?.checked ? 'checked' : '';
        content = `<label><input type="checkbox" disabled ${checked}><span>${item.content || ''}</span></label>`;
      }
      else {
        content = item.content || '';
      }

      // Handle nested items - they should be placed inside the current <li>
      const nestedList = item.items?.length ? recursor(item.items, style) : '';

      return `<li>${content}${nestedList}</li>`;
    });

    return `<${tag}>${listItems.join('')}</${tag}>`;
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
    const url = data?.file?.url;

    if (!url) {
      return '<figure></figure>';
    }

    const caption = data.caption || '';
    const classes = [];

    if (data.withBorder)
      classes.push('with-border');
    if (data.withBackground)
      classes.push('with-background');
    if (data.stretched)
      classes.push('stretched');

    const classAttr = classes.length > 0 ? ` class="${classes.join(' ')}"` : '';

    return `<figure${classAttr}><img src="${url}" alt="${caption}" />${caption ? `<figcaption>${caption}</figcaption>` : ''}</figure>`;
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

  delimiter: () => `<hr />`,
};
