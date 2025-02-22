"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, XCircle } from "lucide-react"

const formSchema = z.object({
  domain: z
    .string()
    .min(1, "Domain is required")
    .refine((val) => /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/.test(val), {
      message: "Please enter a valid domain",
    }),
  forwardingEmail: z.string().email("Invalid email address"),
  testEmail: z.string().email("Invalid email address").optional(),
})

type FormValues = z.infer<typeof formSchema>

type VerificationStatus = "pending" | "success" | "error"

interface VerificationStep {
  name: string
  status: VerificationStatus
  instructions: string
  value?: string
}

export default function EmailSetup() {
  const [currentStep, setCurrentStep] = useState(0)
  const [verificationSteps, setVerificationSteps] = useState<VerificationStep[]>([
    { name: "TXT Record", status: "pending", instructions: "Add a TXT record to your domain's DNS settings." },
    { name: "MX Record", status: "pending", instructions: "Add an MX record to your domain's DNS settings." },
    { name: "DKIM Record", status: "pending", instructions: "Add a DKIM record to your domain's DNS settings." },
  ])

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      domain: "",
      forwardingEmail: "",
    },
  })

  const onSubmit = async (data: FormValues) => {
    console.log(data)
    // Here you would typically send this data to your backend
    // and start the verification process
    await simulateVerification()
  }

  const simulateVerification = async () => {
    for (let i = 0; i < verificationSteps.length; i++) {
      setVerificationSteps((prev) => prev.map((step, index) => (index === i ? { ...step, status: "success" } : step)))
      await new Promise((resolve) => setTimeout(resolve, 1500)) // Simulate API call
    }
  }

  const sendTestEmail = async () => {
    // Here you would send a test email
    console.log("Sending test email to:", form.getValues("testEmail"))
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    alert("Test email sent successfully!")
  }

  const steps = ["Domain Setup", "Verification", "Email Forwarding", "Test"]

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Email Configuration</CardTitle>
        <CardDescription>Set up your domain for sending emails and configure email forwarding.</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={steps[currentStep]} onValueChange={(value) => setCurrentStep(steps.indexOf(value))}>
          <TabsList className="grid w-full grid-cols-4">
            {steps.map((step, index) => (
              <TabsTrigger key={step} value={step} disabled={index > currentStep}>
                {index + 1}. {step}
              </TabsTrigger>
            ))}
          </TabsList>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-6">
              <TabsContent value="Domain Setup">
                <FormField
                  control={form.control}
                  name="domain"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Domain</FormLabel>
                      <FormControl>
                        <Input placeholder="yourdomain.com" {...field} />
                      </FormControl>
                      <FormDescription>Enter the domain you want to verify for sending emails.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="button" onClick={() => setCurrentStep(1)} className="mt-4">
                  Next
                </Button>
              </TabsContent>

              <TabsContent value="Verification">
                {verificationSteps.map((step, index) => (
                  <Alert key={index} className="mb-4">
                    <AlertTitle className="flex items-center">
                      {step.status === "success" ? (
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-500 mr-2" />
                      )}
                      {step.name}
                    </AlertTitle>
                    <AlertDescription>
                      {step.instructions}
                      {step.value && <div className="mt-2 p-2 bg-muted rounded">{step.value}</div>}
                    </AlertDescription>
                  </Alert>
                ))}
                <Button type="button" onClick={() => setCurrentStep(2)} className="mt-4">
                  Next
                </Button>
              </TabsContent>

              <TabsContent value="Email Forwarding">
                <FormField
                  control={form.control}
                  name="forwardingEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Forwarding Email Address</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="your@email.com" {...field} />
                      </FormControl>
                      <FormDescription>
                        Enter the email address where you want to receive forwarded emails.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="button" onClick={() => setCurrentStep(3)} className="mt-4">
                  Next
                </Button>
              </TabsContent>

              <TabsContent value="Test">
                <FormField
                  control={form.control}
                  name="testEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Test Email Address</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="test@email.com" {...field} />
                      </FormControl>
                      <FormDescription>Enter an email address to send a test email.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="button" onClick={sendTestEmail} className="mt-4 mr-4">
                  Send Test Email
                </Button>
                <Button type="submit">Complete Setup</Button>
              </TabsContent>
            </form>
          </Form>
        </Tabs>
      </CardContent>
    </Card>
  )
}

