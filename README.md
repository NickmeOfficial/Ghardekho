# GharDekho Real Estate Platform

A modern real estate platform built with React, TypeScript, and TailwindCSS that allows users to browse, search, and manage property listings.

## Features

-   🏠 Property listing dashboard
-   🔍 Search and filter properties
-   ✏️ Edit property details
-   🗑️ Delete properties
-   ⭐ Mark properties as featured
-   💱 Multiple currency support
-   📱 Responsive design

## Tech Stack

-   **Frontend Framework**: React with TypeScript
-   **Styling**: TailwindCSS
-   **UI Components**: ShadcnUI
-   **State Management**: React Context API
-   **API Integration**: Fetch API
-   **Build Tool**: Vite

## Prerequisites

Before you begin, ensure you have the following installed:

-   Node.js (v14 or higher)
-   npm or yarn
-   Git

## Setup Instructions

1. **Clone the Repository**

    ```bash
    https://github.com/NickmeOfficial/Ghardekho.git
    cd Ghardekho
    ```

2. **Install Dependencies**

    ```bash
    npm install
    # or
    yarn install
    ```

3. **Environment Setup**

    - Create a `.env` file in the root directory

    ```env
    VITE_API_BASE_URL=http://localhost:3000
    ```

4. **Start Development Server**

    ```bash
    npm run dev
    # or
    yarn dev
    ```

5. **Build for Production**
    ```bash
    npm run build
    # or
    yarn build
    ```

## Project Structure

```
src/
├── components/       # Reusable UI components
│   └── ui/          # ShadcnUI components
├── contexts/        # React Context providers
├── types/          # TypeScript interfaces
├── pages/          # Page components
├── styles/         # Global styles
└── App.tsx         # Root component
```

## API Integration

The project expects a REST API with the following endpoints:

```
GET    /property              # List properties
GET    /property/:id         # Get single property
POST   /property            # Create property
PUT    /property/:id       # Update property
DELETE /property/:id      # Delete property
```
