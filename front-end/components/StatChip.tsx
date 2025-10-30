export default function StatChip({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="badge badge-gray">
      <span className="opacity-70">{label}:</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}
