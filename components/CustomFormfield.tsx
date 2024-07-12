"use client"

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "./ui/input"
import { Control } from "react-hook-form"
import { FormFieldType } from "./forms/PatientForm"


const RenderInput = ({ field, props }: { field:any; props: CustomProps }) => {
  return (
    <Input 
      type="text"
      placeholder="John Doe"
    />
  )
}

interface CustomProps {
  control: Control<any>,
  fieldType: FormFieldType,
  name: string,
  label?: string,
  placeholder?: string,
  iconSrc?: string,
  iconAlt?: string,
  disabled?: boolean,
  dateFormat?: string,
  showTimeSelect?: boolean,
  children?: React.ReactNode,
  renderSkeleton?: (field:any) => React.ReactNode
}

const CustomFormfield = (props:CustomProps) => {

  const { control, name, fieldType, label } = props

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        
        <FormItem className="flex-1">
          {fieldType !== FormFieldType.CHECKBOX && label && (
            <FormLabel>{label}</FormLabel>
          )}

          <RenderInput 
            field={field}
            props={props}
          />

          <FormMessage className="shad-error" />

        </FormItem>
      )}
    />
  )
}

export default CustomFormfield