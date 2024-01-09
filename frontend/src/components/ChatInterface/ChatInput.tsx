import React from "react";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import { useStyles } from "../../styles/useStyles";
import Dialog from "@material-ui/core/Dialog";
import UploadDocument from "../Modals/UploadDocument";

interface ChatInputProps {
    userInput: string;
    handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    sendMessage: () => void;
    isProcessing: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({
    userInput,
    handleInputChange,
    sendMessage,
    isProcessing,
}) => {
    const classes = useStyles();

    const [openUploadModal, setOpenUploadModal] =
        React.useState<boolean>(false);

    const handleKeyPress = (event: React.KeyboardEvent) => {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault(); // Prevent the default action to avoid a line break being added
            sendMessage();
        }
        // If Shift + Enter is pressed, the default action will occur, which is to insert a line break.
    };

    const handleClose = () => {
        setOpenUploadModal(false);
    };

    return (
        <div className={classes.inputSection}>
            <Dialog
                open={openUploadModal}
                onClose={handleClose}
                aria-labelledby="parent-modal-title"
                aria-describedby="parent-modal-description"
            >
                <UploadDocument />
            </Dialog>

            <TextField
                id="outlined-multiline-flexible"
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
                                onClick={() => setOpenUploadModal(true)}
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
    );
};

export default ChatInput;
