import { Role } from './modules/role/role.enum'

export interface IUser {
  studentId: number
  roles: Role[]
  iat: number
  exp: number
}

declare global {
  // eslint-disable-next-line no-unused-vars
  namespace Express {
    // eslint-disable-next-line no-unused-vars
    interface User extends IUser {}
  }
}
