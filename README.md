# LoomLink

LoomLink is a web application that allows users to upload images and convert them into shareable links. This project is built using the MERN stack (MongoDB, Express.js, React, Node.js) and Firebase Cloud for image storage.

## Table of Contents
- [Features](#features)
- [Demo](#demo)
- [Installation](#installation)
- [Usage](#usage)
- [Technologies Used](#technologies-used)
- [Contributing](#contributing)
- [Acknowledgements](#acknowledgements)

## Features
- User-friendly interface for uploading images
- Generates shareable links for uploaded images
- Secure and efficient image storage using Firebase Cloud
- Responsive design for optimal viewing on all devices

## Demo
You can access the live demo of the project deployed on Vercel: [LoomLink Demo](https://loomlink.vercel.app)

## Installation

### Prerequisites
Before you begin, ensure you have met the following requirements:
- Node.js and npm installed on your machine
- MongoDB set up locally or using a cloud service like MongoDB Atlas
- Firebase account for storing images

### Steps
1. **Clone the repository:**
    ```bash
    git clone https://github.com/AKASH-KUMAR-R/loomlink.git
    cd loomlink
    ```

2. **Install server dependencies:**
    ```bash
    cd backend
    npm install
    ```

3. **Install client dependencies:**
    ```bash
    cd ../frontend
    npm install
    ```

4. **Set up Firebase:**
    - Create a Firebase project and enable Firestore and Firebase Storage.
    - Create a `.env` file in the `backend` directory and add your Firebase configuration and MongoDB URI:
      ```env
      PORT=preferred_port
      MONGODB_URL=your_mongodb_uri
      PROJECT_ID=your_firebase_project_id
      PRIVATE_KEY_ID=your_firebase_private_key_id
      PRIVATE_KEY=your_firebase_private_key
      CLIENT_EMAIL=your_firebase_client_email
      CLIENT_ID=your_firebase_client_id
      AUTH_URL=your_firebase_auth_url
      TOKEN_URL=your_firebase_token_url
      AUTH_PROVIDER_X509_CERT_URL=your_firebase_auth_provider_x509_cert_url
      CLIENT_X509_CERT_URL=your_client_x509_cert_url
      UNIVERSE_DOMAIN=universe_domain_in_firebase_config_file
      STORAGE_BUCKET=your_firebase_cloud_storage_bucket
      ```

5. **Run the development server:**
    ```bash
    cd ../backend
    npm run dev
    ```

6. **Run the React client:**
    ```bash
    cd ../frontend
    npm start
    ```

The application should now be running on `http://localhost:3000`.

## Usage
1. Open the application in your browser.
2. Use the interface to upload an image.
3. Copy the generated link to share your image.

## Technologies Used
- **Frontend:** React.js
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Image Storage:** Firebase Cloud
- **Deployment:** Vercel

## Contributing
Contributions are welcome! Please follow these steps to contribute:
1. Fork the repository.
2. Create a new branch (`git checkout -b feature/YourFeature`).
3. Commit your changes (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature/YourFeature`).
5. Open a pull request.

## Acknowledgements
- [React](https://reactjs.org/)
- [Node.js](https://nodejs.org/)
- [Firebase](https://firebase.google.com/)
- [Vercel](https://vercel.com/)

---

Feel free to reach out if you have any questions or suggestions.
