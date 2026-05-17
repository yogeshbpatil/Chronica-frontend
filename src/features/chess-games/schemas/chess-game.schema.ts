import { z } from 'zod'

export const chessGameSchema = z.object({
  title: z.string().min(1, 'Title is required').max(120, 'Max 120 characters'),
  opponent: z.string().min(1, 'Opponent name is required').max(100, 'Max 100 characters'),
  result: z.enum(['win', 'loss', 'draw'], {
    errorMap: () => ({ message: 'Please select a result' }),
  }),
  opening: z.string().max(120, 'Max 120 characters').optional().default(''),
  notes: z.string().max(8000, 'Max 8000 characters').optional().default(''),
})

export type ChessGameFormValues = z.infer<typeof chessGameSchema>
