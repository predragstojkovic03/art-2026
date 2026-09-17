import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { IRegistrationResponse, IUpdateRegistration } from '@art-2026/shared';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const schema = z.object({
  paintingDay: z.boolean(),
  photographyDay: z.boolean(),
  groupSize: z.coerce.number().int().min(1),
}).refine((d) => d.paintingDay || d.photographyDay, {
  message: 'Morate odabrati bar jedan dan',
  path: ['paintingDay'],
});

type FormValues = z.infer<typeof schema>;

interface Props {
  registration: IRegistrationResponse;
  onSubmit: (data: IUpdateRegistration) => void;
  isSubmitting: boolean;
}

export function EditRegistrationForm({ registration, onSubmit, isSubmitting }: Props) {
  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      paintingDay: registration.paintingDay,
      photographyDay: registration.photographyDay,
      groupSize: registration.groupSize,
    },
  });

  const painting = watch('paintingDay');
  const photography = watch('photographyDay');

  return (
    <form onSubmit={handleSubmit((v) => onSubmit(v))} className="space-y-5">
      <div>
        <Label>Dani</Label>
        <div className="space-y-2">
          <DayCheck label="Slikarstvo" checked={painting} {...register('paintingDay')} />
          <DayCheck label="Fotografija" checked={photography} {...register('photographyDay')} />
        </div>
        {errors.paintingDay?.message && (
          <p className="text-xs text-red-600 mt-1">{errors.paintingDay.message as string}</p>
        )}
      </div>

      <div>
        <Label>Broj osoba</Label>
        <Input type="number" min={1} {...register('groupSize')} />
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Ažuriranje...' : 'Sačuvaj izmene'}
      </Button>
    </form>
  );
}

function DayCheck({ label, checked, ...rest }: { label: string; checked: boolean } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
      checked
        ? 'border-[oklch(0.55_0.20_40)] bg-[oklch(0.98_0.05_40)]'
        : 'border-[oklch(0.88_0.02_60)] bg-white hover:border-[oklch(0.75_0.10_40)]'
    }`}>
      <input type="checkbox" {...rest} className="w-4 h-4 accent-[oklch(0.55_0.20_40)]" />
      <span className={`font-medium ${checked ? 'text-[oklch(0.30_0.15_40)]' : 'text-[oklch(0.25_0.05_40)]'}`}>
        {label}
      </span>
    </label>
  );
}
