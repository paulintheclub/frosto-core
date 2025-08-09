"use client"

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, Download, FileText, Star, MessageSquare, Package, Wrench } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import ProductImageGallery from '@/components/client/product-image-gallery'

export interface Product {
    id: number
    name: string
    sku: string
    mainImage: string
    gallery: string[]
    price?: string
    availability: string
    category: { name: string; href: string }
    brand: { name: string; href: string }
    specImage: string
    includesImage: string
    accessories: string[]
    catalogs: { name: string; url: string }[]
    slug: string; // Added for routing
    imageUrl: string; // Added for product card
    relatedProducts: {
        id: number
        name: string
        image: string
        price?: string
        href: string
    }[]
    comments: {
        id: number
        author: string
        date: string
        rating: number
        text: string
    }[]
}

interface ProductDetailProps {
    product: Product
}

export default function ProductDetail({ product }: ProductDetailProps) {
    const [selectedImage, setSelectedImage] = useState(0)
    const [showLightbox, setShowLightbox] = useState(false)
    const [newComment, setNewComment] = useState({ name: '', email: '', text: '' })

    const handleSubmitComment = (e: React.FormEvent) => {
        e.preventDefault()
        // Handle comment submission
        console.log('Comment submitted:', newComment)
        setNewComment({ name: '', email: '', text: '' })
    }

    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }, (_, i) => (
            <Star
                key={i}
                className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
            />
        ))
    }

    return (
        <div className="space-y-12">
            {/* Hero Section */}
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
                {/* Product Images */}
                <div className="space-y-4">
                    <ProductImageGallery
                        mainImage={product.mainImage}
                        gallery={product.gallery}
                        productName={product.name}
                    />
                </div>

                {/* Product Info */}
                <div className="space-y-6">
                    <div>
                        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                            <Link href={product.brand.href} className="hover:text-blue-600">
                                {product.brand.name}
                            </Link>
                            <span>•</span>
                            <Link href={product.category.href} className="hover:text-blue-600">
                                {product.category.name}
                            </Link>
                        </div>

                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                            {product.name}
                        </h1>

                        <p className="text-gray-600 mb-4">
                            Model: <span className="font-medium">{product.sku}</span>
                        </p>

                        {/* Availability */}
                        <div className="flex items-center space-x-2 mb-6">
                            <Badge
                                variant={product.availability === 'In Stock' ? 'default' : 'secondary'}
                                className={product.availability === 'In Stock' ? 'bg-green-100 text-green-800' : ''}
                            >
                                {product.availability === 'In Stock' ? '✅' : '❌'} {product.availability}
                            </Badge>
                        </div>

                        {/* Price */}
                        {product.price && (
                            <div className="mb-6">
                                <span className="text-3xl font-bold text-gray-900">{product.price}</span>
                                <p className="text-sm text-gray-600 mt-1">Price excluding VAT and delivery</p>
                            </div>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3">
                        <Button size="lg" className="w-full bg-blue-600 hover:bg-blue-700">
                            Request Quote
                        </Button>
                        <Button size="lg" variant="outline" className="w-full">
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Contact Specialist
                        </Button>
                    </div>

                    {/* Catalogs */}
                    {product.catalogs.length > 0 && (
                        <div className="border-t pt-6">
                            <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                                <FileText className="h-4 w-4 mr-2" />
                                Documentation
                            </h3>
                            <div className="space-y-2">
                                {product.catalogs.map((catalog, index) => (
                                    <Button
                                        key={index}
                                        variant="outline"
                                        size="sm"
                                        className="w-full justify-start"
                                        asChild
                                    >
                                        <a href={catalog.url} target="_blank" rel="noopener noreferrer">
                                            <Download className="h-4 w-4 mr-2" />
                                            {catalog.name}
                                        </a>
                                    </Button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Product Details Tabs */}
            <Tabs defaultValue="specifications" className="w-full">
                <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
                    <TabsTrigger value="specifications">Specifications</TabsTrigger>
                    <TabsTrigger value="accessories">Accessories</TabsTrigger>
                    <TabsTrigger value="related">Related Products</TabsTrigger>
                    <TabsTrigger value="reviews">Reviews</TabsTrigger>
                </TabsList>

                {/* Technical Specifications */}
                <TabsContent value="specifications" className="space-y-6">
                    <div className="grid lg:grid-cols-2 gap-8">
                        <div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-4">
                                Technical Specifications
                            </h3>
                            <div className="bg-gray-50 rounded-lg p-4">
                                <img
                                    src={product.specImage || "/placeholder.svg"}
                                    alt="Technical Specifications"
                                    className="w-full h-auto rounded-lg"
                                />
                            </div>
                        </div>

                        <div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-4">
                                Package Contents
                            </h3>
                            <div className="bg-gray-50 rounded-lg p-4">
                                <img
                                    src={product.includesImage || "/placeholder.svg"}
                                    alt="Package Contents"
                                    className="w-full h-auto rounded-lg"
                                />
                            </div>
                        </div>
                    </div>
                </TabsContent>

                {/* Accessories */}
                <TabsContent value="accessories" className="space-y-6">
                    <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                            <Package className="h-5 w-5 mr-2" />
                            Included Accessories
                        </h3>
                        <Card>
                            <CardContent className="p-6">
                                <ul className="space-y-3">
                                    {product.accessories.map((accessory, index) => (
                                        <li key={index} className="flex items-center space-x-3">
                                            <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0"></div>
                                            <span className="text-gray-700">{accessory}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* Related Products */}
                <TabsContent value="related" className="space-y-6">
                    <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">
                            Other Models in This Series
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {product.relatedProducts.map((relatedProduct) => (
                                <Link key={relatedProduct.id} href={relatedProduct.href}>
                                    <Card className="group hover:shadow-lg transition-shadow duration-300 cursor-pointer">
                                        <CardContent className="p-4">
                                            <div className="aspect-[4/3] overflow-hidden rounded-lg mb-4">
                                                <img
                                                    src={relatedProduct.image || "/placeholder.svg"}
                                                    alt={relatedProduct.name}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                />
                                            </div>
                                            <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                                                {relatedProduct.name}
                                            </h4>
                                            {relatedProduct.price && (
                                                <p className="text-lg font-bold text-blue-600">
                                                    {relatedProduct.price}
                                                </p>
                                            )}
                                            <Button size="sm" className="w-full mt-3" variant="outline">
                                                View Details
                                            </Button>
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    </div>
                </TabsContent>

                {/* Reviews */}
                <TabsContent value="reviews" className="space-y-6">
                    <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                            <MessageSquare className="h-5 w-5 mr-2" />
                            Customer Reviews ({product.comments.length})
                        </h3>

                        {/* Existing Reviews */}
                        <div className="space-y-6">
                            {product.comments.map((comment) => (
                                <Card key={comment.id}>
                                    <CardContent className="p-6">
                                        <div className="flex items-start justify-between mb-3">
                                            <div>
                                                <h4 className="font-semibold text-gray-900">{comment.author}</h4>
                                                <div className="flex items-center space-x-2 mt-1">
                                                    <div className="flex">{renderStars(comment.rating)}</div>
                                                    <span className="text-sm text-gray-500">{comment.date}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <p className="text-gray-700">{comment.text}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {/* Add Review Form */}
                        <Card>
                            <CardContent className="p-6">
                                <h4 className="font-semibold text-gray-900 mb-4">Write a Review</h4>
                                <form onSubmit={handleSubmitComment} className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <Input
                                            placeholder="Your Name"
                                            value={newComment.name}
                                            onChange={(e) => setNewComment(prev => ({ ...prev, name: e.target.value }))}
                                            required
                                        />
                                        <Input
                                            type="email"
                                            placeholder="Your Email"
                                            value={newComment.email}
                                            onChange={(e) => setNewComment(prev => ({ ...prev, email: e.target.value }))}
                                            required
                                        />
                                    </div>
                                    <Textarea
                                        placeholder="Share your experience with this product..."
                                        value={newComment.text}
                                        onChange={(e) => setNewComment(prev => ({ ...prev, text: e.target.value }))}
                                        rows={4}
                                        required
                                    />
                                    <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                                        Submit Review
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>

            {/* Mobile Fixed CTA */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-40">
                <div className="flex space-x-3">
                    <Button size="lg" className="flex-1 bg-blue-600 hover:bg-blue-700">
                        Request Quote
                    </Button>
                    <Button size="lg" variant="outline" className="flex-1">
                        Contact Us
                    </Button>
                </div>
            </div>
        </div>
    )
}
