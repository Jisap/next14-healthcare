"use client";

import { ColumnDef } from "@tanstack/react-table";  // Se usa para definir columnas de una tabla.
import Image from "next/image";

import { Doctors } from "../../app/constants";
import { formatDateTime } from "@/lib/utils";
import { Appointment } from "@/types/appwrite.types";

import { AppointmentModal } from "../../components/AppointmentModal";
import { StatusBadge } from "../StatusBadge";

export const columns: ColumnDef<Appointment>[] = [                            // Define un array de objetos ColumnDef para las citas
  {
    header: "#",                                                              // Muestra el índice de la fila + 1.
    cell: ({ row }) => {
      return <p className="text-14-medium ">{row.index + 1}</p>;
    },
  },
  {                                                                           // Muestra el nombre del paciente de la cita.  
    accessorKey: "patient",                                                   // accesorKey le dice a la tabla que esta columna esta asociada a la prop "patient" de cada objeto en los datos de las citas
    header: "Patient",  
    cell: ({ row }) => {                                                      // La función cell recibe un objeto de contexto que se corresponde al objeto iterado de la cita
      const appointment = row.original;                                       // row.original es el objeto original de la cita correspondiente a esta fila.
      return <p className="text-14-medium ">{appointment.patient.name}</p>;   // appointment.patient.name accede al nombre del paciente de la cita.
    },
  },
  {
    accessorKey: "status",                                                    // Muestra el estado de la cita usando el componente StatusBadge.
    header: "Status",
    cell: ({ row }) => {
      const appointment = row.original;
      return (
        <div className="min-w-[115px]">
          <StatusBadge status={appointment.status} />
        </div>
      );
    },
  },
  {
    accessorKey: "schedule",                                                  // Muestra la fecha y hora de la cita formateada.
    header: "Appointment",
    cell: ({ row }) => {
      const appointment = row.original;
      return (
        <p className="text-14-regular min-w-[100px]">
          {formatDateTime(appointment.schedule).dateTime}
        </p>
      );
    },
  },
  {
    accessorKey: "primaryPhysician",                                           // Muestra la imagen y el nombre del doctor asociado a la cita.
    header: "Doctor",
    cell: ({ row }) => {
      const appointment = row.original;

      const doctor = Doctors.find(
        (doctor) => doctor.name === appointment.primaryPhysician
      );

      return (
        <div className="flex items-center gap-3">
          <Image
            src={doctor?.image!}
            alt="doctor"
            width={100}
            height={100}
            className="size-8"
          />
          <p className="whitespace-nowrap">Dr. {doctor?.name}</p>
        </div>
      );
    },
  },
  {
    id: "actions",                                                            // Proporciona botones para abrir modales que permiten programar o cancelar citas. 
    header: () => <div className="pl-4">Actions</div>,
    cell: ({ row }) => {
      const appointment = row.original;

      return (
        <div className="flex gap-1">
          <AppointmentModal
            patientId={appointment.patient.$id}
            userId={appointment.userId}
            appointment={appointment}
            type="schedule"
            title="Schedule Appointment"
            description="Please confirm the following details to schedule."
          />
          <AppointmentModal
            patientId={appointment.patient.$id}
            userId={appointment.userId}
            appointment={appointment}
            type="cancel"
            title="Cancel Appointment"
            description="Are you sure you want to cancel your appointment?"
          />
        </div>
      );
    },
  },
];