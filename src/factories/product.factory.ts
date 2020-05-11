import { define } from 'typeorm-seeding';

import { Product } from '../entities/product.entity';

define(Product, faker => {
    const product = new Product();

    product.price = faker.random.number(100);
    product.name = faker.random.word();

    return product;
});
