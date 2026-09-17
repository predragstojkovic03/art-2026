import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { ArrowLeft, KeyRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ErrorText } from '@/components/ui/error-text';

const schema = z.object({
  email: z.string().email('Neispravan email'),
  token: z.string().min(1, 'Token je obavezan'),
});

type FormValues = z.infer<typeof schema>;

export function ManagePage() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const submit = (v: FormValues): void => {
    navigate(`/manage/${encodeURIComponent(v.token)}`, { state: { email: v.email } });
    toast.info('Pristupam prijavi...');
  };

  return (
    <div className="min-h-screen animate-fade-in">
      <header className="bg-white border-b border-[oklch(0.90_0.02_60)]">
        <div className="max-w-6xl mx-auto px-6 py-6 flex items-center gap-4">
          <Link to="/" className="text-[oklch(0.45_0.10_40)] hover:text-[oklch(0.35_0.15_40)]">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="font-display text-2xl font-bold text-[oklch(0.15_0.10_40)]">
            Upravljanje prijavom
          </h1>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-6 py-16">
        <div className="bg-white rounded-2xl border border-[oklch(0.90_0.02_60)] shadow-sm overflow-hidden">
          <div className="bg-gradient-to-br from-[oklch(0.95_0.05_40)] to-[oklch(0.92_0.08_20)] px-8 py-6 border-b border-[oklch(0.88_0.05_40)]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[oklch(0.45_0.15_40)]">
                <KeyRound size={20} />
              </div>
              <div>
                <h2 className="font-display text-lg font-semibold text-[oklch(0.20_0.10_40)]">
                  Pristup prijavi
                </h2>
                <p className="text-sm text-[oklch(0.45_0.05_40)]">
                  Unesite email i token koji ste dobili prilikom prijave
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit(submit)} className="p-8 space-y-5">
            <div>
              <Label required>Email</Label>
              <Input type="email" {...register('email')} placeholder="marko@example.com" />
              <ErrorText>{errors.email?.message}</ErrorText>
            </div>
            <div>
              <Label required>Token</Label>
              <Input {...register('token')} placeholder="64 karaktera hex string" />
              <ErrorText>{errors.token?.message}</ErrorText>
            </div>
            <Button type="submit" size="lg" className="w-full">
              Pristupi prijavi
            </Button>
          </form>
        </div>

        <p className="text-center text-sm text-[oklch(0.50_0.03_40)] mt-6">
          Nemate prijavu?{' '}
          <Link to="/register" className="text-[oklch(0.45_0.15_40)] hover:text-[oklch(0.35_0.15_40)] font-medium">
            Prijavite se
          </Link>
        </p>
      </main>
    </div>
  );
}
