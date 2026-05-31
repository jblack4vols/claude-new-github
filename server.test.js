const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('path');
const { getContentType, resolvePath } = require('./server');

test('getContentType returns expected mime types', () => {
  assert.equal(getContentType('styles.css'), 'text/css; charset=utf-8');
  assert.equal(getContentType('app.js'), 'application/javascript; charset=utf-8');
  assert.equal(getContentType('index.html'), 'text/html; charset=utf-8');
  assert.equal(getContentType('notes.txt'), 'text/plain; charset=utf-8');
});

test('resolvePath normalizes root request', () => {
  assert.ok(resolvePath('/').endsWith('/index.html'));
});

test('resolvePath prevents traversal outside root', () => {
  const traversedPath = resolvePath('/../../secret.txt');
  const expectedRootPrefix = `${path.resolve(__dirname)}${path.sep}`;
  assert.ok(path.resolve(traversedPath).startsWith(expectedRootPrefix));
});
