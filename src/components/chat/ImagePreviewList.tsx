import { useImageUploadStore } from '@/store/imageUploadStore'
import { X } from 'lucide-react'
import { Button } from '../shadcn/button'

export const ImagePreviewList = () => {
  const { images, removeImage } = useImageUploadStore()

  if (images.length === 0) return null

  return (
    <div className="flex flex-wrap gap-2 p-2">
      {images.map(image => (
        <div
          key={image.id}
          className="group relative overflow-hidden rounded-lg border border-border"
        >
          <img
            src={image.preview}
            alt={image.file.name}
            className="h-20 w-20 object-cover"
          />
          <Button
            size="icon"
            variant="destructive"
            className="absolute top-1 right-1 h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
            onClick={() => removeImage(image.id)}
            type="button"
          >
            <X className="h-4 w-4" />
          </Button>
          <div className="absolute right-0 bottom-0 left-0 truncate bg-black/50 px-1 py-0.5 text-white text-xs">
            {image.file.name}
          </div>
        </div>
      ))}
    </div>
  )
}
