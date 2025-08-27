// components/layout/language-switcher.tsx
"use client"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useLanguage } from "@/context/language-context"

export const LanguageSwitcher = () => {
    const { language, setLanguage } = useLanguage()

    return (
        <Select value={language} onValueChange={(value) => setLanguage(value as any)}>
            <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Мова" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="en">Англ</SelectItem>
                <SelectItem value="uk">Укр</SelectItem>
            </SelectContent>
        </Select>
    )
}
