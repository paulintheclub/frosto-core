"use client"

import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import {Search, Check, X, Eye, MessageSquare, Clock, CheckCircle, XCircle, MoreHorizontal, Tag} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {StatCard} from "@/components/admin/reusable-components/stat-card";

// Mock comments data
const mockComments = [
  {
    id: "1",
    author: "Олександр Петренко",
    authorEmail: "alex.petrenko@example.com",
    authorAvatar: "/placeholder.svg?height=40&width=40",
    product: "iPhone 15 Pro",
    productId: "prod-1",
    content: "Чудовий телефон! Дуже задоволений покупкою. Камера просто неймовірна, а продуктивність на висоті.",
    rating: 5,
    date: "2024-03-20",
    status: "pending",
    isVerifiedPurchase: true,
  },
  {
    id: "2",
    author: "Марія Іваненко",
    authorEmail: "maria.ivanenko@example.com",
    authorAvatar: "/placeholder.svg?height=40&width=40",
    product: "Samsung Galaxy S24",
    productId: "prod-2",
    content: "Телефон хороший, але батарея могла б бути краще. За цю ціну очікувала більше.",
    rating: 3,
    date: "2024-03-19",
    status: "approved",
    isVerifiedPurchase: true,
  },
  {
    id: "3",
    author: "Дмитро Коваленко",
    authorEmail: "dmytro.kovalenko@example.com",
    authorAvatar: "/placeholder.svg?height=40&width=40",
    product: "MacBook Air M2",
    productId: "prod-3",
    content: "Це спам повідомлення з неприйнятним контентом...",
    rating: 1,
    date: "2024-03-18",
    status: "rejected",
    isVerifiedPurchase: false,
  },
  {
    id: "4",
    author: "Анна Шевченко",
    authorEmail: "anna.shevchenko@example.com",
    authorAvatar: "/placeholder.svg?height=40&width=40",
    product: "Футболка Nike",
    productId: "prod-4",
    content: "Відмінна якість матеріалу, розмір підійшов ідеально. Рекомендую!",
    rating: 5,
    date: "2024-03-17",
    status: "approved",
    isVerifiedPurchase: true,
  },
]



export function CommentsSection() {
  const [comments, setComments] = useState(mockComments)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedComments, setSelectedComments] = useState<string[]>([])
  const [viewingComment, setViewingComment] = useState<any>(null)

  const filteredComments = comments.filter((comment) => {
    const matchesSearch =
      comment.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comment.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comment.content.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || comment.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const handleSelectComment = (commentId: string) => {
    setSelectedComments((prev) =>
      prev.includes(commentId) ? prev.filter((id) => id !== commentId) : [...prev, commentId],
    )
  }

  const handleSelectAll = () => {
    if (selectedComments.length === filteredComments.length) {
      setSelectedComments([])
    } else {
      setSelectedComments(filteredComments.map((comment) => comment.id))
    }
  }

  const handleStatusChange = (commentId: string, newStatus: string) => {
    setComments((prev) =>
      prev.map((comment) => (comment.id === commentId ? { ...comment, status: newStatus } : comment)),
    )
  }

  const handleBulkStatusChange = (newStatus: string) => {
    setComments((prev) =>
      prev.map((comment) => (selectedComments.includes(comment.id) ? { ...comment, status: newStatus } : comment)),
    )
    setSelectedComments([])
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            Очікує
          </Badge>
        )
      case "approved":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            Схвалено
          </Badge>
        )
      case "rejected":
        return <Badge variant="destructive">Відхилено</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getRatingStars = (rating: number) => {
    return "★".repeat(rating) + "☆".repeat(5 - rating)
  }

  const totalComments = comments.length
  const pendingComments = comments.filter((c) => c.status === "pending").length
  const approvedComments = comments.filter((c) => c.status === "approved").length
  const rejectedComments = comments.filter((c) => c.status === "rejected").length

  const stats = [
    {
      label: "Всього коментарів",
      value: totalComments,
      icon: MessageSquare,
      iconBg: "bg-primary/10",
      iconColor: "text-primary",
    },
    {
      label: "Очікують модерації",
      value: pendingComments,
      icon: Clock,
      iconBg: "bg-yellow-100",
      iconColor: "text-yellow-600",
    },
    {
      label: "Схвалено",
      value: approvedComments,
      icon: CheckCircle,
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      label: "Відхилено",
      value: rejectedComments,
      icon: XCircle,
      iconBg: "bg-red-100",
      iconColor: "text-red-600",
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

      {/* Main Comments Table */}
      <Card>
        <CardHeader>
          <CardTitle>Коментарі</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Controls */}
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-2 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Пошук коментарів..."
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
                  <SelectItem value="approved">Схвалено</SelectItem>
                  <SelectItem value="rejected">Відхилено</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedComments.length > 0 && (
            <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
              <span className="text-sm text-muted-foreground">Обрано {selectedComments.length} коментарів:</span>
              <Button size="sm" variant="outline" onClick={() => handleBulkStatusChange("approved")}>
                <Check className="h-4 w-4 mr-1" />
                Схвалити
              </Button>
              <Button size="sm" variant="destructive" onClick={() => handleBulkStatusChange("rejected")}>
                <X className="h-4 w-4 mr-1" />
                Відхилити
              </Button>
            </div>
          )}

          {/* Comments List */}
          <div className="space-y-4">
            {filteredComments.length > 0 ? (
              filteredComments.map((comment) => (
                <Card key={comment.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <Checkbox
                        checked={selectedComments.includes(comment.id)}
                        onCheckedChange={() => handleSelectComment(comment.id)}
                      />

                      <Avatar className="h-10 w-10">
                        <AvatarImage src={comment.authorAvatar || "/placeholder.svg"} />
                        <AvatarFallback>
                          {comment.author
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{comment.author}</p>
                            <div className="text-sm text-muted-foreground">
                              {comment.product} • {comment.date}
                              {comment.isVerifiedPurchase && (
                                  <Badge variant="outline" className="ml-2 text-xs">
                                    Підтверджена покупка
                                  </Badge>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {getStatusBadge(comment.status)}
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => setViewingComment(comment)}>
                                  <Eye className="h-4 w-4 mr-2" />
                                  Переглянути
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleStatusChange(comment.id, "approved")}>
                                  <Check className="h-4 w-4 mr-2" />
                                  Схвалити
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleStatusChange(comment.id, "rejected")}
                                  className="text-destructive"
                                >
                                  <X className="h-4 w-4 mr-2" />
                                  Відхилити
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-yellow-500">{getRatingStars(comment.rating)}</span>
                          <span className="text-sm text-muted-foreground">({comment.rating}/5)</span>
                        </div>

                        <p className="text-sm leading-relaxed">{comment.content}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="py-8 text-center text-muted-foreground">Немає коментарів для відображення</div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Comment Details Modal */}
      {viewingComment && (
        <Dialog open={!!viewingComment} onOpenChange={() => setViewingComment(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Деталі коментаря</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={viewingComment.authorAvatar || "/placeholder.svg"} />
                  <AvatarFallback>
                    {viewingComment.author
                      .split(" ")
                      .map((n: string) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-medium">{viewingComment.author}</p>
                  <p className="text-sm text-muted-foreground">{viewingComment.authorEmail}</p>
                  <p className="text-sm text-muted-foreground">
                    Продукт: {viewingComment.product} • {viewingComment.date}
                  </p>
                </div>
                {getStatusBadge(viewingComment.status)}
              </div>

              <div className="flex items-center gap-2">
                <span className="text-yellow-500 text-lg">{getRatingStars(viewingComment.rating)}</span>
                <span className="text-sm text-muted-foreground">({viewingComment.rating}/5)</span>
              </div>

              <div className="p-4 bg-muted rounded-lg">
                <p className="leading-relaxed">{viewingComment.content}</p>
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    handleStatusChange(viewingComment.id, "approved")
                    setViewingComment(null)
                  }}
                >
                  <Check className="h-4 w-4 mr-2" />
                  Схвалити
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    handleStatusChange(viewingComment.id, "rejected")
                    setViewingComment(null)
                  }}
                >
                  <X className="h-4 w-4 mr-2" />
                  Відхилити
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
