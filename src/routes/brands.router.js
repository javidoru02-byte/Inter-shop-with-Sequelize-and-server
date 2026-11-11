const { Router } = require("express");
const ctrl = require("../controllers/brands.controller");
const validate = require("../middlewares/validate.mw");
const { idParam, paginationQuery, brand } = require("../validation/schemas");

const router = Router();

router
  .route("/")
  .get(validate(paginationQuery, "query"), ctrl.getAll)
  .post(validate(brand.create), ctrl.create)
  .delete(validate(brand.titlesBody), ctrl.removeByTitles);

router.get("/id-greater", ctrl.getIdGreater);
router.get("/by-titles", validate(brand.titlesQuery, "query"), ctrl.getByTitles);

router
  .route("/:id")
  .all(validate(idParam, "params"))
  .get(ctrl.getById)
  .patch(validate(brand.update), ctrl.update)
  .delete(ctrl.remove);

module.exports = router;
