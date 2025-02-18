const { parse } = require("dotenv")
const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}


invCont.getDetails = async (req, res, next) => {
    let id = req.params.id
//  console.log(id)
    let data = await invModel.getDetailsById(id)
    let details = await utilities.buildDetailsView(data)
    let nav = await utilities.getNav()
    res.render("./inventory/detail", {
      title: data.inv_make + " " + data.inv_model,
      nav,
      details
    })
}

invCont.buildManagement = async (req, res, next) => {
  let nav = await utilities.getNav()
  const list = await utilities.buildClassificationList()
  res.render("./inventory/management", {
    title: "Inventory Management",
    nav,
    errors: null,
    list,
  })
}
/* ****************************************
*  Deliver add classification view
* *************************************** */
invCont.buildAddClassification = async (req, res, next) => {
  let nav = await utilities.getNav()
  res.render("./inventory/add-classification", {
    title: "Add New Classification",
    nav,
    errors: null
  })
}

/* ****************************************
*  Process addClassification
* *************************************** */
invCont.addClassification = async (req, res) => {
  let nav = await utilities.getNav()
  const { classification_name } = req.body
  const classificationResult = await invModel.addClassification(classification_name)
  if (classificationResult) {
    nav = await utilities.getNav();
    req.flash("notice", `The classification ${classification_name} was added successfully.`)
    res.status(201).render("inventory/management", {
      title: "Management",
      nav,
      errors: null,
    });
    
  } else {
    req.flash("notice", "Sorry, the classification could not be added.")
    res.status(501).render("./inventory/add-classification", {
      title: "Add New Classification",
      nav,
      errors: null,
    })
  }
}

/* ****************************************
*  Deliver addInventory view
* *************************************** */
invCont.buildAddInventory = async (req, res, next) => {
  let nav = await utilities.getNav()
  let list = await utilities.buildClassificationList()
  res.render("./inventory/add-inventory", {
    title: "Add New Inventory",
    nav,
    list,
    errors: null
  })
}
/* ****************************************
*  Process addInventory
* *************************************** */
invCont.addInventory = async (req, res) => {
  let nav = await utilities.getNav()
  let list = await utilities.buildClassificationList()
  const { classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color } = req.body
  const inventoryResult = await invModel.addInventory(classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color)
  console.log(inventoryResult);
  if (inventoryResult) {``
    nav = await utilities.getNav();
    req.flash("notice", `The vehicle ${inv_make} ${inv_model} was added successfully.`)
    res.status(201).render("./inventory/management", {
      title: "Management",
      nav,
      list,
      errors: null,
    });
  } else {
    console.log('made it to the else');
    list = await utilities.buildClassificationList();
    req.flash("notice", "Sorry, the vehicle could not be added.")
    res.status(501).render("./inventory/add-inventory", {
      title: "Add New Inventory",
      nav,
      list,
      errors: null,
    })
  }
}

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

/* ***************************
 *  Build edit inventory view
 * ************************** */
invCont.editInventoryView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  const itemData = await invModel.getDetailsById(inv_id)
  const list = await utilities.buildClassificationList(itemData.classification_id)
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render("./inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    list: list,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id
  })
}

/* ***************************
 *  Process updateInventory
 * ************************** */

invCont.updateInventory = async function (req, res) {
  let nav = await utilities.getNav();
  const {
    classification_id,
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
  } = req.body;

  const updateResult = await invModel.updateInventory(
    inv_id,
    classification_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color
  );

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash(
      "notice",
      `${itemName} was successfully updated.`
    );
    res.redirect("/inv/")
  } else {
    const options = await utilities.getOptions();
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, failed to update inventory.");
    res.status(501).render("inventory/edit-inventory", {
      title: "Edit" + itemName,
      options: options,
      nav,
      errors: null,
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id
    });
  }
};

/* ***************************
 *  Delete Inventory Item
 * ************************** */
invCont.deleteView = async (req, res) => {
  const inv_id = parseInt(req.params.inv_id)
  //console.log("THIS IS THE INV ID ----------> " + inv_id)
  let nav = await utilities.getNav();
  const itemData = await invModel.getDetailsById(inv_id)
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render("./inventory/delete-confirm", {
    title: "Delete " + itemName,
    nav,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_price: itemData.inv_price,
  });
};

invCont.deleteItem = async (req, res) => {
  let nav = await utilities.getNav();
  const inv_id = parseInt(req.body.inv_id)
  classificationiSelect = await utilities.buildClassificationList()
  //console.log("THIS IS THE INV ID IN DELETE ITEM ----------> " + inv_id)
  let inv_make = req.body.inv_make
  let inv_model = req.body.inv_model
  const deleteResult = await invModel.deleteInventoryItem(inv_id)

  if (deleteResult) {
    req.flash("notice", `The ${inv_make} ${inv_model} was deleted successfully.`)
    res.redirect("/inv/")
  } else {
    req.flash("notice", "Sorry, failed to delete inventory.")
    res.redirect("/inv/delete/inv_id")
  }
}

module.exports = invCont