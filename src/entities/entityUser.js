const { EntitySchema } = require("typeorm");
//Entidad de usuario, posee todos los atributos de la tabla usuario
const user = new EntitySchema({
    name: "user",
    tableName: "tblUser",
    columns: {
        userId: {
            primary: true,
            type: "int",
            generated: true,
 
        },
              userName: {
            type: "varchar"
        },
        userLastName: {
            type: "varchar"
        },
        typeId:{
            type: "int"
        },

        idNumber:{
            type: "varchar"
        },
        email: {
            type: "varchar",
 
        },
        countryId: {
            type: "int",
 
        },
        password: {

            type: "varchar",
 
        },
        phone: {
            type: "varchar",
 
        },

    },
 
});
//Exportacion de la entidad
module.exports = user;