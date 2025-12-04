import { CircleCheckBig, MessageCircle, Brain, Lightbulb, BookOpenText } from "lucide-react"

export const modelTypeIcons = {
  1: MessageCircle,
  2: CircleCheckBig,
  3: Lightbulb,
  4: Brain,
  5: BookOpenText,
}

export enum Provider {
  Google = 1,
  OpenAI = 2,
}