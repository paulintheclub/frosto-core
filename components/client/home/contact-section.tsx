"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Phone, Mail, MapPin, Clock } from 'lucide-react'

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    comment: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log('Form submitted:', formData)
    // Reset form
    setFormData({ name: '', phone: '', comment: '' })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Get in Touch
          </h2>
          <p className="text-lg text-gray-600">
            Ready to discuss your refrigeration needs? Contact our experts today.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <Phone className="h-8 w-8 text-blue-600 mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Phone</h3>
                  <p className="text-gray-600">+1 (555) 123-4567</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <Mail className="h-8 w-8 text-blue-600 mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Email</h3>
                  <p className="text-gray-600">info@industrialcool.com</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <MapPin className="h-8 w-8 text-blue-600 mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Address</h3>
                  <p className="text-gray-600">123 Industrial Ave<br />Business District</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <Clock className="h-8 w-8 text-blue-600 mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Hours</h3>
                  <p className="text-gray-600">Mon-Fri: 8:00-18:00<br />Sat: 9:00-15:00</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Contact Form */}
          <Card>
            <CardHeader>
              <CardTitle>Request a Callback</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Input
                    type="text"
                    name="name"
                    placeholder="Your Name *"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <Input
                    type="tel"
                    name="phone"
                    placeholder="Phone Number *"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <Textarea
                    name="comment"
                    placeholder="Tell us about your refrigeration needs..."
                    value={formData.comment}
                    onChange={handleChange}
                    rows={4}
                  />
                </div>
                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                  Submit Request
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
