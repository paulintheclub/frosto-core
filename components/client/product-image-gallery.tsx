"use client"

import { useState } from 'react'
import { ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ProductImageGalleryProps {
    mainImage: string
    gallery: string[]
    productName: string
}

export default function ProductImageGallery({ mainImage, gallery, productName }: ProductImageGalleryProps) {
    const [selectedImage, setSelectedImage] = useState(0)
    const [showLightbox, setShowLightbox] = useState(false)

    const allImages = [mainImage, ...gallery]

    const nextImage = () => {
        setSelectedImage((prev) => (prev + 1) % allImages.length)
    }

    const prevImage = () => {
        setSelectedImage((prev) => (prev - 1 + allImages.length) % allImages.length)
    }

    return (
        <>
            {/* Main Image */}
            <div className="relative group">
                <div className="aspect-[4/3] bg-gray-100 rounded-lg overflow-hidden">
                    <img
                        src={allImages[selectedImage] || "/placeholder.svg"}
                        alt={productName}
                        className="w-full h-full object-cover cursor-zoom-in"
                        onClick={() => setShowLightbox(true)}
                    />
                </div>

                {/* Zoom Icon */}
                <Button
                    size="sm"
                    variant="secondary"
                    className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => setShowLightbox(true)}
                >
                    <ZoomIn className="h-4 w-4" />
                </Button>

                {/* Navigation Arrows */}
                {allImages.length > 1 && (
                    <>
                        <Button
                            size="sm"
                            variant="secondary"
                            className="absolute left-4 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={prevImage}
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button
                            size="sm"
                            variant="secondary"
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={nextImage}
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </>
                )}
            </div>

            {/* Thumbnail Gallery */}
            {allImages.length > 1 && (
                <div className="flex space-x-2 overflow-x-auto pb-2">
                    {allImages.map((image, index) => (
                        <button
                            key={index}
                            className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                                selectedImage === index ? 'border-blue-600' : 'border-gray-200 hover:border-gray-300'
                            }`}
                            onClick={() => setSelectedImage(index)}
                        >
                            <img
                                src={image || "/placeholder.svg"}
                                alt={`${productName} view ${index + 1}`}
                                className="w-full h-full object-cover"
                            />
                        </button>
                    ))}
                </div>
            )}

            {/* Lightbox */}
            {showLightbox && (
                <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
                    <div className="relative max-w-4xl max-h-full">
                        <img
                            src={allImages[selectedImage] || "/placeholder.svg"}
                            alt={productName}
                            className="max-w-full max-h-full object-contain"
                        />

                        {/* Close Button */}
                        <Button
                            size="sm"
                            variant="secondary"
                            className="absolute top-4 right-4"
                            onClick={() => setShowLightbox(false)}
                        >
                            <X className="h-4 w-4" />
                        </Button>

                        {/* Navigation in Lightbox */}
                        {allImages.length > 1 && (
                            <>
                                <Button
                                    size="sm"
                                    variant="secondary"
                                    className="absolute left-4 top-1/2 transform -translate-y-1/2"
                                    onClick={prevImage}
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>
                                <Button
                                    size="sm"
                                    variant="secondary"
                                    className="absolute right-4 top-1/2 transform -translate-y-1/2"
                                    onClick={nextImage}
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </>
                        )}

                        {/* Image Counter */}
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                            {selectedImage + 1} / {allImages.length}
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
