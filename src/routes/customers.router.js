const { Router } = require("express");
const ctrl = require("../controllers/customers.controller");
const validate = require("../middlewares/validate.mw");
const { idParam, paginationQuery, customer } = require("../validation/schemas");

const router = Router();

router
  .route("/")
  .get(validate(paginationQuery, "query"), ctrl.getAll)
  .post(validate(customer.create), ctrl.create)
  .delete(validate(customer.emailsBody), ctrl.removeByEmails);

router.get("/id-greater", ctrl.getIdGreater);
router.get("/by-last-names", validate(customer.lastNamesQuery, "query"), ctrl.getByLastNames);
router.post("/login", validate(customer.login), ctrl.login);

router.get("/top-buyer", ctrl.getTopBuyer);
router.get("/most-expensive-purchase", ctrl.getMostExpensiveBuyer);

router
  .route("/:id")
  .all(validate(idParam, "params"))
  .get(ctrl.getById)
  .patch(validate(customer.update), ctrl.update)
  .delete(ctrl.remove);

module.exports = router;
