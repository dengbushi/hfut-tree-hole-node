import { Body, Controller, Inject, Post, UseGuards } from '@nestjs/common'
import { Public } from '../../common/decorators/public.decorator'
import { AuthService } from './auth.service'
import { LoginDataDto } from './dto/loginData.dto'
import { LocalAuthGuard } from './guard/local-auth.guard'
import { RegisterDataDto } from './dto/registerData.dto'
import { ForgetDataDto } from './dto/forgetData.dto'

@Public()
@Controller('auth')
export class AuthController {
  @Inject()
  private readonly authService: AuthService

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  login(@Body() loginDataDto: LoginDataDto) {
    return this.authService.login(loginDataDto)
  }

  @Post('/register')
  register(@Body() registerDataDto: RegisterDataDto) {
    return this.authService.register(registerDataDto)
  }

  @Post('/forget')
  forget(@Body() forgetDataDto: ForgetDataDto) {
    return this.authService.forget(forgetDataDto)
  }
}
