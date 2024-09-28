const { EntitySchema } = require("typeorm");
//entidad de pais
const identification = new EntitySchema({
    name: "identification",
    tableName: "tblIdentificationType",
    columns: {
        typeId: {
            primary: true,
            type: "int",
 
        },
        idDescription:{
            type: "varchar"
        }

        
    },
 
});
//Exportacion de la entidad
module.exports = identification;