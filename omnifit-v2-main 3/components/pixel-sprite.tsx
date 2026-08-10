import { cn } from '@/lib/utils'
import type { Sprite } from '@/lib/sprites'

type PixelSpriteProps = {
  sprite: Sprite
  /** size of each pixel cell in px */
  cell?: number
  flip?: boolean
  className?: string
}

export function PixelSprite({
  sprite,
  cell = 8,
  flip = false,
  className,
}: PixelSpriteProps) {
  const width = sprite.rows.reduce((m, r) => Math.max(m, r.length), 0)
  const rows = sprite.rows.map((r) => r.padEnd(width, '.'))
  const height = rows.length

  const boxes: string[] = []
  rows.forEach((row, y) => {
    for (let x = 0; x < width; x++) {
      const color = sprite.palette[row[x]]
      if (color) {
        boxes.push(`${x * cell}px ${y * cell}px 0 0 ${color}`)
      }
    }
  })

  return (
    <div
      className={cn('pixelated', className)}
      style={{
        width: cell,
        height: cell,
        transform: flip ? 'scaleX(-1)' : undefined,
        boxShadow: boxes.join(','),
        marginRight: (width - 1) * cell,
        marginBottom: (height - 1) * cell,
      }}
      role="img"
      aria-hidden="true"
    />
  )
}
