const { Router } = require("express");

const router = Router();

router.use("/brands", require("./brands.router"));
router.use("/categories", require("./categories.router"));
router.use("/products", require("./products.router"));
router.use("/customers", require("./customers.router"));
router.use("/addresses", require("./addresses.router"));
router.use("/orders", require("./orders.router"));

module.exports = router;
