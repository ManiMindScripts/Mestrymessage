import { Message } from "@/models/User"
export interface ApiResponse {
    success: boolean
    message: string
    isAcceptMessages?: boolean
    messages?: Array<Message>
}