// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities")
const invValidate = require("../utilities/inventory-validation")

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route to build details view
router.get("/detail/:id", utilities.handleErrors(invController.getDetails));

// Route to build inventory management view
router.get("/", utilities.handleErrors(invController.buildManagement));


// Route to add classification
router.get("/add-classification", utilities.handleErrors(invController.buildAddClassification));
router.post("/add-classification",
    invValidate.addClassificationRules(),
    invValidate.checkAddClassificationData,
    utilities.handleErrors(invController.addClassification));

    // Route to add inventory
router.get("/add-inventory", utilities.handleErrors(invController.buildAddInventory));
router.post("/add-inventory", 
    invValidate.addInventoryRules(),
    invValidate.checkAddInventoryData,
    utilities.handleErrors(invController.addInventory));

router.get(
    "/getInventory/:classification_id", 
    utilities.handleErrors(invController.getInventoryJSON))

//Route to modify Inventory view
router.get("/edit/:inv_id", 
    utilities.handleErrors(invController.editInventoryView))

//Route to edit Inventory data
router.post("/update/",
    utilities.handleErrors(invController.updateInventory))
module.exports = router;