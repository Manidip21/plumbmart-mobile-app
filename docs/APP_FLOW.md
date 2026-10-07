\# PlumbMart — Application Flow



\## 1. Overall Application Flow



```text

PLUMB MART

│

OTP LOGIN

│

┌───────────────┼────────────────┐

│ │ │

CUSTOMER DEALER PLUMBER

│ │ │

▼ ▼ ▼

Dashboard Verification Dashboard

│ │ │

▼ ▼ ┌───────┼────────┐

Categories Dashboard │ │ │

│ │ Activities Orders Profile

▼ ▼ │

Products Products Notifications

│ │

▼ ▼

Product Details Price + Stock

│ │

▼ ▼

Cart Cart

│ │

▼ ▼

Checkout Checkout

│ │

Direct Payment ┌────┼──────────┐

│ │ │ │

▼ Upfront Credit 30 Credit 90

Orders

│

▼

Order Tracking

```



\---



\## 2. Customer Flow



```text

OTP Login

↓

Customer Dashboard

↓

Categories

↓

Products

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

```



\### Customer Business Rules



\* Customer authentication is OTP based.

\* New customers can register using their mobile number.

\* Customers can view product name, description, price and category.

\* Product stock is not displayed to customers.

\* Customers can add products to the cart.

\* Customers can checkout using Direct Payment.

\* Customer orders can be viewed after checkout.

\* Order tracking displays the current order status returned by the backend.



\---



\## 3. Dealer Flow



```text

OTP Login

↓

Dealer Verification

↓

Dealer Dashboard

↓

Products

↓

Product Details

↓

View Price + Available Stock

↓

Add to Cart

↓

Cart

↓

Checkout

↓

┌───────────────┬────────────────┬────────────────┐

│ │ │

Upfront Credit 30 Credit 90

│ │ │

└───────────────┴────────────────┘

↓

Order Confirmation

```



\### Dealer Business Rules



\* Dealer login requires a registered and verified dealer account.

\* Dealers can view product pricing and available stock.

\* Dealers can add products to the cart.

\* Upfront payment is available to dealers.

\* 30-day credit is available only when the dealer has `credit30Eligible = true`.

\* 90-day credit is available only when the dealer has `credit90Eligible = true`.

\* Credit eligibility is enforced by the backend and is not based only on mobile UI visibility.

\* Stock is validated again during checkout before creating the order.



\---



\## 4. Plumber Flow



```text

OTP Login

↓

Plumber Dashboard

│

├── Assigned Activities

│

├── Orders

│ ↓

│ Order Details

│

├── Notifications

│

└── Profile

```



\### Plumber Functionality



\* OTP based login.

\* Plumber-specific dashboard.

\* Assigned activity overview.

\* Order listing and order details.

\* Profile information.

\* Notifications overview.



> The activity and notification sections are implemented as MVP demonstration data. A production implementation would connect these sections to backend APIs and real assignment/notification records.



\---



\## 5. Admin Flow



```text

Admin Login

↓

Admin Dashboard

│

├── User Management

├── Dealer Verification

├── Plumber Management

├── Product Management

├── Order Management

├── Payment Management

├── Dealer Credit Eligibility

└── Reports

```



The Admin dashboard is implemented as an MVP management overview covering the required administrative areas.



A production implementation would connect each section to dedicated CRUD, approval and reporting APIs.



\---



\## 6. Customer vs Dealer



| Capability | Customer | Dealer |

| -------------------- | -------- | ------------------------------------------ |

| OTP Login | Yes | Yes |

| Account Registration | Yes | Dealer account must be registered/verified |

| View Products | Yes | Yes |

| View Price | Yes | Yes |

| View Stock | No | Yes |

| Add to Cart | Yes | Yes |

| Direct Payment | Yes | Yes |

| Upfront Payment | No | Yes |

| 30-Day Credit | No | Only if eligible |

| 90-Day Credit | No | Only if eligible |

| Order History | Yes | Yes |



\---



\## 7. Backend and API Flow



```text

React Native Mobile App

│

│ HTTP / REST API

▼

Node.js + Express

│

├── Authentication

├── Products

├── Categories

├── Cart

├── Orders

└── Role-based Business Rules

│

▼

MySQL

```



\### Authentication



```text

Mobile Number

↓

Send OTP API

↓

OTP Verification API

↓

JWT Token

↓

AsyncStorage

↓

Authorization Header

↓

Protected APIs

```



\---



\## 8. Zoho Workbook Integration Architecture



```text

Zoho Workbook

│

│ Product / Price / Stock

▼

Backend Synchronization

Service

│

│ Validate + Map

▼

MySQL

│

▼

REST APIs

│

▼

React Native App

```



\### Role-based Data Visibility



```text

Zoho Workbook

↓

Backend Sync

↓

MySQL

↓

REST API

│

├── Customer → Product + Price

│

└── Dealer → Product + Price + Stock

```



The mobile application does not communicate directly with Zoho.



For the current MVP, the product catalogue is maintained in MySQL and exposed through backend APIs. The Zoho integration boundary is documented separately so that a production synchronization service can replace the catalogue source without requiring changes to the mobile application's API flow.



Live Zoho Workbook synchronization was not connected because no live Zoho Workbook/account credentials were provided for the assignment.



See `docs/ZOHO\_INTEGRATION.md` for the detailed integration design.



\---



\## 9. Role-based Architecture



```text

JWT Authentication

│

▼

User Role

│

┌────────────────┼────────────────┐

│ │ │

CUSTOMER DEALER PLUMBER

│ │ │

Customer UI Dealer UI Plumber UI

│ │ │

└────────────────┼────────────────┘

│

▼

Backend APIs

│

▼

Role Validation

│

▼

Business Rules

```



Role-based restrictions are handled at both the mobile UI level and backend/business-rule level where applicable.



\---



\## 10. Main End-to-End Flow



```text

LOGIN

↓

ROLE IDENTIFICATION

↓

ROLE-SPECIFIC DASHBOARD

↓

PRODUCT / ACTIVITY / ORDER FEATURES

↓

ROLE-SPECIFIC BUSINESS RULES

↓

CHECKOUT / ORDER MANAGEMENT

↓

BACKEND VALIDATION

↓

DATABASE UPDATE

↓

RESULT DISPLAYED IN MOBILE APP

```

