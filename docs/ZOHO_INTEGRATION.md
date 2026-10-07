# Zoho Workbook Integration

## Overview

PlumbMart is designed to use Zoho Workbook as the source for product
catalogue data.

The React Native application does not directly communicate with Zoho.

Instead, the backend acts as the integration layer.

## Architecture

Zoho Workbook
      |
      | Product / Price / Stock Data
      v
Backend Sync Service
      |
      v
MySQL Database
      |
      | REST APIs
      v
React Native Mobile App

## Data Flow

1. Product information is maintained in Zoho Workbook.
2. A backend synchronization process retrieves the latest product data.
3. The backend stores the synchronized data in MySQL.
4. The React Native application requests product data from the backend.
5. Customers can see product name, category and price.
6. Dealers can additionally see available stock.
7. Customers never receive stock information in the customer UI.

## Role-Based Product Visibility

### Customer

Customer receives:

- Product name
- Description
- Category
- Price
- Product availability for purchasing

Stock quantity is not exposed in the customer UI.

### Dealer

Dealer receives:

- Product name
- Description
- Category
- Price
- Available stock

This allows dealers to make purchasing decisions based on inventory.

## Recommended Backend Sync Design

A production implementation can use a scheduled backend job:

```text
Zoho Workbook
      ↓
Zoho API
      ↓
Sync Service
      ↓
Validate / Transform Data
      ↓
MySQL Products Table
      ↓
Mobile REST APIs