// interfaces/MessageInterface.ts
export interface Message {
    role: "system" | "user" | "assistant";
    content: string;
}
