const express = require('express');
// const http = require("http");
// const bodyParser = require("body-parser");
const router = express.Router();

// const usersRouter = require('./userroutes');
// const spaceRouter = require('./spaceroutes');
// const menuRouter = require('./menuroutes');
// const orderRouter = require("./orderroutes");

// const app = express();
// app.use(bodyParser.urlencoded({extended: false}));
// const server = http.createServer(app);
// const PORT = 3000;
//
// server.listen(PORT, () => {
//   console.log(`server running on http://localhost:${PORT}`);
// })
//
// app.use('/user', usersRouter);
// app.use('/space', spaceRouter);
// app.use('/menu', menuRouter);
// app.use('/order', orderRouter);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'JeonJuPOS V1' });
});

module.exports = router;