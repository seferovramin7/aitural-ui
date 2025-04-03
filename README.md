# Car Suggestion UI

A simple Vue.js web application with a ChatGPT-like interface for car suggestions.

## Features

- ChatGPT-like interface for entering car requirements
- Displays car suggestions in a carousel
- Responsive design for mobile and desktop
- Integration with the car suggestion API

## Development Setup

### Prerequisites

- Node.js (v14 or later)
- npm or yarn

### Installation

1. Clone the repository
2. Navigate to the project directory
3. Install dependencies:

```bash
npm install
```

### Running the Development Server

```bash
npm run dev
```

This will start the development server at http://localhost:3000.

## Building for Production

```bash
npm run build
```

This will create a `dist` directory with the built application.

## Docker

### Building the Docker Image

```bash
docker build -t car-suggestion-ui .
```

### Running with Docker

```bash
docker run -p 80:80 car-suggestion-ui
```

## Docker Compose

The application can be run together with the backend using Docker Compose:

```bash
cd ..  # Go to the root directory of the project
docker-compose up -d
```

This will start:
- The frontend at http://localhost
- The backend at http://localhost:8080
- MongoDB at localhost:27017

## API Integration

The application communicates with the backend API at `/api/cars/suggestion` to get car suggestions based on user input. 