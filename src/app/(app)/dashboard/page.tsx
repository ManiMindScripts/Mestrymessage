"use client"
import MessageCard from "@/components/MessageCard"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Message } from "@/models/User"
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema"
import { ApiResponse } from "@/types/ApiResponse"
import { zodResolver } from "@hookform/resolvers/zod"
import axios, { AxiosError } from "axios"
import { Loader2, RefreshCcw } from "lucide-react"
import { User } from "next-auth"
import { useSession } from "next-auth/react"
import { useEffect, useCallback, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

const page = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoadin, setIsLoading] = useState(false)
  const [isSwitchLoading, setIsSwitchLoading] = useState(false)

  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter((message) => message._id !== messageId))
  }
  const { data: session } = useSession()
  const form = useForm({
    resolver: zodResolver(acceptMessageSchema)
  })
  const { register, watch, setValue } = form
  const acceptMessages = watch('acceptMessages')
  const fetchAcceptMessage = useCallback(async () => {
    setIsSwitchLoading(true)
    try {
      const response = await axios.get('/api/accept-message')
      setValue('acceptMessages', response.data.isAcceptingMessage)
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast.success(axiosError.response?.data.message || "Error to fetch message setting")
    } finally {
      setIsSwitchLoading(false)
    }
  }, [setValue])
  const fetchMessage = useCallback(async (refresh: boolean = false) => {
    setIsLoading(true)
    setIsSwitchLoading(false)
    try {
      const response = await axios.get('/api/get-message')
      setMessages(response.data.message || [])
      if (refresh) {
        toast.success("showing newest messages")
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast.success(axiosError.response?.data.message || "Error to fetch message setting")
    }
    setIsLoading(false)
    setIsSwitchLoading(false)
  }, [setIsLoading, setMessages])
  useEffect(() => {
    if (!session || !session.user) return
    fetchMessage()
    fetchAcceptMessage()
  }, [session, setValue, fetchAcceptMessage, fetchMessage])
  //handle switch change
  const handleSwitchChange = async () => {
    try {
      const response = await axios.post('/api/accept-message', {
        acceptMessages: !acceptMessages
      })
      setValue('acceptMessages', !acceptMessages)
      toast.success(response.data.message)
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast.success(axiosError.response?.data.message || "Error to fetch message setting")
    }
  }
  const { username } = session?.user as User
  const baseUrl = `${window.location.protocol} // ${window.location.host}`
  const profileUrl = `${baseUrl}/u/${username}`
  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl)
    toast.success("Profile URl has been copied")
  }
  if (!session || !session.user) {
    return <div>Please login </div>
  }
  return (
    <>
      <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
        <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>
        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-4">Copy Your Unique link</h2>{''}
          <div className="items-center flex">
            <input
              type="text"
              value={profileUrl}
              disabled
              className="input input-bordered w-full p-2 mr-2"
            />
            <Button onClick={copyToClipboard}>Copy</Button>
          </div>
        </div>
        <div className="mb-4">
          <Switch
            {...register('acceptMessages')}
            checked={acceptMessages}
            onCheckedChange={handleSwitchChange}
            disabled={isSwitchLoading}
          />
          <span className="ml-2">
            Accept Message: {acceptMessages ? 'On' : 'Off'}
          </span>
        </div>
        <Separator />
        <Button className="mt-4"
          variant='outline'
          onClick={(e) => {
            e.preventDefault()
            fetchMessage(true)
          }}
        >
          {isLoadin ? (
            <Loader2 className="h-4 w-4 animate-ping" />
          ) : (
            <RefreshCcw className="h-4 w-4" />
          )}
        </Button>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
          {
            messages.length > 0 ? (
              messages.map((message, index) => (
                <MessageCard
                  key={String(message._id)}
                  message={message}
                  onMessageDelete={handleDeleteMessage}
                />
              ))
            ) : (
              <p>No Message to display</p>
            )}
        </div>
      </div>
    </>
  )
}

export default page