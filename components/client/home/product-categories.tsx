import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import Link from "next/link";

export default function ProductCategories() {
  const categories = [
    {
      id: 1,
      title: 'Компрессори',
      image: '/compresor.png',
      description: 'Commercial and industrial cooling systems',
      link: '/categories/refrigeration-units'
    },
    {
      id: 2,
      title: 'Агрегати',
      image: '/agregator.png',
      description: 'Heat exchange components for cooling',
      link: '/categories/refrigeration-units'
    },
    {
      id: 3,
      title: 'Повітроохолоджувачі',
      image: '/coldwind.png',
      description: 'Heat rejection equipment',
      link: '/categories/refrigeration-units'
    },
    {
      id: 4,
      title: 'Конденсатори',
      image: '/condensator.png',
      description: 'Commercial freezing solutions',
      link: '/categories/refrigeration-units'
    },
    {
      id: 5,
      title: 'Теплообмінники',
      image: '/tempshare.png',
      description: 'Retail refrigeration displays',
      link: '/categories/refrigeration-units'
    },
    {
      id: 6,
      title: 'Комплектуючі',
      image: '/details.png',
      description: 'Walk-in cooling chambers',
      link: '/categories/refrigeration-units'
    },
    {
      id: 7,
      title: 'Інструмент',
      image: '/instrument.png',
      description: 'Temperature control systems',
      link: '/categories/refrigeration-units'
    },
    {
      id: 8,
      title: 'Кондиціонери',
      image: '/condition.png',
      description: 'Refrigeration compressor units',
      link: '/categories/refrigeration-units'
    }
  ]

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Product Categories
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore our comprehensive range of industrial refrigeration equipment 
            designed for businesses of all sizes.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Card key={category.id} className="group hover:shadow-lg transition-shadow duration-300 border-0 shadow-md">
              <CardContent className="p-6 text-center">
                <div className="mb-4 overflow-hidden rounded-lg p-15 bg-gray-100">
                  <img 
                    src={category.image || "/placeholder.svg"} 
                    alt={category.title}
                    className="w-26 h-26 object-cover mx-auto"
                  />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {category.title}
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  {category.description}
                </p>
                <Link href={category.link} passHref>
                  <Button
                      variant="outline"
                      size="sm"
                      className="w-full group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-colors"
                  >
                    View Products
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
