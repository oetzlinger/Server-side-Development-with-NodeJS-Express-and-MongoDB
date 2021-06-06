const express = require('express'),
     http = require('http');

const hostname = 'localhost';
const port = 3000;
const morgan = require('morgan');
const bodyParser = require('body-parser');

const app = express();
const dishRouter = require('./routes/dishRouter');
const dishRouter1 = require('./routes/promoRouter');
const dishRouter2 = require('./routes/leadersRouter');

app.use('/dishes', dishRouter);
app.use('/promotions', dishRouter1);
app.use('/leaders', dishRouter2);

app.use(morgan('dev'));

app.use(express.static(__dirname + '/public'));

app.use(bodyParser.json());

const server = http.createServer(app);

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});