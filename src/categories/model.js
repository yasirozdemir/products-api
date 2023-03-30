import { DataTypes } from "sequelize";
import sequelize from "../dbConfig.js";

const CategoriesModel = sequelize.define("category", {
  categoryId: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  name: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
});

export default CategoriesModel;
