# Opiniona - Product Review System (Frontend)

This is the complete frontend application for the Opiniona Product Review System, built with React. It provides a modern, responsive user interface for users to browse products, submit reviews, and for administrators to manage the product catalog.

**You can find the backend repository here: [Opiniona-Backend](https://github.com/a-s-l-a-h/opiniona-backend)**

![Opiniona Homepage](docs/HomePage.png)

## About The Project

This application is designed to be a fast and intuitive interface that consumes a RESTful API from a Django backend. It features role-based access control, allowing for a public browsing experience, a logged-in user experience for reviewing, and a separate administrative experience for product management.

## Tech Stack

*   **React:** For building the user interface.
*   **Vite:** As the fast build tool and development server.
*   **Zustand:** For lightweight global state management (handling user authentication).
*   **Tailwind CSS:** For utility-first styling.
*   **React Router:** For client-side page routing.
*   **Axios:** For making asynchronous API requests to the backend.

## Features

### For All Users
*   Browse and view all products in a clean, grid-based layout.
*   View detailed information for a single product, including its description, price, and aggregated average rating.
*   Cycle through multiple product images in a simple carousel.
*   View all existing reviews for a product.

### For Authenticated Regular Users
*   Register for a new account.
*   Log in and out of the system.
*   Submit a rating (1-5 stars) and feedback for any product.
*   The system prevents a user from reviewing the same product more than once.

### For Admin Users (`is_staff=true`)
*   Conditionally rendered UI elements that are only visible to admins.
*   **Create Products:** Access a dedicated page to add new products.
*   **Update Products:** Edit a product's name, description, and price.
*   **Delete Products:** Permanently remove a product from the catalog with a confirmation step.
*   **Manage Images:** Upload new images and delete existing images for any product.

## Backend

This frontend is designed to work with the **Opiniona Django REST API**. The backend provides all the necessary endpoints for authentication, data retrieval, and product management.

**You can find the backend repository here: [Opiniona-Backend](https://github.com/a-s-l-a-h/opiniona-backend)**

---

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

*   Node.js (v18 or later recommended)
*   npm or yarn

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/opiniona-frontend.git
    ```

2.  **Navigate to the project directory:**
    ```bash
    cd opiniona-frontend
    ```

3.  **Install NPM packages:**
    ```bash
    npm install
    ```

4.  **Set up environment variables:**
    Create a new file named `.env` in the root of the project and add the following line. This tells the frontend where to find the backend API.
    ```env
    VITE_API_BASE_URL=http://127.0.0.1:8000/api
    ```

5.  **Run the development server:**
    Make sure your backend server is running first, then start the frontend.
    ```bash
    npm run dev
    ```

The application will be available at `http://localhost:5173` (or the port specified in your terminal).