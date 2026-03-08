# ProShop eCommerce Platform

A professional-grade, full-stack eCommerce application built with the **MVT (Model-View-Template)** architecture. This project integrates a **Django REST Framework** backend with a **React** frontend, featuring state management via **Redux Toolkit** and secure **JWT Authentication**.

## 👤 Developer Profile
**Penina Wanyama** *Data Scientist & IT Operations Professional*  
*MSc. Data Science, University of Nairobi*

---

## 🚀 Key Features

### **Customer Experience**
* **Product Discovery:** Advanced search functionality, pagination, and a "Top Rated" product carousel.
* **Shopping Cart:** Full cart logic with persistent local storage.
* **User Accounts:** Secure registration, login, and profile management.
* **Checkout Workflow:** Shipping address integration, payment method selection, and PayPal integration.

### **Administrative Dashboard (IT Ops & Management)**
* **User Administration:** Full CRUD (Create, Read, Update, Delete) capabilities for user accounts.
* **Role-Based Access:** Promote standard users to Admin status securely.
* **Order Oversight:** Centralized dashboard to view all store orders and mark them as "Delivered".
* **Database Maintenance:** Ability to delete "bad" or test orders to maintain data integrity.

---

## 🛠 Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React.js, Redux Toolkit, React-Bootstrap |
| **Backend** | Django, Django REST Framework (DRF) |
| **Database** | SQLite (Dev) → PostgreSQL (Prod) |
| **API Auth** | JWT (JSON Web Tokens) |
| **Icons** | FontAwesome (via `@fortawesome/react-fontawesome`) |

---

## 🏗 System Architecture (Production)



For production, the application is designed to be stateless:
* **Hosting:** Heroku Dynos for application logic.
* **Data:** Heroku Postgres for relational data storage.
* **Storage:** AWS S3 Bucket for persistent media/product image hosting (to bypass Heroku's ephemeral file system).

---

## 📦 Installation & Setup

### **1. Backend (Django)**
```bash
# Navigate to the backend directory
cd backend

# Install required packages
pip install -r requirements.txt

# Perform database migrations
python manage.py migrate

# Start the development server
python manage.py runserver

Gemini said
Certainly! Here is the complete, professional README.md for your project, formatted entirely in Markdown so you can copy and paste it directly into your file.

I've included your background as a Data Scientist and IT Operations professional to give the project more weight.

Markdown
# ProShop eCommerce Platform

A professional-grade, full-stack eCommerce application built with the **MVT (Model-View-Template)** architecture. This project integrates a **Django REST Framework** backend with a **React** frontend, featuring state management via **Redux Toolkit** and secure **JWT Authentication**.

## 👤 Developer Profile
**Penina Wanyama** *Data Scientist & IT Operations Professional*  
*MSc. Data Science, University of Nairobi*

---

## 🚀 Key Features

### **Customer Experience**
* **Product Discovery:** Advanced search functionality, pagination, and a "Top Rated" product carousel.
* **Shopping Cart:** Full cart logic with persistent local storage.
* **User Accounts:** Secure registration, login, and profile management.
* **Checkout Workflow:** Shipping address integration, payment method selection, and PayPal integration.

### **Administrative Dashboard (IT Ops & Management)**
* **User Administration:** Full CRUD (Create, Read, Update, Delete) capabilities for user accounts.
* **Role-Based Access:** Promote standard users to Admin status securely.
* **Order Oversight:** Centralized dashboard to view all store orders and mark them as "Delivered".
* **Database Maintenance:** Ability to delete "bad" or test orders to maintain data integrity.

---

## 🛠 Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React.js, Redux Toolkit, React-Bootstrap |
| **Backend** | Django, Django REST Framework (DRF) |
| **Database** | SQLite (Dev) → PostgreSQL (Prod) |
| **API Auth** | JWT (JSON Web Tokens) |
| **Icons** | FontAwesome (via `@fortawesome/react-fontawesome`) |

---

## 🏗 System Architecture (Production)



For production, the application is designed to be stateless:
* **Hosting:** Heroku Dynos for application logic.
* **Data:** Heroku Postgres for relational data storage.
* **Storage:** AWS S3 Bucket for persistent media/product image hosting (to bypass Heroku's ephemeral file system).

---

## 📦 Installation & Setup

### **1. Backend (Django)**
```bash
# Navigate to the backend directory
cd backend

# Install required packages
pip install -r requirements.txt

# Perform database migrations
python manage.py migrate

# Start the development server
python manage.py runserver
```
## 2. Frontend (React)

```
# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Install icon libraries
npm install @fortawesome/fontawesome-svg-core @fortawesome/free-solid-svg-icons @fortawesome/react-fontawesome

# Run the development server (Vite)
npm run dev
```