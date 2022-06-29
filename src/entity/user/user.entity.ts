import { Column, Entity, PrimaryColumn } from 'typeorm'
import { IsNotEmpty, IsString } from 'class-validator'
import { CommonEntity } from '../../common/entity/common.entity'

@Entity('user')
export class UserEntity extends CommonEntity {
  @PrimaryColumn({
    comment: '绑定的学号',
  })
    studentId: number

  @Column({
    comment: '用户名',
  })
  @IsNotEmpty()
  @IsString()
    username: string

  @Column({
    comment: '登录密码',
  })
  @IsNotEmpty()
  @IsString()
    password: string
}
