const { EntitySchema } = require("typeorm");
//entidad de categoria de ingresos
const expense = new EntitySchema({
    name: "expense",
    tableName: "tblExpense",
    columns: {
        expenseId: {
            primary: true,
            type: "int",
            generated: true
 
        },
        expenseDate:{
            type: "date"
        },
        expenseAmount:{
            type: "double"
        },
        expenseMethodPaymentId:{
            type: "int"
        },
        expenseCategoryId:{
            type: "int"
        },
        expenseDescription:{
            type: "text"
        },
        userId:{
            type: "int"
        }

    },
 
});
//Exportacion de la entidad
module.exports = expense;