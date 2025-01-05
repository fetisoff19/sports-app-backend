import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import { AppModule } from '@/app.module'
import request from 'supertest'


describe('AuthController (e2e)', () => {
  let app: INestApplication

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()
    app = moduleFixture.createNestApplication()
    await app.init()
  })

  it('/auth (GET)', async () => {
    return request(app.getHttpServer())
      .get('/auth')
      .expect(401)
  })

  it('/registration (POST)', async () => {
    return request(app.getHttpServer())
      .post('/auth/registration')
      .send({ email: '', password: '' })
      .expect(400)
  })

  it('/ (POST)', async () => {
    return request(app.getHttpServer())
      .post('/auth/registration')
      .send({ email: '', password: '' })
      .expect(400)
  })

  afterAll(async () => {
    await app.close()
  })

})
