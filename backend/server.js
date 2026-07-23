const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const Coordinator = require('./agent/coordinator');

const coordinator = new Coordinator();
const PORT = 3000;

/**
 * Раздача статических файлов из frontend/
 */
function serveStatic(res, filePath) {
  const extMap = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.ico': 'image/x-icon',
  };

  const ext = path.extname(filePath);
  const contentType = extMap[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'File not found' }));
      return;
    }
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
}

/**
 * Обработка API-запросов
 */
async function handleApi(req, res) {
  const parsedUrl = url.parse(req.url, true);

  // POST /api/task — отправка задачи агенту
  if (parsedUrl.pathname === '/api/task' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', async () => {
      try {
        const { task } = JSON.parse(body);
        if (!task) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Поле "task" обязательно' }));
          return;
        }

        const result = await coordinator.processTask(task);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ result }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  // GET /api/memory — получение истории задач
  if (parsedUrl.pathname === '/api/memory' && req.method === 'GET') {
    const tasks = coordinator.memory.getAll();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ tasks }));
    return;
  }

  // 404 для неизвестных API-маршрутов
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'API route not found' }));
}

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url);

  // API-запросы
  if (parsedUrl.pathname.startsWith('/api/')) {
    handleApi(req, res);
    return;
  }

  // Статические файлы
  let filePath = path.join(__dirname, '..', 'frontend', parsedUrl.pathname === '/' ? 'index.html' : parsedUrl.pathname);
  serveStatic(res, filePath);
});

server.listen(PORT, () => {
  console.log(`[Server] TECTOV запущен на http://localhost:${PORT}`);
  console.log(`[Server] Отправляйте задачи на POST http://localhost:${PORT}/api/task`);
});
