const { Router } = require("express");
const ctrl = require("../controllers/addresses.controller");
const validate = require("../middlewares/validate.mw");
const { idParam, paginationQuery, address } = require("../validation/schemas");

const router = Router();

router
  .route("/")
  .get(validate(paginationQuery, "query"), ctrl.getAll)
  .post(validate(address.create), ctrl.create);

router
  .route("/:id")
  .all(validate(idParam, "params"))
  .get(ctrl.getById)
  .patch(validate(address.update), ctrl.update)
  .delete(ctrl.remove);

module.exports = router;
