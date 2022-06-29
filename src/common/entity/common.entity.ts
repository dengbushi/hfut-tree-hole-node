import { CreateDateColumn, DeleteDateColumn, Entity, UpdateDateColumn } from 'typeorm'

@Entity()
export class CommonEntity {
  @CreateDateColumn({
    type: 'timestamp',
    comment: '创建时间',
  })
    createAt: Date

  @UpdateDateColumn({
    type: 'timestamp',
    comment: '更新时间',
  })
    updateAt: Date

  @DeleteDateColumn({
    type: 'timestamp',
    comment: '删除时间',
    name: '',
  })
    deleteAt: Date
}
