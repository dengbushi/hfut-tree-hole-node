import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { UserEntity } from '../../entity/user/user.entity'

@Injectable()
export class UserService {
  @InjectRepository(UserEntity)
  private readonly userRepository: Repository<UserEntity>

  async findOne(studentId: number) {
    return this.userRepository.findOne({
      where: { studentId },
    })
  }
}
