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
  res.render("./inventory/management", {
    title: "Inventory Management",
    nav,
    errors: null
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
*  Deliver add inventory view
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

module.exports = invCont