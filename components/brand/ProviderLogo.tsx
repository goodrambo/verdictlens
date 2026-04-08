import Image from 'next/image';
import { providerMap } from '@/lib/content/providers';
import { ProviderId } from '@/lib/types';
import { clsx } from 'clsx';

export function ProviderLogo({ providerId, className }: { providerId: ProviderId; className?: string }) {
  const provider = providerMap[providerId];

  return (
    <div className={clsx('inline-flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-[var(--surface-2)]', className)}>
      <Image src={provider.logoPath} alt={`${provider.name} logo`} width={40} height={40} className="h-full w-full" />
    </div>
  );
}
