const { EntitySchema } = require("typeorm");
//entidad de categoria de ingresos
const expenseCategory = new EntitySchema({
    name: "expenseCategory",
    tableName: "tblExpenseCategory",
    columns: {
        expenseCategoryId: {
            primary: true,
            type: "int",
 
        },
        categoryName:{
            type: "varchar"
        }

        
    },
 
});
//Exportacion de la entidad
module.exports = expenseCategory;