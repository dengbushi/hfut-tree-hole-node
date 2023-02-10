import { CacheModule, Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { Report, ReportSchema } from '@/schema/report/report.schema'
import { Holes, HolesSchema } from '@/schema/treehole/holes.schema'
import { CaslAbilityFactory } from '../casl/casl.factory'
import { RoleService } from '../role/role.service'
import { Users, UsersSchema } from '@/schema/user/user.schema'
import { UserService } from '../user/user.service'
import { UserDaoService } from '@/dao/user/user.service'
import { TreeholeDaoService } from '@/dao/treehole/treehole-dao.service'
import { ReportController } from './report.controller'
import { ReportService } from './report.service'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Report.name, schema: ReportSchema },
      { name: Holes.name, schema: HolesSchema },
      { name: Users.name, schema: UsersSchema },
    ]),
    CacheModule.register(),
  ],
  controllers: [ReportController],
  providers: [
    ReportService,
    CaslAbilityFactory,
    RoleService,
    UserService,
    UserDaoService,
    TreeholeDaoService,
  ],
})
export class ReportModule {}
