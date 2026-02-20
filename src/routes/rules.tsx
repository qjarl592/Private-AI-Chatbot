import ChatbotRuleTextField from '@/components/rule/ChatbotRuleTextField'
import { Button } from '@/components/shadcn/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from '@/components/shadcn/card'
import { Checkbox } from '@/components/shadcn/checkbox'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/shadcn/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/shadcn/dropdown-menu'
import { Input } from '@/components/shadcn/input'
import { Label } from '@/components/shadcn/label'
import type { CustomRule } from '@/services/idb'
import {
  createCustomRule,
  deleteCustomRule,
  getAllCustomRules,
  getGlobalRule,
  saveGlobalRule,
  toggleCustomRule,
  updateCustomRule,
} from '@/services/ruleService'
import { useIdbStore } from '@/store/IdbStore'
import { useConfirm } from '@/store/confirmStore'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { EllipsisVertical, Plus } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'

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
  const { idbInstance } = useIdbStore()
  const { requestConfirm } = useConfirm()
  const [globalRules, setGlobalRules] = useState('')
  const [isEditingGlobalRule, setIsEditingGlobalRule] = useState(false)
  const [customRules, setCustomRules] = useState<CustomRule[]>([])
  const [openDialog, setOpenDialog] = useState(false)
  const [editingRule, setEditingRule] = useState<CustomRule | null>(null)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)

  // Dialog form state
  const [formTitle, setFormTitle] = useState('')
  const [formDescription, setFormDescription] = useState('')
  const [formContent, setFormContent] = useState('')
  const [isEditingFormContent, setIsEditingFormContent] = useState(false)

  // Store original value for cancel
  const originalGlobalRuleRef = useRef<string>('')
  const originalFormContentRef = useRef<string>('')

  useEffect(() => {
    if (idbInstance) {
      loadGlobalRule(idbInstance)
      loadCustomRules(idbInstance)
    }
  }, [idbInstance])

  const loadGlobalRule = async (idb: typeof idbInstance) => {
    const rule = await getGlobalRule(idb)
    if (rule) {
      setGlobalRules(rule.content)
      originalGlobalRuleRef.current = rule.content
    }
  }

  const loadCustomRules = async (idb: typeof idbInstance) => {
    const rules = await getAllCustomRules(idb)
    setCustomRules(rules)
  }

  const handleSaveGlobalRule = async () => {
    try {
      await saveGlobalRule(idbInstance, globalRules)
      originalGlobalRuleRef.current = globalRules
      setIsEditingGlobalRule(false)
      toast.success('Global rule saved')
    } catch (error) {
      console.error('Failed to save global rule:', error)
      toast.error('Failed to save global rule')
    }
  }

  const handleCancelGlobalRule = () => {
    setGlobalRules(originalGlobalRuleRef.current)
    setIsEditingGlobalRule(false)
  }

  const handleSaveFormContent = () => {
    originalFormContentRef.current = formContent
    setIsEditingFormContent(false)
  }

  const handleCancelFormContent = () => {
    setFormContent(originalFormContentRef.current)
    setIsEditingFormContent(false)
  }

  const handleToggleRule = async (id: string) => {
    try {
      await toggleCustomRule(idbInstance, id)
      await loadCustomRules(idbInstance)
    } catch (error) {
      console.error('Failed to toggle rule:', error)
      toast.error('Failed to toggle rule')
    }
  }

  const handleOpenCreateDialog = () => {
    setEditingRule(null)
    setFormTitle('')
    setFormDescription('')
    setFormContent('')
    setIsEditingFormContent(false)
    originalFormContentRef.current = ''
    setOpenDialog(true)
  }

  const handleOpenEditDialog = (rule: CustomRule) => {
    setEditingRule(rule)
    setFormTitle(rule.title)
    setFormDescription(rule.description)
    setFormContent(rule.content)
    setIsEditingFormContent(false)
    originalFormContentRef.current = rule.content
    setOpenDialog(true)
    setOpenDropdown(null)
  }

  const handleSaveRule = async () => {
    if (!formTitle.trim()) {
      toast.error('Title is required')
      return
    }

    try {
      if (editingRule) {
        // Update existing rule
        await updateCustomRule(idbInstance, editingRule.id, {
          title: formTitle,
          description: formDescription,
          content: formContent,
        })
        toast.success('Rule updated')
      } else {
        // Create new rule
        await createCustomRule(idbInstance, {
          title: formTitle,
          description: formDescription,
          content: formContent,
          enabled: true,
        })
        toast.success('Rule created')
      }

      await loadCustomRules(idbInstance)
      setOpenDialog(false)
    } catch (error) {
      console.error('Failed to save rule:', error)
      toast.error('Failed to save rule')
    }
  }

  const handleDeleteRule = (rule: CustomRule) => {
    requestConfirm({
      title: 'Delete Rule',
      description: `Are you sure you want to delete "${rule.title}"? This action cannot be undone.`,
      actionText: 'Delete',
      cancelText: 'Cancel',
      onConfirm: async () => {
        try {
          await deleteCustomRule(idbInstance, rule.id)
          await loadCustomRules(idbInstance)
          toast.success('Rule deleted')
        } catch (error) {
          console.error('Failed to delete rule:', error)
          toast.error('Failed to delete rule')
        }
      },
    })
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="mx-auto my-10 max-w-5xl overflow-x-hidden px-4">
      <h1 className="mb-6 font-semibold text-3xl">Rules Settings</h1>

      {/* Global Rules Section */}
      <section className="mb-8">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="font-semibold text-xl">Global Rules</h2>
        </div>
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <ChatbotRuleTextField
            label=""
            value={globalRules}
            onValueChange={setGlobalRules}
            disabled={!isEditingGlobalRule}
            isEditing={isEditingGlobalRule}
            onEdit={() => setIsEditingGlobalRule(true)}
            onSave={handleSaveGlobalRule}
            onCancel={handleCancelGlobalRule}
          />
          <p className="mt-2 text-muted-foreground text-sm">
            Global rules apply to all chat conversations automatically.
          </p>
        </div>
      </section>

      {/* Custom Rules Section */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-semibold text-xl">Custom Rules</h2>
          <Button onClick={handleOpenCreateDialog} size="sm">
            <Plus className="mr-2 size-4" />
            Create New Rule
          </Button>
        </div>

        <div className="rounded-lg border bg-card p-6 shadow-sm">
          {customRules.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              <p className="mb-2 text-lg">No custom rules yet</p>
              <p className="text-sm">
                Create your first custom rule to get started
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {customRules.map(rule => (
                <Card
                  key={rule.id}
                  className={`transition-all hover:shadow-md ${
                    rule.enabled ? 'bg-accent' : 'bg-muted/30 opacity-60'
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-2">
                        <Checkbox
                          checked={rule.enabled}
                          onCheckedChange={() => handleToggleRule(rule.id)}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <CardTitle className="mb-1 text-base">
                            {rule.title}
                          </CardTitle>
                          {rule.description && (
                            <p className="mb-2 text-muted-foreground text-sm">
                              {rule.description}
                            </p>
                          )}
                          <CardDescription className="text-xs">
                            Last updated: {formatTimestamp(rule.updatedAt)}
                          </CardDescription>
                        </div>
                      </div>
                      <DropdownMenu
                        open={rule.id === openDropdown}
                        onOpenChange={open => {
                          console.log('open change')
                          if (open) {
                            setOpenDropdown(rule.id)
                          } else {
                            setOpenDropdown(null)
                          }
                        }}
                      >
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-8 shrink-0"
                          >
                            <EllipsisVertical className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleOpenEditDialog(rule)}
                          >
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeleteRule(rule)}
                            className="text-destructive"
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Create/Edit Dialog */}
      <Dialog
        open={openDialog}
        onOpenChange={open => {
          setOpenDialog(open)
          // Reset form when closing dialog
          if (!open) {
            setEditingRule(null)
            setFormTitle('')
            setFormDescription('')
            setFormContent('')
            setIsEditingFormContent(false)
            originalFormContentRef.current = ''
          }
        }}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingRule ? 'Edit Rule' : 'Create New Rule'}
            </DialogTitle>
            <DialogDescription>
              {editingRule
                ? 'Update the details of your custom rule'
                : 'Create a new custom rule for your chat conversations'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="rule-title">Title *</Label>
              <Input
                id="rule-title"
                value={formTitle}
                onChange={e => setFormTitle(e.target.value)}
                placeholder="e.g., Korean Language Response"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="rule-description">Description</Label>
              <Input
                id="rule-description"
                value={formDescription}
                onChange={e => setFormDescription(e.target.value)}
                placeholder="Brief description of this rule"
              />
            </div>

            <div className="space-y-2">
              <ChatbotRuleTextField
                label="Rule Content"
                value={formContent}
                onValueChange={setFormContent}
                disabled={!isEditingFormContent}
                isEditing={isEditingFormContent}
                onEdit={() => {
                  setIsEditingFormContent(true)
                  originalFormContentRef.current = formContent
                }}
                onSave={handleSaveFormContent}
                onCancel={handleCancelFormContent}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveRule}>
              {editingRule ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
