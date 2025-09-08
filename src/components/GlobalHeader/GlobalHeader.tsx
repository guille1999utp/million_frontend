"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Home, Building2, Users } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"

interface GlobalHeaderProps {
  title: string
  subtitle?: string
  showBackButton?: boolean
  showNavigationButtons?: boolean
  customActions?: React.ReactNode
  className?: string
}

export default function GlobalHeader({
  title,
  subtitle,
  showBackButton = true,
  showNavigationButtons = true,
  customActions,
  className = ""
}: GlobalHeaderProps) {
  const router = useRouter()

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`backdrop-blur-sm border-b border-white/10 sticky top-0 z-50 ${className}`}
    >
      <div className="container mx-auto px-4 sm:px-6 py-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Left Section */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
            {showBackButton && (
              <Button 
                onClick={() => router.back()} 
                variant="ghost" 
                size="sm" 
                className="text-white hover:bg-white/10 w-fit"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver
              </Button>
            )}
            <div className="min-w-0">
              <h1 className="text-lg sm:text-xl font-semibold text-white ">
                {title}
              </h1>
              {subtitle && (
                <p className="text-white/60 text-xs sm:text-sm truncate">
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
            {customActions}
            {showNavigationButtons && (
              <>
                <Link href="/owners">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-white hover:bg-white/10 text-xs sm:text-sm"
                  >
                    <Users className="w-4 h-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Propietarios</span>
                    <span className="sm:hidden">Dueños</span>
                  </Button>
                </Link>
                <Link href="/properties">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-white hover:bg-white/10 text-xs sm:text-sm"
                  >
                    <Building2 className="w-4 h-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Ver Propiedades</span>
                    <span className="sm:hidden">Propiedades</span>
                  </Button>
                </Link>
                <Link href="/">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-white hover:bg-white/10 text-xs sm:text-sm"
                  >
                    <Home className="w-4 h-4 mr-1 sm:mr-2" />
                    Inicio
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.header>
  )
}
