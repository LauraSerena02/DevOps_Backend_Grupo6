const { EntitySchema } = require("typeorm");
//entidad de pais
const country = new EntitySchema({
    name: "country",
    tableName: "tblCountry",
    columns: {
        countryId: {
            primary: true,
            type: "int",
 
        },
        countryName:{
            type: "varchar"
        }

        
    },
 
});
//Exportacion de la entidad
module.exports = country;