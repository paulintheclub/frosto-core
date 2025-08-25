"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Search, Edit, Trash2, Ban, UserCheck, MoreHorizontal, Users, UserPlus } from "lucide-react"
import { UserDetailsModal } from "./user-details-modal"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {StatCard} from "@/components/admin/reusable-components/stat-card";

// Mock user data
const mockUsers = [
  {
    id: "1",
    name: "Олександр Петренко",
    email: "alex.petrenko@example.com",
    role: "admin",
    status: "active",
    registrationDate: "2024-01-15",
    lastLogin: "2024-03-20",
    ordersCount: 12,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "2",
    name: "Марія Іваненко",
    email: "maria.ivanenko@example.com",
    role: "customer",
    status: "active",
    registrationDate: "2024-02-10",
    lastLogin: "2024-03-19",
    ordersCount: 5,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "3",
    name: "Дмитро Коваленко",
    email: "dmytro.kovalenko@example.com",
    role: "customer",
    status: "banned",
    registrationDate: "2024-01-20",
    lastLogin: "2024-03-10",
    ordersCount: 0,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "4",
    name: "Анна Шевченко",
    email: "anna.shevchenko@example.com",
    role: "moderator",
    status: "active",
    registrationDate: "2024-03-01",
    lastLogin: "2024-03-20",
    ordersCount: 8,
    avatar: "/placeholder.svg?height=40&width=40",
  },
]

export function UserControlSection() {
  const [users, setUsers] = useState(mockUsers)
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [editingUser, setEditingUser] = useState<any>(null)

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = roleFilter === "all" || user.role === roleFilter
    const matchesStatus = statusFilter === "all" || user.status === statusFilter

    return matchesSearch && matchesRole && matchesStatus
  })

  const handleSelectUser = (userId: string) => {
    setSelectedUsers((prev) => (prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]))
  }

  const handleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([])
    } else {
      setSelectedUsers(filteredUsers.map((user) => user.id))
    }
  }

  const handleBanUser = (userId: string) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === userId ? { ...user, status: user.status === "banned" ? "active" : "banned" } : user,
      ),
    )
  }

  const handleDeleteUser = (userId: string) => {
    setUsers((prev) => prev.filter((user) => user.id !== userId))
  }

  const handleBulkAction = (action: string) => {
    switch (action) {
      case "ban":
        setUsers((prev) => prev.map((user) => (selectedUsers.includes(user.id) ? { ...user, status: "banned" } : user)))
        break
      case "unban":
        setUsers((prev) => prev.map((user) => (selectedUsers.includes(user.id) ? { ...user, status: "active" } : user)))
        break
      case "delete":
        setUsers((prev) => prev.filter((user) => !selectedUsers.includes(user.id)))
        break
    }
    setSelectedUsers([])
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            Активний
          </Badge>
        )
      case "banned":
        return <Badge variant="destructive">Заблокований</Badge>
      case "inactive":
        return <Badge variant="secondary">Неактивний</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return (
          <Badge variant="default" className="bg-purple-100 text-purple-800">
            Адміністратор
          </Badge>
        )
      case "moderator":
        return (
          <Badge variant="default" className="bg-blue-100 text-blue-800">
            Модератор
          </Badge>
        )
      case "customer":
        return <Badge variant="outline">Клієнт</Badge>
      default:
        return <Badge variant="outline">{role}</Badge>
    }
  }

  const totalUsers = users.length
  const activeUsers = users.filter((u) => u.status === "active").length
  const bannedUsers = users.filter((u) => u.status === "banned").length
  const stats = [
    {
      label: "Всього користувачів",
      value: totalUsers,
      icon: Users,
      iconBg: "bg-primary/10",
      iconColor: "text-primary",
    },
    {
      label: "Активні користувачі",
      value: activeUsers,
      icon: UserCheck,
      iconBg: "bg-green-100",
      iconColor: "text-text-green-600-600",
    },
    {
      label: "Заблоковані",
      value: bannedUsers,
      icon: Ban,
      iconBg: "bg-red-100",
      iconColor: "text-red-600",
    },
  ]
  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4">
        {stats.map((stat, idx) => (
            <StatCard key={idx} {...stat} />
        ))}
      </div>

      {/* Main Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Контроль юзерів</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Controls */}
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-2 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Пошук користувачів..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Роль" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Всі ролі</SelectItem>
                  <SelectItem value="admin">Адміністратор</SelectItem>
                  <SelectItem value="moderator">Модератор</SelectItem>
                  <SelectItem value="customer">Клієнт</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Статус" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Всі статуси</SelectItem>
                  <SelectItem value="active">Активний</SelectItem>
                  <SelectItem value="banned">Заблокований</SelectItem>
                  <SelectItem value="inactive">Неактивний</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button>
              <UserPlus className="h-4 w-4 mr-2" />
              Додати користувача
            </Button>
          </div>

          {/* Bulk Actions */}
          {selectedUsers.length > 0 && (
            <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
              <span className="text-sm text-muted-foreground">Обрано {selectedUsers.length} користувачів:</span>
              <Button size="sm" variant="outline" onClick={() => handleBulkAction("ban")}>
                Заблокувати
              </Button>
              <Button size="sm" variant="outline" onClick={() => handleBulkAction("unban")}>
                Розблокувати
              </Button>
              <Button size="sm" variant="destructive" onClick={() => handleBulkAction("delete")}>
                Видалити
              </Button>
            </div>
          )}

          {/* Users Table */}
          <div className="border border-border rounded-lg overflow-hidden">
            {/* Table Header */}
            <div className="bg-muted/50 border-b border-border">
              <div className="flex items-center py-3 px-4 font-medium text-sm">
                <div className="w-12">
                  <Checkbox
                    checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </div>
                <div className="flex-1 min-w-0 px-4">Користувач</div>
                <div className="w-32 px-4 hidden md:block">Роль</div>
                <div className="w-32 px-4 hidden lg:block">Статус</div>
                <div className="w-32 px-4 hidden xl:block">Замовлення</div>
                <div className="w-40 px-4 hidden xl:block">Останній вхід</div>
                <div className="w-20 px-4 text-center">Дії</div>
              </div>
            </div>

            {/* Table Body */}
            <div className="max-h-96 overflow-y-auto">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center py-3 px-4 border-b border-border hover:bg-muted/50 transition-colors"
                  >
                    <div className="w-12">
                      <Checkbox
                        checked={selectedUsers.includes(user.id)}
                        onCheckedChange={() => handleSelectUser(user.id)}
                      />
                    </div>

                    <div className="flex-1 min-w-0 px-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.avatar || "/placeholder.svg"} />
                          <AvatarFallback>
                            {user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <div className="font-medium truncate">{user.name}</div>
                          <div className="text-sm text-muted-foreground truncate">{user.email}</div>
                        </div>
                      </div>
                    </div>

                    <div className="w-32 px-4 hidden md:block">{getRoleBadge(user.role)}</div>

                    <div className="w-32 px-4 hidden lg:block">{getStatusBadge(user.status)}</div>

                    <div className="w-32 px-4 hidden xl:block">
                      <span className="text-sm">{user.ordersCount}</span>
                    </div>

                    <div className="w-40 px-4 hidden xl:block">
                      <span className="text-sm text-muted-foreground">{user.lastLogin}</span>
                    </div>

                    <div className="w-20 px-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setEditingUser(user)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Редагувати
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleBanUser(user.id)}>
                            {user.status === "banned" ? (
                              <>
                                <UserCheck className="h-4 w-4 mr-2" />
                                Розблокувати
                              </>
                            ) : (
                              <>
                                <Ban className="h-4 w-4 mr-2" />
                                Заблокувати
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDeleteUser(user.id)} className="text-destructive">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Видалити
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-muted-foreground">Немає користувачів для відображення</div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* User Details Modal */}
      {editingUser && (
        <UserDetailsModal
          user={editingUser}
          isOpen={!!editingUser}
          onClose={() => setEditingUser(null)}
          onSave={(updatedUser) => {
            setUsers((prev) => prev.map((u) => (u.id === updatedUser.id ? updatedUser : u)))
            setEditingUser(null)
          }}
        />
      )}
    </div>
  )
}
