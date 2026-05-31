const http = require('http');
const fs = require('fs');
const path = require('path');

const rootDir = __dirname;

function getContentType(filePath) {
  if (filePath.endsWith('.css')) {
    return 'text/css; charset=utf-8';
  }
  if (filePath.endsWith('.js')) {
    return 'application/javascript; charset=utf-8';
  }
  if (filePath.endsWith('.html')) {
    return 'text/html; charset=utf-8';
  }
  return 'text/plain; charset=utf-8';
}

function resolvePath(urlPath) {
  const requestedPath = urlPath === '/' ? '/index.html' : urlPath;
  const normalizedPath = path.normalize(requestedPath).replace(/^([/\\])+/, '');
  return path.join(rootDir, normalizedPath);
}

function createServer() {
  return http.createServer((req, res) => {
    const filePath = path.resolve(resolvePath(req.url || '/'));
    const relativePath = path.relative(rootDir, filePath);
    if (relativePath.startsWith('..') || path.isAbsolute(relativePath)) {
      res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Forbidden');
      return;
    }

    fs.readFile(filePath, (error, data) => {
      if (error) {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('Not Found');
        return;
      }

      res.writeHead(200, { 'Content-Type': getContentType(filePath) });
      res.end(data);
    });
  });
}

if (require.main === module) {
  const port = Number(process.env.PORT || 3000);
  createServer().listen(port, () => {
    console.log(`PT Practice Manager available at http://localhost:${port}`);
  });
}

module.exports = {
  createServer,
  getContentType,
  resolvePath
};
