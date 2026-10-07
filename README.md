PlumbMart — Mobile App Development Assignment
A role-based React Native mobile application for plumbing products, purchasing, dealer credit, orders, and plumber activities.

Developed as part of the WayToWebs App Developer Task.


Project Overview
PlumbMart supports four application roles:

Customer — Browse products, purchase products, and track orders.
Dealer — Browse products with stock visibility and use approved credit options.
Plumber — View assigned activities, orders, notifications, and profile.
Admin — Access a demonstration dashboard covering management areas.
The application follows a mobile → REST API → database architecture.

React Native Mobile App
|
| REST API + JWT
v
Node.js / Express Backend
|
v
MySQL
^
|
Zoho Workbook
(sync boundary)

For the assignment MVP, MySQL is the working catalogue source. The Zoho integration architecture is documented separately.


Features
Customer
OTP login
Product catalogue
Product categories
Product details
Cart management
Direct payment checkout
Order confirmation
Order history
Order details and tracking
Stock hidden from customers
Dealer
OTP login
Dealer verification
Product catalogue
Price and stock visibility
Cart management
Upfront payment
30-day credit for eligible dealers
90-day credit for eligible dealers
Order creation
Plumber
OTP login
Verification-controlled access
Dashboard
Assigned activities
Orders
Order details
Notifications
Profile
Admin
The MVP includes a dashboard covering:

User Management
Dealer Verification
Product Management
Order Management
Payment Management
Dealer Credit
Plumber Management
Reports
The Admin dashboard is intentionally implemented as an MVP/wireframe rather than a complete enterprise administration portal.


Application Flows
Customer
OTP Login
↓
Dashboard
↓
Categories / Products
↓
Product Details
↓
Add to Cart
↓
Cart
↓
Checkout
↓
Direct Payment
↓
Order Confirmation
↓
Orders
↓
Order Tracking

Dealer
OTP Login
↓
Dealer Verification
↓
Dealer Dashboard
↓
Products
↓
Price + Stock
↓
Cart
↓
Checkout
↓
Upfront Payment
OR
Approved Credit
↓
Order Confirmation

Plumber
OTP Login
↓
Plumber Dashboard
├── Assigned Activities
├── Orders
├── Notifications
└── Profile


Customer vs Dealer
Feature
Customer
Dealer
OTP Login
Yes
Yes
Products
Yes
Yes
Product Price
Yes
Yes
Product Stock
Hidden
Visible
Cart
Yes
Yes
Direct Payment
Yes
No
Upfront Payment
No
Yes
30-Day Credit
No
Eligible dealers
90-Day Credit
No
Eligible dealers
Orders
Yes
Yes
The backend also enforces the role-specific rules, so restrictions are not dependent only on the mobile UI.


Technology Stack
Mobile
React Native CLI
JavaScript
React Navigation
Redux Toolkit
React Redux
Axios
AsyncStorage
React Native Safe Area Context
React Native Screens
Backend
Node.js
Express.js
Sequelize
MySQL
JWT
REST APIs
Testing / Development
Git
GitHub
Postman
Android physical-device testing

Authentication
Authentication is implemented using OTP-based login.

Endpoints
POST /api/auth/send-otp
POST /api/auth/verify-otp

For the assignment MVP, the OTP is mocked as:

123456

After successful verification, the backend returns a JWT containing the authenticated user's identity and role.

The mobile application:

Receives the JWT.
Stores authentication data using AsyncStorage.
Stores authentication state using Redux.
Automatically attaches the JWT to protected Axios requests.

Role-Based Verification
Customers can register/login using their mobile number.

Dealer and Plumber accounts require backend verification.

An unverified Dealer or Plumber is rejected during OTP verification.

This ensures that role-based access is controlled by the backend rather than only by the mobile application.


Dealer Credit Logic
Dealer credit eligibility is stored in the backend using:

credit30Eligible
credit90Eligible

During checkout:

Dealer selects CREDIT_30
↓
Backend checks credit30Eligible
↓
Eligible → Order allowed
Not eligible → Request rejected

The same validation is applied to 90-day credit.

The test Dealer account has 30-day credit enabled and 90-day credit disabled to demonstrate this business rule.


Product and Stock Rules
Customers receive:

Product
├── Name
├── Description
└── Price

Stock is hidden.

Dealers receive:

Product
├── Name
├── Description
├── Price
└── Available Stock

Stock is also validated by the backend during checkout.


API Overview
Authentication
POST /api/auth/send-otp
POST /api/auth/verify-otp

Products
GET /api/products
GET /api/products/:id
GET /api/products/categories

Cart
GET /api/cart
POST /api/cart/items
PUT /api/cart/items/:id
DELETE /api/cart/items/:id

Orders
POST /api/orders/checkout
GET /api/orders
GET /api/orders/:id

Protected endpoints use JWT authentication.


Zoho Integration
The requested catalogue integration is designed around the following architecture:

Zoho Workbook
↓
Backend Synchronization Service
↓
MySQL Catalogue
↓
REST API
↓
React Native App

The mobile application does not communicate directly with Zoho.

This keeps Zoho credentials and synchronization logic on the backend.

MVP Scope
The actual Zoho API synchronization is not connected in this assignment MVP because live Zoho credentials/workbook access were not provided.

Instead:

MySQL acts as the working catalogue source.
The integration boundary is documented.
The mobile application communicates only with the backend API.
A future Zoho synchronization service can update the backend catalogue without requiring changes to the mobile application.
Detailed documentation:

docs/ZOHO_INTEGRATION.md


Project Structure
PlumbMart/
│
├── backend/
│ └── src/
│ ├── controllers/
│ ├── models/
│ ├── routes/
│ └── ...
│
├── mobile/
│ └── PlumbMartMobile/
│ ├── App.js
│ └── src/
│ ├── config/
│ ├── navigation/
│ ├── screens/
│ ├── store/
│ └── utils/
│
├── docs/
│ └── ZOHO_INTEGRATION.md
│
└── README.md


Setup
Backend
Navigate to:

cd backend

Install dependencies:

npm install

Create:

backend/.env

Configure the required MySQL and JWT environment variables.

Start the backend using the project's configured start command.


Mobile
Navigate to:

cd mobile/PlumbMartMobile

Install dependencies:

npm install

Start Metro:

npm start

Run Android:

npm run android

The API base URL is configured in:

mobile/PlumbMartMobile/src/config/api.js

When testing on a physical Android device, the backend must be reachable using the computer's LAN IP address.


Demo Accounts
Role
Mobile
OTP
Customer
9876543211
123456
Dealer
9876543210
123456
Plumber
9876543212
123456
These are development/demo credentials used for assignment testing.

The Dealer account has:

30-day credit: Enabled
90-day credit: Disabled


Testing Performed
Authentication
Customer OTP login
Dealer OTP login
Plumber OTP login
Unverified Dealer/Plumber rejection
JWT authentication
Token persistence
Customer
Product listing
Category filtering
Product details
Add to cart
Quantity update
Remove from cart
Direct payment checkout
Order creation
Order history
Order details
Tracking display
Dealer
Dealer verification
Product listing
Stock visibility
Cart management
Upfront payment
30-day credit
30-day credit rejection when disabled
90-day credit rejection when disabled
Backend stock validation
Plumber
Dashboard
Assigned activities
Orders
Order details
Notifications
Profile
API
Backend APIs were tested during development using Postman.


MVP Limitations
The following areas are intentionally represented as MVP functionality:

OTP uses a mock OTP instead of a production SMS provider.
Zoho synchronization is documented but not connected to a live Zoho account.
Plumber activities use demonstration data.
Plumber notifications use demonstration data.
Admin functionality is represented through an MVP dashboard/wireframe.
Payment processing is represented through order/payment business logic rather than a live payment gateway.

Key Implementation Decisions
Backend business rules
Dealer verification, credit eligibility, and stock validation are enforced by the backend.

Shared mobile components
Customer and Dealer flows reuse common product, cart, and checkout screens where the business behavior overlaps.

Role-aware navigation
After authentication, the application routes the user according to the role returned by the backend.

Secure Zoho boundary
Zoho credentials and future synchronization logic are designed to remain on the backend.


Repository
GitHub:

https://github.com/Manidip21/plumbmart-mobile-app


Assignment Status
PlumbMart MVP — Completed

The repository contains the React Native application, backend APIs, role-based business logic, authentication, database models, and supporting documentation for the assignment.