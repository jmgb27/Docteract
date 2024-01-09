import { useState } from "react";
import { Box, Button, Typography, CircularProgress } from "@material-ui/core";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import { styled } from "@material-ui/core/styles";
import useConversationStore from "../../store/useConversationStore";

const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    whiteSpace: "nowrap",
    width: 1,
});

const UploadDocument = () => {
    const [file, setFile] = useState<File | null>(null);
    const [fileName, setFileName] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(false);

    const { selectedConversationId } = useConversationStore();

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUploadSuccess(false); // Reset upload success state
        if (event.target.files && event.target.files.length > 0) {
            const selectedFile = event.target.files[0];
            const maxLength = 20;
            const truncatedFileName =
                selectedFile.name.length > maxLength
                    ? selectedFile.name.substring(0, maxLength) + "..."
                    : selectedFile.name;
            setFile(selectedFile);
            setFileName(truncatedFileName);
        }
    };

    const handleUploadClick = () => {
        if (file) {
            setIsLoading(true); // Start loading
            uploadFile(file);
        }
    };

    const uploadFile = (file: File) => {
        const formData = new FormData();

        formData.append("file", file);
        formData.append("conversation_id", selectedConversationId);

        // Replace 'your_endpoint_url' with the URL of your FastAPI endpoint
        fetch(`${import.meta.env.VITE_BACKEND_URL}/ingest`, {
            method: "POST",
            body: formData,
        })
            .then((response) => response.json())
            .then((data) => {
                console.log("Success:", data);
                setIsLoading(false); // Stop loading
                setUploadSuccess(true); // Set upload success
            })
            .catch((error) => {
                console.error("Error:", error);
                setIsLoading(false); // Stop loading
                setUploadSuccess(false); // Reset upload success
            });
    };

    return (
        <Box
            style={{
                margin: "auto",
                maxWidth: "400px",
                padding: "20px",
                textAlign: "center",
            }}
        >
            <Button
                component="label"
                variant="contained"
                color="primary"
                startIcon={<CloudUploadIcon />}
                disabled={isLoading}
            >
                Choose file
                <VisuallyHiddenInput type="file" onChange={handleFileChange} />
            </Button>
            {file && (
                <>
                    <Typography
                        variant="subtitle1"
                        style={{ marginTop: "10px" }}
                    >
                        File Name: {fileName}
                    </Typography>
                    {!isLoading && (
                        <Button
                            variant="contained"
                            color="secondary"
                            style={{ marginTop: "10px" }}
                            onClick={handleUploadClick}
                            disabled={isLoading}
                        >
                            Upload file
                        </Button>
                    )}
                    {isLoading && (
                        <CircularProgress style={{ marginTop: "10px" }} />
                    )}
                    {uploadSuccess && !isLoading && (
                        <Typography
                            variant="subtitle1"
                            style={{ marginTop: "10px", color: "green" }}
                        >
                            <CheckCircleIcon /> Upload successful!
                        </Typography>
                    )}
                </>
            )}
        </Box>
    );
};

export default UploadDocument;
