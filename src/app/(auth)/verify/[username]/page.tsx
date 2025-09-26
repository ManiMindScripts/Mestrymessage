"use client"
import { Button } from '@/components/ui/button'
import { Form,FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { verifySchema } from '@/schemas/verifySchema'
import { ApiResponse } from '@/types/ApiResponse'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'
import { useParams, useRouter } from 'next/navigation'
import React from 'react'
import {  useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from 'zod'

const page = () => {
  const router = useRouter()
  const params = useParams()
  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
  })
  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    try {
      const response = await axios.post(`/api/verify-code`, {
        username: params.username,
        code: data.code,
      })
      toast.success(response.data.message)
      router.replace('sign-in')
    } catch (error) {
      console.error("Error is signup of user", error)
      const axiosError = error as AxiosError<ApiResponse>
      let errorMessage = axiosError.response?.data.message
      toast.error(errorMessage)
    }
  }
  return (
    <>
      <div className='justify-center flex items-center min-h-screen bg-gray-100'>
        <div className='max-w-md w-full p-8 space-y-8 bg-white rounded-lg shadow-md'>
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight mb-6 lg:text-5xl">
              Verify Account
            </h1>
            <p className="mb-4">Enter the verify code sent to your email</p>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Verification Code</FormLabel>
                    <FormControl>
                      <Input placeholder="Verification Code"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e)
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type='submit'>Submit</Button>
              </form>
              </Form>
        </div>
      </div>
    </>
  )
}

export default page