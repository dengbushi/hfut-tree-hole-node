import { Role } from './modules/role/role.enum'

export interface IUser {
  studentId: number
  roles: Role[]
  iat: number
  exp: number
}

declare global {
  namespace Express {
    interface User extends IUser {}
  }
}
