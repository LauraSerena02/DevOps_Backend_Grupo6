const { EntitySchema } = require("typeorm");
//Entidad de token
const token = new EntitySchema({
    name: "token",
    tableName: "tblToken",
    columns: {
        tokenId: {
            primary: true,
            type: "int",
            generated: true
 
        },
        email:{
            type: "varchar"
        },
        tokenInfo:{
            type: "text"
        },
        tokenExpirationDate:{
            type: "datetime"
        }


        
    },
 
});
//Exportacion de la entidad
module.exports = token;