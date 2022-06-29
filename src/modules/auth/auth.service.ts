import { Inject, Injectable } from '@nestjs/common'
import { UserService } from '../user/user.service'
import { LoginQueryDto } from './dto/loginQuery.dto'
import { RegisterQueryDto } from './dto/registerQuery.dto'

@Injectable()
export class AuthService {
  @Inject()
  private readonly userService: UserService

  async login(dto: LoginQueryDto) {

  }

  async register(dto: RegisterQueryDto) {

  }

  async isUserExist(dto: LoginQueryDto) {
    return this.userService.findOne(dto.studentId)
  }
}
