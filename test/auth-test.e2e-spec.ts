import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';

describe('Auth Controller (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/v1/auth/test (GET)', () => {
    return request(app.getHttpServer())
      .get('/v1/auth/test')
      .expect(200)
      .expect('auth test');
  });

  it('/v1/auth/login (POST)', () => {
    return request(app.getHttpServer())
      .post('/v1/auth/login')
      .send({
        email: 'user@example.com',
        password: 'string',
      })
      .expect(401)
      .expect({
        message: 'Unauthorized',
        statusCode: 401,
      });
  });

  it('/v1/auth/login (POST)', () => {
    return request(app.getHttpServer())
      .post('/v1/auth/login')
      .send({
        email: 'user1@example.com',
        password: 'password123',
      })
      .expect(201)
      .expect((res) => {
        const { body } = res;
        expect(body.token).toBeDefined();
        expect(body.user).toBeDefined();
      });
  });

  afterEach(async () => {
    await app.close();
  });
});
