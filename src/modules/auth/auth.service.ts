import { Injectable } from '@nestjs/common'
import { LoginQueryDto } from './dto/loginQuery.dto'

@Injectable()
export class AuthService {
  async login(dto: LoginQueryDto) {

  }
}
