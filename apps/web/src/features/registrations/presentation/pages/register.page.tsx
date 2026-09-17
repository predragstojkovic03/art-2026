import { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { ArrowLeft, Check, Copy, PartyPopper } from 'lucide-react';
import { IRegistrationResponse } from '@art-2026/shared';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/shared/presentation/lib/utils';
import { useEventInfo } from '@/features/event-info/application/use-event-info.hook';
import { HttpError } from '@/shared/infrastructure/http/http-error';
import { useCreateRegistration } from '../../application/use-create-registration.hook';
import { RegistrationForm } from '../components/registration-form';

export function RegisterPage() {
  const { data: eventInfo, isLoading } = useEventInfo();
  const createMut = useCreateRegistration();
  const [created, setCreated] = useState<IRegistrationResponse | null>(null);

  if (isLoading || !eventInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-[oklch(0.50_0.03_40)]">Učitavanje...</p>
      </div>
    );
  }

  if (created) {
    return <SuccessScreen registration={created} />;
  }

  return (
    <div className="min-h-screen animate-fade-in">
      <header className="bg-white border-b border-[oklch(0.90_0.02_60)]">
        <div className="max-w-6xl mx-auto px-6 py-6 flex items-center gap-4">
          <Link to="/" className="text-[oklch(0.45_0.10_40)] hover:text-[oklch(0.35_0.15_40)]">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="font-display text-2xl font-bold text-[oklch(0.15_0.10_40)]">
              Prijava na Art 2026
            </h1>
            <p className="text-sm text-[oklch(0.50_0.03_40)]">Popunite podatke ispod</p>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        <RegistrationForm
          config={{
            pricePainting: eventInfo.pricePainting,
            pricePhotography: eventInfo.pricePhotography,
            earlyBirdDeadline: eventInfo.earlyBirdDeadline,
          }}
          isSubmitting={createMut.isPending}
          onSubmit={(data) => {
            createMut.mutate(data, {
              onSuccess: (r) => {
                setCreated(r);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              },
              onError: (err) => {
                const msg = err instanceof HttpError ? err.parsedMessage() : (err as Error).message;
                toast.error(msg);
              },
            });
          }}
        />
      </main>
    </div>
  );
}

function SuccessScreen({ registration }: { registration: IRegistrationResponse }) {
  const copy = (text: string, label: string): void => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} kopiran`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12 animate-fade-in">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-2xl shadow-lg border border-[oklch(0.88_0.05_40)] overflow-hidden">
          <div className="bg-gradient-to-br from-[oklch(0.55_0.20_40)] to-[oklch(0.45_0.20_40)] p-10 text-center text-white">
            <PartyPopper size={48} className="mx-auto mb-4" />
            <h1 className="font-display text-3xl font-bold mb-2">Uspešna prijava!</h1>
            <p className="text-white/90">Vaša prijava za Art 2026 je zabeležena.</p>
          </div>

          <div className="p-8 space-y-6">
            <TokenBlock
              label="Token za pristup prijavi"
              value={registration.token}
              hint="Sačuvajte ovaj token — potreban vam je za izmenu ili otkazivanje prijave."
              onCopy={() => copy(registration.token, 'Token')}
            />

            <TokenBlock
              label="Vaš promo kod za prijatelje"
              value={registration.promoCode}
              hint="Podelite ovaj kod sa prijateljem — dobiće 5% popusta prilikom prijave."
              onCopy={() => copy(registration.promoCode, 'Promo kod')}
              variant="accent"
            />

            <div className="bg-[oklch(0.97_0.02_60)] rounded-lg p-5 flex items-baseline justify-between">
              <span className="text-sm text-[oklch(0.40_0.05_40)]">Ukupan iznos zaduženja</span>
              <span className="font-display text-2xl font-bold text-[oklch(0.30_0.15_40)]">
                {formatCurrency(registration.totalAmount)}
              </span>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <Link to="/" className="inline-flex items-center gap-2 rounded-lg bg-[oklch(0.45_0.20_40)] px-5 py-2.5 text-sm font-medium text-white hover:bg-[oklch(0.55_0.20_40)]">
                Nazad na početnu
              </Link>
              <Link to="/manage" className="inline-flex items-center gap-2 rounded-lg border border-[oklch(0.85_0.02_60)] bg-white px-5 py-2.5 text-sm font-medium text-[oklch(0.25_0.10_40)] hover:bg-[oklch(0.98_0.02_60)]">
                Pogledaj prijavu
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TokenBlock({ label, value, hint, onCopy, variant }: { label: string; value: string; hint: string; onCopy: () => void; variant?: 'accent' }) {
  const bgClass = variant === 'accent'
    ? 'bg-gradient-to-br from-[oklch(0.96_0.05_40)] to-[oklch(0.94_0.08_20)] border-[oklch(0.85_0.10_40)]'
    : 'bg-[oklch(0.98_0.02_60)] border-[oklch(0.90_0.02_60)]';

  return (
    <div className={`rounded-lg border p-5 ${bgClass}`}>
      <div className="text-xs uppercase tracking-wider font-semibold text-[oklch(0.45_0.10_40)] mb-2">
        {label}
      </div>
      <div className="flex items-center gap-2 mb-2">
        <code className="flex-1 font-mono text-sm bg-white px-3 py-2 rounded border border-[oklch(0.90_0.03_60)] break-all text-[oklch(0.25_0.10_40)]">
          {value}
        </code>
        <Button variant="secondary" size="sm" onClick={onCopy} type="button">
          <Copy size={14} />
        </Button>
      </div>
      <p className="text-xs text-[oklch(0.45_0.05_40)] flex items-start gap-1.5">
        <Check size={12} className="mt-0.5 shrink-0" />
        {hint}
      </p>
    </div>
  );
}
