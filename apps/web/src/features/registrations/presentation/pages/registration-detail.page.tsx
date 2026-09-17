import { useState } from 'react';
import { Link, Navigate, useLocation, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { ArrowLeft, Ban, Calendar, CheckCircle2, Copy, Mail, User } from 'lucide-react';
import { RegistrationStatus } from '@art-2026/shared';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, formatDate } from '@/shared/presentation/lib/utils';
import { HttpError } from '@/shared/infrastructure/http/http-error';
import { useRegistration } from '../../application/use-registration.hook';
import { useUpdateRegistration } from '../../application/use-update-registration.hook';
import { useCancelRegistration } from '../../application/use-cancel-registration.hook';
import { EditRegistrationForm } from '../components/edit-registration-form';
import { PriceSummary } from '../components/price-summary';

interface LocationState {
  email?: string;
}

export function RegistrationDetailPage() {
  const { token } = useParams<{ token: string }>();
  const location = useLocation();
  const email = (location.state as LocationState | null)?.email ?? null;
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [editing, setEditing] = useState(false);

  const { data: reg, isLoading, error } = useRegistration(token, email);
  const updateMut = useUpdateRegistration(token ?? '', email ?? '');
  const cancelMut = useCancelRegistration(token ?? '', email ?? '');

  if (!email) return <Navigate to="/manage" replace />;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-[oklch(0.50_0.03_40)]">Učitavanje prijave...</p>
      </div>
    );
  }
  if (error || !reg) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-red-600">
          Nije moguće učitati prijavu. {(error instanceof HttpError ? error.parsedMessage() : (error as Error)?.message)}
        </p>
        <Link to="/manage" className="text-[oklch(0.45_0.15_40)] hover:underline">
          Pokušajte ponovo
        </Link>
      </div>
    );
  }

  const isCancelled = reg.status === RegistrationStatus.Cancelled;

  return (
    <div className="min-h-screen animate-fade-in">
      <header className="bg-white border-b border-[oklch(0.90_0.02_60)]">
        <div className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link to="/" className="text-[oklch(0.45_0.10_40)] hover:text-[oklch(0.35_0.15_40)]">
              <ArrowLeft size={20} />
            </Link>
            <div>
              <h1 className="font-display text-2xl font-bold text-[oklch(0.15_0.10_40)]">
                Vaša prijava
              </h1>
              <p className="text-sm text-[oklch(0.50_0.03_40)]">
                Kreirano: {formatDate(reg.createdAt)}
              </p>
            </div>
          </div>
          <Badge variant={isCancelled ? 'danger' : 'success'}>
            {isCancelled ? 'Otkazana' : 'Aktivna'}
          </Badge>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Panel title="Podaci o posetiocu" icon={<User size={16} />}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-6 text-sm">
              <Detail label="Ime i prezime" value={`${reg.firstName} ${reg.lastName}`} />
              {reg.profession && <Detail label="Profesija" value={reg.profession} />}
              <Detail label="Email" value={reg.email} icon={<Mail size={14} />} />
              <Detail label="Broj osoba" value={String(reg.groupSize)} />
              <Detail label="Adresa" value={`${reg.address1}${reg.address2 ? `, ${reg.address2}` : ''}`} />
              <Detail label="Mesto" value={`${reg.postalCode} ${reg.city}, ${reg.country}`} />
            </div>
          </Panel>

          <Panel title="Dani prijave" icon={<Calendar size={16} />}>
            <div className="flex flex-wrap gap-2">
              {reg.paintingDay && <Badge variant="brand">Slikarstvo</Badge>}
              {reg.photographyDay && <Badge variant="brand">Fotografija</Badge>}
            </div>

            {!isCancelled && (
              <div className="mt-6 pt-6 border-t border-[oklch(0.92_0.02_60)]">
                {!editing ? (
                  <Button variant="secondary" onClick={() => setEditing(true)}>
                    Izmeni dane / broj osoba
                  </Button>
                ) : (
                  <div className="space-y-4">
                    <EditRegistrationForm
                      registration={reg}
                      isSubmitting={updateMut.isPending}
                      onSubmit={(data) => {
                        updateMut.mutate(data, {
                          onSuccess: () => {
                            toast.success('Prijava ažurirana');
                            setEditing(false);
                          },
                          onError: (err) => {
                            const msg = err instanceof HttpError ? err.parsedMessage() : (err as Error).message;
                            toast.error(msg);
                          },
                        });
                      }}
                    />
                    <Button variant="ghost" size="sm" onClick={() => setEditing(false)}>
                      Odustani
                    </Button>
                  </div>
                )}
              </div>
            )}
          </Panel>

          <Panel title="Vaš promo kod" icon={<CheckCircle2 size={16} />}>
            <div className="flex items-center gap-3">
              <code className="flex-1 font-mono text-sm bg-[oklch(0.98_0.02_60)] px-3 py-2 rounded border border-[oklch(0.90_0.03_60)] text-[oklch(0.25_0.10_40)]">
                {reg.promoCode}
              </code>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  navigator.clipboard.writeText(reg.promoCode);
                  toast.success('Promo kod kopiran');
                }}
              >
                <Copy size={14} />
              </Button>
            </div>
            <p className="text-xs text-[oklch(0.50_0.03_40)] mt-3">
              {reg.promoCodeRedeemedAt
                ? `Iskorišćen ${formatDate(reg.promoCodeRedeemedAt)}`
                : isCancelled
                  ? 'Ovaj promo kod je nevažeći (prijava je otkazana).'
                  : 'Podelite ga sa prijateljem — dobiće 5% popusta.'}
            </p>
          </Panel>

          {!isCancelled && (
            <Panel title="Otkazivanje prijave" icon={<Ban size={16} />}>
              <p className="text-sm text-[oklch(0.45_0.05_40)] mb-4">
                Otkazivanjem prijave token postaje trajno neaktivan i ne može se obnoviti. Za novu prijavu moraćete se ponovo registrovati.
              </p>
              {!confirmCancel ? (
                <Button variant="danger" onClick={() => setConfirmCancel(true)}>
                  Otkaži prijavu
                </Button>
              ) : (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg space-y-3">
                  <p className="text-sm text-red-800 font-medium">
                    Sigurno želite da otkažete prijavu?
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="danger"
                      size="sm"
                      disabled={cancelMut.isPending}
                      onClick={() => {
                        cancelMut.mutate(undefined, {
                          onSuccess: () => {
                            toast.success('Prijava otkazana');
                            setConfirmCancel(false);
                          },
                          onError: (err) => {
                            const msg = err instanceof HttpError ? err.parsedMessage() : (err as Error).message;
                            toast.error(msg);
                          },
                        });
                      }}
                    >
                      Da, otkaži
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setConfirmCancel(false)}>
                      Ne
                    </Button>
                  </div>
                </div>
              )}
            </Panel>
          )}

          {isCancelled && (
            <div className="rounded-lg bg-red-50 border border-red-200 p-5">
              <p className="text-sm text-red-800">
                Ova prijava je otkazana. Token je trajno neaktivan i promo kod je nevažeći.
              </p>
              <div className="mt-3">
                <Link to="/register" className="text-sm text-red-700 hover:text-red-900 font-medium underline">
                  Napravi novu prijavu
                </Link>
              </div>
            </div>
          )}
        </div>

        <aside className="lg:col-span-1 space-y-4">
          <div>
            <h3 className="text-xs uppercase tracking-wider text-[oklch(0.50_0.10_40)] font-semibold mb-3">
              Iznos zaduženja
            </h3>
            <PriceSummary breakdown={reg.priceBreakdown} groupSize={reg.groupSize} compact />
          </div>
          <div className="rounded-lg border border-[oklch(0.90_0.02_60)] bg-white p-4 text-sm text-[oklch(0.45_0.05_40)]">
            <p className="font-medium text-[oklch(0.25_0.05_40)] mb-1">Ukupno</p>
            <p className="font-display text-2xl font-bold text-[oklch(0.35_0.15_40)]">
              {formatCurrency(reg.totalAmount)}
            </p>
          </div>
        </aside>
      </main>
    </div>
  );
}

function Panel({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-[oklch(0.90_0.02_60)] shadow-sm">
      <div className="px-6 py-4 border-b border-[oklch(0.94_0.02_60)] flex items-center gap-2">
        <span className="text-[oklch(0.45_0.10_40)]">{icon}</span>
        <h3 className="font-display font-semibold text-[oklch(0.20_0.05_40)]">{title}</h3>
      </div>
      <div className="px-6 py-5">{children}</div>
    </div>
  );
}

function Detail({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-wide text-[oklch(0.50_0.03_40)] font-medium mb-1 flex items-center gap-1.5">
        {icon}
        {label}
      </div>
      <div className="text-[oklch(0.20_0.05_40)]">{value}</div>
    </div>
  );
}
