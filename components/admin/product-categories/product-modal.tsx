// components/admin/products/product-modal.tsx
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
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { trpc } from "@/utils/trpc"
import { useLanguage } from "@/context/language-context"

import { ImageUploadField } from "@/components/admin/reusable-components/image-upload-field"
import {ProductCategorySelector} from "@/components/admin/product-categories/product-category-selector";

interface ProductModalProps {
  isOpen: boolean
  onClose: () => void
  mode: "add" | "edit"
  defaultProductId?: string
  defaultParentId?: string | null
  onSuccess?: () => void
}

export function ProductModal({
                               isOpen,
                               onClose,
                               mode,
                               defaultProductId,
                               defaultParentId,
                               onSuccess,
                             }: ProductModalProps) {
  const { language } = useLanguage()
  const [fillInError, setFillInError] = useState<boolean>(false)
 const [unkownProduct, setUnkownProduct] = useState<boolean>(false)
  const [skuError, setSkuError] = useState<boolean>(false)

  const [brandName, setBrandName] = useState<string>("")
  const [sku, setSku] = useState("")
  const [mainImage, setMainImage] = useState("")
  const [gallery, setGallery] = useState<string[]>([])
  const [price, setPrice] = useState<number>(0)
  const [isDiscounted, setIsDiscounted] = useState(false)
  const [discountPrice, setDiscountPrice] = useState<number | undefined>()
  const [availability, setAvailability] = useState<"IN_STOCK" | "ON_ORDER">("IN_STOCK")
  const [categoryId, setCategoryId] = useState<string | null>(defaultParentId ?? null)

  const [mainChar, setMainChar] = useState("")
  const [techCharImage, setTechCharImage] = useState("")
  const [expCharImage, setExpCharImage] = useState("")
  const [sizeConnectionsImage, setSizeConnectionsImage] = useState("")
  const [accessoriesImage, setAccessoriesImage] = useState("")

  const [translations, setTranslations] = useState<Record<string, { name: string; description: string }>>({
    uk: { name: "", description: "" },
    ru: { name: "", description: "" },
  })

  const { data: oneProduct } = trpc.adminProduct.getProductById.useQuery(
      { productId: defaultProductId! },
      { enabled: mode === "edit" && !!defaultProductId }
  )

  const utils = trpc.useUtils()
  const createMutation = trpc.adminProduct.createProduct.useMutation({
    onSuccess: async () => {
      await utils.adminProduct.invalidate()
      if (onSuccess) await onSuccess()
    },
    onError: (error) => {
      if (error.data?.code === "BAD_REQUEST") {
        setSkuError(true)
      }
    },
  })

  const updateMutation = trpc.adminProduct.updateProduct.useMutation({
    onSuccess: async () => {
      await utils.adminProduct.invalidate()
      if (onSuccess) await onSuccess()
    },
    onError: (error) => {
      if (error.data?.code === "BAD_REQUEST") {
        setSkuError(true)
      }
      else if (error.data?.code === "NOT_FOUND") {
        setUnkownProduct(true)
      }

    },
  })

  const { data: parentCategory } = trpc.adminCategory.getCategoryById.useQuery(
      { catId: defaultParentId! },
      { enabled: mode === "add" && !!defaultParentId }
  )

  useEffect(() => {

    console.log(parentCategory);
    if (!parentCategory) return

    setBrandName(parentCategory.brand?.name ?? "")

  })

  useEffect(() => {
    if (!oneProduct) return

    setSku(oneProduct.sku)
    setMainImage(oneProduct.mainImage)
    setGallery(oneProduct.gallery)
    setPrice(oneProduct.price)
    setIsDiscounted(oneProduct.isDiscounted)
    setDiscountPrice(oneProduct.discountPrice ?? undefined)
    setAvailability(oneProduct.availability)
    setMainChar(oneProduct.mainChar ?? "")
    setTechCharImage(oneProduct.techCharImage ?? "")
    setExpCharImage(oneProduct.expCharImage ?? "")
    setSizeConnectionsImage(oneProduct.sizeConnectionsImage ?? "")
    setAccessoriesImage(oneProduct.accessoriesImage ?? "")
    setCategoryId(oneProduct.categoryId)
    setBrandName(oneProduct.category?.brand?.name ?? "")

    const tr: typeof translations = { uk: { name: "", description: "" }, ru: { name: "", description: "" } }
    oneProduct.translations.forEach(t => {
      if (t.languageCode === "uk" || t.languageCode === "ru") {
        tr[t.languageCode] = { name: t.name, description: t.description ?? "" }
      }
    })
    setTranslations(tr)
  }, [oneProduct])



  const isValid = sku.trim()
        && translations.uk.name.trim()
        && price > 0
        && availability
        && mainImage.trim()
        && gallery.length > 0
        && categoryId


  const handleSave = () => {
    if (!isValid || !categoryId) return

    const translationArray = []

    translationArray.push({
      languageCode: "uk",
      name: translations.uk.name,
      description: translations.uk.description,
    })

    const hasRuTranslation =
        translations.ru.name.trim() !== "" ||
        translations.ru.description.trim() !== ""

    if (hasRuTranslation) {
      if (translations.ru.name.trim() === "") {
        setFillInError(true)
        return
      }
      else {
        setFillInError(false)
      }

      translationArray.push({
        languageCode: "ru",
        description: translations.ru.description,
        name: translations.ru.name,
      })
    }


    const payload = {
      sku,
      mainImage,
      gallery,
      price,
      isDiscounted,
      discountPrice: isDiscounted ? discountPrice ?? 0 : null,
      availability,
      mainChar,
      techCharImage,
      expCharImage,
      sizeConnectionsImage,
      accessoriesImage,
      categoryId,
      translations: translationArray,
    }

    if (mode === "add") {
      createMutation.mutate(payload)
    } else if (defaultProductId) {
      updateMutation.mutate({ productId: defaultProductId, ...payload })
    }
  }

  return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{mode === "add" ? "Створити продукт" : "Редагувати продукт"}</DialogTitle>
          </DialogHeader>

          <Tabs defaultValue="general" className="mt-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="general">Основне</TabsTrigger>
              <TabsTrigger value="images">Зображення</TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="mt-4 space-y-3 overflow-y-auto max-h-[calc(90vh-270px)] pr-2">

              {Object.entries(translations).map(([lang, val]) => (
                  <div key={lang}>
                    <Label>Назва ({lang.toUpperCase()})</Label>
                    {lang === "uk" && <span className="text-red-500 ml-1">*</span>}
                    <Input
                        value={val.name}
                        onChange={(e) =>
                            setTranslations((prev) => ({
                              ...prev,
                              [lang]: { ...prev[lang], name: e.target.value },
                            }))
                        }
                    />

                    {lang === "ru" && fillInError && (
                        <p className="text-sm text-red-500 mt-1">
                          Якщо заповнено опис російскою, потрібно вказати і назву.
                        </p>
                    )}

                    <Label>Опис ({lang.toUpperCase()})</Label>
                    <Input
                        value={val.description}
                        onChange={(e) =>
                            setTranslations((prev) => ({
                              ...prev,
                              [lang]: { ...prev[lang], description: e.target.value },
                            }))
                        }
                    />
                  </div>
              ))}

              <Label>SKU</Label>
              <span className="text-red-500 ml-1">*</span>
              <Input value={sku} onChange={(e) => setSku(e.target.value)} />
              {skuError && (
                  <p className="text-sm text-red-500 mt-1">
                    SKU не унікальний.
                  </p>
              )}

              <Label>Головна характеристика</Label>
              <Input value={mainChar} onChange={(e) => setMainChar(e.target.value)} />

              <Label>Ціна</Label>
              <span className="text-red-500 ml-1">*</span>
              <Input type="number" value={price} onChange={(e) => setPrice(parseFloat(e.target.value))} />

              <Label>Знижка</Label>
              <Select value={isDiscounted ? "yes" : "no"} onValueChange={(val) => setIsDiscounted(val === "yes")}>
                <SelectTrigger>
                  <SelectValue placeholder="Чи є знижка?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="no">Без знижки</SelectItem>
                  <SelectItem value="yes">Є знижка</SelectItem>
                </SelectContent>
              </Select>

              {isDiscounted && (
                  <>
                    <Label>Ціна зі знижкою</Label>
                    <Input
                        type="number"
                        value={discountPrice ?? ""}
                        onChange={(e) => setDiscountPrice(parseFloat(e.target.value))}
                    />
                  </>
              )}

              <Label>Наявність</Label>
              <span className="text-red-500 ml-1">*</span>
                <Select value={availability} onValueChange={(val) => setAvailability(val as "IN_STOCK" | "ON_ORDER")}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="IN_STOCK">В наявності</SelectItem>
                  <SelectItem value="ON_ORDER">Доступний на замовлення</SelectItem>
                </SelectContent>
              </Select>

              <Label>Бренд</Label>
              <Input
                  value={brandName}
                  readOnly
                  className="bg-muted cursor-not-allowed"
              />

              <ProductCategorySelector
                  categoryId={categoryId}
                  onChange={setCategoryId}
                  disabled={mode === "edit"}
              />
            </TabsContent>

            <TabsContent value="images" className="mt-4 space-y-3 overflow-y-auto max-h-[calc(90vh-270px)] pr-2">
              <ImageUploadField
                  label="Головне зображення"
                  value={mainImage}
                  mandatory
                  onChange={(url) => setMainImage(Array.isArray(url) ? url[0] : url)}
              />

              <ImageUploadField
                  label="Галерея"
                  value={gallery}
                  mandatory
                  multiple
                  onChange={(url) => setMainImage(Array.isArray(url) ? url[0] : url)}
              />
              <ImageUploadField
                  label="Зображення тех. характеристик"
                  value={techCharImage}
                  onChange={(url) => setMainImage(Array.isArray(url) ? url[0] : url)}
              />
              <ImageUploadField
                  label="Зображення експлуатаційних характеристик"
                  value={expCharImage}
                  onChange={(url) => setMainImage(Array.isArray(url) ? url[0] : url)}
              />
              <ImageUploadField
                  label="Зображення розмірів"
                  value={sizeConnectionsImage}
                  onChange={(url) => setMainImage(Array.isArray(url) ? url[0] : url)}
              />
              <ImageUploadField
                  label="Зображення аксесуарів"
                  value={accessoriesImage}
                  onChange={(url) => setMainImage(Array.isArray(url) ? url[0] : url)}
              />

            </TabsContent>


          </Tabs>

          <div className="flex justify-end mt-6">
            <Button onClick={handleSave} disabled={!isValid}>
              {mode === "add" ? "Створити" : "Зберегти"}
            </Button>
            {unkownProduct && (
            <p className="text-sm text-red-500 mt-1 ml-4">
            Не вдалося знайти продукт. Можливо, він був видалений.
            </p>
            )}
          </div>
        </DialogContent>
      </Dialog>
  )
}
