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
import QuestionAnswerIcon from "@material-ui/icons/QuestionAnswer";
import { v4 as uuidv4 } from "uuid";
import DeleteIcon from "@material-ui/icons/Delete"; // Importing the delete icon
import IconButton from "@material-ui/core/IconButton";
import LOGO from "/logo.png";

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

    const deleteConversation = (conversationId: string) => {
        // Filter out the conversation to delete
        const updatedHistory = conversationHistory.filter(
            (conv) => conv.id !== conversationId
        );

        // Update local storage and state
        localStorage.setItem(
            "conversationHistory",
            JSON.stringify(updatedHistory)
        );
        setConversationHistory(updatedHistory);

        // Reset selected conversation if it's the one being deleted
        if (selectedConversationId === conversationId) {
            const newSelectedId = updatedHistory[0]?.id || "";
            setSelectedConversationId(newSelectedId);
            setMessages(newSelectedId ? updatedHistory[0].messages : []);
        }
    };

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
            <div style={{ textAlign: "center" }}>
                <img
                    src={LOGO}
                    className="App-logo"
                    alt="logo"
                    height={"70px"}
                />
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
                        <React.Fragment key={conv.id}>
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
                                        conv.messages[1].content.length > 15
                                            ? conv.messages[1].content.slice(
                                                  0,
                                                  15
                                              ) + "..."
                                            : conv.messages[1].content
                                    }`}
                                />
                                <IconButton>
                                    <DeleteIcon
                                        color="secondary"
                                        onClick={(event) => {
                                            event.stopPropagation(); // Prevents ListItem click event
                                            deleteConversation(conv.id);
                                        }}
                                    />
                                </IconButton>
                            </ListItem>
                        </React.Fragment>
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
