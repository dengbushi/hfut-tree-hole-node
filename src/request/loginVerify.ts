import axios from 'axios'
import { RegisterDataDto } from '../modules/auth/dto/registerData.dto'

const url = 'https://service-lqt2n98h-1251811980.sh.apigw.tencentcs.com'

export function loginVerifyRequest(registerQueryDto: RegisterDataDto) {
  return axios.get(url, {
    params: {
      username: registerQueryDto.studentId,
      password: registerQueryDto.hfutPassword,
    },
  })
}
