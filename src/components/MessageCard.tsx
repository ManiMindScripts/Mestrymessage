"use cltient"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Message } from "@/models/User"
import { ApiResponse } from "@/types/ApiResponse"
import axios from "axios"
import { toast } from "sonner"
import { any } from "zod/v4"
type MessaageCardProp = {
  message: Message,
  onMessageDelete: (messageId: string) => void
}

const MessageCard = ({ message, onMessageDelete }: MessaageCardProp) => {
  const handleDeleteMessage = async () => {
    const response = await axios.delete<ApiResponse>(`/api/delete-message/${message._id}`)
    toast.success(response.data.message)
    onMessageDelete(message._id as string)
  }
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
          <CardDescription>Card Description</CardDescription>
        </CardHeader>
        <CardContent>
        </CardContent>

      </Card>
    </>
  )
}

export default MessageCard