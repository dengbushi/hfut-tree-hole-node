export interface IUser {
  studentId: number
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
