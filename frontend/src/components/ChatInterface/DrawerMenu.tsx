// src/components/ChatInterface/DrawerMenu.tsx
import React, { useEffect } from "react";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import { useStyles } from "../../styles/useStyles";
import useConversationStore from "../../store/useConversationStore";
import { Message } from "../../interfaces/MessageInterface";
import { Button } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import QuestionAnswerIcon from "@material-ui/icons/QuestionAnswer";
import { v4 as uuidv4 } from "uuid";

type Conversation = {
    id: string;
    messages: Message[];
};

const DrawerMenu: React.FC = () => {
    const classes = useStyles();

    const {
        selectedConversationId,
        setSelectedConversationId,
        conversationHistory,
        setConversationHistory,
        setMessages,
    } = useConversationStore();

    // Function to update conversation history
    const updateConversationHistory = () => {
        const history = JSON.parse(
            localStorage.getItem("conversationHistory") || "[]"
        );
        setConversationHistory(history);
    };

    // Update conversation history on mount
    useEffect(() => {
        updateConversationHistory();
    }, []);

    useEffect(() => {
        const selectedConversation = conversationHistory.find(
            (conv) => conv.id === selectedConversationId
        );

        if (selectedConversation) {
            setMessages(selectedConversation.messages);
        } else {
            setMessages([]);
        }
    }, [selectedConversationId]);

    // Function to handle ListItem click
    const handleListItemClick = (conversation: Conversation) => {
        localStorage.setItem(
            "selectedConversation",
            JSON.stringify([conversation])
        );

        setSelectedConversationId(conversation.id);
        // You might want to perform other actions here, like updating a state or triggering a re-render
    };

    return (
        <Drawer
            className={classes.drawer}
            variant="permanent"
            classes={{ paper: classes.drawerPaper }}
            anchor="left"
        >
            <div style={{ textAlign: "center", padding: "10px" }}>
                <Typography variant="h4"></Typography>
            </div>

            <Divider />

            <List>
                {/* Button to reset chat */}
                <div
                    style={{
                        textAlign: "center",
                        margin: "5px",
                        paddingBottom: "10px",
                    }}
                >
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => {
                            localStorage.setItem("selectedConversation", "[]");
                            const conversationId = uuidv4();
                            setSelectedConversationId(conversationId);
                        }}
                    >
                        Create New Chat
                    </Button>
                </div>

                {conversationHistory.length > 0 ? (
                    conversationHistory.map((conv) => (
                        <ListItem
                            button
                            key={conv.id}
                            onClick={() => handleListItemClick(conv)}
                        >
                            <ListItemIcon style={{ minWidth: "30px" }}>
                                <QuestionAnswerIcon color="primary" />
                            </ListItemIcon>

                            <ListItemText
                                style={{ margin: 0, padding: 0 }}
                                primary={`${
                                    conv.messages[1].content.length > 20
                                        ? conv.messages[1].content.slice(
                                              0,
                                              20
                                          ) + "..."
                                        : conv.messages[1].content
                                }`}
                            />
                        </ListItem>
                    ))
                ) : (
                    <ListItemText
                        style={{ paddingTop: "20px", textAlign: "center" }}
                        primary="No Conversation History."
                    />
                )}
            </List>
        </Drawer>
    );
};

export default DrawerMenu;
