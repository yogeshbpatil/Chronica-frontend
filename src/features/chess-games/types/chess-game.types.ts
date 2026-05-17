export type GameResult = 'win' | 'loss' | 'draw'

export interface ChessGame {
  id: string
  userId: string
  title: string
  opponent: string
  result: GameResult
  opening: string
  notes: string
  createdAt: string
  updatedAt: string
}

export type CreateChessGameDTO = Omit<ChessGame, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
export type UpdateChessGameDTO = Partial<CreateChessGameDTO>

export interface ChessGameStats {
  total: number
  wins: number
  losses: number
  draws: number
  winRate: number
}
