const createHttpError = require("http-errors")
const ProductCategories = require("../models/productCategories")
const { STATUS_CODE, MESSAGES } = require("../utils/constants")


//WITHOUT USING AGGREGATION
// exports.getCategories = async () => {
//   const buildCategoryTree = async (parentId = null) => {
//     const categories = await ProductCategories.find({ parentId });
//     return Promise.all(categories.map(async (category) => {
//       const children = await buildCategoryTree(category._id);
//       return {
//         ...category.toObject(),
//         subCategories: children
//       };
//     }));
//   };

//   const categoryTree = await buildCategoryTree();

//   if (!categoryTree.length) {
//     throw new createHttpError(STATUS_CODE.NOT_FOUND, MESSAGES.CATEGORIES_NOT_FOUND);
//   }

//   return categoryTree;
// };

// GET ALL CATEGORIES WITH SUBCATEGORIES
exports.getCategories = async () => {
  const categories = await ProductCategories.aggregate([
    {
      $match: { parentId: null, isActive: true }
    },
    {
      $graphLookup: {
        from: 'productcategories',
        startWith: '$_id',
        connectFromField: '_id',
        connectToField: 'parentId',
        as: 'subCategories',
        restrictSearchWithMatch: { isActive: true }
      }
    }
  ]);

  if (!categories.length) {
    throw new createHttpError(STATUS_CODE.NOT_FOUND, MESSAGES.CATEGORIES_NOT_FOUND);
  }


  const buildTree = (parent, items) => {
    const children = items.filter(item => String(item.parentId) === String(parent._id));
    return {
      ...parent,
      subCategories: children.map(child => buildTree(child, items))
    };
  };

  const categoryTree = categories.map(cat =>
    buildTree(cat, [cat, ...cat.subCategories])
  );

  return categoryTree;
};

// CREATE A NEW CATEGORY
exports.createCategory = async (data) => {
  const slug = data.name.toLowerCase().replace(/ /g, '_').replace(/[^a-z0-9_]/g, '');
  try {
    const category = new ProductCategories({
      name: data.name,
      description: data.description,
      parentId: data.parentId || null,
      slug: slug
    });

    await category.save();
    return category;
  } catch (error) {
    if (error.code === STATUS_CODE.DUPLICATE_KEY) {
      throw new createHttpError(STATUS_CODE.BAD_REQUEST, MESSAGES.CATEGORY_ALREADY_EXISTS)

    } else {
      throw new createHttpError(STATUS_CODE.INTERNAL_SERVER_ERROR, MESSAGES.SOMETHING_WENT_WRONG)
    }
  }
};

// UPDATE A CATEGORY
exports.updateCategory = async (id, data) => {
  if (Object.keys(data).length === 0) {
    throw new createHttpError(STATUS_CODE.BAD_REQUEST, MESSAGES.DELETE_CATEGORY_ERROR)
  }
  try {
    const category = await ProductCategories.findById(id)
    if (!category) {
      throw new createHttpError(STATUS_CODE.NOT_FOUND, MESSAGES.CATEGORY_NOT_FOUND)
    }
    if (data.name) {
      category.name = data.name;
      category.slug = data.name.toLowerCase().replace(/ /g, '_').replace(/[^a-z0-9_]/g, '');
    }
    if (data.description) {
      category.description = data.description;
    }
    if (data.parentId) {
      category.parentId = data.parentId;
    }
    // if (data.isActive) {
    category.isActive = data.isActive;
    // }
    await category.save()
    return category
  } catch (error) {
    if (error.code === STATUS_CODE.DUPLICATE_KEY) {
      throw new createHttpError(STATUS_CODE.BAD_REQUEST, MESSAGES.CATEGORY_ALREADY_EXISTS)

    } else {
      throw new createHttpError(STATUS_CODE.INTERNAL_SERVER_ERROR, MESSAGES.SOMETHING_WENT_WRONG)
    }
  }
}

// DELETE A CATEGORY
exports.deleteCategory = async (id) => {
  const category = await ProductCategories.findById(id);
  if (!category) {
    throw new createHttpError(STATUS_CODE.NOT_FOUND, MESSAGES.CATEGORY_NOT_FOUND)
  }

  const subCategories = await ProductCategories.find({ parentId: id })

  if (subCategories.length > 0) {
    throw new createHttpError(STATUS_CODE.BAD_REQUEST, MESSAGES.DELETE_CATEGORY_ERROR)
  }
  await ProductCategories.deleteOne({ _id: id })

  return { message: "Category deleted successfully" }
}
