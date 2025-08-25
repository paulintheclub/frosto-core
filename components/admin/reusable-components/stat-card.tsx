// components/dashboard/stat-card.tsx
import { LucideIcon } from "lucide-react"

interface StatCardProps {
    label: string
    value: string | number
    hint?: string
    icon: LucideIcon
    iconBg: string
    iconColor: string
}

export const StatCard = ({
                             label,
                             value,
                             hint,
                             icon: Icon,
                             iconBg,
                             iconColor,
                         }: StatCardProps) => {
    return (
        <div className="bg-white p-6 rounded-lg border border-border">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-muted-foreground">{label}</p>
                    <p className="text-2xl font-bold text-foreground">{value}</p>
                    {hint && (
                        <p className="text-xs text-muted-foreground mt-1">{hint}</p>
                    )}
                </div>
                <div className={`h-12 w-12 rounded-lg flex items-center justify-center ${iconBg}`}>
                    <Icon className={`h-6 w-6 ${iconColor}`} />
                </div>
            </div>
        </div>
    )
}
