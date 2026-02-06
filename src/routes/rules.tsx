import ChatbotRuleTextField from '@/components/rule/ChatbotRuleTextField'
import { Button } from '@/components/shadcn/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from '@/components/shadcn/card'
import { Checkbox } from '@/components/shadcn/checkbox'
import { Dialog, DialogContent } from '@/components/shadcn/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/shadcn/dropdown-menu'
import { Input } from '@/components/shadcn/input'
import { useIdbStore } from '@/store/IdbStore'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { EllipsisVertical } from 'lucide-react'
import { useState } from 'react'

export const Route = createFileRoute('/rules')({
  component: RouteComponent,
  loader: async () => {
    const { idbInstance, init } = useIdbStore.getState()

    if (!idbInstance) {
      try {
        await init()
      } catch (_) {
        throw redirect({ to: '/chat' })
      }
    }
  },
})

function RouteComponent() {
  const [globalRules, setGlobalRules] = useState('')
  const [openEditPopup, setOpenEditPopup] = useState(false)

  return (
    <div className="mx-auto my-10 max-w-5xl overflow-x-hidden">
      <h1 className="mb-2 font-semibold text-xl">Rules Settings</h1>
      <section>
        <div className="rounded-lg border bg-primary-foreground p-6 shadow-sm">
          <ChatbotRuleTextField
            label="Global Rules"
            value={globalRules}
            onValueChange={setGlobalRules}
          />
        </div>
      </section>

      <section className="mt-6">
        <p className="mb-2 font-semibold text-xl">Custom Rules</p>
        <div className="rounded-lg border bg-primary-foreground p-6 shadow-sm">
          <div className="grid grid-cols-2 gap-4">
            <Card className="bg-accent py-2">
              <CardContent className="px-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="mt-2">
                    <Checkbox className="mr-2" />
                    rule 1
                  </CardTitle>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="size-6">
                        <EllipsisVertical className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => setOpenEditPopup(true)}>
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem>Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <p className="py-2">rule description 1</p>
                <CardDescription>last updated: 2024-01-01</CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-accent py-2">
              <CardContent className="px-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="mt-2">
                    <Checkbox className="mr-2" />
                    rule 1
                  </CardTitle>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="size-6">
                        <EllipsisVertical className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => setOpenEditPopup(true)}>
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem>Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <p className="py-2">rule description 1</p>
                <CardDescription>last updated: 2024-01-01</CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-accent py-2">
              <CardContent className="px-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="mt-2">
                    <Checkbox className="mr-2" />
                    rule 1
                  </CardTitle>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="size-6">
                        <EllipsisVertical className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => setOpenEditPopup(true)}>
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem>Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <p className="py-2">rule description 1</p>
                <CardDescription>last updated: 2024-01-01</CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-accent py-2">
              <CardContent className="px-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="mt-2">
                    <Checkbox className="mr-2" />
                    rule 1
                  </CardTitle>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="size-6">
                        <EllipsisVertical className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => setOpenEditPopup(true)}>
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem>Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <p className="py-2">rule description 1</p>
                <CardDescription>last updated: 2024-01-01</CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>

        <Dialog open={openEditPopup} onOpenChange={setOpenEditPopup}>
          <DialogContent>
            <label htmlFor="rule-title">Rule Title</label>
            <Input id="rule-title" />

            <label htmlFor="rule-description">Rule Description</label>
            <Input id="rule-description" />

            <ChatbotRuleTextField
              label="CusRule"
              value={globalRules}
              onValueChange={setGlobalRules}
            />
          </DialogContent>
        </Dialog>
      </section>
    </div>
  )
}
