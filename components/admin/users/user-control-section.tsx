"use client"

import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {Ban, UserCheck, Users, UserPlus} from "lucide-react"
import { UserDetailsModal } from "./user-details-modal"
import {StatCard} from "@/components/admin/reusable-components/stat-card";
import {DataTable} from "@/components/ui/data-table";
import {getUserColumns} from "@/components/admin/users/columns";
import { User } from "./columns"
import { mockUsers } from "@/components/admin/users/mockData"

export function UserControlSection() {
  const [users, setUsers] = useState(mockUsers)
  const [roleFilter, setRoleFilter] = useState("all")
  const [editingUser, setEditingUser] = useState<any>(null)

  const handleDeleteUser = (user: User) => {
    setUsers((prev) => prev.filter((u) => u.id !== user.id))
  }

  const totalUsers = users.length
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
      value: 32,
      icon: UserCheck,
      iconBg: "bg-green-100",
      iconColor: "text-text-green-600-600",
    },
    {
      label: "Заблоковані",
      value: 44,
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

            </div>

            <Button>
              <UserPlus className="h-4 w-4 mr-2" />
              Додати користувача
            </Button>
          </div>




          <DataTable
              columns={getUserColumns(setEditingUser, handleDeleteUser)}
              data={users}
              filters={[
                { columnId: "role", value: roleFilter },
              ]}
          />
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
