"use client"

import { zodResolver } from "@hookform/resolvers/zod"

import { z, ZodEnum } from "zod"
import { Button } from "@/components/ui/button"
import CustomFormfield from "../CustomFormfield"
import { Form } from "../ui/form"
import { useForm } from "react-hook-form"


export enum FormFieldType {
  INPUT = 'input',
  TEXTAREA = 'textarea',
  PHONE_INPUT = 'phone_input',
  CHECKBOX = 'checkbox',
  DATE_PICKET = 'datePicker',
  SELECT = 'select',
  SKELETON = 'skeleton'
}

const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
})


const PatientForm = () => {

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
    },
  })

  const onSubmit = async(values: z.infer<typeof formSchema>) => {
   
    console.log(values)
  }

  return (
    <Form {...form}>
      <form 
        onSubmit={form.handleSubmit(onSubmit)} 
        className="space-y-6 flex-1"
      >
        <section className="mb-12 space-y-4">
          <h1 className="header">Hi there 👋</h1>
          <p className="text-dark-700">Get started with appointments.</p>
        </section>
        
        <CustomFormfield 
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="name"
          label="Full name"
          iconSrc="/assets/icons/user.svg"
          iconAlt="user"
        />

        <CustomFormfield
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="email"
          label="Email"
          placeholder="johndoe@gmail.com"
          iconSrc="/assets/icons/email.svg"
          iconAlt="email"
        />

        <CustomFormfield
          fieldType={FormFieldType.PHONE_INPUT}
          control={form.control}
          name="phone"
          label="Phone number"
          placeholder="(555) 123-4567"
        />

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}

export default PatientForm