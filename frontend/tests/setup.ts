import { afterEach } from 'vitest';

// React 19 の act 警告を抑止するため、テスト環境で明示する。
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

afterEach(() => {
  document.body.innerHTML = '';
});
