import { AuthController } from './auth.controller'
import { Test } from '@nestjs/testing'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { UserService } from '@/microservice/user/user.service'
import { WorkoutsService } from '@/microservice/workout/workout.service'
import { JwtService } from '@nestjs/jwt'
import { UserModel } from '@/db/model'
import { Response } from 'express'
import { AuthUserDto, ChangePasswordDto } from '@/microservice/auth/dto'
import { CryptoHelper } from '@/common/helpers'
import { omit } from 'lodash'
import { ClientsModule, Transport } from '@nestjs/microservices'

const authDto: AuthUserDto = {
  email: 'email@gmail.com',
  password: '012345678',
}
const changePasswordDto: ChangePasswordDto = {
  current: '012345678@012345678.com',
  new: '012345678',
}

const mockUser: UserModel = {
  created_at: undefined,
  email: '',
  image: '',
  login: '',
  password: '',
  provider: undefined,
  provider_id: '',
  role: undefined,
  updated_at: undefined,
  uuid: '',
  workouts: [],
}

const mockPublicUser = omit(mockUser, [
  'uuid',
  'password',
  'created_at',
  'updated_at',
  'provider_id',
])

const mockWorkoutCount = 10

const mockResponse = {
  statusCode: 200,
  header: jest.fn(() => mockResponse),
  json: jest.fn(() => mockResponse),
  send: jest.fn(() => mockResponse),
} as unknown as Response

describe('AuthController', () => {
  let authController: AuthController

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [
        ClientsModule.registerAsync([
          {
            imports: [ConfigModule],
            name: 'NOTIFICATION_SERVICE',
            useFactory: async (configService: ConfigService) => ({
              transport: Transport.REDIS,
              options: {
                port: configService.get<number>('redis.port'),
                host: configService.get<string>('redis.host'),
              },
            }),
            inject: [ConfigService],
          },
        ]),
      ],
      controllers: [AuthController],
      providers: [
        {
          provide: UserService,
          useValue: {
            isEmailExist: jest.fn().mockResolvedValue(false),
            createWithPassword: jest.fn().mockResolvedValue(authDto),
            getPublicUser: jest.fn().mockImplementationOnce(() => mockPublicUser),
            changePassword: jest.fn().mockResolvedValue(true),
            remove: jest.fn().mockResolvedValue(true),
          },
        },
        {
          provide: CryptoHelper,
          useValue: {
            hashPassword: jest.fn().mockResolvedValue(authDto.password),
          },
        },
        {
          provide: WorkoutsService,
          useValue: {
            getCountByUserUuid: jest.fn().mockResolvedValue(mockWorkoutCount),
            removeAll: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {},
        },
        {
          provide: ConfigService,
          useValue: {},
        },
      ],
    }).compile()
    authController = module.get<AuthController>(AuthController)

  })
  it('should be defined', () => {
    expect(authController).toBeDefined()
  })
  it('should be registered', async () => {
    expect(await authController.registration(authDto, mockResponse)).toBe(mockResponse)
  })
  it('should be logout', async () => {
    expect(await authController.logout(mockResponse)).toBe(mockResponse)
  })
  it('should be auth', async () => {
    expect(await authController.auth(mockUser)).toStrictEqual({ ...mockPublicUser, workoutCount: mockWorkoutCount })
  })
  it('password should be changed', async () => {
    expect(await authController.changePassword(changePasswordDto, mockUser)).toBe(true)
  })
  it('user should be deleted', async () => {
    expect(await authController.deleteUser(mockUser)).toBe(true)
  })
})
