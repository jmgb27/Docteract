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
            <div className={classes.toolbar} />
            <Divider />
            <List>
                {/* Button to reset chat */}
                <ListItem
                    button
                    onClick={() => {
                        localStorage.setItem("selectedConversation", "[]");
                        setSelectedConversationId(null);
                    }}
                >
                    <ListItemText primary="New chat" />
                </ListItem>

                {conversationHistory.length > 0 ? (
                    conversationHistory.map((conv) => (
                        <ListItem
                            button
                            key={conv.id}
                            onClick={() => handleListItemClick(conv)}
                        >
                            <ListItemIcon>
                                {/* Here you might want to display an icon or something else */}
                            </ListItemIcon>
                            <ListItemText primary={conv.id} />
                        </ListItem>
                    ))
                ) : (
                    <ListItemText primary="No Conversation History." />
                )}
            </List>
        </Drawer>
    );
};

export default DrawerMenu;
