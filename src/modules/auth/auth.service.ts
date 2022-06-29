import { Inject, Injectable, NotAcceptableException, UnauthorizedException } from '@nestjs/common'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { AxiosError } from 'axios'
import { UserService } from '../user/user.service'
import { createResponse } from '../../shared/utils/create'
import { UserEntity } from '../../entity/user/user.entity'
import { loginVerifyRequest } from '../../request/loginVerify'
import { LoginQueryDto } from './dto/loginQuery.dto'
import { RegisterQueryDto } from './dto/registerQuery.dto'

@Injectable()
export class AuthService {
  @Inject()
  private readonly userService: UserService

  @InjectRepository(UserEntity)
  private readonly userRepository: Repository<UserEntity>

  async login(dto: LoginQueryDto) {
    const user = await this.userService.findOne(dto)

    if (!user) {
      throw new UnauthorizedException('密码错误')
    } else {
      return createResponse('登录成功')
    }
  }

  async register(dto: RegisterQueryDto) {
    const isUserExisted = await this.userService.findOne(dto.studentId)

    if (isUserExisted) {
      throw new NotAcceptableException('用户已存在')
    }

    try {
      await loginVerifyRequest(dto)
    } catch (err) {
      throw new NotAcceptableException((err as AxiosError).response?.data?.msg || '登录验证请求错误')
    }

    const user = await this.userRepository.save(
      this.userRepository.create({ ...dto }),
    )

    if (user) {
      return createResponse('注册成功')
    }
  }
}
