"use client"

import { Crud, CrudForm, CrudFormType } from '@/components/ui/crud';
import { Label } from '@/components/ui/label';
import PromptTypeInput from '@/components/ai/chat/prompt-type-input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { Chatbot } from '@/types/ai/chat';
import { addChatbot, deleteChatbot, updateChatbot } from '@/app/actions/chatbots';
import { columns } from './columns';

export default function ChatbotCrud({ chatbots }: { chatbots: Chatbot[] }) {
  const defaultChatbot = {
    id: '',
    name: '',
    instructions: '',
    provider: 1,
    promptType: 1,
  }
  const formState = useState<CrudFormType<Chatbot>>({
    method: 'create',
    data: defaultChatbot
  })
  const [formType, setFormType] = formState
  const formData = formType.data
  const setFormData = (data: Chatbot) => setFormType({ ...formType, data })

  const onCreate = (data: Chatbot) => {
    addChatbot(data)
  }

  const onEdit = (data: Chatbot) => {
    updateChatbot(data.id, data)
  }

  const onDelete = (data: Chatbot) => {
    deleteChatbot(data.id)
  }

  return (
    <Crud
      name="Chatbot"
      columns={columns}
      data={chatbots}
      formState={formState}
      onCreate={onCreate}
      onEdit={onEdit}
      onDelete={onDelete}
      defaultData={defaultChatbot}
    >
      <CrudForm>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="type" className="text-right">
              Type
            </Label>
            <PromptTypeInput promptType={formData.promptType} setPromptType={(type) => setFormData({ ...formData, promptType: type })} />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="provider" className="text-right">
              Provider
            </Label>
            <Select
              value={formData.provider?.toString()}
              required
              onValueChange={(value) => setFormData({ ...formData, provider: parseInt(value) })}>
              <SelectTrigger>
                <SelectValue placeholder="Select a provider" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>AI Providers</SelectLabel>
                  <SelectItem value="1">Google</SelectItem>
                  <SelectItem value="2">OpenAI</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="col-span-3"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="instructions" className="text-right">
              Instructions
            </Label>
            <Textarea
              id="instructions"
              value={formData.instructions}
              onChange={(e) =>
                setFormData({ ...formData, instructions: e.target.value })
              }
              className="col-span-3"
            />
          </div>
        </div>
      </CrudForm>
    </Crud>
  )
}