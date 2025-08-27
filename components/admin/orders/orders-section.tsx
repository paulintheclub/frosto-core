"use client"

import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Download,
  Package,
  Clock,
  CheckCircle,
} from "lucide-react"
import { OrderDetailsModal } from "./order-details-modal"
import {StatCard} from "@/components/admin/reusable-components/stat-card";
import {DataTable} from "@/components/ui/data-table";

import {getOrderColumns} from "@/components/admin/orders/columns"

// Mock orders data
import { mockOrders } from "@/components/admin/orders/mockData"

export function OrdersSection() {
  const [orders, setOrders] = useState(mockOrders)
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedOrders, setSelectedOrders] = useState<string[]>([])
  const [viewingOrder, setViewingOrder] = useState<any>(null)


  const handleStatusChange = (orderId: string, newStatus: string) => {
    setOrders((prev) => prev.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order)))
  }

  const handleBulkStatusChange = (newStatus: string) => {
    setOrders((prev) =>
      prev.map((order) => (selectedOrders.includes(order.id) ? { ...order, status: newStatus } : order)),
    )
    setSelectedOrders([])
  }

  const totalOrders = orders.length
  const pendingOrders = orders.filter((o) => o.status === "pending").length
  const processingOrders = orders.filter((o) => o.status === "processing").length
  const completedOrders = orders.filter((o) => o.status === "delivered").length
  const totalRevenue = orders.filter((o) => o.status !== "cancelled").reduce((sum, order) => sum + order.total, 0)

  const stats = [
    {
      label: "Всього замовлень",
      value: totalOrders,
      icon: Package,
      iconBg: "bg-primary/10",
      iconColor: "text-primary",
    },
    {
      label: "Очікують обробки",
      value: pendingOrders,
      icon: Clock,
      iconBg: "bg-yellow-100",
      iconColor: "text-yellow-600",
    },
    {
      label: "В обробці",
      value: processingOrders,
      icon: Package,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      label: "Виконано",
      value: completedOrders,
      icon: CheckCircle,
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
            <StatCard key={idx} {...stat} />
        ))}
      </div>

      {/* Revenue Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Загальний дохід</p>
              <p className="text-3xl font-bold">₴{totalRevenue.toLocaleString()}</p>
            </div>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Експорт звіту
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Main Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Замовлення</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Controls */}
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-2 flex-1">

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Статус" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Всі статуси</SelectItem>
                  <SelectItem value="pending">Очікує</SelectItem>
                  <SelectItem value="processing">Обробляється</SelectItem>
                  <SelectItem value="shipped">Відправлено</SelectItem>
                  <SelectItem value="delivered">Доставлено</SelectItem>
                  <SelectItem value="cancelled">Скасовано</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Експорт
            </Button>
          </div>

          {/* Bulk Actions */}
          {selectedOrders.length > 0 && (
            <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
              <span className="text-sm text-muted-foreground">Обрано {selectedOrders.length} замовлень:</span>
              <Button size="sm" variant="outline" onClick={() => handleBulkStatusChange("processing")}>
                Взяти в обробку
              </Button>
              <Button size="sm" variant="outline" onClick={() => handleBulkStatusChange("shipped")}>
                Відправити
              </Button>
              <Button size="sm" variant="outline" onClick={() => handleBulkStatusChange("delivered")}>
                Доставлено
              </Button>
              <Button size="sm" variant="destructive" onClick={() => handleBulkStatusChange("cancelled")}>
                Скасувати
              </Button>
            </div>
          )}
          <DataTable
              columns={getOrderColumns(handleStatusChange, setViewingOrder)}
              data={orders}
              filters={[
                { columnId: "status", value: statusFilter }, // можно добавлять другие фильтры
              ]}
          />

        </CardContent>
      </Card>

      {/* Order Details Modal */}
      <OrderDetailsModal
        order={viewingOrder}
        isOpen={!!viewingOrder}
        onClose={() => setViewingOrder(null)}
        onStatusChange={(newStatus) => {
          handleStatusChange(viewingOrder.id, newStatus)
          setViewingOrder({ ...viewingOrder, status: newStatus })
        }}
      />

    </div>
  )
}
