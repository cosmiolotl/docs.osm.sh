import { Link } from '@tanstack/react-router'
import { Lean } from '@/components/arrow'
import { KIND } from '@/lib/kinds'
import type { Entry, Group, Project, Rail as RailData } from '@/server/docs.fn'

/*
  The left rail. Writing and notes are read one piece at a time, so the
  rail is a short stream of that kind; a project is a docs set, so the
  rail is its contents under a project switcher.
*/
export type RailProps = {
  rail: RailData
  url: string
  draft: boolean
  date?: string
  minutes: number
}

export function Rail({ rail, ...page }: RailProps) {
  if (rail.kind === 'projects') return <ProjectRail {...rail} url={page.url} />
  if (rail.kind === 'notes') return <NotesRail entries={rail.entries} url={page.url} />
  return <WritingRail entries={rail.entries} {...page} />
}

function Back({ to, label, className = '' }: { to: string; label: string; className?: string }) {
  return (
    <Link to="/$" params={{ _splat: to }} activeOptions={{ exact: true }} className={`group flex items-center gap-2 px-3 font-mono text-xs leading-4 ${className}`}>
      <Lean left className="text-fd-primary">
        ←
      </Lean>
      <span className="text-fd-muted-foreground group-hover:text-ink">{label}</span>
    </Link>
  )
}

function GroupHead({ label, count }: { label: string; count?: number }) {
  return (
    <p className="eyebrow flex justify-between pb-2 pl-3 text-fd-muted-foreground">
      <span>{label}</span>
      {count !== undefined && <span>{count}</span>}
    </p>
  )
}

const ITEM = 'flex flex-col gap-1 text-sm leading-5'
const ACTIVE = 'border-l-2 border-fd-primary bg-fd-accent font-medium text-fd-primary'
const IDLE = 'border-l border-fd-border text-fd-muted-foreground transition-colors hover:border-fd-ring hover:text-ink'

function WritingRail({ entries, url, draft, date, minutes }: { entries: Entry[] } & Omit<RailProps, 'rail'>) {
  return (
    <div className="flex flex-col gap-7">
      <Back to="writing" label="all writing" />
      <dl className="flex flex-col gap-2.5 border-y border-fd-border px-3 py-4 font-mono text-xs leading-4">
        <div className="flex justify-between">
          <dt className="text-fd-muted-foreground">status</dt>
          <dd className={draft ? 'text-fd-primary' : 'text-ink'}>{draft ? 'draft' : 'published'}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-fd-muted-foreground">{draft ? 'started' : 'published'}</dt>
          <dd className={date ? 'text-ink tabular-nums' : 'text-fd-muted-foreground'}>{date ?? '# undated'}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-fd-muted-foreground">reading</dt>
          <dd className="text-ink">~{minutes} min</dd>
        </div>
      </dl>
      <nav aria-label="Writing" className="flex flex-col gap-0.5">
        <GroupHead label="In writing" count={entries.length} />
        {entries.map((entry) => (
          <Link key={entry.url} to={entry.url} aria-current={entry.url === url ? 'page' : undefined} className={`${ITEM} ${entry.url === url ? `${ACTIVE} px-2.5 py-2` : `${IDLE} px-3 py-2`}`}>
            {entry.title}
          </Link>
        ))}
        {entries.length < 3 && <p className="px-3 pt-2 font-mono text-[13px] leading-4 text-fd-muted-foreground">{KIND.writing.empty}</p>}
      </nav>
    </div>
  )
}

function NotesRail({ entries, url }: { entries: Entry[]; url: string }) {
  return (
    <div className="flex flex-col gap-7">
      <Back to="notes" label="all notes" />
      <nav aria-label="Notes" className="flex flex-col border-t border-fd-border pt-4">
        <GroupHead label="Notes" count={entries.length} />
        {entries.map((entry) => {
          const active = entry.url === url
          return (
            <Link key={entry.url} to={entry.url} aria-current={active ? 'page' : undefined} className={`${ITEM} ${active ? `${ACTIVE} p-2.5` : `${IDLE} px-3 py-2.5`}`}>
              {entry.date && <span className="font-mono text-[11px] leading-[14px] font-normal">{entry.date}</span>}
              <span>{entry.title}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}

function ProjectRail({ project, projects, groups, url }: { project?: Project; projects: Project[]; groups: Group[]; url: string }) {
  return (
    <div className="flex flex-col gap-7">
      <Switcher project={project} projects={projects} />
      {groups.map((group, i) => (
        <nav key={group.label ?? i} aria-label={group.label ?? project?.name ?? 'Projects'} className="flex flex-col gap-0.5">
          {group.label && <GroupHead label={group.label} />}
          {group.items.map((item) => {
            const active = item.url === url
            return (
              <Link key={item.url} to={item.url} aria-current={active ? 'page' : undefined} className={`${ITEM} py-[7px] ${active ? `${ACTIVE} pr-3 pl-[11px]` : `${IDLE} px-3`}`}>
                {item.title}
              </Link>
            )
          })}
        </nav>
      ))}
      <Back to="projects" label="all projects" className="border-t border-fd-border pt-4" />
    </div>
  )
}

/** The current project, and a menu of the others. */
function Switcher({ project, projects }: { project?: Project; projects: Project[] }) {
  const name = project?.name ?? 'Projects'
  return (
    <details className="group/switch relative">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 border border-fd-border bg-fd-muted p-3 hover:border-fd-ring [&::-webkit-details-marker]:hidden">
        <span className="flex min-w-0 items-center gap-3">
          <span aria-hidden="true" className="flex size-7 shrink-0 items-center justify-center bg-projects font-mono text-[13px] leading-4 font-semibold text-projects-wash">
            {name.slice(0, 1).toLowerCase()}
          </span>
          <span className="flex min-w-0 flex-col gap-0.5">
            <span className="truncate text-sm leading-[18px] font-semibold text-ink">{name}</span>
            <span className="truncate font-mono text-[11px] leading-[14px] text-fd-muted-foreground">projects{project && ` / ${project.slug}`}</span>
          </span>
        </span>
        <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true" className="shrink-0 stroke-fd-muted-foreground">
          <path d="M3.5 4.5L6 2l2.5 2.5M3.5 7.5L6 10l2.5-2.5" fill="none" strokeWidth="1.2" />
        </svg>
      </summary>
      <ul className="absolute inset-x-0 top-full z-10 mt-1 border border-fd-border bg-paper py-1 shadow-[4px_4px_0_0_rgb(18_27_53/0.08)]">
        {projects.map((p) => (
          <li key={p.url}>
            <Link to={p.url} className={`flex items-baseline justify-between gap-3 px-3 py-2 text-sm hover:bg-fd-accent ${p.slug === project?.slug ? 'text-fd-primary' : 'text-ink'}`}>
              <span className="truncate">{p.name}</span>
              <span className="font-mono text-[11px] text-fd-muted-foreground">{p.slug}</span>
            </Link>
          </li>
        ))}
        <li className="border-t border-fd-border">
          <Link to="/$" params={{ _splat: 'projects' }} activeOptions={{ exact: true }} className="group block px-3 py-2 font-mono text-xs text-fd-muted-foreground hover:bg-fd-accent hover:text-ink">
            all projects <Lean>→</Lean>
          </Link>
        </li>
      </ul>
    </details>
  )
}
