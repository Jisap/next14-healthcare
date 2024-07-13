"use client"

import { PatientFormDefaultValues } from '@/app/constants';
import { PatientFormValidation } from '@/lib/validation';
import { User } from '@/types'
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const RegisterForm = ({ user }: { user: User }) => {

  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof PatientFormValidation>>({
    resolver: zodResolver(PatientFormValidation),
    defaultValues: {
      ...PatientFormDefaultValues,
      name: user.name,
      email: user.email,
      phone: user.phone,
    },
  });

  return (
    <div>RegisterForm</div>
  )
}

export default RegisterForm