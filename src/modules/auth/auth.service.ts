import { Inject, Injectable, NotAcceptableException, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { ConfigService } from '@nestjs/config'
import { AxiosError } from 'axios'
import { UserService } from '../user/user.service'
import { createResponse } from '../../shared/utils/create'
import { Users, UsersDocument } from '../../schema/user/user.schema'
import { loginVerifyRequest } from '../../request/loginVerify'
import { Role } from '../role/role.enum'
import { isArray } from '../../shared/utils/is'
import { LoginDataDto } from './dto/loginData.dto'
import { RegisterDataDto } from './dto/registerData.dto'
import { ForgetDataDto } from './dto/forgetData.dto'

@Injectable()
export class AuthService {
  @Inject()
  private readonly userService: UserService

  @Inject()
  private readonly jwtService: JwtService

  @Inject()
  private readonly configService: ConfigService

  @InjectModel(Users.name)
  private readonly userModel: Model<UsersDocument>

  async login(dto: LoginDataDto) {
    const user = await this.userService.findOne(dto)

    if (!user) {
      throw new UnauthorizedException('密码错误')
    } else {
      return createResponse('登录成功', { token: this.signToken(user.studentId, Role.User) })
    }
  }

  async register(dto: RegisterDataDto) {
    const isUserExisted = await this.userService.findOne(dto.studentId)
    if (isUserExisted) {
      throw new NotAcceptableException('这个学号已经被注册了')
    }

    const isUsernameExisted = await this.userService.findOne({
      username: dto.username,
    })
    if (isUsernameExisted) {
      throw new NotAcceptableException('嗨嗨嗨，换个名字吧，这个已经被注册了')
    }

    await this.verifyHfutAccount(dto)

    const roles = [Role.User]
    const user = await new this.userModel({
      ...dto,
      roles,
    }).save()

    if (user) {
      return createResponse('注册成功', { token: this.signToken(user.studentId, roles) })
    }
  }

  async forget(forgetDataDto: ForgetDataDto): Promise<any> {
    const isUserExisted = await this.userService.findOne(forgetDataDto.studentId)
    if (!isUserExisted) {
      throw new NotAcceptableException('该学号未注册')
    }

    await this.verifyHfutAccount(forgetDataDto)

    const updatedUser = await this.userModel.updateOne({ studentId: forgetDataDto.studentId }, { password: forgetDataDto.password })

    if (updatedUser) {
      return createResponse('修改密码成功', { token: this.signToken(forgetDataDto.studentId, Role.User), updatedUser })
    } else {
      throw new NotAcceptableException('修改密码失败')
    }
  }

  signToken(studentId: number, roles: Role | Role[]) {
    if (!isArray(roles)) {
      roles = [roles]
    }

    return this.jwtService.sign({ studentId, roles })
  }

  async verifyHfutAccount(dto: RegisterDataDto | ForgetDataDto) {
    try {
      await loginVerifyRequest(`${this.configService.get('HFUTAPI_URL')}/login/verify`, {
        studentId: dto.studentId,
        hfutPassword: dto.hfutPassword,
      } as RegisterDataDto)
    } catch (err) {
      const msg = (err as AxiosError).response?.data?.msg
      throw new NotAcceptableException(`信息门户${msg || '登录验证请求错误'}`)
    }
  }
}
