"use client"

import { useUI, useOwnerMutations } from '@/hooks'
import { Button } from '@/components/ui/button'
import { Edit, Trash2 } from 'lucide-react'
import { Owner } from '@/interfaces'

// Ejemplo de cómo usar los modales con Redux
export default function ReduxModalExample() {
  const {
    isEditOwnerModalOpen,
    isDeleteOwnerModalOpen,
    selectedOwner,
    openEditOwnerModal,
    closeEditOwnerModal,
    openDeleteOwnerModal,
    closeDeleteOwnerModal,
  } = useUI()

  const { deleteOwner } = useOwnerMutations()

  // Ejemplo de propietario
  const exampleOwner = {
    id: '1',
    name: 'Juan Pérez',
    address: 'Av. Las Condes 123',
    birthday: '1990-01-01',
    photo: '',
  }

  const handleEditOwner = () => {
    openEditOwnerModal(exampleOwner as Owner)
  }

  const handleDeleteOwner = () => {
    openDeleteOwnerModal(exampleOwner as Owner)
  }

  const handleConfirmDelete = async () => {
    if (selectedOwner) {
      try {
        await deleteOwner(selectedOwner.id).unwrap()
        closeDeleteOwnerModal()
        // Mostrar toast de éxito
      } catch (error) {
        // Mostrar toast de error
        console.error('Error al eliminar propietario:', error)
      }
    }
  }

  return (
    <div className="space-y-4">
      <h3 className="text-white text-lg font-semibold">Ejemplo de Modales con Redux</h3>
      
      <div className="flex gap-4">
        <Button onClick={handleEditOwner} variant="outline" className="border-white/20 bg-white/5 text-white hover:bg-white/10">
          <Edit className="w-4 h-4 mr-2" />
          Abrir Modal Editar
        </Button>
        
        <Button onClick={handleDeleteOwner} variant="outline" className="border-red-500/20 bg-red-500/5 text-red-400 hover:bg-red-500/10">
          <Trash2 className="w-4 h-4 mr-2" />
          Abrir Modal Eliminar
        </Button>
      </div>

      {/* Modal de Editar (ejemplo) */}
      {isEditOwnerModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white/10 border border-white/20 rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-white text-xl font-semibold mb-4">Editar Propietario</h3>
            <p className="text-white/60 mb-6">
              Editando: {selectedOwner?.name}
            </p>
            <div className="flex gap-3">
              <Button onClick={closeEditOwnerModal} variant="outline" className="flex-1 border-white/20 bg-white/5 text-white hover:bg-white/10">
                Cancelar
              </Button>
              <Button className="flex-1 bg-amber-600 hover:bg-amber-700 text-white">
                Guardar Cambios
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Eliminar (ejemplo) */}
      {isDeleteOwnerModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white/10 border border-white/20 rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-white text-xl font-semibold mb-4">Eliminar Propietario</h3>
            <p className="text-white/60 mb-6">
              ¿Estás seguro de que quieres eliminar a {selectedOwner?.name}? Esta acción no se puede deshacer.
            </p>
            <div className="flex gap-3">
              <Button onClick={closeDeleteOwnerModal} variant="outline" className="flex-1 border-white/20 bg-white/5 text-white hover:bg-white/10">
                Cancelar
              </Button>
              <Button onClick={handleConfirmDelete} className="flex-1 bg-red-600 hover:bg-red-700 text-white">
                Eliminar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
