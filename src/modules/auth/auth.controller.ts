import { Body, Controller, Get, Inject, Post, UseGuards } from '@nestjs/common'
import { Public } from '../../common/decorators/public.decorator'
import { AuthService } from './auth.service'
import { LoginQueryDto } from './dto/loginQuery.dto'
import { LocalAuthGuard } from './guard/local-auth.guard'
import { RegisterQueryDto } from './dto/registerQuery.dto'

@Controller('auth')
export class AuthController {
  @Inject()
  private readonly authService: AuthService

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  login(@Body() loginQueryDto: LoginQueryDto) {
    return this.authService.login(loginQueryDto)
  }

  @Public()
  @Post('/register')
  register(@Body() registerQueryDto: RegisterQueryDto) {
    return this.authService.register(registerQueryDto)
  }

  @Get('/test')
  test() {
    return 'test'
  }
}
