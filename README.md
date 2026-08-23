# Vivek Rana --- MERN Stack Developer Portfolio

```{=html}
<p align="center">
```
`<strong>`{=html}A modern, full-stack developer portfolio with a dynamic
Admin Dashboard.`</strong>`{=html}
```{=html}
</p>
```
```{=html}
<p align="center">
```
React • Node.js • Express.js • MongoDB • Cloudinary • JWT
```{=html}
</p>
```

------------------------------------------------------------------------

## 📌 Overview

This is a full-stack personal portfolio website built to showcase my
professional profile, technical skills, experience, education,
certifications, projects, and contact information.

The project goes beyond a static portfolio by providing a **CMS-style
Admin Dashboard** backed by MongoDB. Portfolio content can be managed
dynamically instead of keeping the main profile data hard-coded in the
frontend.

### Project Structure

``` text
my-portfolio-mern/
├── Frontend/     # React + Vite frontend
├── Backend/      # Node.js + Express REST API
└── README.md
```

------------------------------------------------------------------------

## ✨ Features

### 🌐 Public Portfolio

-   Responsive portfolio website
-   Hero section
-   About section
-   Skills showcase
-   Professional experience
-   Education
-   Certifications
-   Projects
-   Contact section
-   Social links
-   Availability badge
-   Responsive desktop/tablet/mobile UI
-   Modern animations and interactive elements
-   Light/dark themed UI styling

### 🧑‍💻 Admin Dashboard

Authenticated admin users can manage:

-   Profile information
-   Hero section
-   About section
-   Contact information
-   Social links
-   Experience
-   Education
-   Skills
-   Projects
-   Certifications
-   Resume
-   Profile image
-   SEO settings
-   Portfolio visibility
-   Site settings
-   Portfolio reset/delete operations

### 📄 Resume Management

Resume handling is integrated with the backend instead of depending on a
hard-coded frontend PDF.

``` text
Admin Dashboard
      ↓
PDF Upload
      ↓
Multer Validation
      ↓
Cloudinary RAW Storage
      ↓
MongoDB Resume Metadata
      ↓
Public Resume Endpoint
      ↓
View / Download
```

The resume is stored on Cloudinary and its metadata is maintained in
MongoDB.

### ☁️ Cloudinary

Cloudinary is used for uploaded media such as:

-   Resume PDFs
-   Profile images
-   Certificate images
-   Other supported uploads

### 🔐 Authentication

Protected admin APIs use JWT authentication.

The frontend Axios instance automatically attaches the stored JWT as:

``` http
Authorization: Bearer <token>
```

### 🗄️ MongoDB

MongoDB + Mongoose stores dynamic portfolio content including:

-   Hero
-   About
-   Contact
-   Social Links
-   Resume
-   Experience
-   Education
-   Skills
-   SEO
-   Settings

------------------------------------------------------------------------

## 🛠️ Tech Stack

### Frontend

-   React
-   Vite
-   JavaScript
-   Tailwind CSS
-   Axios
-   React Icons
-   React Toastify

### Backend

-   Node.js
-   Express.js
-   MongoDB
-   Mongoose
-   JWT
-   Multer
-   Cloudinary
-   CORS
-   dotenv

### Tools

-   Git
-   GitHub
-   VS Code
-   Postman
-   MongoDB Atlas
-   Cloudinary

------------------------------------------------------------------------

## 🏗️ Architecture

``` text
                    ┌─────────────────────┐
                    │   Public Visitors   │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │ React + Vite        │
                    │ Frontend            │
                    └──────────┬──────────┘
                               │ Axios
                               ▼
                    ┌─────────────────────┐
                    │ Express REST API    │
                    │ Backend             │
                    └───────┬───────┬─────┘
                            │       │
                ┌───────────┘       └───────────┐
                ▼                               ▼
       ┌─────────────────┐             ┌─────────────────┐
       │ MongoDB Atlas   │             │ Cloudinary      │
       │ Portfolio Data  │             │ Uploaded Media  │
       └─────────────────┘             └─────────────────┘

                    ┌─────────────────────┐
                    │ Admin Dashboard     │
                    │ JWT Protected APIs  │
                    └─────────────────────┘
```

------------------------------------------------------------------------

## 📂 Project Structure

``` text
my-portfolio-mern/
│
├── Frontend/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── admin/
│   │   │   ├── layout/
│   │   │   ├── sections/
│   │   │   └── ui/
│   │   ├── pages/
│   │   ├── utils/
│   │   └── main.jsx
│   │
│   ├── public/
│   ├── .env.example
│   └── package.json
│
├── Backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── uploads/
│   ├── .env.example
│   ├── server.js
│   └── package.json
│
└── README.md
```

------------------------------------------------------------------------

## 🔌 API Structure

### Portfolio

``` text
GET    /api/portfolio
PUT    /api/portfolio

PUT    /api/portfolio/hero
PUT    /api/portfolio/about
PUT    /api/portfolio/contact
PUT    /api/portfolio/social-links
PUT    /api/portfolio/experience
PUT    /api/portfolio/education
PUT    /api/portfolio/seo
PUT    /api/portfolio/settings
```

### Resume

``` text
POST   /api/portfolio/upload/resume
GET    /api/portfolio/upload/resume
GET    /api/portfolio/upload/resume/info
GET    /api/portfolio/resume/public
```

### Profile Image

``` text
POST   /api/portfolio/upload/profile-image
POST   /api/portfolio/profile-image
DELETE /api/portfolio/profile-image
```

### Other APIs

``` text
/api/projects
/api/certificates
/api/contact
/api/auth
/api/settings
```

------------------------------------------------------------------------

## ⚙️ Prerequisites

Install the following before running the project:

-   Node.js
-   npm
-   MongoDB Atlas or another accessible MongoDB database
-   Cloudinary account
-   Git

------------------------------------------------------------------------

## 🚀 Installation

Clone the repository:

``` bash
git clone https://github.com/realvivekrana/my-portfolio-mern.git
cd my-portfolio-mern
```

> If the GitHub repository name is different, replace the URL with the
> correct repository URL.

### Backend

``` bash
cd Backend
npm install
npm run dev
```

The backend runs on:

``` text
http://localhost:5000
```

### Frontend

Open another terminal:

``` bash
cd Frontend
npm install
npm run dev
```

The Vite frontend normally runs on:

``` text
http://localhost:5173
```

------------------------------------------------------------------------

## 🔐 Environment Variables

### Backend

Create:

``` text
Backend/.env
```

Example:

``` env
NODE_ENV=development

PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret
JWT_EXPIRE=30d

ADMIN_PIN=your_admin_pin

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

FRONTEND_URL=http://localhost:5173
```

### Frontend

Create:

``` text
Frontend/.env
```

Example:

``` env
VITE_API_URL=http://localhost:5000/api
```

### ⚠️ Security

Never commit real credentials to GitHub.

Keep these private:

-   MongoDB credentials
-   JWT secret
-   Admin credentials/PIN
-   Cloudinary API secret
-   Production environment variables

Use `.env.example` files to document required variables.

------------------------------------------------------------------------

## 🧪 Testing

### Backend Health Check

Open:

``` text
http://localhost:5000/
```

The API should return a successful health response.

### Frontend

Open:

``` text
http://localhost:5173
```

### Postman

Use Postman to test:

-   Admin authentication
-   Portfolio APIs
-   Protected APIs
-   Resume upload
-   Project APIs
-   Certificate APIs
-   Contact APIs

------------------------------------------------------------------------

## 📄 Resume Upload Flow

``` text
1. Admin selects PDF
        ↓
2. Frontend sends multipart/form-data
        ↓
3. JWT authenticates admin
        ↓
4. Multer validates the file
        ↓
5. Backend uploads PDF to Cloudinary
        ↓
6. Cloudinary returns the uploaded resource
        ↓
7. MongoDB stores resume metadata
        ↓
8. Public endpoint generates the delivery URL
        ↓
9. Visitor can view/download the resume
```

The project is designed so the deployed application does not depend on a
local server filesystem for persistent resume storage.

------------------------------------------------------------------------

## 🔄 Dynamic Content Flow

``` text
Admin Dashboard
       ↓
JWT Protected API
       ↓
Express Controller
       ↓
Mongoose Model
       ↓
MongoDB
       ↓
GET /api/portfolio
       ↓
Public Portfolio
```

This allows portfolio content to be updated through the Admin Dashboard
without manually editing React components for every content change.

------------------------------------------------------------------------

## 📊 Dynamic Sections

  Section          Dynamic
  ---------------- ---------
  Hero             ✅
  About            ✅
  Contact          ✅
  Social Links     ✅
  Resume           ✅
  Experience       ✅
  Education        ✅
  Skills           ✅
  SEO              ✅
  Settings         ✅
  Projects         ✅
  Certifications   ✅

------------------------------------------------------------------------

## 🎨 UI Highlights

The frontend focuses on:

-   Clean developer-focused layout
-   Responsive design
-   Modern cards and sections
-   Animated hero experience
-   Floating technology badges
-   Dark/light themed styling
-   Accessible buttons and links
-   Mobile-friendly layouts
-   Clear calls-to-action
-   Professional developer portfolio presentation

The Hero section currently showcases technologies including React,
JavaScript, Node.js, Express, MongoDB, HTML5, CSS3, Tailwind CSS,
TypeScript, Next.js, Git, GitHub, Postman, and MySQL.
fileciteturn13file1L195-L277

------------------------------------------------------------------------

## 🌍 Deployment

The project is structured for separate frontend and backend deployment.

### Recommended Architecture

``` text
Frontend
   │
   └── Vercel
          │
          ▼
Backend
   │
   └── Render / Railway / Node hosting
          │
          ├── MongoDB Atlas
          │
          └── Cloudinary
```

### Frontend Production Environment

``` env
VITE_API_URL=https://your-backend-domain.com/api
```

### Backend Production Environment

``` env
NODE_ENV=production

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_production_jwt_secret
JWT_EXPIRE=30d

ADMIN_PIN=your_admin_pin

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

FRONTEND_URL=https://your-frontend-domain.vercel.app
```

Do not use `localhost` as the production API URL.

------------------------------------------------------------------------

## 🔒 Security Considerations

The project includes:

-   JWT-protected admin APIs
-   CORS configuration
-   Environment-based secrets
-   Protected resume flow
-   PDF upload validation
-   File-size limits
-   Direct PDF access protection
-   Separate frontend/backend deployment
-   No requirement to commit production credentials

------------------------------------------------------------------------

## 🚀 Future Improvements

Possible future enhancements:

-   Automated CI/CD pipeline
-   Automated unit/integration tests
-   Portfolio analytics
-   Visitor analytics
-   Blog/CMS module
-   Project filtering
-   Email notifications
-   Rate limiting
-   Refresh-token authentication
-   Automated database backups
-   Advanced image optimization

------------------------------------------------------------------------

## 👨‍💻 About Me

### Vivek Kumar Rana

MERN Stack Developer focused on building responsive, scalable, and
user-friendly web applications with modern JavaScript technologies.

### Core Technologies

``` text
HTML5
CSS3
JavaScript
React.js
Tailwind CSS
Node.js
Express.js
MongoDB
REST APIs
Git
GitHub
Postman
```

------------------------------------------------------------------------

## 🔗 Connect With Me

-   **GitHub:** https://github.com/realvivekrana
-   **LinkedIn:** https://www.linkedin.com/in/mrvivekrana/

------------------------------------------------------------------------

## 📜 License

This is a personal portfolio project.

If you reuse significant parts of the project structure or
implementation, please provide appropriate credit.

------------------------------------------------------------------------

```{=html}
<p align="center">
```
Built with ❤️ using React, Node.js, Express.js, MongoDB and Cloudinary.
```{=html}
</p>
```
