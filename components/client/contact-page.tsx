"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Phone, Mail, MapPin, Clock } from "lucide-react"

export default function ContactPage() {
  return (
    <div className="bg-gray-50/90">
      <div className="container mx-auto px-4 pb-16 lg:pb-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left side: Contact Info & Map */}
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                Свяжитесь с нами
              </h1>
              <p className="text-lg text-gray-600">
                Мы здесь, чтобы помочь. Задайте нам вопрос или расскажите о своем проекте.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="bg-blue-100 text-blue-600 p-3 rounded-full">
                  <Phone className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Телефон</h3>
                  <a href="tel:+15551234567" className="text-gray-600 hover:text-blue-600 transition-colors">
                    +1 (555) 123-4567
                  </a>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-blue-100 text-blue-600 p-3 rounded-full">
                  <Mail className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Email</h3>
                  <a href="mailto:info@industrialcool.com" className="text-gray-600 hover:text-blue-600 transition-colors">
                    info@industrialcool.com
                  </a>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-blue-100 text-blue-600 p-3 rounded-full">
                  <MapPin className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Адрес</h3>
                  <p className="text-gray-600">123 Industrial Way, Coolsville, CS 54321</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-blue-100 text-blue-600 p-3 rounded-full">
                  <Clock className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Часы работы</h3>
                  <p className="text-gray-600">Пн-Пт: 8:00 - 18:00</p>
                </div>
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="h-64 bg-gray-200 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">Карта будет здесь</p>
            </div>
          </div>

          {/* Right side: Contact Form */}
          <Card className="shadow-lg">
            <CardContent className="p-8 lg:p-10">
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-6">
                Форма обратной связи
              </h2>
              <form className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium text-gray-700">Имя</label>
                    <Input id="name" placeholder="Ваше имя" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-gray-700">Email</label>
                    <Input id="email" type="email" placeholder="Ваш email" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="subject" className="text-sm font-medium text-gray-700">Тема</label>
                  <Input id="subject" placeholder="Тема вашего сообщения" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium text-gray-700">Сообщение</label>
                  <Textarea id="message" placeholder="Напишите ваше сообщение здесь..." className="min-h-[120px]" />
                </div>
                <Button type="submit" className="w-full" size="lg">
                  Отправить
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
