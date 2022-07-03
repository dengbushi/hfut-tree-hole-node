import axios from 'axios'
import { RegisterDataDto } from '../modules/auth/dto/registerData.dto'

const url = 'http://81.68.170.254:8082/login/verify'

export function loginVerifyRequest(registerQueryDto: RegisterDataDto) {
  return axios.get(url, {
    params: {
      username: registerQueryDto.studentId,
      password: registerQueryDto.hfutPassword,
    },
  })
}
