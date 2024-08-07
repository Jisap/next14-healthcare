"use client"

import { zodResolver } from "@hookform/resolvers/zod"

import { z, ZodEnum } from "zod"
import { Button } from "@/components/ui/button"
import CustomFormfield from "../CustomFormfield"
import { Form } from "../ui/form"
import { useForm } from "react-hook-form"
import { useState } from "react"
import { UserFormValidation } from "@/lib/validation"
import SubmitButton from "../SubmitButton"
import { useRouter } from "next/navigation"
import { createUser } from "@/lib/actions/patient-action"


export enum FormFieldType {
  INPUT = 'input',
  TEXTAREA = 'textarea',
  PHONE_INPUT = 'phone_input',
  CHECKBOX = 'checkbox',
  DATE_PICKER = 'datePicker',
  SELECT = 'select',
  SKELETON = 'skeleton'
}

const PatientForm = () => {

  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof UserFormValidation>>({  // Formulario validado por UserFormValidation
    resolver: zodResolver(UserFormValidation),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof UserFormValidation>) => {
    setIsLoading(true)
   
    try {
      const userData = {
        name: values.name,
        email: values.email,
        phone: values.phone,
      }
      
      const newUser = await createUser(userData)            // Creamos un nuevo usuario en bd

      if (newUser) {                                        // Si es nuevo
        router.push(`/patients/${newUser.$id}/register`);   // redirect a register con su nuevo id de bd
      }

      console.log(userData);

    } catch (error) {
      console.log(error);
    }

    setIsLoading(false);
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

        <SubmitButton isLoading={isLoading}>Get Started</SubmitButton>
      </form>
    </Form>
  )
}

export default PatientForm