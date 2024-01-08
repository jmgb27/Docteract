import React from "react";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import InboxIcon from "@material-ui/icons/MoveToInbox";
import MailIcon from "@material-ui/icons/Mail";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: "8b4c4608dc3022b27bd842512662a8cc4789be7db3616f5ae20dd0d638b967b3",
    baseURL: "https://api.together.xyz",
    dangerouslyAllowBrowser: true,
});

const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: "flex",
            flexDirection: "column", // Stack the drawer and main content vertically
            height: "100vh", // Full viewport height
        },
        drawer: {
            width: drawerWidth,
            flexShrink: 0,
        },
        drawerPaper: {
            width: drawerWidth,
        },
        content: {
            flexGrow: 1,
            display: "flex",
            flexDirection: "column", // Stack toolbar, chatSection, and inputSection vertically
            padding: theme.spacing(3),
        },
        toolbar: theme.mixins.toolbar,
        chatSection: {
            flexGrow: 1,
            overflowY: "auto",
            marginLeft: drawerWidth, // push the chat section to the right by the width of the drawer
            // height: `calc(100vh - ${theme.mixins.toolbar.minHeight}px)`, // adjust the height as necessary
            paddingBottom: theme.spacing(10), // padding at the bottom for the input section
        },
        inputSection: {
            position: "fixed",
            bottom: 0,
            left: drawerWidth, // align the left edge with the chat section
            right: 0,
            padding: theme.spacing(1),
            backgroundColor: theme.palette.background.paper, // Match the theme background
        },
        messageInput: {
            flexGrow: 1,
            marginRight: theme.spacing(2),
        },
        chatBubble: {
            margin: theme.spacing(1),
            padding: theme.spacing(1),
            backgroundColor: "#f1f1f1",
            borderRadius: "10px",
        },
        chatBubbleRight: {
            backgroundColor: "#3f51b5",
            color: "white",
        },
        inputFieldContainer: {
            flexGrow: 1,
            marginRight: theme.spacing(2), // Adjust the spacing as needed
        },
        inputField: {
            width: "100%",
            "& .MuiOutlinedInput-root": {
                "&.Mui-focused fieldset": {
                    borderColor: "primary",
                },
            },
            "& .MuiOutlinedInput-input": {
                height: "40px",
                padding: "10px 14px",
            },
            "& .MuiButtonBase-root": {
                height: "50px", // match TextField height, adjust if necessary
            },
        },
        // Add this for the IconButton styles if needed
        iconButton: {
            padding: 10,
        },
    })
);

interface Message {
    role: "system" | "user" | "assistant";
    content: string;
}

const ChatInterface: React.FC = () => {
    const classes = useStyles();

    const [isProcessing, setIsProcessing] = React.useState(false); // New state variable

    const [messages, setMessages] = React.useState<Message[]>([
        { role: "system", content: `This is a system message.` },
        { role: "assistant", content: "👋 Hi, how can I help you?" },
    ]);
    const [userInput, setUserInput] = React.useState<string>("");

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUserInput(event.target.value);
    };

    const ongoingMessageRef = React.useRef("");

    const sendMessage = async () => {
        if (userInput.trim() !== "") {
            setIsProcessing(true);

            const newUserMessage: Message = {
                role: "user",
                content: userInput.trim(),
            };

            setMessages((messages) => [...messages, newUserMessage]);
            setUserInput("");
            ongoingMessageRef.current = ""; // Reset the ongoing message

            try {
                const completion = await openai.chat.completions.create({
                    model: "teknium/OpenHermes-2p5-Mistral-7B",
                    messages: [...messages, newUserMessage],
                    max_tokens: 1024,
                    stream: true,
                });

                for await (const chunk of completion) {
                    if (
                        chunk.choices[0].delta &&
                        chunk.choices[0].delta.content
                    ) {
                        // Append the new content to the ongoing message
                        ongoingMessageRef.current +=
                            chunk.choices[0].delta.content;

                        // Update the messages state with the new content
                        setMessages((messages) => {
                            // Clone the messages array
                            const newMessages = [...messages];
                            // Check if the last message belongs to the assistant and update it
                            if (
                                newMessages[newMessages.length - 1].role ===
                                "assistant"
                            ) {
                                newMessages[newMessages.length - 1].content =
                                    ongoingMessageRef.current;
                            } else {
                                // If there's no assistant message yet, add it
                                newMessages.push({
                                    role: "assistant",
                                    content: ongoingMessageRef.current,
                                });
                            }
                            console.log(newMessages);
                            return newMessages;
                        });
                    }
                }
            } catch (error) {
                console.error("Error calling OpenAI API:", error);
            }

            setIsProcessing(false);
        }
    };

    const renderMessageContent = (messageContent) => {
        return messageContent.split("\n").map((line, index) => (
            <React.Fragment key={index}>
                {line}
                <br />
            </React.Fragment>
        ));
    };

    const handleKeyPress = (event: React.KeyboardEvent) => {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault(); // Prevent the default action to avoid a line break being added
            sendMessage();
        }
        // If Shift + Enter is pressed, the default action will occur, which is to insert a line break.
    };

    return (
        <div className={classes.root}>
            {/* Side navigation history */}
            <Drawer
                className={classes.drawer}
                variant="permanent"
                classes={{
                    paper: classes.drawerPaper,
                }}
                anchor="left"
            >
                <div className={classes.toolbar} />
                <Divider />
                <List>
                    {["Option 1", "Option 2"].map((text, index) => (
                        <ListItem button key={text}>
                            <ListItemIcon>
                                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                            </ListItemIcon>
                            <ListItemText primary={text} />
                        </ListItem>
                    ))}
                </List>
                <Divider />
                <List>
                    {["Option 3", "Option 4"].map((text, index) => (
                        <ListItem button key={text}>
                            <ListItemIcon>
                                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                            </ListItemIcon>
                            <ListItemText primary={text} />
                        </ListItem>
                    ))}
                </List>
            </Drawer>
            {/* Main chat interface */}
            <main className={classes.content}>
                <div className={classes.chatSection}>
                    {messages.map(
                        (message, index) =>
                            message.role !== "system" && (
                                <Paper
                                    key={index}
                                    className={`${classes.chatBubble} ${
                                        message.role === "user"
                                            ? classes.chatBubbleRight
                                            : ""
                                    }`}
                                    style={{ whiteSpace: "pre-wrap" }} // This style will ensure line breaks are preserved
                                >
                                    <Typography variant="body1">
                                        {renderMessageContent(message.content)}
                                    </Typography>
                                </Paper>
                            )
                    )}
                </div>

                <div className={classes.inputSection}>
                    <div className={classes.inputFieldContainer}>
                        <TextField
                            id="outlined-multiline-flexible"
                            label="Type your message"
                            multiline
                            minRows={1} // Set this to the desired minimum number of lines
                            margin="normal"
                            variant="outlined"
                            fullWidth
                            InputLabelProps={{
                                shrink: true,
                            }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <IconButton
                                            color="primary"
                                            className={classes.iconButton}
                                        >
                                            <AttachFileIcon />
                                        </IconButton>
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={sendMessage}
                                            disabled={isProcessing} // Disable Button when processing
                                        >
                                            Send
                                        </Button>
                                    </InputAdornment>
                                ),
                            }}
                            value={userInput}
                            onChange={handleInputChange}
                            onKeyDown={handleKeyPress}
                            disabled={isProcessing} // Disable TextField when processing
                        />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ChatInterface;
