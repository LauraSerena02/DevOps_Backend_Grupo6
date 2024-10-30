const { EntitySchema } = require("typeorm");
//entidad de métodos de pago de ingresos
const expenseMethodPayment = new EntitySchema({
    name: "expenseMethodPayment",
    tableName: "tblExpenseMethodPayment",
    columns: {
        expenseMethodPaymentId: {
            primary: true,
            type: "int",
 
        },
        expenseMethodPaymentName:{
            type: "varchar"
        }

        
    },
 
});
//Exportacion de la entidad
module.exports = expenseMethodPayment;