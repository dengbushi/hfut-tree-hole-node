import { Body, Controller, Get, Inject, Post, Query, Req } from '@nestjs/common'
import { Request } from 'express'
import { MessageWallService } from './message-wall.service'
import { MessageWallTagsService } from './tags.service'
import { PostMessageDto } from './dto/postMessage.dto'
import { GetWallDto } from './dto/getWall.dto'
import { Roles } from '@/common/decorators/roles.decorator'

@Roles()
@Controller('messageWall')
export class MessageWallController {
  @Inject()
  private readonly messageWallService: MessageWallService

  @Inject()
  private readonly messageWallTagsService: MessageWallTagsService

  @Get('/tags')
  async getTags() {
    return this.messageWallTagsService.getTags()
  }

  @Post('/post')
  async postMessage(@Body() dto: PostMessageDto, @Req() req: Request) {
    return this.messageWallService.postMessage(dto, req.user)
  }

  @Get('/wall')
  async getWall(@Query() query: GetWallDto) {
    return this.messageWallService.getWall(query)
  }
}
