import { Op } from "sequelize";

export const filterProductsMw = (req, res, next) => {
  try {
    const searchQuery = {};
    // by price
    if (req.query.minPrice || req.query.maxPrice) {
      const priceFilterArray = [];
      if (req.query.minPrice) {
        priceFilterArray.push(req.query.minPrice);
        searchQuery.price = { [Op.gte]: priceFilterArray };
      }
      if (req.query.maxPrice) {
        priceFilterArray.push(req.query.maxPrice);
        searchQuery.price = { [Op.lte]: priceFilterArray };
      }
      if (req.query.minPrice && req.query.maxPrice) {
        searchQuery.price = { [Op.between]: priceFilterArray };
      }
    }
    // by name
    if (req.query.name) {
      searchQuery.name = { [Op.iLike]: `%${req.query.name}%` };
    }
    // by category
    if (req.query.category) {
      searchQuery.category = { [Op.iLike]: req.query.category };
    }
    res.searchQuery = searchQuery;
    next();
  } catch (error) {}
};
