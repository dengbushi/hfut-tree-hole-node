import { Body, Controller, Inject, Post, UseGuards } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { AuthService } from './auth.service'
import { LoginDataDto } from './dto/loginData.dto'
import { LocalAuthGuard } from './guard/local-auth.guard'
import { RegisterDataDto } from './dto/registerData.dto'
import { ForgetDataDto } from './dto/forgetData.dto'
import { Roles } from '@/common/decorators/roles.decorator'
import { Public } from '@/common/decorators/public.decorator'

@ApiTags('鉴权模块')
@Public()
@Controller('auth')
@Roles()
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
