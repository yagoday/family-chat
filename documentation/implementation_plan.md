**Implementation Plan for Family Chat Application**

This plan is organized into five phases. Each step cites its relevant document section for clarity. We have revised the processing order to prioritize message functionality before integrating image uploading and Cloudinary.

## Phase 1: Environment Setup

1.  **Set up project repository and directories**

    *   Create a Git repository and add separate folders: `/frontend`, `/backend`, and `/scripts`.
    *   Create `main` and `dev` branches and enable branch protections.
    *   **Reference**: PRD Section 1

2.  **Initialize Node.js Express backend project with TypeScript**

    *   In `/backend`, run `npm init -y` and install TypeScript plus required type definitions.
    *   **Reference**: Implementation Plan (Phase 1: Setup & Backend)

3.  **Initialize React TypeScript frontend project**

    *   In `/frontend`, set up a React project with TypeScript (e.g., using `create-react-app --template typescript`).
    *   **Reference**: Implementation Plan (Phase 3: Frontend Development)

4.  **Create environment configuration files**

    *   For backend: Create `/backend/.env` for database URL, JWT secret, and client URL.
    *   For frontend: Create `/frontend/.env` for API base URL and Socket.io URL.
    *   **Reference**: PRD Section 5

5.  **Install backend dependencies**

    *   In `/backend`, install: `express`, `socket.io`, `typeorm`, `pg` (for PostgreSQL), `jsonwebtoken`, `bcrypt`, and their TypeScript types.
    *   **Reference**: Tech Stack Document

6.  **Install frontend dependencies**

    *   In `/frontend`, install: `axios`, `socket.io-client`, UI library (Material-UI or Tailwind CSS), and `emoji-mart`.
    *   **Reference**: Tech Stack Document

## Phase 2: Frontend Development

1.  **Create Login Page Component**

    *   Create `/frontend/src/components/Auth/LoginForm.tsx` implementing a simple username/password form with kid-friendly emojis and bright colors.
    *   **Reference**: Frontend Guidelines Document (Login Page)

2.  **Implement Authentication API Call**

    *   In `/frontend/src/services/api.ts`, set up an Axios POST request to `/api/auth/login` to validate credentials.
    *   **Reference**: PRD Section 4 (Authentication)

3.  **Add routing to handle login and chat views**

    *   In `/frontend/src/App.tsx`, implement routing that directs users to the Login page initially, then to the Chat interface after authentication.
    *   **Reference**: Implementation Plan (Phase 3: Frontend Development)

4.  **Build Chat Interface Components (Header, MessageList, InputArea)**

    *   Create components:

        *   `/frontend/src/components/Chat/Header.tsx` (includes logo, online indicator, and logout button)
        *   `/frontend/src/components/Chat/MessageList.tsx` and `/frontend/src/components/Chat/MessageItem.tsx` (displays chat history in a scrollable container)
        *   `/frontend/src/components/Chat/InputArea.tsx` (includes text input supporting emoji and a send button)

*   **Reference**: Frontend Guidelines Document (Chat Page Layout)

1.  **Integrate Emoji Picker into Message Input**

    *   In `/frontend/src/components/Chat/InputArea.tsx`, integrate `emoji-mart` to allow emoji selection.
    *   **Reference**: PRD Section 6 (Frontend Components)

2.  **Validate Login and Component Functionality**

    *   Run the React development server and manually test logging in with sample credentials; check that the chat UI loads for valid login.
    *   **Reference**: PRD Section 3 (User Flow)

## Phase 3: Backend Development

1.  **Set up Express Server with TypeScript**

    *   In `/backend/src/server.ts`, initialize an Express server and enable JSON body parsing.
    *   **Reference**: Implementation Plan (Phase 1: Setup & Backend)

2.  **Configure PostgreSQL with TypeORM**

    *   In `/backend/src/config/ormconfig.ts`, configure TypeORM to connect to the PostgreSQL database provided by Railway.app.
    *   Create migrations for the tables defined in the design document (Users and Messages).
    *   **Reference**: PRD Section 3 (Database Design)

3.  **Implement Authentication Endpoint**

    *   Create `/backend/src/routes/auth.ts` with a POST endpoint `/api/auth/login` which verifies user credentials using bcrypt and returns a JWT token and user info.
    *   **Reference**: PRD Section 4 (Authentication)

4.  **Develop Admin CLI Script for User Pre-Registration**

    *   Create `/backend/scripts/add-user.ts` that accepts command-line arguments, hashes the password using bcrypt, and inserts the user into the `users` table.
    *   **Reference**: PRD Section 3.2 (Pre-Registration Script)

5.  **Build Message Endpoints**

    *   Create `/backend/src/routes/messages.ts` to implement:

        *   GET `/api/messages` for retrieving chat history with pagination support (query params: `limit`, `before`).
        *   POST `/api/messages` for sending text messages.

    *   **Reference**: PRD Section 4.2 (Messages)

6.  **Implement Socket.io for Real-Time Communication**

    *   In `/backend/src/server.ts`, integrate Socket.io with Express to enable WebSocket connections.
    *   Apply an authentication middleware (`authenticateSocket`) that validates JWT tokens sent during the socket handshake.
    *   **Reference**: PRD Section 8 (Real-time Communication Implementation)

7.  **Implement Socket Event Handlers**

    *   In the Socket.io connection callback, implement event listeners for:

        *   'join_chat' (validate token and emit `user_joined`)
        *   'send_message' (save message to database and broadcast to all clients)
        *   'typing' (emit typing indicator to others)

    *   **Reference**: PRD Section 8.1 (Server Events)

8.  **Test API Endpoints and Socket Events**

    *   Use Postman or curl to test `/api/auth/login` and message endpoints. In addition, simulate a Socket.io client connection to validate real-time events.
    *   **Reference**: Implementation Plan (Phase 2: Core Functionality)

## Phase 4: Image Upload Integration (Postponed)

1.  **Implement Image Upload UI**

    *   Postponed until Phase 5.

2.  **Integrate Cloudinary for Image Processing**

    *   Postponed until Phase 5.

3.  **Test Image Upload Functionality**

    *   Postponed until Phase 5.

## Phase 5: Integration and Deployment

1.  **Connect Frontend with Backend Authentication**

    *   Update the frontend login form (in `/frontend/src/components/Auth/LoginForm.tsx`) to call the backend `/api/auth/login` endpoint via Axios.
    *   On successful login, store the JWT token in local storage and redirect to the chat interface.
    *   **Reference**: App Flow Document (User Authentication Flow)

2.  **Establish Frontend Socket.io Connection**

    *   In `/frontend/src/services/socket.ts`, initialize Socket.io-client using the stored JWT token for authentication.
    *   Ensure the client listens for `message`, `user_joined`, and other events to update the chat UI in real time.
    *   **Reference**: PRD Section 8.2 (Client Setup)

3.  **Validate End-to-End Communication Without Image Uploads**

    *   Manually test the flow by logging in, establishing a WebSocket connection, and sending text messages only. Verify that the backend processes and broadcasts messages correctly.
    *   **Reference**: Implementation Plan (User Flow and Core Features)

4.  **Configure Railway.app Deployments and Environment Variables**

    *   In Railway.app, set up deployments for backend and frontend along with a PostgreSQL database instance. Ensure environment variables (JWT secret, DB URL) are configured correctly.
    *   **Reference**: Implementation Plan (Phase 4: Deployment)

5.  **Deploy Backend and Run Database Migrations**

    *   Deploy the backend application and trigger TypeORM migrations to create the Users and Messages tables in PostgreSQL.
    *   **Reference**: PRD Section 3 (Database Design)

6.  **Build and Deploy Frontend Application**

    *   Create a production build of the React app and deploy it on Railway.app or as static assets hosted with CDN integration if needed.
    *   **Reference**: Implementation Plan (Phase 4: Deployment)

7.  **Final Integration Testing on Production Environment**

    *   Access the deployed URL, perform a login, send test messages, and verify that real-time communications function as expected.
    *   **Reference**: PRD Section 7 (User Flow)

8.  **Distribute Pre-Registered Credentials**

    *   Provide the pre-registered usernames and passwords to family members along with usage instructions.
    *   **Reference**: PRD Section 7 (User Authentication and Pre-Registration Process)

9.  **Integrate Cloudinary and Image Upload Features**

    *   Revisit image uploading and Cloudinary integration for resizing oversized JPEGs.

This concludes the step-by-step implementation plan for the Family Chat Application with postponed image upload features to ensure a timely launch. Phase 4 will commence upon the stability of the initial release with text messaging functionalities.
