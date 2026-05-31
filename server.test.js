const test = require('node:test');
const assert = require('node:assert/strict');
const { getContentType, resolvePath } = require('./server');

test('getContentType returns expected mime types', () => {
  assert.equal(getContentType('styles.css'), 'text/css; charset=utf-8');
  assert.equal(getContentType('app.js'), 'application/javascript; charset=utf-8');
  assert.equal(getContentType('index.html'), 'text/html; charset=utf-8');
});

test('resolvePath normalizes root request', () => {
  assert.ok(resolvePath('/').endsWith('/index.html'));
});
