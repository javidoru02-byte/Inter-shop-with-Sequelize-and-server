const { Router } = require("express");
const ctrl = require("../controllers/categories.controller");
const validate = require("../middlewares/validate.mw");
const { idParam, paginationQuery, category } = require("../validation/schemas");

const router = Router();

router
  .route("/")
  .get(validate(paginationQuery, "query"), ctrl.getAll)
  .post(validate(category.create), ctrl.create);

router
  .route("/:id")
  .all(validate(idParam, "params"))
  .get(ctrl.getById)
  .patch(validate(category.update), ctrl.update)
  .delete(ctrl.remove);

module.exports = router;
