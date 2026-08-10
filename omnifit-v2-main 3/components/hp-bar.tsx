import { cn } from '@/lib/utils'

type HpBarProps = {
  hp: number
  maxHp: number
  variant: 'player' | 'boss'
  align?: 'left' | 'right'
}

const SEGMENTS = 20

export function HpBar({ hp, maxHp, variant, align = 'left' }: HpBarProps) {
  const pct = Math.max(0, Math.min(1, hp / maxHp))
  const filled = Math.round(pct * SEGMENTS)
  const color = variant === 'player' ? 'bg-[var(--hp-player)]' : 'bg-[var(--hp-boss)]'
  const segments = Array.from({ length: SEGMENTS })
  if (align === 'right') segments.reverse()

  return (
    <div className={cn('w-full', align === 'right' && 'text-right')}>
      <div
        className={cn(
          'flex h-3 gap-0.5 rounded-sm border border-border bg-black/60 p-0.5',
          align === 'right' && 'flex-row-reverse',
        )}
        role="progressbar"
        aria-valuenow={hp}
        aria-valuemin={0}
        aria-valuemax={maxHp}
        aria-label={`${variant} health`}
      >
        {segments.map((_, i) => {
          const isFilled = i < filled
          return (
            <div
              key={i}
              className={cn(
                'h-full flex-1 transition-colors duration-300',
                isFilled ? color : 'bg-white/5',
                isFilled && pct <= 0.3 && variant === 'player' && 'bg-[var(--hp-boss)]',
              )}
            />
          )
        })}
      </div>
      <div
        className={cn(
          'mt-1 font-mono text-[10px] tabular-nums text-muted-foreground',
          align === 'right' && 'text-right',
        )}
      >
        {hp} / {maxHp} HP
      </div>
    </div>
  )
}
