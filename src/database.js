//Instanciamiento de todos los modulos necesarios
const typeorm = require("typeorm");
const identification = require("./entities/entityIdentificationType");
const country = require('./entities/entityCountry');
const user = require('./entities/entityUser');
const token = require('./entities/entityToken');
const tip= require('./entities/entityTip');
const income =require ('./entities/entityIncome')
const dotenv = require('dotenv');
const incomeCategory = require("./entities/entityIncomeCategory");
const incomeMethodPayment = require("./entities/entityincomeMethodPayment");

dotenv.config();

//Instancia de DataSource de typeorm con la configuración  para conectarse a una base de datos MySQL.
const dataSource = new typeorm.DataSource({
    type: "mysql",
    host: process.env.host,
    port: process.env.portdb,
    username: process.env.usernamedb,
    password: process.env.password,
    database: process.env.database,
    synchronize: false,
    entities: [user, country, identification, token, tip, incomeCategory, incomeMethodPayment, income]
});

//Funcion de conexion a la base de datos
async function connection() {
    try { ////Si o si espera que se conecte a la base de datos, sin esto, se dispara el mensaje primero
        await dataSource.initialize(); 
        console.log('Se ha conectado la base de datos');
    } catch (error) {
        console.log('Ha ocurrido un error ' + error);
    }
}

//Exportacion de los modulos para cualquier archivo JavaScript
module.exports = { connection, dataSource };