// eslint.config.js
import antfu from '@antfu/eslint-config';

export default antfu({
  ignores: ['src/components/posthog*'],
  stylistic: {
    indent: 2,
    quotes: 'single',
    semi: true,
  },
  formatters: {
    css: true,
    html: true,
  },
});
