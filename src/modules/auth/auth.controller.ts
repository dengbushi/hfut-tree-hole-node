import { Body, Controller, Inject, Post, UseGuards } from '@nestjs/common'
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
  login(@Body() loginQueryDto: LoginQueryDto) {
    return this.authService.login(loginQueryDto)
  }

  @Post('/register')
  register(@Body() registerQueryDto: RegisterQueryDto) {
    return this.authService.register(registerQueryDto)
  }
}
