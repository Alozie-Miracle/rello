import openai from "@/openai";
import { NextResponse } from "next/server";


export async function POST(req: Request){
    //todos in the body of the POST req
    const { todos } = await req.json();
    
    //communicate with openAI
    const res = await openai.chat.completions.create({
        messages: [
            {"role": "system", "content": "When responding, welcome the user alsways as Mr/Mrs and say welcome to the Rello App from Zypher-ix! Limit the response to 200 characters"},
            {"role": "user", "content": `Hi there, provide a summary of the following todos. Count how many todos are in each category such as To do, in progress and done, then tell the user to have a productive day! Here's is the data: ${JSON.stringify(todos)} `},],
        model: "gpt-3.5-turbo",
        temperature: 0.8,
        n: 1,
        stream: false,
    });

    

    return NextResponse.json(res.choices[0].message)

}