const { Router } = require("express");
const ctrl = require("../controllers/products.controller");
const validate = require("../middlewares/validate.mw");
const { idParam, paginationQuery, product } = require("../validation/schemas");

const router = Router();

router
  .route("/")
  .get(validate(paginationQuery, "query"), ctrl.getAll)
  .post(validate(product.create), ctrl.create)
  .delete(validate(product.idsBody), ctrl.removeByIds);

router.get("/id-greater", ctrl.getIdGreater);
router.get("/by-brands", validate(product.brandIdsQuery, "query"), ctrl.getByBrands);
router.patch("/price", validate(product.priceChange), ctrl.changePrice);

router
  .route("/:id")
  .all(validate(idParam, "params"))
  .get(ctrl.getById)
  .patch(validate(product.update), ctrl.update)
  .delete(ctrl.remove);

module.exports = router;
