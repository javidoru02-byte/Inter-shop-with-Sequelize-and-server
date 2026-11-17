# Inter-shop with Sequelize and server

REST API інтернет-магазину: **Express 5 + Sequelize + PostgreSQL**.

## Швидкий старт

Потрібно: **Node.js 18+** і запущений **PostgreSQL**.

```bash
npm install
cp .env.example .env
```

Відкрийте `.env` і вкажіть **логін і пароль вашого локального PostgreSQL** (`DB_USER`, `DB_PASSWORD`).

```bash
npm run db:setup
npm start
```

`npm run db:setup` створює базу (якщо її ще немає), запускає міграції і заповнює таблиці тестовими даними.
Команду можна запускати повторно — вона нічого не зламає.

Сервер: http://localhost:3000

Якщо щось не так, сервер і `db:setup` пишуть підказку (`Hint: ...`): невірний пароль, база не створена, PostgreSQL не запущено, порт зайнятий.

## Команди sequelize-cli

| Команда | Що робить |
|---|---|
| `npm run db:create` / `npx sequelize db:create` | створити базу |
| `npm run migrate` / `npx sequelize db:migrate` | міграції |
| `npm run seed` / `npx sequelize db:seed:all` | тестові дані |
| `npm run migrate:undo` | відкотити всі міграції |
| `npm run seed:undo` | видалити тестові дані |
| `npm run db:reset` | відкотити все, накотити міграції і сідери заново |
| `npm run db:drop` | видалити базу |

## Таблиці та зв'язки

| Таблиця | Модель | Зв'язки |
|---|---|---|
| `brands` | `Brand` | `hasMany(Product)` |
| `categories` | `Category` | `hasMany(Product)` |
| `products` | `Product` | `belongsTo(Brand)`, `belongsTo(Category)`, `belongsToMany(Order)` через `OrderItem` |
| `customers` | `Customer` | `hasOne(Address)`, `hasMany(Order)` |
| `addresses` | `Address` | `belongsTo(Customer)` |
| `orders` | `Order` | `belongsTo(Customer)`, `belongsToMany(Product)` через `OrderItem` |
| `order_items` | `OrderItem` | `belongsTo(Order)`, `belongsTo(Product)` |

У міграціях зовнішні ключі задані через `references`.

`customers.password` шифрується bcrypt (хуки `beforeCreate` / `beforeUpdate`) і не повертається в API.
`customers.email` перевіряється засобами Sequelize (`isEmail`) і унікальний.

Паролі тестових покупців: `Password1!`, `Password2!`, … (номер = id покупця).

## Запити

| № | Опис | Ендпоінт |
|---|---|---|
| 1 | Усі дані, максимум 10 рядків | `GET /api/products`, `GET /api/brands`, `GET /api/customers` |
| 2 | id більший за значення (за замовчуванням — середина таблиці) | `GET /api/products/id-greater?value=25` |
| 3 | Кілька значень одного атрибуту | `GET /api/brands/by-titles?titles=Samsung,Dell,Xiaomi` |
| 4 | Видалення за масивом значень | `DELETE /api/products` з `{ "ids": [..] }` |
| 5 | Зміна даних | `PATCH /api/products/price` з `{ "brandIds": [10, 11], "percent": -10 }` |
| JOIN | Покупець з найбільшою кількістю покупок | `GET /api/customers/top-buyer` |
| JOIN | Покупець, який купив найдорожчий товар | `GET /api/customers/most-expensive-purchase` |

## Тести

Розширення **REST Client** для VS Code. Запустіть сервер, відкрийте файли з `tests/` і натискайте **Send Request** згори донизу.
