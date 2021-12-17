import {INestApplication} from "@nestjs/common";
import {Test, TestingModule} from "@nestjs/testing";
import * as request from "supertest";
import {ItemsModule} from "../src/items/items.module";

describe('Items API (e2e)', () => {

    let app: INestApplication;

    beforeEach(async () => {

        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [ItemsModule]
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();

    });

    it('Should get all items',  () => {

        return request(app.getHttpServer())
            .get('/v1/items')
            .expect(200);
    });
});