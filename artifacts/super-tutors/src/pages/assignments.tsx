import { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  CalendarDays,
  Clock3,
  House,
  MapPin,
  SlidersHorizontal,
} from 'lucide-react';
import { Link } from 'wouter';
import {
  business,
  demoAssignments,
  getTutorInterestUrl,
  type PublicAssignment,
  siteConfig,
} from '@/config';

type AssignmentResponse = {
  success?: boolean;
  assignments?: unknown;
};

function publicAssignment(value: unknown): PublicAssignment | null {
  if (!value || typeof value !== 'object') return null;
  const item = value as Record<string, unknown>;
  const required = ['id', 'class', 'board', 'subject', 'area', 'mode', 'timing', 'days', 'duration', 'fee'];
  if (required.some((key) => typeof item[key] !== 'string' || !item[key])) return null;
  if (item.status && item.status !== 'Open') return null;
  return {
    id: item.id as string,
    className: item.class as string,
    board: item.board as string,
    subject: item.subject as string,
    area: item.area as string,
    mode: item.mode as string,
    timing: item.timing as string,
    days: item.days as string,
    duration: item.duration as string,
    fee: item.fee as string,
    status: 'Open',
    createdDate: typeof item.createdDate === 'string' ? item.createdDate : undefined,
  };
}

function sortAssignments(items: PublicAssignment[]) {
  return [...items].sort((a, b) => (b.createdDate ?? '').localeCompare(a.createdDate ?? ''));
}

export function useAssignmentsData() {
  const [assignments, setAssignments] = useState<PublicAssignment[]>(
    siteConfig.assignmentsApiEnabled ? [] : sortAssignments(demoAssignments),
  );
  const [loading, setLoading] = useState<boolean>(siteConfig.assignmentsApiEnabled);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!siteConfig.assignmentsApiEnabled) return;
    if (!siteConfig.assignmentsApiUrl) {
      setLoading(false);
      setError('The live assignments feed is not configured yet.');
      return;
    }

    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 8000);
    setLoading(true);
    fetch(siteConfig.assignmentsApiUrl, { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error('Assignment feed unavailable');
        const payload = (await response.json()) as AssignmentResponse;
        if (payload.success === false || !Array.isArray(payload.assignments)) {
          throw new Error('Invalid assignment feed');
        }
        const safeAssignments = payload.assignments
          .map(publicAssignment)
          .filter((item): item is PublicAssignment => Boolean(item));
        setAssignments(sortAssignments(safeAssignments));
        setError('');
      })
      .catch(() => {
        setAssignments([]);
        setError(
          'Current assignments are temporarily unavailable. Please contact us or join as a tutor for assignment updates.',
        );
      })
      .finally(() => {
        window.clearTimeout(timeout);
        setLoading(false);
      });

    return () => {
      controller.abort();
      window.clearTimeout(timeout);
    };
  }, []);

  return {
    assignments,
    loading,
    error,
    isDemo: !siteConfig.assignmentsApiEnabled,
  };
}

function AssignmentCard({ assignment }: { assignment: PublicAssignment }) {
  return (
    <article className="rounded-2xl border border-[#dbe5f0] bg-white p-6 card-shadow">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[.14em] text-[#64748b]">
            {assignment.id}
          </p>
          <h3 className="display mt-3 text-2xl font-extrabold tracking-[-.04em] text-[#0f2747]">
            Class {assignment.className} <span className="text-[#2563eb]">•</span>{' '}
            {assignment.board}
          </h3>
        </div>
        <span className="rounded-full bg-[#dcfce7] px-3 py-1 text-[11px] font-extrabold uppercase tracking-[.1em] text-[#15803d]">
          Open
        </span>
      </div>
      <p className="mt-3 font-semibold text-[#172033]">{assignment.subject}</p>
      <dl className="mt-6 grid gap-3 text-sm text-[#64748b] sm:grid-cols-2">
        <div className="flex items-center gap-2">
          <MapPin size={16} className="shrink-0 text-[#2563eb]" />
          <dt className="sr-only">Area</dt>
          <dd>{assignment.area}</dd>
        </div>
        <div className="flex items-center gap-2">
          <House size={16} className="shrink-0 text-[#2563eb]" />
          <dt className="sr-only">Mode</dt>
          <dd>{assignment.mode}</dd>
        </div>
        <div className="flex items-center gap-2">
          <Clock3 size={16} className="shrink-0 text-[#2563eb]" />
          <dt className="sr-only">Timing</dt>
          <dd>{assignment.timing}</dd>
        </div>
        <div className="flex items-center gap-2">
          <CalendarDays size={16} className="shrink-0 text-[#2563eb]" />
          <dt className="sr-only">Days</dt>
          <dd>{assignment.days}</dd>
        </div>
      </dl>
      <div className="mt-6 flex flex-wrap items-end justify-between gap-4 border-t border-[#eef2f7] pt-5">
        <div className="text-sm text-[#64748b]">
          <p>{assignment.duration}</p>
          <p className="mt-1 text-lg font-extrabold text-[#0f2747]">{assignment.fee}</p>
        </div>
        <a
          href={getTutorInterestUrl(assignment.id)}
          target="_blank"
          rel="noreferrer"
          data-testid={`link-interest-${assignment.id}`}
          className="inline-flex items-center gap-2 rounded-lg bg-[#2563eb] px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-[#1d4ed8]"
        >
          I&apos;m Interested <ArrowRight size={15} />
        </a>
      </div>
    </article>
  );
}

function AssignmentNotice({
  isDemo,
  error,
}: {
  isDemo: boolean;
  error: string;
}) {
  if (error) {
    return (
      <div className="rounded-xl border border-[#fed7aa] bg-[#fff7ed] px-4 py-3 text-sm leading-6 text-[#9a3412]">
        {error}
      </div>
    );
  }
  if (isDemo) {
    return (
      <div className="rounded-xl border border-[#fde68a] bg-[#fffbeb] px-4 py-3 text-sm leading-6 text-[#92400e]">
        Sample assignment format — these examples are not live vacancies. Live assignments will appear here after the Apps Script feed is connected.
      </div>
    );
  }
  return null;
}

export function AssignmentPreview() {
  const { assignments, loading, error, isDemo } = useAssignmentsData();
  const preview = assignments.slice(0, 3);
  return (
    <section className="section-pad bg-white">
      <div className="container-wide">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div className="max-w-2xl">
            <p className="eyebrow mb-3">For tutors</p>
            <h2 className="display text-[clamp(28px,4vw,46px)] font-extrabold leading-[1.08] tracking-[-.045em] text-[#0f2747]">
              Latest teaching assignments
            </h2>
            <p className="mt-4 text-[16px] leading-7 text-[#64748b]">
              Public assignment details only. Private parent and student information is never shown here.
            </p>
          </div>
          <Link
            href="/assignments"
            data-testid="link-view-all-assignments"
            className="inline-flex items-center gap-2 text-sm font-bold text-[#2563eb]"
          >
            View all assignments <ArrowRight size={16} />
          </Link>
        </div>
        <div className="mt-8">
          <AssignmentNotice isDemo={isDemo} error={error} />
        </div>
        {loading ? (
          <p className="mt-8 text-sm text-[#64748b]">Loading current assignments…</p>
        ) : preview.length ? (
          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {preview.map((assignment) => (
              <AssignmentCard key={assignment.id} assignment={assignment} />
            ))}
          </div>
        ) : (
          <div className="mt-8 rounded-2xl border border-[#e2e8f0] bg-[#f8fafc] p-7 text-sm leading-7 text-[#64748b]">
            No open assignments are currently published. Please contact us or join as a tutor for assignment updates.
          </div>
        )}
      </div>
    </section>
  );
}

export function Assignments() {
  const { assignments, loading, error, isDemo } = useAssignmentsData();
  const [filters, setFilters] = useState({
    className: 'All Classes',
    board: 'All Boards',
    subject: 'All Subjects',
    area: 'All Areas',
    mode: 'All Modes',
    timing: 'All Timings',
  });

  const options = useMemo(
    () => ({
      className: Array.from(new Set(['All Classes', ...assignments.map((item) => `Class ${item.className}`)])),
      board: Array.from(new Set(['All Boards', ...assignments.map((item) => item.board)])),
      subject: Array.from(new Set(['All Subjects', ...assignments.map((item) => item.subject)])),
      area: Array.from(new Set(['All Areas', ...assignments.map((item) => item.area)])),
      mode: Array.from(new Set(['All Modes', ...assignments.map((item) => item.mode)])),
      timing: Array.from(new Set(['All Timings', ...assignments.map((item) => item.timing)])),
    }),
    [assignments],
  );

  const filtered = assignments.filter((item) => {
    const checks = [
      filters.className === 'All Classes' || `Class ${item.className}` === filters.className,
      filters.board === 'All Boards' || item.board === filters.board,
      filters.subject === 'All Subjects' || item.subject === filters.subject,
      filters.area === 'All Areas' || item.area === filters.area,
      filters.mode === 'All Modes' || item.mode === filters.mode,
      filters.timing === 'All Timings' || item.timing === filters.timing,
    ];
    return checks.every(Boolean);
  });

  return (
    <>
      <section className="relative overflow-hidden bg-[#0f2747]">
        <div className="container-wide relative py-16 sm:py-24">
          <p className="eyebrow mb-4 text-[#93c5fd]">For teachers and tutors</p>
          <h1 className="display max-w-3xl text-balance text-[clamp(40px,6vw,68px)] font-extrabold leading-[1] tracking-[-.065em] text-white">
            Current teaching assignments.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-[#c1d1e3]">
            Browse public opportunities shared by Super Tutors. Register your interest without seeing private parent information.
          </p>
        </div>
      </section>
      <section className="section-pad bg-[#f8fafc]">
        <div className="container-wide">
          <AssignmentNotice isDemo={isDemo} error={error} />
          <div className="mt-8 rounded-2xl border border-[#dbe5f0] bg-white p-5 card-shadow sm:p-6">
            <div className="flex items-center gap-2">
              <SlidersHorizontal size={18} className="text-[#2563eb]" />
              <p className="text-sm font-bold text-[#0f2747]">Filter assignments</p>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {(
                [
                  ['className', 'Class', options.className],
                  ['board', 'Board', options.board],
                  ['subject', 'Subject', options.subject],
                  ['area', 'Area', options.area],
                  ['mode', 'Mode', options.mode],
                  ['timing', 'Timing', options.timing],
                ] as const
              ).map(([key, label, values]) => (
                <label key={key} className="text-xs font-bold uppercase tracking-[.12em] text-[#64748b]">
                  {label}
                  <select
                    value={filters[key]}
                    onChange={(event) => setFilters((current) => ({ ...current, [key]: event.target.value }))}
                    className="mt-2 block w-full rounded-lg border border-[#d8e2ed] bg-white px-3 py-3 text-sm font-semibold normal-case tracking-normal text-[#172033] outline-none focus:border-[#2563eb] focus:ring-2 focus:ring-[#dbeafe]"
                  >
                    {values.map((value) => (
                      <option key={value}>{value}</option>
                    ))}
                  </select>
                </label>
              ))}
            </div>
          </div>

          {loading ? (
            <p className="mt-10 text-sm text-[#64748b]">Loading current assignments…</p>
          ) : filtered.length ? (
            <div className="mt-10 grid gap-5 lg:grid-cols-2">
              {filtered.map((assignment) => (
                <AssignmentCard key={assignment.id} assignment={assignment} />
              ))}
            </div>
          ) : (
            <div className="mt-10 rounded-2xl border border-[#e2e8f0] bg-white p-8 text-center">
              <h2 className="display text-2xl font-extrabold tracking-[-.04em] text-[#0f2747]">No assignments match these filters.</h2>
              <p className="mt-3 text-sm leading-6 text-[#64748b]">
                Try a different filter or contact us for the latest tutor assignment updates.
              </p>
              <Link href="/join-as-tutor" className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#2563eb]">
                Join as a tutor <ArrowRight size={15} />
              </Link>
            </div>
          )}
          <p className="mt-8 text-xs leading-5 text-[#64748b]">
            Assignment availability depends on current requirements, tutor availability and suitability. Final decisions remain with the business owner.
          </p>
        </div>
      </section>
    </>
  );
}