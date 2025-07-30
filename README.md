# React Blog Frontend

This is a simple blog application frontend built with **Next.js** and styled using **Tailwind CSS**. It connects to a Laravel API backend for managing blog posts.

# TO RUN FRONTEND MUST RUN BLOG POST PROJECT FOR BACKEND
https://github.com/shohorab-shanto/blog_posts
**Create a `.env.local` file:**
Inside `.env.local`, add the following line, replacing `http://localhost:8000/api` with the actual base URL of your Laravel API.

## Features

* **Public Blog Interface:** Displays a list of blog posts with pagination and search functionality.

* **Admin Dashboard:** A dedicated panel for creating, editing, and deleting blog posts.

* **Server-Side Pagination:** Efficiently fetches and displays posts from the backend, handling pagination on the server.

* **API Integration:** Connects seamlessly with a Laravel API for all data operations.

* **Responsive Design:** Optimized for various screen sizes using Tailwind CSS.

* **Slug Auto-generation:** Automatically generates URL-friendly slugs for blog posts if not provided manually in the admin panel.

* **Published At Field:** Allows setting a specific publication date and time for posts.

## Installation and Setup

To get this project up and running on your local machine, please follow these steps:

### 1. Obtaining the Project Files

You can get the project files by cloning its Git repository (if available) or by downloading a compressed archive.

* **Via Git (Recommended):** If the project is hosted on a platform like GitHub, GitLab, or Bitbucket, you can clone the repository using Git:

    ```
    git clone [repository-url]
    cd react-blog-frontend
    ```

    Replace `[repository-url]` with the actual URL of your project's Git repository.

* **Direct Download:** If you've received the project as a `.zip` or `.tar.gz` file, simply extract its contents to your desired directory.

### 2. Prerequisites

Before you start, make sure you have the following installed on your computer:

* **Node.js**: This includes npm (Node Package Manager). You can download it from [nodejs.org](https://nodejs.org/). It's recommended to use the LTS (Long Term Support) version.

* **npm** or **Yarn**: npm comes with Node.js. If you prefer Yarn, you can install it globally: `npm install -g yarn`.

### 5. Install Dependencies

While still in your `react-blog-frontend` directory in the terminal, install the project's dependencies:

```
npm install
# or if you use yarn
yarn install
```

### 6. Run the Development Server

After the dependencies are installed, you can start the Next.js development server:

```
npm run dev
# or if you use yarn
yarn dev
```

### 7. Access Your Project

Once the server starts (it might take a moment), you'll see a message in your terminal indicating the address. Typically, it will be:

* **Public Blog Frontend:** Open your web browser and go to `http://localhost:3000`

* **Admin Panel (Demo):** Click the "Go to Admin Panel" button on the homepage, or directly go to `http://localhost:3000/admin`

You should now see the blog frontend with its demo posts and be able to navigate to the admin panel to add, edit, or delete posts (these changes will be in-memory for the demo).

## Backend API Base URL Configuration

This frontend application communicates with a backend API (presumably a Laravel application). To tell the frontend where your backend API is located, you **must configure the `NEXT_PUBLIC_API_BASE_URL` environment variable**.

### Steps:

1.  **Create a `.env.local` file:**
    In the **root directory** of this `react-blog-frontend` project (where your `package.json` is located), create a new file named `.env.local`.

2.  **Add the API Base URL:**
    Inside `.env.local`, add the following line, replacing `http://localhost:8000/api` with the actual base URL of your Laravel API.

    ```
    NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api
    ```

    * **Important:** The `NEXT_PUBLIC_` prefix is essential. It makes the variable accessible in the browser (client-side code).

    * **Note:** If your Laravel API's routes are prefixed with `/api` (as indicated by your `api.php` routes), it's good practice to include `/api` in this base URL to keep your frontend fetch calls cleaner (e.g., just `/blogs` instead of `/api/blogs`).

3.  **Restart the Development Server:**
    After creating or modifying `.env.local`, you **must restart your Next.js development server** for the changes to take effect.

    ```
    npm run dev
    # or
    yarn dev
    ```

## API Endpoints (Backend Reference)

This frontend expects the following API endpoints from your Laravel backend:

* `GET /api/blogs`: Fetch all blog posts (supports pagination with `?page=X` and optional search with `?search=query`).

* `GET /api/blogs/{id}`: Fetch a single blog post by ID.

* `POST /api/blogs`: Create a new blog post. Expects `title`, `content`, `slug`, and `published_at` (optional) in the request body.

* `PUT /api/blogs/{id}`: Update an existing blog post by ID. Expects `title`, `content`, `slug`, and `published_at` (optional) in the request body.

* `DELETE /api/blogs/{id}`: Delete a blog post by ID.

## Admin Panel

The admin panel is accessible at `http://localhost:3000/admin`.
It allows you to:

* **Create New Posts:** Fill out the form with a title, optional slug (auto-generated if empty), publication date/time, and content.

* **Edit Existing Posts:** Click the "Edit" button next to a post to populate the form and update its details.

* **Delete Posts:** Click the "Delete" button to remove a post.

* **Search Posts:** Filter the list of posts by title or content.

* **Paginate Posts:** Navigate through pages of posts fetched from the backend.

## Troubleshooting

* **"Field 'slug' doesn't have a default value" error:**
    This error means your Laravel backend is not receiving or processing the `slug` field.

    * **Frontend:** Ensure you are using the latest `components/AdminContent.tsx` code which includes the slug input and auto-generation.

    * **Backend (Laravel):**

        * Verify `slug` is in your `BlogPost` model's `$fillable` array.

        * Ensure `slug` is included in the validation rules for `store` and `update` methods in your `BlogApiController`.

        * Confirm your database migration for `blog_posts` table defines `slug` as a non-nullable string (e.g., `->string('slug')->unique();`).

* **CORS Errors (Cross-Origin Resource Sharing):**
    If your frontend (e.g., `http://localhost:3000`) and backend (e.g., `http://localhost:8000`) are on different origins, you might encounter CORS errors.

    * **Backend (Laravel):** You need to configure CORS in your Laravel application to allow requests from your frontend's origin. Laravel typically uses the `fruitcake/laravel-cors` package. You can configure allowed origins, methods, and headers in `config/cors.php`.

* **"API_BASE_URL is not defined..." error:**
    This indicates that the `NEXT_PUBLIC_API_BASE_URL` environment variable is not correctly set or recognized.

    * **Frontend:** Double-check that you have a `.env.local` file in the root of your Next.js project and that `NEXT_PUBLIC_API_BASE_URL` is defined within it.

    * **Restart:** Always restart your Next.js development server (`npm run dev`) after making changes to `.env.local`.
