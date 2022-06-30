import axios from 'axios'
import { RegisterQueryDto } from '../modules/auth/dto/registerQuery.dto'

const url = 'http://81.68.170.254:8082/login/verify'

export function loginVerifyRequest(registerQueryDto: RegisterQueryDto) {
  return axios.get(url, {
    params: {
      username: registerQueryDto.studentId,
      password: registerQueryDto.hfutPassword,
    },
  })
}
