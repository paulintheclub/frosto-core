"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"

interface InfoPageProps {
  data: {
    title: string;
    sections: {
      subtitle: string;
      text: string;
    }[];
  };
}

export default function InfoPage({ data }: InfoPageProps) {
  return (
    <>
      {/* Title Section */}
      <section className="relative bg-gradient-to-r from-gray-800 to-gray-600 text-white pt-32 lg:pt-40 pb-16">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10"
          style={{ backgroundImage: "url('/hero-background.png')" }}
        />
        <div className="relative container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold">
            {data.title}
          </h1>
        </div>
      </section>

      {/* Content Section with Timeline */}
      <section className="bg-white py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-4 top-0 h-full w-0.5 bg-gray-200" />

              {data.sections.map((section, index) => (
                <div key={index} className="relative pl-12 mb-12">
                  {/* Timeline Dot */}
                  <div className="absolute left-0 top-1 flex items-center justify-center w-8 h-8 bg-blue-600 rounded-full text-white">
                    <CheckCircle className="h-5 w-5" />
                  </div>
                  
                  <Card className="shadow-lg border-l-4 border-blue-600">
                    <CardHeader>
                      <CardTitle className="text-2xl text-gray-900">{section.subtitle}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 leading-relaxed">
                        {section.text}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
