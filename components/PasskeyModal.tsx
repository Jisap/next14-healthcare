"use client"

import React, { useEffect, useState } from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"

import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { decryptKey, encryptKey } from '@/lib/utils';

const PasskeyModal = () => {

  const router = useRouter()
  const path = usePathname();
  const [open, setOpen] = useState(true);
  const [passkey, setPasskey] = useState("");
  const [error, setError] = useState("");

  const encryptedKey =
    typeof window !== "undefined"
      ? window.localStorage.getItem("accessKey")
      : null;

  const closeModal = () => {
    setOpen(false);
    router.push("/");
  };

  useEffect(() => {                                                           // 2º Cada vez que encrytedKey cambie

    const accessKey = encryptedKey && decryptKey(encryptedKey);               // se desencrypta

    if (path)
      if (accessKey === process.env.NEXT_PUBLIC_ADMIN_PASSKEY!.toString()) {  // si la contraseña desencriptada = env
        setOpen(false);                                                       // se cierra el modal
        router.push("/admin");                                                // redirect a /admin
      } else {
        setOpen(true);                                                        // sino se abre el modal
      }
  }, [encryptedKey]);

 
  const validatePasskey = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => { // 1º se recibe la passkey
    e.preventDefault();

    if (passkey === process.env.NEXT_PUBLIC_ADMIN_PASSKEY) {                        // Si coincide con la env
      const encryptedKey = encryptKey(passkey);                                     // se encrypta  

      localStorage.setItem("accessKey", encryptedKey);                              // y se almacena en localstorage

      setOpen(false);                                                               // Se cierra el modal
    } else {
      setError("Invalid passkey. Please try again.");
    }
  };

  return (
    <AlertDialog 
      open={open} 
      onOpenChange={setOpen}
    >
      <AlertDialogContent className="shad-alert-dialog">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-start justify-between">
            Admin Access Verification
            <Image
              src="/assets/icons/close.svg"
              alt="close"
              width={20}
              height={20}
              onClick={() => closeModal()}
              className="cursor-pointer"
            />
          </AlertDialogTitle>
          <AlertDialogDescription>
            To access the admin page, please enter the passkey.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div>
          <InputOTP 
            maxLength={6}
            value={passkey}
            onChange={(value) => setPasskey(value)}  
          >
            <InputOTPGroup className="shad-otp">
              <InputOTPSlot className="shad-otp-slot" index={0} />
              <InputOTPSlot className="shad-otp-slot" index={1} />
              <InputOTPSlot className="shad-otp-slot" index={2} />
              <InputOTPSlot className="shad-otp-slot" index={3} />
              <InputOTPSlot className="shad-otp-slot" index={4} />
              <InputOTPSlot className="shad-otp-slot" index={5} />
            </InputOTPGroup>
          </InputOTP>

          {error && (
            <p className="shad-error text-14-regular mt-4 flex justify-center">
              {error}
            </p>
          )}

        </div>

        <AlertDialogFooter>
          <AlertDialogAction
            onClick={(e) => validatePasskey(e)}
            className="shad-primary-btn w-full"
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>

  )
}

export default PasskeyModal