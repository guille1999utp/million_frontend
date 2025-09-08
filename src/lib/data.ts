export interface Owner {
  idOwner: string
  name: string
  address: string
  photo: string
  birthday: string
  email?: string
  phone?: string
}

export interface Property {
  idProperty: string
  name: string
  address: string
  price: number
  codeInternal: string
  year: number
  idOwner: string
  description?: string
  bedrooms?: number
  bathrooms?: number
  area?: number
  propertyType?: string
  features?: string[]
  image?: string
  trace?: string
}

export interface PropertyImage {
  idPropertyImage: string
  idProperty: string
  file: string
  enabled: boolean
  isPrimary?: boolean
}

export interface PropertyTrace {
  idPropertyTrace: string
  dateSale: string
  name: string
  value: number
  tax: number
  idProperty: string
}

export const mockOwners: Owner[] = [
  {
    idOwner: "owner-001",
    name: "María González Pérez",
    address: "Av. Las Condes 8500, Las Condes, Santiago",
    photo: "/professional-woman-real-estate.jpg",
    birthday: "1975-03-15",
    email: "maria.gonzalez@email.com",
    phone: "+56 9 8765 4321",
  },
  {
    idOwner: "owner-002",
    name: "Carlos Rodríguez Silva",
    address: "Av. Providencia 1800, Providencia, Santiago",
    photo: "/professional-man-business-suit.jpg",
    birthday: "1968-11-22",
    email: "carlos.rodriguez@email.com",
    phone: "+56 9 7654 3210",
  },
  {
    idOwner: "owner-003",
    name: "Ana Martínez López",
    address: "Calle Los Leones 456, Ñuñoa, Santiago",
    photo: "/middle-aged-woman-smiling.png",
    birthday: "1982-07-08",
    email: "ana.martinez@email.com",
    phone: "+56 9 6543 2109",
  },
  {
    idOwner: "owner-004",
    name: "Roberto Fernández Castro",
    address: "Av. Vitacura 9200, Vitacura, Santiago",
    photo: "/elegant-businessman-luxury.jpg",
    birthday: "1965-01-30",
    email: "roberto.fernandez@email.com",
    phone: "+56 9 5432 1098",
  },
  {
    idOwner: "owner-005",
    name: "Sofía Herrera Morales",
    address: "Calle Bellavista 890, Bellavista, Santiago",
    photo: "/creative-woman-artist.jpg",
    birthday: "1990-09-12",
    email: "sofia.herrera@email.com",
    phone: "+56 9 4321 0987",
  },
  {
    idOwner: "owner-006",
    name: "Diego Vargas Soto",
    address: "Camino El Alba 3800, Lo Barnechea, Santiago",
    photo: "/placeholder-gjiq6.png",
    birthday: "1972-05-18",
    email: "diego.vargas@email.com",
    phone: "+56 9 3210 9876",
  },
  {
    idOwner: "owner-007",
    name: "Valentina Torres Ruiz",
    address: "Av. Pajaritos 2800, Maipú, Santiago",
    photo: "/young-professional-woman.png",
    birthday: "1988-12-03",
    email: "valentina.torres@email.com",
    phone: "+56 9 2109 8765",
  },
  {
    idOwner: "owner-008",
    name: "Andrés Moreno Díaz",
    address: "Av. El Bosque Norte 300, Las Condes, Santiago",
    photo: "/corporate-executive-man.jpg",
    birthday: "1978-04-25",
    email: "andres.moreno@email.com",
    phone: "+56 9 1098 7654",
  },
]

export const mockProperties: Property[] = [
  {
    idProperty: "prop-001",
    name: "Villa Moderna en Las Condes",
    address: "Av. Las Condes 12450, Las Condes, Santiago",
    price: 850000000,
    codeInternal: "LC-VM-001",
    year: 2020,
    idOwner: "owner-001",
    description:
      "Espectacular villa moderna con acabados de lujo, piscina y amplio jardín. Ubicada en el exclusivo sector de Las Condes.",
    bedrooms: 4,
    bathrooms: 3,
    area: 320,
    propertyType: "Casa",
    features: ["Piscina", "Jardín", "Garaje", "Terraza", "Cocina equipada"],
  },
  {
    idProperty: "prop-002",
    name: "Departamento Ejecutivo Providencia",
    address: "Av. Providencia 2890, Providencia, Santiago",
    price: 420000000,
    codeInternal: "PR-DE-002",
    year: 2019,
    idOwner: "owner-002",
    description:
      "Moderno departamento ejecutivo con vista panorámica de la ciudad. Excelente conectividad y servicios.",
    bedrooms: 2,
    bathrooms: 2,
    area: 85,
    propertyType: "Departamento",
    features: ["Vista panorámica", "Balcón", "Gimnasio", "Portería 24hrs", "Estacionamiento"],
  },
  {
    idProperty: "prop-003",
    name: "Casa Familiar Ñuñoa",
    address: "Calle Los Aromos 1234, Ñuñoa, Santiago",
    price: 280000000,
    codeInternal: "NU-CF-003",
    year: 2015,
    idOwner: "owner-003",
    description:
      "Acogedora casa familiar en tranquilo barrio residencial. Perfecta para familias que buscan tranquilidad.",
    bedrooms: 3,
    bathrooms: 2,
    area: 150,
    propertyType: "Casa",
    features: ["Patio", "Quincho", "Bodega", "Calefacción central"],
  },
  {
    idProperty: "prop-004",
    name: "Penthouse Vitacura Premium",
    address: "Av. Vitacura 8800, Vitacura, Santiago",
    price: 1200000000,
    codeInternal: "VT-PP-004",
    year: 2021,
    idOwner: "owner-004",
    description: "Exclusivo penthouse con terraza privada y vista a la cordillera. Máximo lujo y confort en Vitacura.",
    bedrooms: 3,
    bathrooms: 3,
    area: 180,
    propertyType: "Penthouse",
    features: ["Terraza privada", "Vista cordillera", "Jacuzzi", "Bodega", "2 estacionamientos"],
  },
  {
    idProperty: "prop-005",
    name: "Loft Industrial Bellavista",
    address: "Calle Constitución 567, Bellavista, Santiago",
    price: 180000000,
    codeInternal: "BV-LI-005",
    year: 2018,
    idOwner: "owner-005",
    description:
      "Único loft de estilo industrial en el corazón de Bellavista. Ideal para artistas y profesionales creativos.",
    bedrooms: 1,
    bathrooms: 1,
    area: 65,
    propertyType: "Loft",
    features: ["Estilo industrial", "Techos altos", "Ventanales", "Ubicación central"],
  },
  {
    idProperty: "prop-006",
    name: "Casa Mediterránea Lo Barnechea",
    address: "Camino El Alba 4500, Lo Barnechea, Santiago",
    price: 950000000,
    codeInternal: "LB-CM-006",
    year: 2017,
    idOwner: "owner-006",
    description: "Hermosa casa de estilo mediterráneo con amplios espacios y contacto directo con la naturaleza.",
    bedrooms: 5,
    bathrooms: 4,
    area: 400,
    propertyType: "Casa",
    features: ["Estilo mediterráneo", "Piscina", "Quincho", "Jardín amplio", "Vista montaña"],
  },
  {
    idProperty: "prop-007",
    name: "Departamento Nuevo Maipú",
    address: "Av. Pajaritos 3200, Maipú, Santiago",
    price: 95000000,
    codeInternal: "MP-DN-007",
    year: 2023,
    idOwner: "owner-007",
    description: "Departamento nuevo en proyecto inmobiliario con áreas verdes y excelente conectividad.",
    bedrooms: 2,
    bathrooms: 1,
    area: 55,
    propertyType: "Departamento",
    features: ["Proyecto nuevo", "Áreas verdes", "Gimnasio", "Sala de eventos", "Metro cercano"],
  },
  {
    idProperty: "prop-008",
    name: "Oficina Corporativa Las Condes",
    address: "Av. El Bosque Norte 500, Las Condes, Santiago",
    price: 320000000,
    codeInternal: "LC-OC-008",
    year: 2020,
    idOwner: "owner-008",
    description: "Moderna oficina corporativa en edificio clase A. Ideal para empresas en crecimiento.",
    bedrooms: 0,
    bathrooms: 2,
    area: 120,
    propertyType: "Oficina",
    features: ["Edificio clase A", "Aire acondicionado", "Estacionamientos", "Seguridad 24hrs"],
  },
]

export const propertyTypes = ["Todos", "Casa", "Departamento", "Penthouse", "Loft", "Oficina"]

export const priceRanges = [
  { label: "Todos los precios", min: 0, max: Number.POSITIVE_INFINITY },
  { label: "Hasta $100M", min: 0, max: 100000000 },
  { label: "$100M - $300M", min: 100000000, max: 300000000 },
  { label: "$300M - $500M", min: 300000000, max: 500000000 },
  { label: "$500M - $800M", min: 500000000, max: 800000000 },
  { label: "Más de $800M", min: 800000000, max: Number.POSITIVE_INFINITY },
]

export const mockPropertyImages: PropertyImage[] = [
  // Villa Moderna en Las Condes
  { idPropertyImage: "img-001", idProperty: "prop-001", file: "/villa-property.png", enabled: true, isPrimary: true },
  { idPropertyImage: "img-002", idProperty: "prop-001", file: "/luxury-villa-living-room.png", enabled: true },
  { idPropertyImage: "img-003", idProperty: "prop-001", file: "/placeholder-pmo2s.png", enabled: true },
  { idPropertyImage: "img-004", idProperty: "prop-001", file: "/placeholder-c9ksa.png", enabled: true },

  // Departamento Ejecutivo Providencia
  {
    idPropertyImage: "img-005",
    idProperty: "prop-002",
    file: "/modern-apartment-with-city-view-and-balcony.jpg",
    enabled: true,
    isPrimary: true,
  },
  { idPropertyImage: "img-006", idProperty: "prop-002", file: "/placeholder-785of.png", enabled: true },
  { idPropertyImage: "img-007", idProperty: "prop-002", file: "/placeholder-aw5rq.png", enabled: true },

  // Casa Familiar Ñuñoa
  {
    idPropertyImage: "img-008",
    idProperty: "prop-003",
    file: "/cozy-family-house-with-front-yard-and-traditional-.jpg",
    enabled: true,
    isPrimary: true,
  },
  { idPropertyImage: "img-009", idProperty: "prop-003", file: "/corporate-executive-man.jpg", enabled: true },
  { idPropertyImage: "img-010", idProperty: "prop-003", file: "/placeholder-dj09f.png", enabled: true },

  // Penthouse Vitacura Premium
  {
    idPropertyImage: "img-011",
    idProperty: "prop-004",
    file: "/luxury-penthouse-with-terrace-and-mountain-view.jpg",
    enabled: true,
    isPrimary: true,
  },
  { idPropertyImage: "img-012", idProperty: "prop-004", file: "/placeholder-dqu0y.png", enabled: true },
  { idPropertyImage: "img-013", idProperty: "prop-004", file: "/placeholder-4jhr0.png", enabled: true },

  // Loft Industrial Bellavista
  {
    idPropertyImage: "img-014",
    idProperty: "prop-005",
    file: "/industrial-loft-with-exposed-brick-walls-and-large.jpg",
    enabled: true,
    isPrimary: true,
  },
  { idPropertyImage: "img-015", idProperty: "prop-005", file: "/placeholder-dke4x.png", enabled: true },

  // Casa Mediterránea Lo Barnechea
  {
    idPropertyImage: "img-016",
    idProperty: "prop-006",
    file: "/mediterranean-style-house-with-red-tile-roof-and-g.jpg",
    enabled: true,
    isPrimary: true,
  },
  { idPropertyImage: "img-017", idProperty: "prop-006", file: "/placeholder-jzml4.png", enabled: true },
  { idPropertyImage: "img-018", idProperty: "prop-006", file: "/placeholder-pfcks.png", enabled: true },

  // Departamento Nuevo Maipú
  {
    idPropertyImage: "img-019",
    idProperty: "prop-007",
    file: "/new-modern-apartment-building-with-green-areas.jpg",
    enabled: true,
    isPrimary: true,
  },
  { idPropertyImage: "img-020", idProperty: "prop-007", file: "/placeholder.svg?height=400&width=600", enabled: true },

  // Oficina Corporativa Las Condes
  {
    idPropertyImage: "img-021",
    idProperty: "prop-008",
    file: "/modern-corporate-office-space-with-glass-walls.jpg",
    enabled: true,
    isPrimary: true,
  },
  { idPropertyImage: "img-022", idProperty: "prop-008", file: "/placeholder.svg?height=400&width=600", enabled: true },
]

export const mockPropertyTraces: PropertyTrace[] = [
  // Villa Moderna en Las Condes
  {
    idPropertyTrace: "trace-001",
    dateSale: "2020-03-15",
    name: "Compra inicial",
    value: 750000000,
    tax: 22500000,
    idProperty: "prop-001",
  },
  {
    idPropertyTrace: "trace-002",
    dateSale: "2022-08-20",
    name: "Tasación comercial",
    value: 820000000,
    tax: 0,
    idProperty: "prop-001",
  },
  {
    idPropertyTrace: "trace-003",
    dateSale: "2024-01-10",
    name: "Tasación actual",
    value: 850000000,
    tax: 0,
    idProperty: "prop-001",
  },

  // Departamento Ejecutivo Providencia
  {
    idPropertyTrace: "trace-004",
    dateSale: "2019-06-10",
    name: "Compra inicial",
    value: 380000000,
    tax: 11400000,
    idProperty: "prop-002",
  },
  {
    idPropertyTrace: "trace-005",
    dateSale: "2023-03-15",
    name: "Tasación comercial",
    value: 420000000,
    tax: 0,
    idProperty: "prop-002",
  },

  // Casa Familiar Ñuñoa
  {
    idPropertyTrace: "trace-006",
    dateSale: "2015-11-25",
    name: "Compra inicial",
    value: 220000000,
    tax: 6600000,
    idProperty: "prop-003",
  },
  {
    idPropertyTrace: "trace-007",
    dateSale: "2020-09-12",
    name: "Mejoras y remodelación",
    value: 250000000,
    tax: 0,
    idProperty: "prop-003",
  },
  {
    idPropertyTrace: "trace-008",
    dateSale: "2024-02-01",
    name: "Tasación actual",
    value: 280000000,
    tax: 0,
    idProperty: "prop-003",
  },

  // Penthouse Vitacura Premium
  {
    idPropertyTrace: "trace-009",
    dateSale: "2021-05-30",
    name: "Compra inicial",
    value: 1100000000,
    tax: 33000000,
    idProperty: "prop-004",
  },
  {
    idPropertyTrace: "trace-010",
    dateSale: "2023-12-15",
    name: "Tasación comercial",
    value: 1200000000,
    tax: 0,
    idProperty: "prop-004",
  },

  // Loft Industrial Bellavista
  {
    idPropertyTrace: "trace-011",
    dateSale: "2018-04-18",
    name: "Compra inicial",
    value: 150000000,
    tax: 4500000,
    idProperty: "prop-005",
  },
  {
    idPropertyTrace: "trace-012",
    dateSale: "2021-07-22",
    name: "Renovación completa",
    value: 170000000,
    tax: 0,
    idProperty: "prop-005",
  },
  {
    idPropertyTrace: "trace-013",
    dateSale: "2024-01-05",
    name: "Tasación actual",
    value: 180000000,
    tax: 0,
    idProperty: "prop-005",
  },

  // Casa Mediterránea Lo Barnechea
  {
    idPropertyTrace: "trace-014",
    dateSale: "2017-09-08",
    name: "Compra inicial",
    value: 850000000,
    tax: 25500000,
    idProperty: "prop-006",
  },
  {
    idPropertyTrace: "trace-015",
    dateSale: "2022-11-30",
    name: "Tasación comercial",
    value: 950000000,
    tax: 0,
    idProperty: "prop-006",
  },

  // Departamento Nuevo Maipú
  {
    idPropertyTrace: "trace-016",
    dateSale: "2023-08-15",
    name: "Compra pre-venta",
    value: 85000000,
    tax: 2550000,
    idProperty: "prop-007",
  },
  {
    idPropertyTrace: "trace-017",
    dateSale: "2024-03-01",
    name: "Entrega y tasación",
    value: 95000000,
    tax: 0,
    idProperty: "prop-007",
  },

  // Oficina Corporativa Las Condes
  {
    idPropertyTrace: "trace-018",
    dateSale: "2020-12-10",
    name: "Compra inicial",
    value: 280000000,
    tax: 8400000,
    idProperty: "prop-008",
  },
  {
    idPropertyTrace: "trace-019",
    dateSale: "2023-06-20",
    name: "Tasación comercial",
    value: 320000000,
    tax: 0,
    idProperty: "prop-008",
  },
]

export const getOwnerById = (idOwner: string): Owner | undefined => {
  return mockOwners.find((owner) => owner.idOwner === idOwner)
}

export const getPropertiesByOwner = (idOwner: string): Property[] => {
  return mockProperties.filter((property) => property.idOwner === idOwner)
}

export const getPropertyImages = (idProperty: string): PropertyImage[] => {
  return mockPropertyImages.filter((image) => image.idProperty === idProperty && image.enabled)
}

export const getPrimaryImage = (idProperty: string): PropertyImage | undefined => {
  return mockPropertyImages.find((image) => image.idProperty === idProperty && image.isPrimary && image.enabled)
}

export const getPropertyTraces = (idProperty: string): PropertyTrace[] => {
  return mockPropertyTraces
    .filter((trace) => trace.idProperty === idProperty)
    .sort((a, b) => new Date(b.dateSale).getTime() - new Date(a.dateSale).getTime())
}
