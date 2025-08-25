"use client"

import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Search,
  Eye,
  Download,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  MoreHorizontal,
  MessageSquare
} from "lucide-react"
import { OrderDetailsModal } from "./order-details-modal"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {StatCard} from "@/components/admin/reusable-components/stat-card";

// Mock orders data
const mockOrders = [
  {
    id: "ORD-001",
    customerName: "Олександр Петренко",
    customerEmail: "alex.petrenko@example.com",
    date: "2024-03-20",
    status: "pending",
    total: 1250.0,
    items: 3,
    paymentMethod: "card",
    shippingAddress: "вул. Хрещатик, 1, Київ",
    products: [
      { name: "iPhone 15 Pro", quantity: 1, price: 1000.0 },
      { name: "Чохол для iPhone", quantity: 1, price: 150.0 },
      { name: "Захисне скло", quantity: 1, price: 100.0 },
    ],
  },
  {
    id: "ORD-002",
    customerName: "Марія Іваненко",
    customerEmail: "maria.ivanenko@example.com",
    date: "2024-03-19",
    status: "processing",
    total: 750.5,
    items: 2,
    paymentMethod: "cash",
    shippingAddress: "вул. Шевченка, 15, Львів",
    products: [
      { name: "Samsung Galaxy S24", quantity: 1, price: 650.5 },
      { name: "Навушники", quantity: 1, price: 100.0 },
    ],
  },
  {
    id: "ORD-003",
    customerName: "Дмитро Коваленко",
    customerEmail: "dmytro.kovalenko@example.com",
    date: "2024-03-18",
    status: "shipped",
    total: 2100.0,
    items: 1,
    paymentMethod: "card",
    shippingAddress: "вул. Грушевського, 5, Одеса",
    products: [{ name: "MacBook Air M2", quantity: 1, price: 2100.0 }],
  },
  {
    id: "ORD-004",
    customerName: "Анна Шевченко",
    customerEmail: "anna.shevchenko@example.com",
    date: "2024-03-17",
    status: "delivered",
    total: 450.0,
    items: 4,
    paymentMethod: "card",
    shippingAddress: "вул. Франка, 20, Харків",
    products: [
      { name: "Футболка Nike", quantity: 2, price: 150.0 },
      { name: "Кросівки Adidas", quantity: 1, price: 300.0 },
    ],
  },
  {
    id: "ORD-005",
    customerName: "Петро Мельник",
    customerEmail: "petro.melnyk@example.com",
    date: "2024-03-16",
    status: "cancelled",
    total: 320.0,
    items: 1,
    paymentMethod: "card",
    shippingAddress: "вул. Лесі Українки, 8, Дніпро",
    products: [{ name: "Планшет Samsung", quantity: 1, price: 320.0 }],
  },
]

export function OrdersSection() {
  const [orders, setOrders] = useState(mockOrders)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedOrders, setSelectedOrders] = useState<string[]>([])
  const [viewingOrder, setViewingOrder] = useState<any>(null)

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || order.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const handleSelectOrder = (orderId: string) => {
    setSelectedOrders((prev) => (prev.includes(orderId) ? prev.filter((id) => id !== orderId) : [...prev, orderId]))
  }

  const handleSelectAll = () => {
    if (selectedOrders.length === filteredOrders.length) {
      setSelectedOrders([])
    } else {
      setSelectedOrders(filteredOrders.map((order) => order.id))
    }
  }

  const handleStatusChange = (orderId: string, newStatus: string) => {
    setOrders((prev) => prev.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order)))
  }

  const handleBulkStatusChange = (newStatus: string) => {
    setOrders((prev) =>
      prev.map((order) => (selectedOrders.includes(order.id) ? { ...order, status: newStatus } : order)),
    )
    setSelectedOrders([])
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
        return <Clock className="h-4 w-4 text-yellow-600" />
      case "processing":
        return <Package className="h-4 w-4 text-blue-600" />
      case "shipped":
        return <Truck className="h-4 w-4 text-purple-600" />
      case "delivered":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "cancelled":
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return null
    }
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
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Пошук замовлень..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

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

          {/* Orders Table */}
          <div className="border border-border rounded-lg overflow-hidden">
            {/* Table Header */}
            <div className="bg-muted/50 border-b border-border">
              <div className="flex items-center py-3 px-4 font-medium text-sm min-w-fit">
                <div className="w-12 flex-shrink-0">
                  <Checkbox
                    checked={selectedOrders.length === filteredOrders.length && filteredOrders.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </div>
                <div className="w-28 flex-shrink-0 px-2">№ Замовлення</div>
                <div className="flex-1 min-w-0 px-2">Клієнт</div>
                <div className="w-24 flex-shrink-0 px-2 hidden md:block">Дата</div>
                <div className="w-28 flex-shrink-0 px-2 hidden lg:block">Статус</div>
                <div className="w-16 flex-shrink-0 px-2 hidden lg:block">Товарів</div>
                <div className="w-24 flex-shrink-0 px-2">Сума</div>
                <div className="w-16 flex-shrink-0 px-2 text-center">Дії</div>
              </div>
            </div>

            {/* Table Body */}
            <div className="max-h-96 overflow-y-auto">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center py-3 px-4 border-b border-border hover:bg-muted/50 transition-colors min-w-fit"
                  >
                    <div className="w-12 flex-shrink-0">
                      <Checkbox
                        checked={selectedOrders.includes(order.id)}
                        onCheckedChange={() => handleSelectOrder(order.id)}
                      />
                    </div>

                    <div className="w-28 flex-shrink-0 px-2">
                      <span className="font-mono text-xs">{order.id}</span>
                    </div>

                    <div className="flex-1 min-w-0 px-2">
                      <div className="font-medium truncate text-sm">{order.customerName}</div>
                      <div className="text-xs text-muted-foreground truncate">{order.customerEmail}</div>
                    </div>

                    <div className="w-24 flex-shrink-0 px-2 hidden md:block">
                      <span className="text-xs">{order.date}</span>
                    </div>

                    <div className="w-28 flex-shrink-0 px-2 hidden lg:block">
                      <div className="flex items-center gap-1">
                        {getStatusIcon(order.status)}
                        <div className="hidden xl:block">{getStatusBadge(order.status)}</div>
                        <div className="xl:hidden">{getStatusIcon(order.status)}</div>
                      </div>
                    </div>

                    <div className="w-16 flex-shrink-0 px-2 hidden lg:block">
                      <span className="text-xs">{order.items}</span>
                    </div>

                    <div className="w-24 flex-shrink-0 px-2">
                      <span className="font-medium text-sm">₴{order.total.toLocaleString()}</span>
                    </div>

                    <div className="w-16 flex-shrink-0 px-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setViewingOrder(order)}>
                            <Eye className="h-4 w-4 mr-2" />
                            Переглянути
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleStatusChange(order.id, "processing")}>
                            <Package className="h-4 w-4 mr-2" />В обробку
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleStatusChange(order.id, "shipped")}>
                            <Truck className="h-4 w-4 mr-2" />
                            Відправити
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleStatusChange(order.id, "delivered")}>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Доставлено
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleStatusChange(order.id, "cancelled")}
                            className="text-destructive"
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Скасувати
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-muted-foreground">Немає замовлень для відображення</div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Order Details Modal */}
      {viewingOrder && (
        <OrderDetailsModal
          order={viewingOrder}
          isOpen={!!viewingOrder}
          onClose={() => setViewingOrder(null)}
          onStatusChange={(newStatus) => {
            handleStatusChange(viewingOrder.id, newStatus)
            setViewingOrder({ ...viewingOrder, status: newStatus })
          }}
        />
      )}
    </div>
  )
}
