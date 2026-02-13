

## 📝 Blogging Web Application

This is a **React-based Blogging Application** that enables users to create blog posts with **text, images, and videos**. The app integrates cloud services for authentication, database management, and media storage to provide a smooth and scalable blogging experience.

---

## 🚀 Features

* User authentication (Login)
* Create blog posts with:

  * Text content
  * Image uploads
  * Video uploads
* Cloud-based media storage
* Real-time post rendering
* Simple and clean UI
* Modular React component structure

---

## 🛠️ Tech Stack

* **Frontend:** React JS, CSS
* **Authentication & Database:** Firebase
* **Media Storage:** Cloudinary
* **Language:** JavaScript

---

## 📂 Project File Structure

```
src/
│
├── login/
│   ├── Login.jsx
│   └── Login.css
│
├── pages/
│   ├── Home.jsx
│   ├── Home.css
│   ├── CreatePost.jsx
│   └── CreatePost.css
│
├── .env
├── App.js
├── App.css
├── App.test.js
├── firebase-config.js
├── index.js
├── index.css
├── logo.svg
├── reportWebVitals.js
└── setupTests.js
```

---

## 🔧 Configuration & Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
```

---

### 2️⃣ Install Dependencies

```bash
npm install
```

---

### 3️⃣ Firebase Configuration

Update the **`firebase-config.js`** file with your Firebase project credentials:

```js
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

export const app = initializeApp(firebaseConfig);
```

> 🔹 Create a Firebase project
> 🔹 Enable **Authentication** and **Firestore Database**

---

### 4️⃣ Cloudinary Setup

Update the **`.env`** file with your Cloudinary credentials:

```env
REACT_APP_CLOUDINARY_CLOUD_NAME=your_cloud_name
REACT_APP_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
```

> 🔹 Create a Cloudinary account
> 🔹 Create an upload preset
> 🔹 Enable image & video uploads

---

### 5️⃣ Run the Application

```bash
npm start
```

The app will run at:

```
http://localhost:3000
```

---

## 📸 Application Pages

* **Login Page:** User authentication
* **Home Page:** Displays all blog posts
* **Create Post Page:** Create posts with text, images, and videos

---

## 🧠 Application Workflow

1. User logs in using Firebase Authentication
2. User creates a post via the Create Post page
3. Media files are uploaded to Cloudinary
4. Post metadata is stored in Firebase
5. Home page dynamically displays posts

---

## 🔮 Future Enhancements

* Edit and delete posts
* User profile management
* Like and comment system
* Post categories and tags
* Rich text editor
* Role-based access control

---

## 📜 License

This project is developed for **learning and academic purposes**.
You are free to modify and enhance it.


