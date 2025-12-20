import { MessageSquare } from "lucide-react"

export function ChatButton() {
  return (
    <button className="fixed bottom-6 right-6 w-14 h-14 bg-[#0095da] hover:bg-[#0080c0] rounded-full flex items-center justify-center shadow-lg transition-colors">
      <MessageSquare className="w-6 h-6 text-white" />
    </button>
  )
}
