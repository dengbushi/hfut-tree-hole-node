import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { MessageWallTags, MessageWallTagsDocument, MessageWallTagsTypes } from '@/schema/message-wall/tags.schema'

@Injectable()
export class MessageWallTagsService {
  constructor(
    @InjectModel(MessageWallTags.name)
    private readonly tagsModel: Model<MessageWallTagsDocument>,
  ) {
    this.initTags()
  }

  async initTags() {
    const isTagExist = await this.tagsModel.find()

    if (!isTagExist.length) {
      const tags = [] as MessageWallTagsTypes[]
      for (const [, key] of Object.entries(MessageWallTagsTypes)) {
        tags.push(key as any)
      }

      await new this.tagsModel({ tags }).save()
    }
  }

  async getTags() {
    const tags = await this.tagsModel.findOne()

    return {
      data: tags.tags,
    }
  }
}
