# QR Opinion - Customer Feedback via QR Codes

A SaaS application that allows businesses to collect customer feedback through QR codes.

## Features

- Create and customize surveys
- Generate QR codes linked to surveys
- Collect and analyze customer feedback
- Dashboard with analytics and insights
- Subscription plans with different features

## Tech Stack

- **Frontend**: React, Tailwind CSS, Chart.js
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Authentication**: JWT

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- MongoDB

### Installation

1. Clone the repository
    git clone https://github.com/yourusername/qr-opinion.git
    cd qr-opinion
2. Install backend dependencies
   cd backend
   npm install
3. Install frontend dependencies
   cd ../frontend
   npm install
4. Set up environment variables
- Create `.env` file in the backend directory with:
  ```
  NODE_ENV=development
  PORT=5000
  MONGO_URI=mongodb://localhost:27017/qr_opinion
  JWT_SECRET=your_jwt_secret_key_here
  JWT_EXPIRE=30d
  FRONTEND_URL=http://localhost:3000
  ```
- Create `.env` file in the frontend directory with:
  ```
  REACT_APP_API_URL=http://localhost:5000/api
  ```

### Running the Application

1. Start the backend server
   cd backend
   npm run dev
2.  Start the frontend development server
    cd frontend
    npm start
3. Open your browser and navigate to `http://localhost:3000`

## Deployment

Instructions for deploying to production will be added soon.

## License

This project is licensed under the MIT License.