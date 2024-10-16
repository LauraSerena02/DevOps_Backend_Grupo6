const { EntitySchema } = require("typeorm");
//entidad de categoria de ingresos
const incomeCategory = new EntitySchema({
    name: "incomeCategory",
    tableName: "tblIncomeCategory",
    columns: {
        incomeCategoryId: {
            primary: true,
            type: "int",
 
        },
        incomeName:{
            type: "varchar"
        }

        
    },
 
});
//Exportacion de la entidad
module.exports = incomeCategory;