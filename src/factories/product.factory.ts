import { define } from 'typeorm-seeding';

import { Product } from '../entities/product.entity';

define(Product, faker => {
    const product = new Product();

    product.price = faker.random.number(100);
    product.name = faker.random.word();
    // product.createdAt = faker.date.future(20, new Date(2000, 0, 1));

    // @ts-ignore
    // product.createdAt = new Date(2000,1,1).toISOString();
    // product.createdAt = faker.date.
    product.createdAt = faker.date.between('2000-01-01', '2020-01-01').toISOString();
    product.updatedAt = faker.date.between('2000-01-01', '2020-01-01');

    return product;
});
