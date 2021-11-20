const http = require('http');
const app = require('./app');

const normalizePort = val => {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};

const port = normalizePort(process.env.PORT || '3080');

app.set('port', port);

const errorHandler = error => {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const address = server.address();

  const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;

  switch (error.code) {
    case 'EACCES':
      process.exit(1);
      break;
    case 'EADDRINUSE':
      process.exit(1);
      break;
    default:
      throw error;
  }
};

// 7sjVqvpNZ?Gt6:mdp heurokou
// link panelhoster : furien-ebook-apps.go.yj.fr , email : mylife , mdp : pL2K#J!.Hpn4LHV

const server = http.createServer(app);

server.on('error', errorHandler);


server.on('listening', () => {
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
});

server.listen(port);
