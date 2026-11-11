const { Router } = require("express");
const ctrl = require("../controllers/orders.controller");
const validate = require("../middlewares/validate.mw");
const { idParam, paginationQuery, order } = require("../validation/schemas");

const router = Router();

router
  .route("/")
  .get(validate(paginationQuery, "query"), ctrl.getAll)
  .post(validate(order.create), ctrl.create);

router.get("/by-statuses", validate(order.statusesQuery, "query"), ctrl.getByStatuses);

router
  .route("/:id")
  .all(validate(idParam, "params"))
  .get(ctrl.getById)
  .patch(validate(order.update), ctrl.update)
  .delete(ctrl.remove);

module.exports = router;
