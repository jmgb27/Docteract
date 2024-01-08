// src/components/ChatInterface/ChatInterface.tsx
import React, { useRef, useEffect } from "react";
import DrawerMenu from "./DrawerMenu";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";
import { useStyles } from "../../styles/useStyles";
import useChat from "../../hooks/useChat"; // Custom hook for chat logic

const ChatInterface: React.FC = () => {
    const classes = useStyles();
    const {
        messages,
        userInput,
        isProcessing,
        handleInputChange,
        sendMessage,
    } = useChat();
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <div className={classes.root}>
            <DrawerMenu />
            <main className={classes.content}>
                <ChatMessages messages={messages} ref={messagesEndRef} />
                <ChatInput
                    userInput={userInput}
                    handleInputChange={handleInputChange}
                    sendMessage={sendMessage}
                    isProcessing={isProcessing}
                />
            </main>
        </div>
    );
};

export default ChatInterface;
