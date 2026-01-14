# Arkisanté Ecommerce and Admin Dashboard

This project represents an extended ecommerce experience developed for Arkisanté Architecture, combining a product catalog, shopping cart, product review system, and an administrative dashboard for stock and analytics management.

The application is built with vanilla HTML, CSS, and JavaScript on the front end, and it relies on a separate backend server to provide product data, reviews, purchases, and inventory updates.

## Project Overview

The purpose of this project is to:

* Simulate a complete ecommerce flow integrated into an institutional architecture website
* Allow users to browse products, view detailed project pages, and submit reviews
* Manage a shopping cart with business rules and stock validation
* Provide an admin dashboard with real time charts and inventory control
* Demonstrate front end logic, state handling, and API integration using pure JavaScript

This project focuses on usability, visual consistency, and realistic ecommerce behavior without the use of frameworks.

## Key Features

* Product Listing Page with dynamic rendering from API data
* Product Details Page with image, description, stock status, and reviews
* Star based Review System with visual interaction and persistence
* Shopping Cart with localStorage state management
* Business Rule enforcement for exclusive product categories
* Admin Dashboard with analytics charts using Chart.js
* Inventory Management with real time stock updates
* Fully Responsive Layout for mobile, tablet, and desktop devices

## Technologies Used

* HTML5 with semantic structure
* CSS3
    * CSS Grid and Flexbox for layout
    * Media Queries for responsive behavior
    * Custom variables for colors and typography
    * Component based styling for ecommerce and admin sections
* JavaScript ES6
    * Fetch API for server communication
    * DOM manipulation and event handling
    * LocalStorage for cart persistence
* Chart.js for data visualization
* Google Fonts and Material Symbols for UI consistency

## Project Structure

The project is divided into three main areas:

* Ecommerce storefront
    * Product listing
    * Cart sidebar
    * Checkout simulation
* Product details
    * Dynamic product rendering
    * Review submission and display
* Admin dashboard
    * Sales sentiment visualization
    * Stock per product charts
    * Inventory management controls

All data interactions depend on a backend API.

## How to Run the Project

This front end requires a backend server to function correctly.

1. Clone or download this repository
2. Clone and run the server from the separate repository:
   https://github.com/bellamarcucci/retail-dashboard-app-server
3. Start the backend server on localhost port 3000
4. Open `ecommerce.html` or `admin.html` in your browser

Without the server running, the application will display fallback messages and mock behavior.

## Author

This project was designed and developed by:

Isabella Marcucci

Responsibilities and contributions:

* Front end architecture and implementation
* Ecommerce logic and cart management
* Product detail and review system
* Admin dashboard layout and logic
* API integration and error handling
* Responsive design and UX decisions

## License

This project is intended for educational and portfolio purposes only.
The code and structure may not be reused for commercial applications without authorization.
