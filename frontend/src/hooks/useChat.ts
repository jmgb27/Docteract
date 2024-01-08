// src/hooks/useChat.ts
import { useState, useEffect, useCallback, useRef, ChangeEvent } from "react";
import { v4 as uuidv4 } from "uuid";
import { Message } from "../interfaces/MessageInterface";
import { openai } from "../utils/OpenAIInstance";
import useConversationStore from "../store/useConversationStore";

const useChat = () => {
    const {
        messages,
        selectedConversationId,
        setMessages,
        setSelectedConversationId,
        updateConversationHistory,
    } = useConversationStore();

    const [userInput, setUserInput] = useState<string>("");
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const ongoingMessageRef = useRef<string>("");

    // Load initial conversation from localStorage
    useEffect(() => {
        const selectedConversation = JSON.parse(
            localStorage.getItem("selectedConversation") || "[]"
        );
        if (selectedConversation.length > 0) {
            setMessages(selectedConversation[0].messages);
            setSelectedConversationId(selectedConversation[0].id);
        }
    }, []);

    useEffect(() => {
        // if the messages is empty then use the default message
        if (messages.length === 0) {
            setMessages([
                {
                    role: "system",
                    content: `This is a System Message`,
                },
                {
                    role: "assistant",
                    content: "👋 Hi, how can I help you?",
                },
            ]);
        }
    }, [messages]);

    const handleInputChange = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            setUserInput(event.target.value);
        },
        []
    );

    const updateLocalStorage = (
        newMessages: Message[],
        conversationId: string
    ) => {
        let conversationHistory = JSON.parse(
            localStorage.getItem("conversationHistory") || "[]"
        );
        let conversationExists = false;

        conversationHistory = conversationHistory.map(
            (convo: { id: string }) => {
                if (convo.id === conversationId) {
                    conversationExists = true;
                    return { ...convo, messages: newMessages };
                }
                return convo;
            }
        );

        if (!conversationExists) {
            conversationHistory.push({
                id: conversationId,
                messages: newMessages,
            });
        }

        localStorage.setItem(
            "conversationHistory",
            JSON.stringify(conversationHistory)
        );

        localStorage.setItem(
            "selectedConversation",
            JSON.stringify([{ id: conversationId, messages: newMessages }])
        );

        updateConversationHistory(newMessages, conversationId);
    };

    const sendMessage = useCallback(async () => {
        if (userInput.trim() !== "") {
            setIsProcessing(true);
            const newUserMessage: Message = {
                role: "user",
                content: userInput.trim(),
            };

            // Check and set a new conversation ID if it doesn't exist
            let conversationId = selectedConversationId;
            if (!conversationId) {
                conversationId = uuidv4();
                setSelectedConversationId(conversationId);
            }

            const updatedMessages = [...messages, newUserMessage];
            setMessages(updatedMessages);

            // Immediately update localStorage with the new conversation
            updateLocalStorage(updatedMessages, conversationId);

            setUserInput("");
            ongoingMessageRef.current = "";

            try {
                const completion = await openai.chat.completions.create({
                    model: "teknium/OpenHermes-2p5-Mistral-7B",
                    messages: updatedMessages,
                    max_tokens: 1024,
                    stream: true,
                });

                for await (const chunk of completion) {
                    if (
                        chunk.choices[0].delta &&
                        chunk.choices[0].delta.content
                    ) {
                        ongoingMessageRef.current +=
                            chunk.choices[0].delta.content;

                        const newMessages: Message[] = [
                            ...updatedMessages,
                            {
                                role: "assistant",
                                content: ongoingMessageRef.current,
                            },
                        ];
                        setMessages(newMessages);
                        updateLocalStorage(newMessages, conversationId);
                    }
                }
            } catch (error) {
                console.error("Error calling OpenAI API:", error);
            }

            setIsProcessing(false);
        }
    }, [userInput, messages, selectedConversationId]);

    return {
        messages,
        userInput,
        isProcessing,
        handleInputChange,
        sendMessage,
    };
};

export default useChat;
