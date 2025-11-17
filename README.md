# **Technologies Used**

• Framework: Next.js (App Router)  
• Language: TypeScript  
• Styling: Tailwind CSS (for responsive design)  
• State/UX: Custom React Hooks for data fetching and global notifications (toasts)


# **Setup & Installation**

## **1. Prerequisites**
The Backend API must be running successfully on `http://localhost:3000` before starting this application.

## **2. Project Clone and Dependencies**

# **Clone the repository**

`git clone https://github.com/Aayushnhk/Task-Management-Frontend`

`cd task-management-frontend`

# **Install dependencies**

`npm install`

3. Environment Configuration

Create a file named `.env.local` in the root directory.

    Variable	                         Description	                                       Value

NEXT_PUBLIC_API_BASE_URL	    URL of the running backend API	                     http://localhost:3000/

    PORT	             Frontend development server port (to avoid conflict)	                3001

4. Running the Application

Start the Next.js development server: npm run dev

The application will be available at http://localhost:3001.

Application Features

This application implements the following features:

•	User Flow: Responsive Login and Registration forms connecting directly to the API.

•	Secure Session: Custom client-side API layer manages storing the Access Token and automatically using the Refresh Token when the Access Token expires.

•	Task Dashboard: Displays the list of tasks retrieved from the backend.

•	Filtering & Searching: Includes UI elements to filter tasks by status and search tasks by title.

•	CRUD Forms: Implements UI and modals for Add, Edit, Delete, and Toggle task status.

•	Notifications: Shows pop-up notifications (toasts) for successful operations.

