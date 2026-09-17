import { useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ICreateRegistration } from '@art-2026/shared';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ErrorText } from '@/components/ui/error-text';
import { PriceSummary, computePriceBreakdown } from '../price-summary';

const schema = z
  .object({
    firstName: z.string().min(1, 'Ime je obavezno'),
    lastName: z.string().min(1, 'Prezime je obavezno'),
    profession: z.string().optional(),
    address1: z.string().min(1, 'Adresa je obavezna'),
    address2: z.string().optional(),
    postalCode: z.string().min(1, 'Poštanski broj je obavezan'),
    city: z.string().min(1, 'Mesto je obavezno'),
    country: z.string().min(1, 'Država je obavezna'),
    email: z.string().email('Neispravan email'),
    emailConfirm: z.string().email('Neispravan email'),
    days: z.enum(['painting', 'photography', 'both']),
    groupSize: z.coerce.number().int().min(1, 'Broj osoba mora biti najmanje 1'),
    promoCode: z.string().optional(),
  })
  .refine((d) => d.email === d.emailConfirm, {
    message: 'Email adrese se ne podudaraju',
    path: ['emailConfirm'],
  });

type FormValues = z.infer<typeof schema>;

interface Config {
  pricePainting: number;
  pricePhotography: number;
  earlyBirdDeadline: string;
}

interface Props {
  config: Config;
  onSubmit: (data: ICreateRegistration) => void;
  isSubmitting: boolean;
}

export function RegistrationForm({ config, onSubmit, isSubmitting }: Props) {
  const { register, handleSubmit, control, formState: { errors }, setValue } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      days: 'painting',
      groupSize: 1,
      country: 'Srbija',
    },
  });

  const days = useWatch({ control, name: 'days' });
  const groupSize = useWatch({ control, name: 'groupSize' }) || 1;
  const promoCode = useWatch({ control, name: 'promoCode' });
  const paintingDay = days === 'painting' || days === 'both';
  const photographyDay = days === 'photography' || days === 'both';

  const breakdown = computePriceBreakdown(config, paintingDay, photographyDay, Number(groupSize), !!promoCode);

  // Keep groupSize as number
  useEffect(() => {
    const g = Number(groupSize);
    if (isNaN(g) || g < 1) setValue('groupSize', 1);
  }, [groupSize, setValue]);

  const submit = (v: FormValues): void => {
    onSubmit({
      firstName: v.firstName,
      lastName: v.lastName,
      profession: v.profession || undefined,
      address1: v.address1,
      address2: v.address2 || undefined,
      postalCode: v.postalCode,
      city: v.city,
      country: v.country,
      email: v.email,
      emailConfirm: v.emailConfirm,
      paintingDay: v.days === 'painting' || v.days === 'both',
      photographyDay: v.days === 'photography' || v.days === 'both',
      groupSize: Number(v.groupSize),
      promoCode: v.promoCode || undefined,
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <form onSubmit={handleSubmit(submit)} className="lg:col-span-2 space-y-8">
        <Section title="Lični podaci">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Ime" required error={errors.firstName?.message}>
              <Input {...register('firstName')} placeholder="Marko" />
            </Field>
            <Field label="Prezime" required error={errors.lastName?.message}>
              <Input {...register('lastName')} placeholder="Petrović" />
            </Field>
            <Field label="Profesija" error={errors.profession?.message}>
              <Input {...register('profession')} placeholder="Student" />
            </Field>
          </div>
        </Section>

        <Section title="Adresa">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Adresa 1" required error={errors.address1?.message}>
              <Input {...register('address1')} placeholder="Bulevar kralja Aleksandra 73" />
            </Field>
            <Field label="Adresa 2" error={errors.address2?.message}>
              <Input {...register('address2')} placeholder="Stan 4" />
            </Field>
            <Field label="Poštanski broj" required error={errors.postalCode?.message}>
              <Input {...register('postalCode')} placeholder="11000" />
            </Field>
            <Field label="Mesto" required error={errors.city?.message}>
              <Input {...register('city')} placeholder="Beograd" />
            </Field>
            <Field label="Država" required error={errors.country?.message}>
              <Input {...register('country')} />
            </Field>
          </div>
        </Section>

        <Section title="Kontakt">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Email" required error={errors.email?.message}>
              <Input type="email" {...register('email')} placeholder="marko@example.com" />
            </Field>
            <Field label="Potvrda email adrese" required error={errors.emailConfirm?.message}>
              <Input type="email" {...register('emailConfirm')} placeholder="marko@example.com" />
            </Field>
          </div>
        </Section>

        <Section title="Prijava">
          <Label required>Za koje dane se prijavljujete?</Label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-2">
            <DayChoice value="painting" label="Slikarstvo" price={config.pricePainting} register={register} current={days} />
            <DayChoice value="photography" label="Fotografija" price={config.pricePhotography} register={register} current={days} />
            <DayChoice value="both" label="Oba dana (−10%)" price={Math.round((config.pricePainting + config.pricePhotography) * 0.9)} register={register} current={days} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <Field label="Broj osoba (grupna prijava)" required error={errors.groupSize?.message}>
              <Input type="number" min={1} {...register('groupSize')} />
              <p className="text-xs text-[oklch(0.50_0.03_40)] mt-1.5">
                Grupni popust: 3 osobe — 3%, 5+ osoba — 5%
              </p>
            </Field>
            <Field label="Promo kod (opciono)" error={errors.promoCode?.message}>
              <Input {...register('promoCode')} placeholder="npr. ABC12345" style={{ textTransform: 'uppercase' }} />
              <p className="text-xs text-[oklch(0.50_0.03_40)] mt-1.5">Dodatnih 5% popusta</p>
            </Field>
          </div>
        </Section>

        <div className="flex justify-end">
          <Button type="submit" size="lg" disabled={isSubmitting}>
            {isSubmitting ? 'Slanje...' : 'Potvrdi prijavu'}
          </Button>
        </div>
      </form>

      <aside className="lg:col-span-1">
        <PriceSummary breakdown={breakdown} groupSize={Number(groupSize)} />
      </aside>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="font-display text-xl font-semibold text-[oklch(0.20_0.05_40)] mb-4 pb-2 border-b border-[oklch(0.90_0.02_60)]">
        {title}
      </h2>
      {children}
    </section>
  );
}

function Field({ label, required, error, children }: { label: string; required?: boolean; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <Label required={required}>{label}</Label>
      {children}
      <ErrorText>{error}</ErrorText>
    </div>
  );
}

function DayChoice({ value, label, price, register, current }: {
  value: string;
  label: string;
  price: number;
  register: ReturnType<typeof useForm<FormValues>>['register'];
  current: string;
}) {
  const isSelected = current === value;
  return (
    <label className={`relative flex flex-col p-4 rounded-lg border-2 cursor-pointer transition-all ${
      isSelected
        ? 'border-[oklch(0.55_0.20_40)] bg-[oklch(0.98_0.05_40)] shadow-sm'
        : 'border-[oklch(0.88_0.02_60)] bg-white hover:border-[oklch(0.75_0.10_40)]'
    }`}>
      <input type="radio" value={value} {...register('days')} className="sr-only" />
      <span className={`font-medium ${isSelected ? 'text-[oklch(0.30_0.15_40)]' : 'text-[oklch(0.25_0.05_40)]'}`}>
        {label}
      </span>
      <span className={`text-xs mt-0.5 ${isSelected ? 'text-[oklch(0.45_0.15_40)]' : 'text-[oklch(0.50_0.03_40)]'}`}>
        {new Intl.NumberFormat('sr-RS').format(price)} RSD
      </span>
    </label>
  );
}
