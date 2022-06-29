import { Controller, Inject, Post, Query, UseGuards } from '@nestjs/common'
import { AuthService } from './auth.service'
import { LoginQueryDto } from './dto/loginQuery.dto'
import { LocalAuthGuard } from './local-auth.guard'
import { RegisterQueryDto } from './dto/registerQuery.dto'

@Controller('auth')
export class AuthController {
  @Inject()
  private readonly authService: AuthService

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  login(@Query() dto: LoginQueryDto) {
    return this.authService.login(dto)
  }

  @Post('/register')
  register(@Query() dto: RegisterQueryDto) {
    return this.authService.register(dto)
  }
}
