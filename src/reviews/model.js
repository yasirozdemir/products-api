import { DataTypes } from "sequelize";
import sequelize from "../dbConfig.js";
import ProductsModel from "../products/model.js";
import UsersModel from "../users/model.js";

const ReviewsModel = sequelize.define("review", {
  reviewId: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
});

// one-to-many relationship between user and review
UsersModel.hasMany(ReviewsModel, {
  foreignKey: { name: "userId", allowNull: false },
});
ReviewsModel.belongsTo(UsersModel, {
  foreignKey: { name: "userId", allowNull: false },
});

// one-to-many relationship between product and review
ProductsModel.hasMany(ReviewsModel, {
  foreignKey: { name: "productId", allowNull: false },
});
ReviewsModel.belongsTo(ProductsModel, {
  foreignKey: { name: "productId", allowNull: false },
});

export default ReviewsModel;
