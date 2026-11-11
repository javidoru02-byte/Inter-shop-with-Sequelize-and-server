"use strict";

const products = [
  ["Galaxy S24", "SM-S921", "Samsung", "Smartphones", 899.99, 25],
  ["Galaxy S24 Ultra", "SM-S928", "Samsung", "Smartphones", 1299.99, 12],
  ["Galaxy A55", "SM-A556", "Samsung", "Smartphones", 449.0, 40],
  ["Galaxy Tab S9", "SM-X710", "Samsung", "Tablets", 799.0, 15],
  ["Galaxy Buds2 Pro", "SM-R510", "Samsung", "Headphones", 199.0, 60],
  ["Odyssey G7", "LS27BG", "Samsung", "Monitors", 549.0, 10],
  ["iPhone 15", "A3090", "Apple", "Smartphones", 799.0, 30],
  ["iPhone 15 Pro Max", "A3106", "Apple", "Smartphones", 1199.0, 18],
  ["MacBook Air 13 M3", "MRXN3", "Apple", "Laptops", 1099.0, 14],
  ["MacBook Pro 16 M3 Max", "MRW73", "Apple", "Laptops", 3499.0, 5],
  ["iPad Air 11", "MUWD3", "Apple", "Tablets", 599.0, 22],
  ["AirPods Pro 2", "MTJV3", "Apple", "Headphones", 249.0, 50],
  ["Redmi Note 13", "23129RAA4G", "Xiaomi", "Smartphones", 249.0, 70],
  ["Xiaomi 14", "23127PN0CG", "Xiaomi", "Smartphones", 799.0, 20],
  ["Xiaomi Pad 6", "23043RP34G", "Xiaomi", "Tablets", 349.0, 25],
  ["Redmi Buds 5", "M2316E1", "Xiaomi", "Headphones", 49.0, 100],
  ["XPS 13", "9340", "Dell", "Laptops", 1299.0, 9],
  ["XPS 15", "9530", "Dell", "Laptops", 1899.0, 7],
  ["Inspiron 15", "3520", "Dell", "Laptops", 549.0, 30],
  ["UltraSharp U2723QE", "U2723QE", "Dell", "Monitors", 629.0, 11],
  ["ThinkPad X1 Carbon", "Gen 11", "Lenovo", "Laptops", 1749.0, 8],
  ["IdeaPad Slim 5", "16ABR8", "Lenovo", "Laptops", 699.0, 20],
  ["Legion 5 Pro", "16ARX8", "Lenovo", "Laptops", 1499.0, 6],
  ["Tab P12", "TB370FU", "Lenovo", "Tablets", 379.0, 16],
  ["Pavilion 15", "15-eg3000", "HP", "Laptops", 649.0, 18],
  ["Spectre x360 14", "14-ef2000", "HP", "Laptops", 1599.0, 5],
  ["HP 27f", "2G3D3AA", "HP", "Monitors", 229.0, 24],
  ["ZenBook 14 OLED", "UX3405", "Asus", "Laptops", 999.0, 12],
  ["ROG Strix G16", "G614JV", "Asus", "Laptops", 1599.0, 7],
  ["ProArt PA278QV", "PA278QV", "Asus", "Monitors", 329.0, 13],
  ["ROG Phone 8", "AI2401", "Asus", "Smartphones", 1099.0, 6],
  ["WH-1000XM5", "WH1000XM5", "Sony", "Headphones", 399.0, 35],
  ["WF-1000XM5", "WF1000XM5", "Sony", "Headphones", 299.0, 40],
  ["Bravia XR A80L 55", "XR-55A80L", "Sony", "TVs", 1799.0, 4],
  ["Xperia 1 V", "XQ-DQ72", "Sony", "Smartphones", 1399.0, 5],
  ["OLED C3 65", "OLED65C3", "LG", "TVs", 2299.0, 3],
  ["UltraGear 27GP850", "27GP850-B", "LG", "Monitors", 449.0, 9],
  ["gram 16", "16Z90R", "LG", "Laptops", 1399.0, 6],
  ["MX Master 3S", "910-006559", "Logitech", "Accessories", 99.0, 80],
  ["MX Keys S", "920-011587", "Logitech", "Accessories", 109.0, 65],
  ["G Pro X Superlight 2", "910-006630", "Logitech", "Accessories", 159.0, 45],
  ["G Pro X 2 Lightspeed", "981-001263", "Logitech", "Headphones", 249.0, 20],
  ["Swift Go 14", "SFG14-71", "Acer", "Laptops", 799.0, 15],
  ["Nitro V 15", "ANV15-51", "Acer", "Laptops", 899.0, 14],
  ["Predator XB273K", "XB273K", "Acer", "Monitors", 799.0, 5],
  ["Pura 70", "ADY-LX9", "Huawei", "Smartphones", 999.0, 10],
  ["MatePad 11.5", "BTK-W09", "Huawei", "Tablets", 329.0, 18],
  ["FreeBuds Pro 3", "T0018", "Huawei", "Headphones", 179.0, 30],
  ["MateBook D 16", "MCLF-X", "Huawei", "Laptops", 849.0, 11],
  ["Watch GT 4 Charger", "AP32", "Huawei", "Accessories", 19.0, 150],
];

module.exports = {
  async up(queryInterface) {
    const [brandRows] = await queryInterface.sequelize.query("SELECT id, title FROM brands;");
    const [categoryRows] = await queryInterface.sequelize.query("SELECT id, title FROM categories;");
    const brandId = Object.fromEntries(brandRows.map((b) => [b.title, b.id]));
    const categoryId = Object.fromEntries(categoryRows.map((c) => [c.title, c.id]));
    const now = new Date();

    await queryInterface.bulkInsert(
      "products",
      products.map(([title, model, brand, category, price, quantity]) => ({
        title,
        model,
        price,
        quantity,
        description: `${brand} ${title}`,
        brand_id: brandId[brand],
        category_id: categoryId[category],
        created_at: now,
        updated_at: now,
      })),
    );
  },
  async down(queryInterface) {
    await queryInterface.sequelize.query("TRUNCATE TABLE products RESTART IDENTITY CASCADE;");
  },
};
