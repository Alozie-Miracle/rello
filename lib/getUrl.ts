import { storage } from "@/appwrite";
import { Image } from "@/typings";

export const getUrl = async (image: any) => {
    const data = JSON.parse(image)

    const properIds = JSON.parse(data)
    
    const {bucketId, fileId} = properIds

    const url = storage.getFileView(bucketId, fileId)
    
    return url;
}