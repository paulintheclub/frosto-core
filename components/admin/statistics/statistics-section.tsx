"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  BarChart3,
  TrendingUp,
  Users,
  ShoppingCart,
  Package,
  DollarSign,
  Eye,
  Calendar,
  ArrowUpRight,
  ArrowDownRight, Folder, Tag,
} from "lucide-react"
import {StatCard} from "@/components/admin/reusable-components/stat-card";

export function StatisticsSection() {
  const [animatedValues, setAnimatedValues] = useState({
    revenue: 0,
    orders: 0,
    users: 0,
    products: 0,
  })

  useEffect(() => {
    const targets = { revenue: 47892, orders: 1234, users: 2847, products: 156 }
    const duration = 2000
    const steps = 60

    const intervals = Object.keys(targets).map((key) => {
      const target = targets[key]
      const increment = target / steps
      let current = 0

      return setInterval(() => {
        current += increment
        if (current >= target) {
          current = target
          clearInterval(intervals.find((_, i) => Object.keys(targets)[i] === key))
        }
        setAnimatedValues((prev) => ({ ...prev, [key]: Math.floor(current) }))
      }, duration / steps)
    })

    return () => intervals.forEach(clearInterval)
  }, [])

  const stats = [
    {
      label: "Загальний дохід",
      value: "45,324 ₴",
      hint: "+22% цього місяця",
      icon: DollarSign,
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      label: "Всього замовлень",
      value: "1,234",
      hint: "+142 цього місяця",
      icon: ShoppingCart,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      label: "Активні користувачі",
      value: "2,547",
      hint: "+8 цього місяця",
      icon: Users,
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
    },
    {
      label: "Продуктів в каталозі",
      value: 154,
      hint: "+5 цього місяця",
      icon: Package,
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
    },
    {
      label: "Категорії",
      value: 45,
      hint: "+5 цього місяця",
      icon: BarChart3,
      iconBg: "bg-teal-100",
      iconColor: "text-teal-600",
    },
    {
      label: "Бренди",
      value: 28,
      hint: "+5 цього місяця",
      icon: TrendingUp,
      iconBg: "bg-indigo-100",
      iconColor: "text-indigo-600",
    },
    {
      label: "Коментарі",
      value: 47,
      hint: "+5 цього місяця",
      icon: Eye,
      iconBg: "bg-pink-100",
      iconColor: "text-pink-600",
    },
    {
      label: "Переглядів",
      value: "12.4K",
      hint: "+5 цього місяця",
      icon: TrendingUp,
      iconBg: "bg-cyan-100",
      iconColor: "text-cyan-600",
    },
  ]

  const orderStatusData = [
    { status: "В очікуванні", count: 156, color: "bg-yellow-500" },
    { status: "Оплачено", count: 892, color: "bg-green-500" },
    { status: "Відправлено", count: 734, color: "bg-blue-500" },
    { status: "Скасовано", count: 23, color: "bg-red-500" },
  ]

  const paymentStatusData = [
    { status: "В очікуванні", count: 89, color: "bg-yellow-500" },
    { status: "Оплачено", count: 1456, color: "bg-green-500" },
    { status: "Невдало", count: 34, color: "bg-red-500" },
    { status: "Повернено", count: 12, color: "bg-gray-500" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Статистика</h1>
          <p className="text-muted-foreground mt-1">Ласкаво просимо! Ось що відбувається з вашим магазином сьогодні.</p>
        </div>
        <Button variant="outline" className="gap-2 bg-transparent">
          <Calendar className="h-4 w-4" />
          Останні 30 днів
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
            <StatCard key={idx} {...stat} />
        ))}
      </div>

      {/* Status Breakdowns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Розподіл статусів замовлень</CardTitle>
            <CardDescription>Поточний розподіл замовлень за статусами</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {orderStatusData.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${item.color}`} />
                  <span className="text-sm font-medium">{item.status}</span>
                </div>
                <Badge variant="secondary">{item.count}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Розподіл статусів платежів</CardTitle>
            <CardDescription>Розподіл статусів платежів</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {paymentStatusData.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${item.color}`} />
                  <span className="text-sm font-medium">{item.status}</span>
                </div>
                <Badge variant="secondary">{item.count}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
