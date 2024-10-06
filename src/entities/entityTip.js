const { EntitySchema } = require("typeorm");

const tip = new EntitySchema({
  name: "tip",
  tableName: "tblTip",
  columns: {
      tipID: {
      primary: true,
      type: "int",
      
    },
    title: {
      type: "varchar"
    },
    content: {
      type: "text"
    },

      photo: {
      type: "text" // Cambiado a 'text' para almacenar imágenes
    },
    
  }
});

module.exports = tip;
