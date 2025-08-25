"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, Building2, Bell, Shield, Palette, Globe } from "lucide-react"

export function SettingsSection() {
  const [companyData, setCompanyData] = useState({
    name: "TechStore Pro",
    email: "contact@techstore.com",
    phone: "+1 (555) 123-4567",
    address: "123 Tech Street, Silicon Valley, CA 94000",
    description: "Ваш головний пункт призначення для передових електронних пристроїв та розумних пристроїв.",
    workingHours: "Понеділок - П'ятниця: 9:00 - 18:00\nСубота: 10:00 - 16:00\nНеділя: Закрито",
  })

  const [notifications, setNotifications] = useState({
    emailOrders: true,
    emailComments: true,
    emailUsers: false,
    pushOrders: true,
    pushComments: false,
  })

  const [security, setSecurity] = useState({
    twoFactor: false,
    sessionTimeout: "30",
    passwordExpiry: "90",
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Налаштування компанії</h1>
        <p className="text-muted-foreground mt-1">Керуйте інформацією про вашу компанію та контактними даними.</p>
      </div>

      <Tabs defaultValue="company" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="company" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Компанія
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Сповіщення
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Безпека
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Вигляд
          </TabsTrigger>
        </TabsList>

        <TabsContent value="company" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Інформація про компанію
              </CardTitle>
              <CardDescription>Оновіть дані вашої компанії, які будуть відображатися на всій платформі</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-sm font-medium">Логотип компанії</Label>
                <div className="mt-2 flex items-center gap-4">
                  <div className="h-16 w-16 bg-muted rounded-lg flex items-center justify-center border-2 border-dashed border-border">
                    <Building2 className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <Button variant="outline" className="gap-2 bg-transparent">
                    <Upload className="h-4 w-4" />
                    Завантажити логотип
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Рекомендований розмір: 200x200px. Формат PNG або JPG.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="company-name" className="text-sm font-medium">
                    Назва компанії *
                  </Label>
                  <Input
                    id="company-name"
                    value={companyData.name}
                    onChange={(e) => setCompanyData((prev) => ({ ...prev, name: e.target.value }))}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="contact-email" className="text-sm font-medium">
                    Контактний email *
                  </Label>
                  <Input
                    id="contact-email"
                    type="email"
                    value={companyData.email}
                    onChange={(e) => setCompanyData((prev) => ({ ...prev, email: e.target.value }))}
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description" className="text-sm font-medium">
                  Опис
                </Label>
                <Textarea
                  id="description"
                  value={companyData.description}
                  onChange={(e) => setCompanyData((prev) => ({ ...prev, description: e.target.value }))}
                  className="mt-1 min-h-[100px]"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone" className="text-sm font-medium">
                    Номер телефону
                  </Label>
                  <Input
                    id="phone"
                    value={companyData.phone}
                    onChange={(e) => setCompanyData((prev) => ({ ...prev, phone: e.target.value }))}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="address" className="text-sm font-medium">
                    Адреса
                  </Label>
                  <Input
                    id="address"
                    value={companyData.address}
                    onChange={(e) => setCompanyData((prev) => ({ ...prev, address: e.target.value }))}
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="working-hours" className="text-sm font-medium">
                  Години роботи
                </Label>
                <Textarea
                  id="working-hours"
                  value={companyData.workingHours}
                  onChange={(e) => setCompanyData((prev) => ({ ...prev, workingHours: e.target.value }))}
                  className="mt-1 min-h-[100px]"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Налаштування сповіщень
              </CardTitle>
              <CardDescription>Керуйте тим, як і коли ви отримуєте сповіщення</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="text-sm font-medium mb-4">Email сповіщення</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Нові замовлення</p>
                      <p className="text-xs text-muted-foreground">Отримувати email при нових замовленнях</p>
                    </div>
                    <Switch
                      checked={notifications.emailOrders}
                      onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, emailOrders: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Нові коментарі</p>
                      <p className="text-xs text-muted-foreground">Отримувати email при нових коментарях</p>
                    </div>
                    <Switch
                      checked={notifications.emailComments}
                      onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, emailComments: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Нові користувачі</p>
                      <p className="text-xs text-muted-foreground">
                        Отримувати email при реєстрації нових користувачів
                      </p>
                    </div>
                    <Switch
                      checked={notifications.emailUsers}
                      onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, emailUsers: checked }))}
                    />
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-4">Push сповіщення</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Замовлення</p>
                      <p className="text-xs text-muted-foreground">Push сповіщення про замовлення</p>
                    </div>
                    <Switch
                      checked={notifications.pushOrders}
                      onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, pushOrders: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Коментарі</p>
                      <p className="text-xs text-muted-foreground">Push сповіщення про коментарі</p>
                    </div>
                    <Switch
                      checked={notifications.pushComments}
                      onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, pushComments: checked }))}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Налаштування безпеки
              </CardTitle>
              <CardDescription>Керуйте налаштуваннями безпеки вашого акаунту</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Двофакторна автентифікація</p>
                  <p className="text-xs text-muted-foreground">Додатковий рівень безпеки для вашого акаунту</p>
                </div>
                <Switch
                  checked={security.twoFactor}
                  onCheckedChange={(checked) => setSecurity((prev) => ({ ...prev, twoFactor: checked }))}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="session-timeout" className="text-sm font-medium">
                    Тайм-аут сесії (хвилини)
                  </Label>
                  <Input
                    id="session-timeout"
                    type="number"
                    value={security.sessionTimeout}
                    onChange={(e) => setSecurity((prev) => ({ ...prev, sessionTimeout: e.target.value }))}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="password-expiry" className="text-sm font-medium">
                    Термін дії пароля (дні)
                  </Label>
                  <Input
                    id="password-expiry"
                    type="number"
                    value={security.passwordExpiry}
                    onChange={(e) => setSecurity((prev) => ({ ...prev, passwordExpiry: e.target.value }))}
                    className="mt-1"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Налаштування вигляду
              </CardTitle>
              <CardDescription>Налаштуйте вигляд адмін панелі</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-sm font-medium">Тема</Label>
                <div className="mt-2 grid grid-cols-2 gap-4">
                  <div className="border rounded-lg p-4 cursor-pointer hover:bg-muted/50 transition-colors">
                    <div className="w-full h-20 bg-white border rounded mb-2"></div>
                    <p className="text-sm font-medium">Світла</p>
                  </div>
                  <div className="border rounded-lg p-4 cursor-pointer hover:bg-muted/50 transition-colors">
                    <div className="w-full h-20 bg-gray-900 border rounded mb-2"></div>
                    <p className="text-sm font-medium">Темна</p>
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">Мова інтерфейсу</Label>
                <div className="mt-2 flex items-center gap-2">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Українська</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Button className="bg-teal-600 hover:bg-teal-700">Зберегти зміни</Button>
      </div>
    </div>
  )
}
