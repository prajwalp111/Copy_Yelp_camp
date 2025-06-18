# ExploreHut 🏕️

ExploreHut is a full-stack campground listing web application where users can discover, review, and share their favorite camping spots. It is inspired by YelpCamp and built using Node.js, Express.js, MongoDB, and EJS templating.

🌐 **Live Demo:** [ExploreHut on Render](https://explorehut-pddl.onrender.com/campgrounds)

## 🚀 Features

- 📝 Users can **create, edit, and delete** campground listings
- 📸 Upload campground images
- 💬 Add and delete **reviews** for each campground
- 🔒 User **authentication** and **authorization**
- 🌍 Fully **responsive** design with Bootstrap 5
- 🌐 RESTful routes and **EJS templating engine**

## 🛠️ Technologies Used

- **Backend:** Node.js, Express.js, MongoDB, Mongoose
- **Frontend:** EJS, Bootstrap 5
- **Authentication:** Passport.js, bcrypt
- **Storage:** Cloudinary (image upload)
- **Deployment:** Render
- **Other:** Helmet.js (security), method-override, express-session, dotenv

## 📂 Folder Structure

```
ExploreHut/
├── models/            # Mongoose schemas
├── public/            # Static assets (CSS, JS, images)
├── routes/            # Express route handlers
├── views/             # EJS templates
├── utils/             # Custom utilities and error handling
├── app.js             # Main application file
├── package.json       
└── .env               # Environment variables (not committed)
```

## Setup Instructions

1. Clone the repository:
   ```bash
   git clone https://github.com/prajwalp111/Copy_Yelp_camp.git
   cd ExploreHut
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file and add the following:
   ```env
   DB_URL=your_mongodb_connection_string
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_KEY=your_key
   CLOUDINARY_SECRET=your_secret
   SECRET=your_session_secret
   ```

4. Run the development server:
   ```bash
   node app.js
   ```

5. Visit `http://localhost:5050` in your browser to view the application.

## ✅ To-Do

- Add search/filter functionality
- Improve mobile experience

## 📸 Screenshots

![Home Page](https://drive.google.com/file/d/1MGm0ox3m0kz-JS7TQ7uDWYEfJ1Lyp7GB/view?usp=sharing)
![Campground Show Page](https://drive.google.com/file/d/1MGm0ox3m0kz-JS7TQ7uDWYEfJ1Lyp7GB/view?usp=sharing)


> Created  Prajwal P and Team
