"use client"

import { useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs"

import { CategorySelector } from "@/components/admin/product-categories/category-selector"

import { trpc } from "@/utils/trpc"
import { useLanguage } from "@/context/language-context"

interface CategoryModalProps {
  isOpen: boolean
  onClose: () => void
  mode: "add" | "edit"
  defaultParentId?: string | null
  defaultBrandId?: string | null
  defaultCategoryId?: string
  onSuccess?: () => void
}

export function CategoryModal({
                                isOpen,
                                onClose,
                                mode,
                                defaultParentId = null,
                                defaultBrandId = "",
                                defaultCategoryId,
                                onSuccess,
                              }: CategoryModalProps) {
  const { language } = useLanguage()
  const [brandId, setBrandId] = useState<string>(defaultBrandId || "")
  const [selectedBrandName, setSelectedBrandName] = useState<string>("")
  const [categoryPath, setCategoryPath] = useState<string[]>(
      defaultParentId ? [defaultParentId] : []
  )
  const [fillInError, setFillInError] = useState<boolean>(false)

  const [translations, setTranslations] = useState<Record<string, { type: string; description: string }>>({
    uk: { type: "", description: "" },
    ru: { type: "", description: "" },
  })

  const { data: brands = [] } = trpc.adminBrand.getAllBrands.useQuery()
  const { data: allCategories = [] } =
      trpc.adminCategory.getAllFlatCategories.useQuery({ lang: language })

  const { data: oneCategory } = trpc.adminCategory.getCategoryById.useQuery(
      { catId: defaultCategoryId! },
      { enabled: mode === "edit" && !!defaultCategoryId }
  )

  const utils = trpc.useUtils()
  const createMutation = trpc.adminCategory.createCategory.useMutation({
    onSuccess: async () => {
      await utils.adminCategory.getAllFlatCategories.invalidate()
      if (onSuccess) await onSuccess()
    },
  })
  const updateMutation = trpc.adminCategory.updateCategory.useMutation({
    onSuccess: async () => {
      await utils.adminCategory.getAllFlatCategories.invalidate()
      if (onSuccess) await onSuccess()
    },
  })

  useEffect(() => {
    if (!oneCategory) return

    setBrandId(oneCategory.brandId ?? "")

    const updatedTranslations = { ru: { type: "", description: "" }, uk: { type: "", description: "" } }
    for (const lang of ["ru", "uk"]) {
      const t = oneCategory.translations.find(tr => tr.languageCode === lang)
      if (t) {
        updatedTranslations[lang as "ru" | "uk"] = {
          type: t.type || "",
          description: t.description || "",
        }
      }
    }
    setTranslations(updatedTranslations)

    if (oneCategory.parentId) {
      const path = findPathToParent(oneCategory.parentId, allCategories)
      setCategoryPath(path)
    } else {
      setCategoryPath([])
    }
  }, [oneCategory, allCategories])

  useEffect(() => {
    const brand = brands.find((b) => b.id === brandId)
    setSelectedBrandName(brand?.name || "")
  }, [brandId, brands])

  useEffect(() => {
    if (mode === "add" && defaultParentId && allCategories.length > 0) {
      const path = findPathToParent(defaultParentId, allCategories)
      setCategoryPath(path)
    }
  }, [mode, defaultParentId, allCategories])

  function findPathToParent(
      parentId: string,
      categories: { id: string; parentId: string | null }[]
  ): string[] {
    const map = new Map<string, string | null>()
    categories.forEach(cat => {
      map.set(cat.id, cat.parentId)
    })

    const path: string[] = []
    let current: string | null = parentId
    while (current) {
      path.unshift(current)
      current = map.get(current) ?? null
    }

    return path
  }


  const parentId = categoryPath.at(-1) ?? null

  const isBrandSelectable = !!parentId
  const inheritedBrandId = allCategories.find((c) => c.id === parentId)?.brandId
  const brandSelectDisabled = !isBrandSelectable || !!inheritedBrandId

  useEffect(() => {
    if (inheritedBrandId) {
      setBrandId(inheritedBrandId)
    }
  }, [inheritedBrandId])

  const isValid = translations.uk.type.trim() !== ""

  const handleSave = () => {
    if (!isValid) return

    const translationArray = []

// Украинский — обязателен
    translationArray.push({
      languageCode: "uk",
      type: translations.uk.type,
      description: translations.uk.description,
      name: translations.uk.type,
    })

    const hasRuTranslation =
        translations.ru.type.trim() !== "" ||
        translations.ru.description.trim() !== ""

    if (hasRuTranslation) {
      if (translations.ru.type.trim() === "") {
        setFillInError(true)
        return
      }
      else {
        setFillInError(false)
      }

      translationArray.push({
        languageCode: "ru",
        type: translations.ru.type,
        description: translations.ru.description,
        name: translations.ru.type,
      })
    }

    if (mode === "add") {
      createMutation.mutate({
        parentId: parentId ?? null,
        brandId: brandId || null,
        translations: translationArray
      })
    }
    if (mode === "edit" && defaultCategoryId) {
      updateMutation.mutate({
        catId: defaultCategoryId,
        brandId: brandId || null,
        translations: translationArray,
      })
    }
  }

  return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {mode === "add" ? "Створити категорію" : "Редагувати категорію"}
            </DialogTitle>
          </DialogHeader>

          <Tabs defaultValue="details" className="mt-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="details">Назва й опис</TabsTrigger>
              <TabsTrigger value="structure">Бренд і категорія</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="mt-4">
              <div>
                <Label>Назва укр. (згенеровано)</Label>
                <Input
                    value={`${translations["uk"].type} ${selectedBrandName}`.trim()}
                    readOnly
                    className="bg-muted cursor-not-allowed"
                />
              </div>

              <div className="mt-2">
                <Label>Назва рус. (згенеровано)</Label>
                <Input
                    value={`${translations["ru"].type} ${selectedBrandName}`.trim()}
                    readOnly
                    className="bg-muted cursor-not-allowed"
                />
              </div>

              {Object.entries(translations).map(([lang, val]) => (
                  <div key={lang} className="mt-4">
                    <Label>
                      Тип ({lang.toUpperCase()})
                      {lang === "uk" && <span className="text-red-500 ml-1">*</span>}
                    </Label>
                    <Input
                        value={val.type}
                        onChange={(e) =>
                            setTranslations((prev) => ({
                              ...prev,
                              [lang]: { ...prev[lang], type: e.target.value },
                            }))
                        }
                        placeholder="Введіть тип категорії"
                    />

                    {lang === "ru" && fillInError && (
                        <p className="text-sm text-red-500 mt-1">
                          Якщо заповнено опис російскою, потрібно вказати і назву.
                        </p>
                    )}

                    <Label className="mt-2">
                      Опис ({lang.toUpperCase()})
                    </Label>
                    <Input
                        value={val.description}
                        onChange={(e) =>
                            setTranslations((prev) => ({
                              ...prev,
                              [lang]: { ...prev[lang], description: e.target.value },
                            }))
                        }
                        placeholder="Введіть опис категорії"
                    />
                  </div>
              ))}
            </TabsContent>

            <TabsContent value="structure" className="mt-4">
              <div>
                <Label>Бренд</Label>
                <Select
                    value={brandId}
                    onValueChange={setBrandId}
                    disabled={brandSelectDisabled}
                >
                  <SelectTrigger>
                    <SelectValue
                        placeholder={brandSelectDisabled ? "Автоматично" : "Оберіть бренд"}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {brands.map((brand) => (
                        <SelectItem key={brand.id} value={brand.id}>
                          {brand.name}
                        </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="mt-4">
                <Label>Батьківська категорія</Label>
                <CategorySelector
                    categoryPath={categoryPath}
                    onChange={setCategoryPath}
                    disabled={mode === "edit" && !!defaultCategoryId} // опционально
                />
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end mt-6">
            <Button onClick={handleSave} disabled={!isValid}>
              {mode === "add" ? "Створити" : "Зберегти"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
  )
}
