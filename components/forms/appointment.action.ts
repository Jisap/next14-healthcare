"use server";

import { revalidatePath } from "next/cache";
import { ID, Query } from "node-appwrite";

import { Appointment } from "@/types/appwrite.types";

import {
  APPOINTMENT_COLLECTION_ID,
  DATABASE_ID,
  databases,
  messaging,
} from "../../lib/appwrite.config";
import { formatDateTime, parseStringify } from "../../lib/utils";
import { CreateAppointmentParams, UpdateAppointmentParams } from "@/types";

//  CREATE APPOINTMENT
export const createAppointment = async (
  appointment: CreateAppointmentParams
) => {
  try {
    const newAppointment = await databases.createDocument(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      ID.unique(),
      appointment // info del formulario
    );

    revalidatePath("/admin");
    return parseStringify(newAppointment);
  } catch (error) {
    console.error("An error occurred while creating a new appointment:", error);
  }
};

//  GET RECENT APPOINTMENTS
export const getRecentAppointmentList = async () => {
  try {
    const appointments = await databases.listDocuments(                   // Se recuperan las citas 
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      [Query.orderDesc("$createdAt")]
    );

    const initialCounts = {                                               // Se inicializan los contadores de las citas por estado:
      scheduledCount: 0,
      pendingCount: 0,
      cancelledCount: 0,
    };

    const counts = (appointments.documents as Appointment[]).reduce(      // Se utiliza el método reduce para iterar sobre las citas y contar cuántas de ellas están en cada estado
      (acc, appointment) => {
        switch (appointment.status) { // Si el status de appointment
          case "scheduled":           // es "scheduled"  
            acc.scheduledCount++;     // el acumulador scheduledCount se incrementa en 1
            break;
          case "pending":             // idem
            acc.pendingCount++;
            break;
          case "cancelled":           // idem
            acc.cancelledCount++;
            break;
        }
        return acc; // Después de actualizar acc, es crucial devolverlo para que la próxima iteración reciba el acumulador actualizado.
      },
      initialCounts
    );

    const data = {                                                         // Se prepara el objeto data   
      totalCount: appointments.total,                                      // que contiene el total de citas 
      ...counts,                                                           // los contadores por estado 
      documents: appointments.documents,                                   // y los documentos de citas
    };

    return parseStringify(data);                                           // Se retornan los datos en un formato seguro para JSON, utilizando parseStringify 

  } catch (error) {
    console.error(
      "An error occurred while retrieving the recent appointments:",
      error
    );
  }
};

//  SEND SMS NOTIFICATION
export const sendSMSNotification = async (userId: string, content: string) => {
  try {
    const message = await messaging.createSms(
      ID.unique(),
      content,
      [],
      [userId]
    );
    return parseStringify(message);
  } catch (error) {
    console.error("An error occurred while sending sms:", error);
  }
};

//  UPDATE APPOINTMENT
export const updateAppointment = async ({
  appointmentId,
  userId,
  appointment,
  type,
}: UpdateAppointmentParams) => {
  try {
    
    const updatedAppointment = await databases.updateDocument(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      appointmentId,
      appointment
    );

    if (!updatedAppointment) throw Error;

    const smsMessage = `
      Greetings from CarePulse. 
      ${type === "schedule" 
        ? `Your appointment is confirmed for ${formatDateTime(appointment.schedule!).dateTime} with Dr. ${appointment.primaryPhysician}` 
        : `We regret to inform that your appointment for ${formatDateTime(appointment.schedule!).dateTime} is cancelled. Reason:  ${appointment.cancellationReason}`}.
      `;
      
    await sendSMSNotification(userId, smsMessage);

    revalidatePath("/admin");
    return parseStringify(updatedAppointment);
  } catch (error) {
    console.error("An error occurred while scheduling an appointment:", error);
  }
};

// GET APPOINTMENT
export const getAppointment = async (appointmentId: string) => {
  try {
    const appointment = await databases.getDocument(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      appointmentId
    );

    return parseStringify(appointment);
  } catch (error) {
    console.error(
      "An error occurred while retrieving the existing patient:",
      error
    );
  }
};