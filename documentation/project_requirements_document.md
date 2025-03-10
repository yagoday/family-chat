# Project Requirements Document (PRD)

## 1. Project Overview

This project is a real-time family chat application designed for fast and secure communication among pre-registered family members. The application allows users to log in using a username and password and join a shared chat room where they can exchange text messages, emojis, and JPEG images (with automatic image shrinking if needed). The system is built to promote an engaging, kid-friendly environment using bright colors and emojis, making it simple and fun for all ages.

The main goal is to provide a seamless and safe platform for family interactions while keeping the interface straightforward. Key objectives include secure authentication through JWT, efficient real-time messaging via Socket.io, and reliable image support using Cloudinary. Success is measured by ease of use, reliability of real-time interactions across desktop, mobile, and tablet devices, and robust performance and security.

## 2. In-Scope vs. Out-of-Scope

**In-Scope:**

*   User authentication with pre-registered family members (login using username and password).
*   Secure JWT-based authentication for API endpoints and WebSocket communications.
*   Real-time messaging feature with text messages, emoji support, and image sharing.
*   Implementation of a shared chat room using Socket.io for instant updates.
*   Image uploads limited to simple JPEG images with automatic resizing/shrinking if the file size is too large.
*   A responsive UI designed for desktop, mobile, and tablet devices.
*   A command-line script for admin pre-registration of users.
*   Basic error handling and input validation for chat messages and image uploads.

**Out-of-Scope:**

*   User registration flow on the application (all users are pre-registered by an administrator).
*   Content moderation, parental control, logging, analytics, and advanced reconnection/offline handling.
*   Additional roles or permission levels other than the administrator and pre-registered family members.
*   Push notifications, advanced reconnection features, and robust offline support.

## 3. User Flow

When a user opens the application, they are met with a friendly login page featuring bright colors and kid-friendly emojis. The user enters their pre-assigned username and password and submits the information through a clean and simple form. The client sends these credentials to the backend API at /api/auth/login. If the credentials are valid, the client receives a JWT token and user information, which is then stored locally. The user is automatically redirected to the main chat interface where they can join the real-time conversation.

Once on the chat screen, the stored token is used to establish a secure WebSocket connection with the server. The interface displays a dynamic message list that auto-scrolls to the newest messages and shows messages from everyone in the shared chatroom. Users can send text messages (with emojis), upload JPEG images through an image uploader with preview, and see real-time notifications when other family members join or leave the chat. Logging out clears the token and redirects the user back to the login page, ending the secure session.

## 4. Core Features

*   **User Authentication:**

    *   Login using pre-registered username and password.
    *   Secure token-based authentication (JWT) used for both API and Socket.io communications.

*   **Real-Time Messaging:**

    *   Live chat functionality via Socket.io.
    *   Instant broadcasting of new messages, emojis, and images.

*   **Message Storage and Retrieval:**

    *   PostgreSQL database for storing user accounts and messages.
    *   API endpoint to retrieve chat history with pagination support.

*   **Image Upload Support:**

    *   Upload JPEG images with a preview option.
    *   Automatic image resizing/shrinking if the file is too large.
    *   Storage and processing through Cloudinary integration.

*   **Pre-Registration Management:**

    *   CLI-based script for administrators to pre-register users.
    *   Secure password storage using bcrypt hash for each user.

*   **Frontend UI Components:**

    *   Responsive design supporting desktop, mobile, and tablets.
    *   Components such as LoginForm, MessageList, EmojiPicker, ImageUploader, and an intuitive navigation header.

## 5. Tech Stack & Tools

*   **Frontend:**

    *   React.js with TypeScript for building a dynamic user interface.
    *   Material-UI or Tailwind CSS for simple and colorful styling.
    *   Socket.io-client for handling real-time communications.
    *   Axios for making API requests.
    *   Emoji-mart for integrating emoji selection.
    *   Cloudinary React SDK for implementing image uploads.

*   **Backend:**

    *   Node.js with Express.js using TypeScript.
    *   Socket.io for WebSocket-based real-time messaging.
    *   JWT for authentication and authorization.
    *   Bcrypt for secure password hashing.
    *   TypeORM for database operations and management.

*   **Database & Hosting:**

    *   PostgreSQL hosted on Railway.app.
    *   PostgreSQL queries handled via TypeORM migrations.
    *   Cloudinary for image storage and processing.

*   **Additional Tools:**

    *   Cursor: Advanced IDE for AI-powered coding and real-time suggestions.
    *   Lovable: AI service to support front-end and full-stack web app generation.

## 6. Non-Functional Requirements

*   **Performance:**

    *   Ensure fast response times for both API calls and WebSocket communications.
    *   Auto-scroll and seamless real-time updates in the chat interface.

*   **Security:**

    *   Use HTTPS for all communications.
    *   Secure JWT tokens with appropriate expiration.
    *   Implement rate limiting on login attempts.
    *   Sanitize all user inputs on the server side.

*   **Usability:**

    *   Simple and colorful user interface catering to children as well as adults.
    *   Responsive design for desktop, mobile, and tablet.

*   **Compliance:**

    *   Adhere to best practices for data encryption and secure storage of sensitive information.
    *   Ensure proper error handling and feedback in the user interface.

## 7. Constraints & Assumptions

*   The application relies on users being pre-registered by an administrator using a CLI script.
*   It assumes the availability and stable performance of external services such as Cloudinary and Railway.app.
*   The system requires a stable Internet connection since there is no robust offline handling mechanism implemented.
*   It is assumed that all users will log in using the provided pre-registered credentials and that there is no need for additional roles or permission levels.
*   The chat application is designed with a focus on simplicity and ease of use, avoiding advanced logging or reconnection strategies.

## 8. Known Issues & Potential Pitfalls

*   API rate limits may affect login or image upload endpoints if not properly managed. Implementing basic rate limiting can help mitigate this.
*   The reliance on external services (Railway.app, Cloudinary) makes the system dependent on their uptime and performance. Monitoring service status is advisable.
*   Image processing could experience delays if the uploaded image exceeds the expected size; ensure resizing/shrinking processes are optimized.
*   There is no built-in robust mechanism for offline handling or reconnection. Users with unstable networks might face temporary disconnections.
*   Ensuring that the UI remains intuitive as message volume grows may require periodic performance and usability testing.

This detailed PRD covers the primary requirements for the Family Chat Application. The document should serve as the main reference for all subsequent technical documents, ensuring that there is a clear, unambiguous foundation for building the system end-to-end.
