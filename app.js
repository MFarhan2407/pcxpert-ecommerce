const express = require('express')
const app = express()
const path = require('path')
const port = 3000

const session = require('express-session');
const flash = require('connect-flash');

const isLogin = require('./middlewares/login');
const authRouter = require('./routes/authRouter');
const productRouter = require('./routes/productRoutes');
const orderRouter = require('./routes/orderRoutes');
const cartRouter = require('./routes/cartRoutes')

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

app.use(session({
  secret: 'ecommerce-secret',
  resave: false,
  saveUninitialized: false
}))

app.use(flash())

app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success');
  res.locals.error_msg = req.flash('error');
  next();
});

app.use('/', authRouter);
app.use(isLogin);
app.use('/', productRouter);
app.use('/', cartRouter);
app.use('/', orderRouter);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
