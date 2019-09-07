const Sequelize = require('sequelize');

const conn = new Sequelize(process.env.DATABASE_URL || 'postgres://localhost/acme_product_offering_db')
const uuidDefinition = {
    type: Sequelize.UUID,
    primaryKey: true,
    defaultValue: Sequelize.UUIDV4,
}

const Product = conn.define('product', {
    id: uuidDefinition,
    name: {
        type: Sequelize.STRING,
        unique: true
    },
    suggestedPrice: {
        type: Sequelize.DECIMAL
    }
})
const Company = conn.define('company', {
    id: uuidDefinition,
    name: {
        type: Sequelize.STRING,
        unique: true
    }
})
const Offering = conn.define('offering', {
    id: uuidDefinition,
    price: {
        type: Sequelize.DECIMAL,
    }
})
Offering.belongsTo(Product);
Product.hasMany(Offering);
Offering.belongsTo(Company);
Company.hasMany(Offering);

const map = (data, model) => data.map(item => model.create(item))

const syncAndSeed = async () => {
    await conn.sync({ force: true });
    const acmeProduct = [
        { name: 'shoe', suggestedPrice: 100.0 },
        { name: 'shirt', suggestedPrice: 88.0 },
        { name: 'coat', suggestedPrice: 89.0 }
    ]
    const acmeCompany = [
        { name: 'acme1' },
        { name: 'acme2' },
        { name: 'acme3' },
    ]
    const [shoe, shirt, coat] = await Promise.all(map(acmeProduct, Product));
    const [acme1, acme2, acme3] = await Promise.all(map(acmeCompany, Company));
    const acmeOffering = [
        { price: 50, companyId: acme1.id, productId: shoe.id },
        { price: 100, companyId: acme2.id, productId: shirt.id },
        { price: 10, companyId: acme3.id, productId: coat.id }
    ];
    await Promise.all(map(acmeOffering, Offering))
}

module.exports = {
    syncAndSeed,
    models: {
        Product,
        Company,
        Offering,
    }
}