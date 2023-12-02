import { ID, storage } from '@/appwrite'

export const uploadImage = async (file: File) => {
    if(!file) return;

    const fileUpload = await storage.createFile(
        process.env.NEXT_PUBLIC_IMAGE_BUCKET_ID!,
        ID.unique(),
        file
    );

    return fileUpload;
}