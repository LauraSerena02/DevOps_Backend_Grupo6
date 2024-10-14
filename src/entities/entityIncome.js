const { EntitySchema } = require("typeorm");
//entidad de categoria de ingresos
const income = new EntitySchema({
    name: "income",
    tableName: "tblIncome",
    columns: {
        incomeId: {
            primary: true,
            type: "int",
            generated: true
 
        },
        incomeDate:{
            type: "date"
        },
        incomeAmount:{
            type: "double"
        },
        incomeMethodPaymentId:{
            type: "int"
        },
        incomeCategoryId:{
            type: "int"
        },
        incomeDescription:{
            type: "text"
        },
        userId:{
            type: "int"
        }

    },
 
});
//Exportacion de la entidad
module.exports = income;