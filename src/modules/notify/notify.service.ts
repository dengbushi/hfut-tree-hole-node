import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Users, UsersDocument } from '@/schema/user/user.schema'
import { Model } from 'mongoose'
import { Notify, NotifyDocument } from '@/schema/notify/notify.schema'

@Injectable()
export class NotifyService {
  @InjectModel(Users.name)
  private readonly usersModel: Model<UsersDocument>

  @InjectModel(Notify.name)
  private readonly notifyModel: Model<NotifyDocument>
}
