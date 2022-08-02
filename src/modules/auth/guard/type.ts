export interface ITokenData {
  studentId: number
  iat: number
  exp: number
}

export interface IRequestHeaderUserData {
  user: ITokenData
  [key: string]: any
}
