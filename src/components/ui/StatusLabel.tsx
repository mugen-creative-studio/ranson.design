// src/components/ui/StatusLabel.tsx

interface StatusLabelProps {
  label: string
  value: string
}

export function StatusLabel({ label, value }: StatusLabelProps) {
  return (
    <div className="flex flex-col gap-1">
      <p className="text-[10px] font-medium leading-[16px] tracking-[0.2px] uppercase text-[#4b5563]">
        {label}
      </p>
      <p className="text-[14px] font-normal leading-[16px] tracking-[0.28px] text-[#2b4159] truncate">
        {value}
      </p>
    </div>
  )
}
