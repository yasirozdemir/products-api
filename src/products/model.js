import { DataTypes } from "sequelize";
import CategoriesModel from "../categories/model.js";
import sequelize from "../dbConfig.js";
import ProductCategoryModel from "../product_category/model.js";

const ProductsModel = sequelize.define("product", {
  productId: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  name: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  imageUrl: {
    type: DataTypes.STRING(150),
    allowNull: false,
  },
  price: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  // timestamps are true by default (createdAt, updatedAt)
});

ProductsModel.belongsToMany(CategoriesModel, {
  through: ProductCategoryModel,
  foreignKey: { name: "productId", allowNull: false },
});
CategoriesModel.belongsToMany(ProductsModel, {
  through: ProductCategoryModel,
  foreignKey: { name: "categoryId", allowNull: false },
});

export default ProductsModel;
