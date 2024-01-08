// src/styles/useStyles.ts
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: "flex",
            flexDirection: "column", // Stack the drawer and main content vertically
            height: "100vh", // Full viewport height
        },
        drawer: {
            width: 240, // drawer width
            flexShrink: 0,
        },
        drawerPaper: {
            width: 240, // drawer width
        },
        content: {
            flexGrow: 1,
            padding: theme.spacing(3),
            marginLeft: 240, // margin equal to drawer width
        },
        toolbar: theme.mixins.toolbar,
        chatSection: {
            flexGrow: 1,
            overflowY: "auto",
            marginBottom: theme.spacing(13),
        },
        inputSection: {
            position: "fixed",
            bottom: 0,
            left: 240, // align with drawer width
            right: 0,
            padding: theme.spacing(1),
            backgroundColor: theme.palette.background.paper,
        },
        chatBubble: {
            margin: theme.spacing(2),
            padding: theme.spacing(1.6),
            backgroundColor: "#f1f1f1",
            borderRadius: "10px",
        },
        chatBubbleRight: {
            backgroundColor: "#3f51b5",
            color: "white",
        },
        iconButton: {
            padding: 10,
        },
        // Add additional styles as needed
    })
);
