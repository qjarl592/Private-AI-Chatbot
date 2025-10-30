import { useImageUploadStore } from '@/store/imageUploadStore'
import { ImagePlus } from 'lucide-react'
import { type ChangeEvent, useRef } from 'react'
import { toast } from 'sonner'
import { Button } from '../shadcn/button'

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_TYPES = [
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/webp',
  'image/gif',
]

export const ImageUploadButton = () => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { addImage } = useImageUploadStore()

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const file = files[0]

    // 파일 타입 검증
    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error('지원하지 않는 파일 형식입니다.', {
        description: 'PNG, JPEG, JPG, WEBP, GIF 파일만 업로드 가능합니다.',
      })
      return
    }

    // 파일 크기 검증
    if (file.size > MAX_FILE_SIZE) {
      toast.error('파일 크기가 너무 큽니다.', {
        description: '최대 5MB까지 업로드 가능합니다.',
      })
      return
    }

    addImage(file)

    // input 초기화 (같은 파일 재선택 가능하도록)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept={ALLOWED_TYPES.join(',')}
        onChange={handleFileChange}
        className="hidden"
      />
      <Button
        size="icon"
        variant="ghost"
        onClick={handleButtonClick}
        title="add image"
      >
        <ImagePlus className="h-5 w-5" />
      </Button>
    </>
  )
}
