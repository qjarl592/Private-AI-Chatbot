import { create } from 'zustand'

export interface UploadedImage {
  id: string
  file: File
  preview: string
}

interface ImageUploadStoreState {
  images: UploadedImage[]
}

interface ImageUploadStoreAction {
  addImage: (file: File) => void
  removeImage: (id: string) => void
  clearImages: () => void
}

export const useImageUploadStore = create<
  ImageUploadStoreState & ImageUploadStoreAction
>((set, get) => ({
  images: [],

  addImage: (file: File) => {
    const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const preview = URL.createObjectURL(file)

    set({
      images: [...get().images, { id, file, preview }],
    })
  },

  removeImage: (id: string) => {
    const images = get().images
    const image = images.find(img => img.id === id)

    // 메모리 누수 방지를 위해 URL 해제
    if (image) {
      URL.revokeObjectURL(image.preview)
    }

    set({
      images: images.filter(img => img.id !== id),
    })
  },

  clearImages: () => {
    // 모든 preview URL 해제
    get().images.forEach(img => {
      URL.revokeObjectURL(img.preview)
    })

    set({ images: [] })
  },
}))
