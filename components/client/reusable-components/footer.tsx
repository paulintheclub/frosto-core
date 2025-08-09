import Link from 'next/link'
import { Phone, Mail, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">IC</span>
              </div>
              <span className="text-xl font-bold">IndustrialCool</span>
            </div>
            <p className="text-gray-400 mb-4">
              Professional refrigeration equipment for businesses across Europe.
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>info@industrialcool.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>123 Industrial Ave</span>
              </div>
            </div>
          </div>

          {/* Products */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Products</h3>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="#" className="hover:text-white">Refrigeration Units</Link></li>
              <li><Link href="#" className="hover:text-white">Evaporators</Link></li>
              <li><Link href="#" className="hover:text-white">Condensers</Link></li>
              <li><Link href="#" className="hover:text-white">Freezer Cabinets</Link></li>
              <li><Link href="#" className="hover:text-white">Display Cases</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Services</h3>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="#" className="hover:text-white">Installation</Link></li>
              <li><Link href="#" className="hover:text-white">Maintenance</Link></li>
              <li><Link href="#" className="hover:text-white">Repair</Link></li>
              <li><Link href="#" className="hover:text-white">24/7 Support</Link></li>
              <li><Link href="#" className="hover:text-white">Warranty</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="#" className="hover:text-white">About Us</Link></li>
              <li><Link href="#" className="hover:text-white">Careers</Link></li>
              <li><Link href="#" className="hover:text-white">News</Link></li>
              <li><Link href="#" className="hover:text-white">Contact</Link></li>
              <li><Link href="#" className="hover:text-white">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2025 IndustrialCool. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
