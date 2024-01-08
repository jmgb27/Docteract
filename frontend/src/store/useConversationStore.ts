import { create } from "zustand";
import { Message } from "../interfaces/MessageInterface";

// Define types for your state
type Conversation = {
    id: string;
    messages: Message[]; // Adjust the type of messages if they are not strings
};

type ConversationStore = {
    messages: Message[];
    selectedConversationId: string | null;
    conversationHistory: Conversation[];

    // Methods
    setMessages: (newMessages: Message[]) => void;
    setSelectedConversationId: (id: string | null) => void;
    setConversationHistory: (newHistory: Conversation[]) => void;
    updateConversationHistory: (
        newMessages: Message[],
        conversationId: string
    ) => void;
};

const useConversationStore = create<ConversationStore>((set) => ({
    // Initial state
    messages: [],
    selectedConversationId: null,
    conversationHistory: [],

    // Method to set messages
    setMessages: (newMessages) => set({ messages: newMessages }),

    // Method to set the selected conversation ID
    setSelectedConversationId: (id) => set({ selectedConversationId: id }),

    // Method to set the conversation history
    setConversationHistory: (newHistory) =>
        set({ conversationHistory: newHistory }),

    // Method to update the conversation history with new messages
    updateConversationHistory: (newMessages, conversationId) =>
        set((state) => {
            const updatedHistory = state.conversationHistory.map((convo) => {
                if (convo.id === conversationId) {
                    return { ...convo, messages: newMessages };
                }
                return convo;
            });

            if (!updatedHistory.some((convo) => convo.id === conversationId)) {
                updatedHistory.push({
                    id: conversationId,
                    messages: newMessages,
                });
            }

            return { conversationHistory: updatedHistory };
        }),
}));

export default useConversationStore;
