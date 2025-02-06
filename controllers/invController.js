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

module.exports = invCont