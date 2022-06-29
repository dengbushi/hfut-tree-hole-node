import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { UserEntity } from '../../entity/user/user.entity'
import { LoginQueryDto } from '../auth/dto/loginQuery.dto'
import { isNumber } from '../../shared/utils/is'

@Injectable()
export class UserService {
  @InjectRepository(UserEntity)
  private readonly userRepository: Repository<UserEntity>

  async findOne(payload: number | LoginQueryDto) {
    let user: UserEntity

    if (isNumber(payload)) {
      user = await this.userRepository.findOne({
        where: { studentId: payload },
      })
    } else {
      user = await this.userRepository.findOne({
        where: payload,
      })
    }

    return user
  }
}
