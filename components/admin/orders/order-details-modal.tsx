"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Package, User, Truck, CheckCircle, Clock, XCircle } from "lucide-react"

interface OrderDetailsModalProps {
  order: any
  isOpen: boolean
  onClose: () => void
  onStatusChange: (newStatus: string) => void
}

export function OrderDetailsModal({ order, isOpen, onClose, onStatusChange }: OrderDetailsModalProps) {
  const [currentStatus, setCurrentStatus] = useState(order?.status || "pending")

  const handleStatusChange = (newStatus: string) => {
    setCurrentStatus(newStatus)
    onStatusChange(newStatus)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            Очікує
          </Badge>
        )
      case "processing":
        return (
          <Badge variant="default" className="bg-blue-100 text-blue-800">
            Обробляється
          </Badge>
        )
      case "shipped":
        return (
          <Badge variant="default" className="bg-purple-100 text-purple-800">
            Відправлено
          </Badge>
        )
      case "delivered":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            Доставлено
          </Badge>
        )
      case "cancelled":
        return <Badge variant="destructive">Скасовано</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-5 w-5 text-yellow-600" />
      case "processing":
        return <Package className="h-5 w-5 text-blue-600" />
      case "shipped":
        return <Truck className="h-5 w-5 text-purple-600" />
      case "delivered":
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case "cancelled":
        return <XCircle className="h-5 w-5 text-red-600" />
      default:
        return null
    }
  }

  if (!order) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Деталі замовлення {order.id}</DialogTitle>
            <div className="flex items-center gap-2">
              {getStatusIcon(currentStatus)}
              {getStatusBadge(currentStatus)}
            </div>
          </div>
        </DialogHeader>

        <div className="overflow-y-auto max-h-96 space-y-6">
          {/* Order Status Management */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Управління статусом</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <Select value={currentStatus} onValueChange={handleStatusChange}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Очікує</SelectItem>
                    <SelectItem value="processing">Обробляється</SelectItem>
                    <SelectItem value="shipped">Відправлено</SelectItem>
                    <SelectItem value="delivered">Доставлено</SelectItem>
                    <SelectItem value="cancelled">Скасовано</SelectItem>
                  </SelectContent>
                </Select>
                <span className="text-sm text-muted-foreground">Оновлено: {order.date}</span>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Customer Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Інформація про клієнта
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Ім'я</p>
                  <p className="font-medium">{order.customerName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{order.customerEmail}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Адреса доставки</p>
                  <p className="font-medium">{order.shippingAddress}</p>
                </div>
              </CardContent>
            </Card>

            {/* Order Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Інформація про замовлення
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Номер замовлення</p>
                  <p className="font-mono font-medium">{order.id}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Дата створення</p>
                  <p className="font-medium">{order.date}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Спосіб оплати</p>
                  <p className="font-medium">{order.paymentMethod === "card" ? "Картка" : "Готівка"}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Товари в замовленні</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.products.map((product: any, index: number) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-3 border-b border-border last:border-b-0"
                  >
                    <div className="flex-1">
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-muted-foreground">Кількість: {product.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">₴{(product.price * product.quantity).toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">₴{product.price.toLocaleString()} за шт.</p>
                    </div>
                  </div>
                ))}

                <Separator />

                <div className="flex justify-between items-center pt-4">
                  <p className="text-lg font-semibold">Загальна сума:</p>
                  <p className="text-xl font-bold">₴{order.total.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Історія замовлення</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-full">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">Замовлення створено</p>
                    <p className="text-sm text-muted-foreground">{order.date}</p>
                  </div>
                </div>

                {currentStatus !== "pending" && (
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-full">
                      <Package className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">Замовлення в обробці</p>
                      <p className="text-sm text-muted-foreground">Оновлено адміністратором</p>
                    </div>
                  </div>
                )}

                {(currentStatus === "shipped" || currentStatus === "delivered") && (
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 rounded-full">
                      <Truck className="h-4 w-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-medium">Замовлення відправлено</p>
                      <p className="text-sm text-muted-foreground">Очікується доставка</p>
                    </div>
                  </div>
                )}

                {currentStatus === "delivered" && (
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-full">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium">Замовлення доставлено</p>
                      <p className="text-sm text-muted-foreground">Замовлення успішно виконано</p>
                    </div>
                  </div>
                )}

                {currentStatus === "cancelled" && (
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-100 rounded-full">
                      <XCircle className="h-4 w-4 text-red-600" />
                    </div>
                    <div>
                      <p className="font-medium">Замовлення скасовано</p>
                      <p className="text-sm text-muted-foreground">Замовлення було скасовано</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end space-x-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Закрити
          </Button>
          <Button>Друк замовлення</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
