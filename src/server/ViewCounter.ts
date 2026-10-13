import { DurableObject } from 'cloudflare:workers'

export class ViewCounter extends DurableObject {
  constructor(context: DurableObjectState, env: Cloudflare.Env) {
    super(context, env)
    this.ctx.storage.sql.exec(`
      CREATE TABLE IF NOT EXISTS views (
        id INTEGER PRIMARY KEY CHECK (id = 1),
        total INTEGER NOT NULL
      )
    `)
  }

  increment(): number {
    // One atomic statement keeps concurrent readers from losing increments.
    const result = this.ctx.storage.sql.exec<{ total: number }>(`
      INSERT INTO views (id, total) VALUES (1, 1)
      ON CONFLICT (id) DO UPDATE SET total = total + 1
      RETURNING total
    `).one()
    return result.total
  }

  read(): number {
    const rows = this.ctx.storage.sql.exec<{ total: number }>('SELECT total FROM views WHERE id = 1').toArray()
    return rows[0]?.total ?? 0
  }
}
