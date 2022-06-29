import axios from 'axios'
import { RegisterQueryDto } from '../modules/auth/dto/registerQuery.dto'

const url = process.env.HFUTAPI_HOST

export function loginVerifyRequest(registerQueryDto: RegisterQueryDto) {
  return axios.get(url, {
    params: {
      username: registerQueryDto.studentId,
      password: registerQueryDto.hfutPassword,
    },
  })
}
