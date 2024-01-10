# Docteract

Docteract, a portmanteau of "Document" and "Interact," is an innovative chatbot that revolutionizes the way you interact with documents. Upload a document in txt, pdf, or docx format, and engage in a question-and-answer session with our intelligent bot to efficiently extract the information you need.

## Features

-   **Document Upload**: Supports txt, pdf, and docx formats for document upload.
-   **Intelligent Q&A**: Uses a chatbot to provide answers from your uploaded document.
-   **User-Friendly Interface**: Seamless and intuitive for easy navigation and interaction.
-   **Privacy-Focused**: Utilizes an open-source language model, ensuring enhanced privacy and security for user data and interactions.

## Technology Stack

-   **Frontend**: Developed using React with Vite and TypeScript for a responsive user interface.
-   **Backend**: Python-based, ensuring reliable processing of user interactions and document handling.
-   **Language Model**: Utilizes the open-source language model "teknium/OpenHermes-2p5-Mistral-7B" for chatbot functionality.
-   **Deployment**: The model is deployed on Together AI, and the backend is hosted on AWS LightSail with the frontend on Vercel.

## Limitations

-   **Language Model Scope**: The chatbot, powered by a 7 billion parameter model, may not be as comprehensive as models with larger parameters like GPT-3.5.
-   **Scalability**: Currently using free tiers for hosting; full scalability for larger user loads is not yet implemented.
-   **Language Support**: Optimized primarily for English language documents.
-   **Document Content Limitations**: The application is currently unable to process documents with image-based content or complex formats, such as tables. Users are recommended to upload documents containing pure text for optimal interaction and results.

## License

Docteract is released under the [MIT License](https://opensource.org/licenses/MIT), permitting free usage and distribution with attribution, making it suitable for open-source projects.
