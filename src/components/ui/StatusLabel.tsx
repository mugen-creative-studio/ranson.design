// src/components/ui/StatusLabel.tsx

interface StatusLabelProps {
  label: string
  value: string
}

export function StatusLabel({ label, value }: StatusLabelProps) {
  return (
    <div className="py-3">
      <p className="text-sm font-medium text-navy">{label}</p>
      <p className="text-sm text-gray-500 truncate">{value}</p>
    </div>
  )
}
