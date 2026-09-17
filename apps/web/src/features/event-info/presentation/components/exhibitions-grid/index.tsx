import { IExhibitionResponse } from '@art-2026/shared';
import { Clock, User } from 'lucide-react';
import { formatTime } from '@/shared/presentation/lib/utils';

interface Props {
  exhibitions: IExhibitionResponse[];
}

export function ExhibitionsGrid({ exhibitions }: Props) {
  if (exhibitions.length === 0) {
    return (
      <p className="text-sm text-[oklch(0.50_0.03_40)] italic">
        Nema izložbi za prikaz.
      </p>
    );
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {exhibitions.map((ex) => (
        <div
          key={ex.id}
          className="p-5 rounded-xl bg-white border border-[oklch(0.90_0.02_60)] hover:border-[oklch(0.65_0.18_40)] transition-colors group"
        >
          <div className="flex items-center gap-2 text-xs text-[oklch(0.45_0.15_40)] font-medium mb-2">
            <Clock size={14} />
            {formatTime(ex.openingTime)} — {formatTime(ex.closingTime)}
          </div>
          <h4 className="font-display text-lg font-semibold text-[oklch(0.20_0.05_40)] mb-1 group-hover:text-[oklch(0.35_0.15_40)] transition-colors">
            {ex.name}
          </h4>
          <p className="flex items-center gap-1.5 text-sm text-[oklch(0.45_0.03_40)]">
            <User size={14} />
            {ex.artist}
          </p>
        </div>
      ))}
    </div>
  );
}
