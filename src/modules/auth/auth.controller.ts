import { Controller, Get, Inject, Query } from '@nestjs/common'
import { AuthService } from './auth.service'
import { LoginQueryDto } from './dto/loginQuery.dto'

@Controller('auth')
export class AuthController {
  @Inject()
  private readonly authService: AuthService

  @Get('/login')
  login(@Query() query: LoginQueryDto) {
    return query
  }
}
