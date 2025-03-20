import Link from "next/link"
import Image from "next/image"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function PartnersPage() {
  // Sample partner data - in a real app, this would come from a database
  const partners = [
    {
      id: 1,
      name: "African Development Bank",
     // logo: "https://upload.wikimedia.org/wikipedia/en/thumb/f/f5/Emblem_of_the_African_Union.svg/1200px-Emblem_of_the_African_Union.svg.png?height=100&width=120",
      description: "Supporting economic development and social progress across Africa.",
      category: "Financial Institution",
      website: "https://example.com",
    },
    {
      id: 2,
      name: "Tech4Africa",
    //  logo: "https://upload.wikimedia.org/wikipedia/en/thumb/f/f5/Emblem_of_the_African_Union.svg/1200px-Emblem_of_the_African_Union.svg.png?height=100&width=120",
      description: "Promoting technology education and digital skills across the continent.",
      category: "Technology",
      website: "https://example.com",
    },
    {
      id: 3,
      name: "EcoVentures",
    //  logo: "https://upload.wikimedia.org/wikipedia/en/thumb/f/f5/Emblem_of_the_African_Union.svg/1200px-Emblem_of_the_African_Union.svg.png?height=100&width=120",
      description: "Investing in sustainable businesses and green initiatives in Africa.",
      category: "Venture Capital",
      website: "https://example.com",
    },
    {
      id: 4,
      name: "AfriLearn",
    //  logo: "https://upload.wikimedia.org/wikipedia/en/thumb/f/f5/Emblem_of_the_African_Union.svg/1200px-Emblem_of_the_African_Union.svg.png?height=100&width=120",
      description: "Providing accessible education resources for students across Africa.",
      category: "Education",
      website: "https://example.com",
    },
    {
      id: 5,
      name: "Pan-African Business Coalition",
   //   logo: "https://upload.wikimedia.org/wikipedia/en/thumb/f/f5/Emblem_of_the_African_Union.svg/1200px-Emblem_of_the_African_Union.svg.png?height=100&width=120",
      description: "Connecting businesses across Africa to foster economic growth and collaboration.",
      category: "Business Network",
      website: "https://example.com",
    },
    {
      id: 6,
      name: "Youth Empowerment Initiative",
    //  logo: "https://upload.wikimedia.org/wikipedia/en/thumb/f/f5/Emblem_of_the_African_Union.svg/1200px-Emblem_of_the_African_Union.svg.png?height=100&width=120",
      description: "Dedicated to creating opportunities for young people across Africa.",
      category: "Non-Profit",
      website: "https://example.com",
    },
    {
      id: 7,
      name: "African Innovation Hub",
  //    logo: "https://upload.wikimedia.org/wikipedia/en/thumb/f/f5/Emblem_of_the_African_Union.svg/1200px-Emblem_of_the_African_Union.svg.png?height=100&width=120",
      description: "Supporting startups and innovation across the African continent.",
      category: "Innovation",
      website: "https://example.com",
    },
    {
      id: 8,
      name: "Women in Business Africa",
      logo: "https://upload.wikimedia.org/wikipedia/en/thumb/f/f5/Emblem_of_the_African_Union.svg/1200px-Emblem_of_the_African_Union.svg.png?height=100&width=120",
      description: "Promoting female entrepreneurship and leadership across Africa.",
      category: "Women Empowerment",
      website: "https://example.com",
    },
  ]

  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <Button variant="ghost" asChild className="mb-8">
        <Link href="/">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>
      </Button>

      <div className="space-y-8 mb-12">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Our Partners</h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-3xl">
            We collaborate with leading organizations across various sectors to provide the best opportunities,
            resources, and support for African youth in their career development journey.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {partners.map((partner) => (
            <Card key={partner.id} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="h-24 flex items-center justify-center bg-muted/20 rounded-md mb-4">
                  <Image
                    src={partner.logo || "/placeholder.svg"}
                    alt={partner.name}
                    width={160}
                    height={80}
                    className="max-h-16 w-auto object-contain"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">{partner.name}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{partner.category}</p>
                  <p className="text-muted-foreground mb-4">{partner.description}</p>
                  <Button variant="outline" size="sm" asChild>
                    <a href={partner.website} target="_blank" rel="noopener noreferrer">
                      Visit Website
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="bg-muted p-8 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Become a Partner</h2>
        <p className="mb-6">
          Interested in partnering with us to support African youth in their career development? We're always looking
          for organizations that share our vision of empowering the next generation of African leaders and
          professionals.
        </p>
        <Button asChild>
          <Link href="/contact">Contact Us</Link>
        </Button>
      </div>
    </div>
  )
}

