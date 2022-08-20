interface Base {
  _id: string
  content: string
  stars: number
  imgs: any[]
  createTime: string
  user: User
  comments_user: CommentsUser[]
  starUserIds: number[]
  isStar: boolean
}

export interface ITreeholeDetailPipeLineStage extends Base{
  comments: Comment[]
}

export interface ITreeholeListPipeLineStage extends Base {
  comments: {
    data: Comment[]
    length: number
  }
}

interface Comment {
  userId: number
  user?: { username?: string }
  content: string
  createTime: string
  isOwner: boolean
}

interface User {
  username: string
  role?: string
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
