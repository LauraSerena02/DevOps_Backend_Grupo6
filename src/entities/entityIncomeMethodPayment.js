const { EntitySchema } = require("typeorm");
//entidad de métodos de pago de ingresos
const incomeMethodPayment = new EntitySchema({
    name: "incomeMethodPayment",
    tableName: "tblIncomeMethodPayment",
    columns: {
        incomeMethodPaymentId: {
            primary: true,
            type: "int",
 
        },
        incomeMethodPaymentName:{
            type: "varchar"
        }

        
    },
 
});
//Exportacion de la entidad
module.exports = incomeMethodPayment;