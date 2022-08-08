export interface ITreeholeDetailPipeLineStage {
  _id: string
  content: string
  stars: number
  imgs: any[]
  comments: Comment[]
  createTime: string
  user: User
  comments_user: CommentsUser[]
  starUserIds: number[]
  isStar: boolean
}

interface Comment {
  userId: number
  user?: { username?: string }
  content: string
  createTime: string
}

interface User {
  username: string
  role: string
}

interface CommentsUser {
  _id: string
  studentId: number
  username: string
  password: string
  holeIds: any[]
  role: string
  __v: number
}
