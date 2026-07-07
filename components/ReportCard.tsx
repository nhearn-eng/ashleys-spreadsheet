import { SectionCard } from "./SectionCard";

export function ReportCard({
  title,
  metrics,
}: {
  title: string;
  metrics: Record<string, number | string>;
}) {
  return (
    <SectionCard title={title} bodyClassName="py-2">
      <dl className="divide-y divide-line">
        {Object.entries(metrics).map(([label, value]) => (
          <div key={label} className="flex items-center justify-between py-2.5">
            <dt className="text-sm text-warmgray">{label}</dt>
            <dd className="font-display text-lg text-navy">{value}</dd>
          </div>
        ))}
      </dl>
    </SectionCard>
  );
}
