import { createConnection, getManager } from "typeorm";
import { Course } from "../entity/course.entity";
import faker from "faker";
import { randomInt } from "crypto";

createConnection().then(async (result) => { 
    const Repository = getManager().getRepository(Course);
    for (let i = 0; i < 30; i++) {
        await Repository.save({
         title: faker.lorem.words(2),
         description: faker.lorem.words(20),
         image: faker.image.imageUrl(200, 200, '', true),
         price: randomInt(100, 200),
        });
    }
    process.exit(0)
});