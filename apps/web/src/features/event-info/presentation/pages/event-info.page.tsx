import { EventDay } from '@art-2026/shared';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/shared/presentation/lib/utils';
import { useEventInfo } from '../../application/use-event-info.hook';
import { ExhibitionsGrid } from '../components/exhibitions-grid';

export function EventInfoPage() {
  const { data, isLoading, error } = useEventInfo();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-[oklch(0.50_0.03_40)]">Učitavanje...</p>
      </div>
    );
  }
  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600">Greška pri učitavanju: {(error as Error)?.message ?? 'Nepoznato'}</p>
      </div>
    );
  }

  const paintingExhibitions = data.exhibitions.filter((e) => e.day === EventDay.Painting);
  const photographyExhibitions = data.exhibitions.filter((e) => e.day === EventDay.Photography);

  return (
    <div className="min-h-screen animate-fade-in">
      <header className="relative overflow-hidden bg-gradient-to-br from-[oklch(0.98_0.02_60)] via-[oklch(0.94_0.06_40)] to-[oklch(0.90_0.10_20)] border-b border-[oklch(0.85_0.05_40)]">
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{
          backgroundImage: 'radial-gradient(circle at 20% 30%, oklch(0.55 0.20 40) 0%, transparent 50%), radial-gradient(circle at 80% 70%, oklch(0.65 0.18 60) 0%, transparent 50%)',
        }} />
        <div className="relative max-w-6xl mx-auto px-6 py-16 md:py-24">
          <Badge variant="brand" className="mb-6 uppercase tracking-wider">
            Kulturna manifestacija
          </Badge>
          <h1 className="font-display text-5xl md:text-7xl font-bold text-[oklch(0.15_0.10_40)] leading-tight mb-4">
            {data.eventName}
          </h1>
          <p className="text-lg text-[oklch(0.35_0.05_40)] max-w-2xl mb-8">
            {data.eventAdditionalInfo}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
            <InfoCard icon={<MapPin size={18} />} label="Grad" value={data.eventCity} />
            <InfoCard icon={<MapPin size={18} />} label="Lokacija" value={data.eventVenue} />
            <InfoCard
              icon={<Calendar size={18} />}
              label="Datumi održavanja"
              value={`${formatDate(data.eventDateDay1)} — ${formatDate(data.eventDateDay2)}`}
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <Link to="/register" className="inline-flex items-center gap-2 rounded-lg bg-[oklch(0.45_0.20_40)] px-6 py-3 text-base font-medium text-white shadow-sm transition-all hover:bg-[oklch(0.55_0.20_40)] hover:shadow">
              Prijavi se
            </Link>
            <Link to="/manage" className="inline-flex items-center gap-2 rounded-lg border border-[oklch(0.85_0.02_60)] bg-white px-6 py-3 text-base font-medium text-[oklch(0.25_0.10_40)] shadow-sm transition-all hover:bg-[oklch(0.98_0.02_60)]">
              Izmeni ili otkaži prijavu
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12 space-y-12">
        <DaySection
          day={1}
          title="Dan 1 — Slikarstvo"
          date={data.eventDateDay1}
          freeSpots={data.freeSpotsPainting}
          maxVisitors={data.maxVisitors}
          exhibitions={paintingExhibitions}
        />
        <DaySection
          day={2}
          title="Dan 2 — Fotografija"
          date={data.eventDateDay2}
          freeSpots={data.freeSpotsPhotography}
          maxVisitors={data.maxVisitors}
          exhibitions={photographyExhibitions}
        />
      </main>

      <footer className="border-t border-[oklch(0.90_0.02_60)] py-8 mt-16">
        <div className="max-w-6xl mx-auto px-6 text-sm text-[oklch(0.50_0.03_40)] flex justify-between">
          <span>© {new Date().getFullYear()} Art 2026</span>
          <span>Ranija prijava do {formatDate(data.earlyBirdDeadline)} — 10% popusta</span>
        </div>
      </footer>
    </div>
  );
}

function InfoCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-lg px-4 py-3 border border-[oklch(0.90_0.03_60)]">
      <div className="flex items-center gap-2 text-xs text-[oklch(0.45_0.10_40)] uppercase tracking-wide font-medium mb-1">
        {icon}
        {label}
      </div>
      <p className="text-[oklch(0.20_0.05_40)] font-medium">{value}</p>
    </div>
  );
}

function DaySection({
  day, title, date, freeSpots, maxVisitors, exhibitions,
}: {
  day: 1 | 2;
  title: string;
  date: string;
  freeSpots: number;
  maxVisitors: number;
  exhibitions: import('@art-2026/shared').IExhibitionResponse[];
}) {
  const percent = maxVisitors > 0 ? (freeSpots / maxVisitors) * 100 : 0;
  const spotVariant = percent > 50 ? 'success' : percent > 20 ? 'warning' : 'danger';
  return (
    <section>
      <div className="flex flex-wrap items-end justify-between gap-3 mb-6">
        <div>
          <div className="text-xs uppercase tracking-wider text-[oklch(0.45_0.15_40)] font-semibold mb-1">
            {formatDate(date)}
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-[oklch(0.15_0.10_40)]">
            {title}
          </h2>
        </div>
        <div className="flex items-center gap-2 bg-white rounded-lg border border-[oklch(0.90_0.02_60)] px-4 py-2.5">
          <Users size={16} className="text-[oklch(0.45_0.15_40)]" />
          <span className="text-sm text-[oklch(0.30_0.05_40)]">
            Slobodnih mesta:
          </span>
          <Badge variant={spotVariant} className="ml-1">
            {freeSpots} / {maxVisitors}
          </Badge>
        </div>
      </div>
      <ExhibitionsGrid exhibitions={exhibitions} />
    </section>
  );
}
