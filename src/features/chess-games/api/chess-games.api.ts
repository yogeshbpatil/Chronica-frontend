import type { ChessGame, CreateChessGameDTO, UpdateChessGameDTO } from '../types/chess-game.types'
import { STORAGE_KEYS, MOCK_DELAY_MS } from '@/shared/constants/app.constants'

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function getStorageKey(userId: string): string {
  return `${STORAGE_KEYS.GAMES_PREFIX}${userId}`
}

function getGames(userId: string): ChessGame[] {
  const raw = localStorage.getItem(getStorageKey(userId))
  return raw ? (JSON.parse(raw) as ChessGame[]) : []
}

function saveGames(userId: string, games: ChessGame[]): void {
  localStorage.setItem(getStorageKey(userId), JSON.stringify(games))
}

function seedGames(userId: string): void {
  const existing = getGames(userId)
  if (existing.length > 0) return

  const now = new Date()
  const samples: ChessGame[] = [
    {
      id: crypto.randomUUID(),
      userId,
      title: 'Opening Principles Study',
      opponent: 'Magnus (AI)',
      result: 'loss',
      opening: 'Ruy Lopez',
      notes:
        'Need to study more about the Berlin Defense. Got crushed in the middlegame after missing a tactical fork on move 18. Key lesson: always calculate knight jumps before committing to a pawn push.',
      createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: crypto.randomUUID(),
      userId,
      title: 'Blitz Tournament Round 3',
      opponent: 'ChessWizard99',
      result: 'win',
      opening: 'Sicilian Defense',
      notes:
        'Played the Dragon variation. Excellent kingside attack developed naturally. Opponent resigned on move 28 after Rxg7+. The g-file pressure was decisive.',
      createdAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: crypto.randomUUID(),
      userId,
      title: 'Endgame Practice Session',
      opponent: 'Stockfish Level 5',
      result: 'draw',
      opening: "Queen's Gambit Declined",
      notes:
        'Managed to hold the rook endgame! The key was keeping the king active and centralizing early. Rook+King vs Rook is still theoretical territory for me — need to study Lucena and Philidor positions.',
      createdAt: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ]
  saveGames(userId, samples)
}

export const chessGamesApi = {
  async list(userId: string): Promise<ChessGame[]> {
    await delay(MOCK_DELAY_MS)
    seedGames(userId)
    return getGames(userId).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
  },

  async get(userId: string, id: string): Promise<ChessGame> {
    await delay(MOCK_DELAY_MS)
    const games = getGames(userId)
    const game = games.find((g) => g.id === id)
    if (!game) throw new Error('Game not found')
    return game
  },

  async create(userId: string, dto: CreateChessGameDTO): Promise<ChessGame> {
    await delay(MOCK_DELAY_MS)
    const games = getGames(userId)
    const now = new Date().toISOString()
    const newGame: ChessGame = {
      id: crypto.randomUUID(),
      userId,
      ...dto,
      createdAt: now,
      updatedAt: now,
    }
    saveGames(userId, [...games, newGame])
    return newGame
  },

  async update(userId: string, id: string, dto: UpdateChessGameDTO): Promise<ChessGame> {
    await delay(MOCK_DELAY_MS)
    const games = getGames(userId)
    const index = games.findIndex((g) => g.id === id)
    if (index === -1) throw new Error('Game not found')
    const updated: ChessGame = {
      ...games[index],
      ...dto,
      updatedAt: new Date().toISOString(),
    }
    games[index] = updated
    saveGames(userId, games)
    return updated
  },

  async remove(userId: string, id: string): Promise<void> {
    await delay(MOCK_DELAY_MS)
    const games = getGames(userId)
    saveGames(
      userId,
      games.filter((g) => g.id !== id),
    )
  },
}
