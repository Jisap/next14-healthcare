"use server"

import { ID, Query } from "node-appwrite";
import {
  BUCKET_ID,
  DATABASE_ID,
  ENDPOINT,
  PATIENT_COLLECTION_ID,
  PROJECT_ID,
  databases,
  storage,
  users,
} from "../appwrite.config";

import { CreateUserParams, RegisterUserParams } from "@/types";
import { parseStringify } from "../utils";
import { InputFile } from "node-appwrite/file"


export const createUser = async (user: CreateUserParams) => {
  
  try {
    
    const newuser = await users.create(
      ID.unique(),
      user.email,
      user.phone,
      user.name
    );

    return parseStringify(newuser);

  } catch (error:any) {
    // Check existing user
    if (error && error?.code === 409) {
      const existingUser = await users.list([
        Query.equal("email", [user.email]),
      ]);

      return existingUser.users[0];
    }
    console.error("An error occurred while creating a new user:", error);
  }
}

export const getUser = async (userId: string) => {
  try {
    const user = await users.get(userId);

    return parseStringify(user);
  } catch (error) {
    console.error(
      "An error occurred while retrieving the user details:",
      error
    );
  }
};

export const getPatient = async (userId: string) => {
  try {
    const patients = await databases.listDocuments(
      DATABASE_ID!,
      PATIENT_COLLECTION_ID!,
      [Query.equal("userId", [userId])]
    );

    if (patients.documents.length === 0) {
      return null; 
    }

    return parseStringify(patients.documents[0]);
  } catch (error) {
    console.error(
      "An error occurred while retrieving the patient details:",
      error
    );
    return null;
  }
};

export const registerPatient = async ({
  identificationDocument,                 // Documento de identificación 
  ...patient                              // Datos del paciente
}: RegisterUserParams) => {
  try {
    
    let file;                                                         // Se declara una variable file para almacenar el archivo subido
    if (identificationDocument) {                                     // Si el documento de identificación esta presente 
      const inputFile =                                               // se crea un objeto inputFile
        identificationDocument &&
        InputFile.fromBuffer(                                         // utilizando InputFile.fromBuffer
          identificationDocument?.get("blobFile") as Blob,            // Este obtiene el contenido del archivo como un Blob.
          identificationDocument?.get("fileName") as string           // y el nombre del archivo
        );

      file = await storage.createFile(BUCKET_ID!, ID.unique(), inputFile); // Se llama a storage.createFile para subir el archivo al almacenamiento de AppWrite
    }

    
    const newPatient = await databases.createDocument(                // Se crea un nuevo documento del paciente en la base de datos:
      DATABASE_ID!,                                                   // ID de la base de datos.
      PATIENT_COLLECTION_ID!,                                         // ID de la colección de pacientes
      ID.unique(),                                                    // Genera un ID único para el documento del paciente
      {
        identificationDocumentId: file?.$id ? file.$id : null,        // El ID del archivo subido
        identificationDocumentUrl: file?.$id                          // La URL para ver el archivo subido
          ? `${ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${file.$id}/view??project=${PROJECT_ID}`
          : null,
        ...patient,                                                   // El resto de los datos del paciente
      }
    );

    return parseStringify(newPatient);
  } catch (error) {
    console.error("An error occurred while creating a new patient:", error);
  }
};
