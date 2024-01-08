import React, { ForwardedRef } from "react";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import { Message } from "../../interfaces/MessageInterface";
import { useStyles } from "../../styles/useStyles";

interface ChatMessagesProps {
    messages: Message[];
}

const ChatMessages = React.forwardRef(
    ({ messages }: ChatMessagesProps, ref: ForwardedRef<HTMLDivElement>) => {
        const classes = useStyles();

        const renderMessageContent = (messageContent: string) => {
            return messageContent.split("\n").map((line, index) => (
                <React.Fragment key={index}>
                    {line}
                    <br />
                </React.Fragment>
            ));
        };

        return (
            <div className={classes.chatSection}>
                {messages.map((message, index) => (
                    <div
                        key={index}
                        ref={index === messages.length - 1 ? ref : null}
                    >
                        {message.role !== "system" && (
                            <Paper
                                className={`${classes.chatBubble} ${
                                    message.role === "user"
                                        ? classes.chatBubbleRight
                                        : ""
                                }`}
                                style={{ whiteSpace: "pre-wrap" }}
                            >
                                <Typography variant="body1">
                                    {renderMessageContent(message.content)}
                                </Typography>
                            </Paper>
                        )}
                    </div>
                ))}
            </div>
        );
    }
);

export default ChatMessages;
