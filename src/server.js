const express = require ('express');
const morgan = require('morgan');
const { connection } = require('./database');
const cors = require('cors');
const graphicsRoutes = require('./routes/graphic');

const app = express();

connection();

app.use(morgan('dev'));
app.use(express.json());

app.set('port', process.env.portbackend || 3000);

app.listen(app.get('port'), () => {
    console.log('Servidor en el puerto', app.get('port'));
});

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

app.use('/login', require('./routes/authentication'));
app.use('/country', require('./routes/country'));
app.use('/identification', require('./routes/identification'));
app.use('/requestReset', require('./routes/sendEmail'));
app.use('/reset', require('./routes/resetPassword'));
app.use('/tip', require('./routes/tip'));
app.use('/incomeCategory', require('./routes/incomeCategory'));
app.use('/incomeMethodPayment', require('./routes/incomeMethodPayment'));
app.use('/income', require('./routes/income'));
app.use('/expenseCategory', require('./routes/expenseCategory'));
app.use('/expenseMethodPayment', require('./routes/expenseMethodPayment'));
app.use('/expense', require('./routes/expense'));
app.use('/graphic', graphicsRoutes);
app.use('/subtract', require('./routes/subtract'));

