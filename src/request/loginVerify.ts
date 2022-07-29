import axios from 'axios'
import { RegisterDataDto } from '../modules/auth/dto/registerData.dto'

export function loginVerifyRequest(url: string, registerQueryDto: RegisterDataDto) {
  return axios.get(url, {
    params: {
      username: registerQueryDto.studentId,
      password: registerQueryDto.hfutPassword,
    },
  })
}
