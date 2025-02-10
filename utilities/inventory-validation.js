const utilities = require(".");
const { body, validationResult } = require("express-validator");
const invModel = require("../models/inventory-model")
const validate = {};


/* ******************************
 *  Add Classification Data Validation Rules
 * ***************************** */
validate.addClassificationRules = () => {
  return [
    body("classification_name")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Classification name is required.")
      .isLength({ min: 3 })
      .withMessage("Classification name must be at least 3 characters long.")
      .matches(/^[A-Za-z\s]+$/)
      .withMessage("Classification name must contain only alphabetic characters.")
      .custom(async (value) => {
        const exists = await invModel.checkExistingClassification(value);
        if (exists) {
          throw new Error("This classification name already exists.");
        }
        return true;
      }),
  ];
};

validate.checkAddClassificationData = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    return res.render("inventory/add-classification", {
      errors,
      title: "Add New Classification",
      nav,
      classification_name: req.body.classification_name,
    });
  }
  next();
};


/* ******************************
 *  Add Inventory Data Validation Rules
 * ***************************** */
validate.addInventoryRules = () => {
  return [
    //classification_id is required and must be integer
    body("classification_id")
      .trim()
      .escape()
      .notEmpty()
      .isInt()
      .withMessage("Please provide a classification id."), // on error this message is sent.

    // make is required and must be string 3 characters or more
    body("inv_make")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 3 })
      .withMessage("Please provide a make."), // on error this message is sent.

      // model is required and must be string 3 characters or more
    body("inv_model")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 3 })
      .withMessage("Please provide a model."), // on error this message is sent.

    // description is required and must be string
    body("inv_description")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide a description."), // on error this message is sent.

    // image is required and must be string
    body("inv_image")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide an image."), // on error this message is sent.

    // thumbnail is required and must be string
    body("inv_thumbnail")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide a thumbnail."), // on error this message is sent.

      // price is required and must be number decimal or integer
    body("inv_price")
      .trim()
      .escape()
      .notEmpty()
      .isNumeric()
      .withMessage("Please provide a price."), // on error this message is sent.

      // year is required and must be 4 digits integer
      body("inv_year")
        .trim()
        .escape()
        .notEmpty()
        .isInt({ min: 1900, max: 2099 })
        .withMessage("Please provide a year."), // on error this message is sent.

        // miles is required and must be number integer
        body("inv_miles")
          .trim()
          .escape()
          .notEmpty()
          .isInt()
          .withMessage("Please provide a mileage."), // on error this message is sent.

          // color is required and must be string
          body("inv_color")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 1 })
            .withMessage("Please provide a color."), // on error this message is sent.
  ];
};

validate.checkAddInventoryData = async (req, res, next) => {
  const { classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("inventory/add-inventory", {
      errors,
      title: "Add New Inventory",
      nav,
      classification_id,
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
    });
    return;
  }
  next();
};


module.exports = validate;