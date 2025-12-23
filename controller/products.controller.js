// const createHttpError = require("http-errors")
// const Products = require("../models/products")
// const { STATUS_CODE, MESSAGES } = require("../utils/constants")
// const ProductCategories = require("../models/productCategories")
// const ObjectId = require("mongoose").Types.ObjectId

// exports.productsList = async ({ query }) => {
//   let products;

//   if (query && query.categoryId) {
//     const allproducts = await ProductCategories.aggregate([
//       {
//         $match: { _id: new ObjectId(query.categoryId) }
//       },
//       {
//         $graphLookup: {
//           from: 'productcategories',
//           startWith: '$_id',
//           connectFromField: '_id',
//           connectToField: 'parentId',
//           as: 'subCategories',
//         }
//       },
//       {
//         $unwind: {
//           path: '$subCategories',
//           preserveNullAndEmptyArrays: true
//         }
//       },
//       {
//         $group: {
//           _id: '$_id',
//           subCategoryIds: {
//             $push: '$subCategories._id'
//           }
//         }
//       },
//       {
//         $set: {
//           subCategoryIds: {
//             $concatArrays: ['$subCategoryIds', ['$_id']]
//           }
//         }
//       },
//       {
//         $lookup: {
//           from: "products",
//           localField: 'subCategoryIds',
//           foreignField: 'categoryId',
//           as: 'products'
//         }
//       },
//       // {
//       //   $replaceRoot: {
//       //     newRoot: '$products'
//       //   }
//       // }
//     ])
//     console.log("ALL PRODUCTS", allproducts)
//     products = allproducts[0].products
//   }
//   else {
//     products = await Products.find({})
//   }

//   if (products.length === 0) {
//     throw new createHttpError(STATUS_CODE.NOT_FOUND, MESSAGES.PRODUCT_NOT_FOUND)
//   }
//   return products
// }

// exports.productCreate = async (data) => {
//   const newProduct = await Products.create({
//     name: data.name,
//     categoryId: data.categoryId,
//     description: data.description,
//     price: data.price,
//     stock: data.stock,
//     color: data.color
//   })
//   return newProduct
// }

const createHttpError = require("http-errors");
const Products = require("../models/products");
const ProductCategories = require("../models/productCategories");
const { STATUS_CODE, MESSAGES } = require("../utils/constants");
const ObjectId = require("mongoose").Types.ObjectId;

exports.productsList = async ({ query }) => {
  let products;

  if (query?.categoryId) {
    if (!ObjectId.isValid(query.categoryId)) {
      throw new createHttpError.BadRequest("Invalid categoryId");
    }

    const result = await ProductCategories.aggregate([
      {
        $match: { _id: new ObjectId(query.categoryId) }
      },
      {
        $graphLookup: {
          from: "productcategories",
          startWith: "$_id",
          connectFromField: "_id",
          connectToField: "parentId",
          as: "allCategories",
        }
      },
      {
        $project: {
          allCategoryIds: {
            $concatArrays: [
              ["$_id"],
              { $map: { input: "$allCategories", as: "cat", in: "$$cat._id" } }
            ]
          }
        }
      }
    ]);
    const categoryIds = result?.[0]?.allCategoryIds || [];

    products = await Products.find({ categoryId: { $in: categoryIds } }).populate("categoryId", "name");
  } else {
    products = await Products.find({});
  }

  if (!products.length) {
    throw new createHttpError(STATUS_CODE.NOT_FOUND, MESSAGES.PRODUCT_NOT_FOUND);
  }

  return products;

};

exports.productCreate = async (data) => {
  console.log('data', data)
  if (Object.keys(data).length === 0) {
    throw new createHttpError(STATUS_CODE.BAD_REQUEST, MESSAGES.DELETE_CATEGORY_ERROR)
  }
  if (data.id) {
    try {
      const product = await Products.findById(data.id)
      if (!product) {
        throw new createHttpError(STATUS_CODE.NOT_FOUND, MESSAGES.PRODUCT_NOT_FOUND)
      }
      if (data.name) {
        product.name = data.name;
      }
      if (data.price) {
        product.price = data.price;
      }
      if (data.description) {
        product.description = data.description;
      }
      if (data.categoryId) {
        product.categoryId = data.categoryId;
      }
      // if (data.isActive) {
      product.isActive = data.isActive;
      // }
      await product.save()
      return product
    } catch (error) {
      console.log('error', error)
      if (error.code === STATUS_CODE.DUPLICATE_KEY) {
        throw new createHttpError(STATUS_CODE.BAD_REQUEST, MESSAGES.CATEGORY_ALREADY_EXISTS)

      } else {
        throw new createHttpError(STATUS_CODE.INTERNAL_SERVER_ERROR, MESSAGES.SOMETHING_WENT_WRONG)
      }
    }
  }
  else {
    const newProduct = await Products.create({
      name: data.name,
      categoryId: data.categoryId,
      description: data.description,
      price: data.price,
      stock: data.stock,
      color: data.color
    });
    return newProduct;
  }
};


