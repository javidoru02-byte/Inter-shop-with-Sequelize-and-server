const yup = require("yup");

const id = yup.number().integer().positive();
const idList = yup.array().of(id.required()).min(1).required();
const stringList = yup.array().of(yup.string().trim().required()).min(1).required();

const csv = (itemSchema) =>
  yup
    .array()
    .transform((value, original) =>
      typeof original === "string" ? original.split(",").map((s) => s.trim()).filter(Boolean) : value,
    )
    .of(itemSchema.required())
    .min(1)
    .required();

const idParam = yup.object({ id: id.required() });

const paginationQuery = yup.object({
  limit: yup.number().integer().min(1).max(10).default(10),
  offset: yup.number().integer().min(0).default(0),
});

const brand = {
  create: yup.object({
    title: yup.string().trim().max(64).required(),
    country: yup.string().trim().max(64).nullable(),
    description: yup.string().trim().nullable(),
  }),
  update: yup.object({
    title: yup.string().trim().max(64),
    country: yup.string().trim().max(64).nullable(),
    description: yup.string().trim().nullable(),
  }),
  titlesQuery: yup.object({ titles: csv(yup.string().trim()) }),
  titlesBody: yup.object({ titles: stringList }),
};

const category = {
  create: yup.object({
    title: yup.string().trim().max(64).required(),
    description: yup.string().trim().nullable(),
  }),
  update: yup.object({
    title: yup.string().trim().max(64),
    description: yup.string().trim().nullable(),
  }),
};

const product = {
  create: yup.object({
    title: yup.string().trim().max(128).required(),
    model: yup.string().trim().max(64).nullable(),
    price: yup.number().min(0).required(),
    quantity: yup.number().integer().min(0).default(0),
    description: yup.string().trim().nullable(),
    brandId: id.required(),
    categoryId: id.required(),
  }),
  update: yup.object({
    title: yup.string().trim().max(128),
    model: yup.string().trim().max(64).nullable(),
    price: yup.number().min(0),
    quantity: yup.number().integer().min(0),
    description: yup.string().trim().nullable(),
    brandId: id,
    categoryId: id,
  }),
  idsBody: yup.object({ ids: idList }),
  brandIdsQuery: yup.object({ brandIds: csv(id) }),
  priceChange: yup.object({
    brandIds: idList,
    percent: yup.number().min(-90).max(500).notOneOf([0]).required(),
  }),
};

const customer = {
  create: yup.object({
    firstName: yup.string().trim().max(64).required(),
    lastName: yup.string().trim().max(64).required(),
    email: yup.string().trim().required(),
    password: yup.string().min(6).max(64).required(),
    phone: yup.string().trim().max(20).nullable(),
  }),
  update: yup.object({
    firstName: yup.string().trim().max(64),
    lastName: yup.string().trim().max(64),
    email: yup.string().trim(),
    password: yup.string().min(6).max(64),
    phone: yup.string().trim().max(20).nullable(),
  }),
  emailsBody: yup.object({ emails: stringList }),
  lastNamesQuery: yup.object({ lastNames: csv(yup.string().trim()) }),
  login: yup.object({
    email: yup.string().trim().required(),
    password: yup.string().required(),
  }),
};

const address = {
  create: yup.object({
    customerId: id.required(),
    country: yup.string().trim().max(64).required(),
    city: yup.string().trim().max(64).required(),
    street: yup.string().trim().max(128).required(),
    zip: yup.string().trim().max(16).nullable(),
  }),
  update: yup.object({
    country: yup.string().trim().max(64),
    city: yup.string().trim().max(64),
    street: yup.string().trim().max(128),
    zip: yup.string().trim().max(16).nullable(),
  }),
};

const STATUSES = ["new", "paid", "shipped", "delivered", "cancelled"];
const order = {
  create: yup.object({
    customerId: id.required(),
    status: yup.string().oneOf(STATUSES).default("new"),
    items: yup
      .array()
      .of(
        yup.object({
          productId: id.required(),
          quantity: yup.number().integer().min(1).default(1),
        }),
      )
      .min(1)
      .required(),
  }),
  update: yup.object({ status: yup.string().oneOf(STATUSES).required() }),
  statusesQuery: yup.object({ statuses: csv(yup.string().oneOf(STATUSES)) }),
};

module.exports = {
  idParam,
  paginationQuery,
  brand,
  category,
  product,
  customer,
  address,
  order,
};
