export interface ITokenData {
  studentId: number
  iat: number
  exp: number
}

export interface RequestHeaderUserInfo {
  user: ITokenData
  [key: string]: any
}
