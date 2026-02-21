# 📚 Folio Bookstore — Full Stack Web Application

A full-stack online bookstore built with Node.js, Express, MySQL, and Nginx, deployed on AWS using EC2 and RDS.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Application Features](#application-features)
4. [Project Structure](#project-structure)
5. [Building the Application](#building-the-application)
6. [Database Setup](#database-setup)
7. [AWS Infrastructure](#aws-infrastructure)
8. [Deploying to AWS](#deploying-to-aws)
9. [User Data Script](#user-data-script)
10. [Accessing the Application](#accessing-the-application)
11. [Troubleshooting](#troubleshooting)

---

## Project Overview

Folio is a curated online bookstore that allows users to browse books by category, view detailed product information, add books to a shopping cart, and place orders. The application is deployed on AWS with a decoupled frontend/backend architecture, a managed MySQL database on RDS, and Nginx as a reverse proxy.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | HTML, CSS, Vanilla JavaScript |
| Backend | Node.js, Express.js |
| Database | MySQL (AWS RDS) |
| Reverse Proxy | Nginx |
| Process Manager | PM2 |
| Cloud Provider | AWS (EC2 + RDS) |
| Version Control | Git + GitHub |

---

## Application Features

- Browse 18 books across 6 categories: NYT Bestsellers, Classics, Children's Books, Top 9, Social Justice, Fantasy
- Expandable/collapsible sidebar navigation
- Grid and list view toggle for the book gallery
- Product detail modal with genre, publication year, stock count, and description
- Add to cart with real-time cart count updates
- Cart page with quantity controls, item removal, and order summary
- Checkout with order confirmation modal and cart clearing
- REST API backend with MySQL for persistent data storage

---

## Project Structure

```
bookstore-infra/
└── bookstore/
    ├── frontend/
    │   ├── index.html              # Main SPA shell
    │   ├── css/
    │   │   └── styles.css          # All styles
    │   └── js/
    │       ├── books.js            # Book data
    │       └── app.js              # UI logic, cart, modals
    ├── backend/
    │   ├── server.js               # Express entry point
    │   ├── package.json
    │   ├── .env.example            # Environment variable template
    │   ├── config/
    │   │   └── db.js               # MySQL connection pool
    │   ├── controllers/
    │   │   ├── booksController.js  # Books API logic
    │   │   └── ordersController.js # Orders API logic
    │   └── routes/
    │       ├── books.js            # GET /api/books
    │       └── orders.js           # POST /api/orders
    ├── database/
    │   └── schema.sql              # DB schema + seed data
    └── nginx/
        └── folio.conf              # Nginx reverse proxy config
```

---

## Building the Application

### Prerequisites

Make sure you have the following installed locally:

- Node.js (v18+)
- npm
- MySQL
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/devops-timi/bookstore-infra.git
cd bookstore-infra/bookstore
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Create Environment File

```bash
cp .env.example .env
```

Edit `.env` with your local database credentials:

```env
PORT=3000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=3306
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_NAME=folio_bookstore
```

### 4. Run Locally

```bash
npm start
```

Open your browser at `http://localhost:3000`

---

## Database Setup

### Schema Overview

The database contains three tables:

```
books        → stores all book records with category, price, stock
orders       → stores placed orders with total and status
order_items  → stores individual items per order
```

### Import Schema

The `schema.sql` file creates the database, all tables, and seeds 18 books automatically.

```bash
mysql -u your_user -p < database/schema.sql
```

### Verify

```bash
mysql -u your_user -p
USE folio_bookstore;
SHOW TABLES;
SELECT COUNT(*) FROM books;
# Should return 18
```

---

## AWS Infrastructure

### Architecture

```
Internet
    │
    ▼
EC2 Instance (Ubuntu, public subnet)
    │
    ├── Nginx (port 80) → reverse proxy
    │       ↓
    └── Node.js / PM2 (port 3000)
            │
            ▼
    RDS MySQL (private subnet, Multi-AZ)
```

### VPC Setup

```
VPC: folio-vpc (e.g. 10.0.0.0/16)

Public Subnets:
  folio-public-subnet-1 (us-east-1a) → EC2
  folio-public-subnet-2 (us-east-1b) → spare

Private Subnets:
  folio-private-subnet-1 (us-east-1a) → RDS Primary
  folio-private-subnet-2 (us-east-1b) → RDS Standby

Internet Gateway → attached to VPC
Route Table → public subnets route 0.0.0.0/0 to Internet Gateway
```

### Security Groups

**folio-ec2-sg**
| Direction | Port | Source |
|---|---|---|
| Inbound | 80 | 0.0.0.0/0 |
| Inbound | 22 | Your IP only |
| Outbound | All | 0.0.0.0/0 |

**folio-rds-sg**
| Direction | Port | Source |
|---|---|---|
| Inbound | 3306 | folio-ec2-sg |
| Outbound | None | — |

### RDS Configuration

```
Engine:          MySQL 8.0
Template:        Production
Multi-AZ:        Yes
Instance class:  db.t3.micro
Storage:         20GB GP2
Public access:   No
VPC:             folio-vpc
Subnet group:    folio-db-subnet (private subnets)
Security group:  folio-rds-sg
```

### EC2 Configuration

```
AMI:             Ubuntu Server 24.04 LTS
Instance type:   t2.micro (free tier)
Subnet:          folio-public-subnet-1
Security group:  folio-ec2-sg
Auto-assign IP:  Enabled
Key pair:        your-key-pair
Auto-recovery:   Enabled
```

### Elastic IP

Assign an Elastic IP to your EC2 instance so the public IP does not change on restart:

```
EC2 → Elastic IPs → Allocate Elastic IP
→ Associate with your EC2 instance
```

---

## Deploying to AWS

### Step 1 — Set Up RDS

1. Create a VPC with public and private subnets
2. Create security groups (folio-ec2-sg, folio-rds-sg)
3. Create a DB Subnet Group using the two private subnets
4. Launch an RDS MySQL instance with the settings above
5. Note the RDS endpoint from: RDS → Databases → Connectivity & Security → Endpoint

### Step 2 — Launch EC2

1. Go to EC2 → Launch Instance
2. Choose Ubuntu Server 24.04 LTS
3. Select t2.micro
4. Select folio-public-subnet-1
5. Enable auto-assign public IP
6. Attach folio-ec2-sg security group
7. Add the user data script (see below)
8. Launch

### Step 3 — Assign Elastic IP

```
EC2 → Elastic IPs → Allocate → Associate with EC2 instance
```

### Step 4 — Verify Deployment

SSH into the instance and check:

```bash
# Check app is running
pm2 list

# Check Node responds
curl http://localhost:3000

# Check Nginx responds
curl http://localhost:80

# Check database connection
mysql -h your-rds-endpoint -u admin -p -e "SHOW DATABASES;"
```

Open in browser:
```
http://your-elastic-ip
```

---

## User Data Script

This script runs automatically when the EC2 instance launches. It installs all dependencies, clones the repository, configures Nginx, sets up environment variables, imports the database schema, and starts the application with PM2.

```bash
#!/bin/bash

export HOME=/root
cd /root

apt update -y && apt upgrade -y
apt install -y nodejs npm nginx mysql-client git
npm install -g pm2

systemctl enable nginx
systemctl start nginx

git clone https://github.com/devops-timi/bookstore-infra.git

cd bookstore-infra/bookstore

rm -rf /var/www/html/*
cp -r frontend/* /var/www/html/
cp nginx/folio.conf /etc/nginx/sites-available/folio
ln -sf /etc/nginx/sites-available/folio /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl restart nginx

cd backend

npm install

cat > .env << 'EOF'
PORT=3000
NODE_ENV=production
DB_HOST=your-rds-endpoint
DB_PORT=3306
DB_USER=admin
DB_PASSWORD=your-password
DB_NAME=folio_bookstore
EOF

cd ..
sleep 30
mysql -h "your-rds-endpoint" -u "admin" -p"your-password" < database/schema.sql

cd backend
pm2 start server.js --name folio
pm2 startup systemd -u root --hp /root
pm2 save
```

### Nginx Configuration (folio.conf)

```nginx
server {
    listen 80;
    server_name _;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

---

## Accessing the Application

Once deployed, access the application at:

```
http://your-ec2-elastic-ip
```

### API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | /api/books | Get all books |
| GET | /api/books?category=nyt | Filter books by category |
| GET | /api/books/:id | Get single book |
| POST | /api/orders | Place an order |
| GET | /api/orders/:id | Get order details |

---

## Troubleshooting

### Check user data script logs

```bash
cat /var/log/cloud-init-output.log
```

### App not running

```bash
pm2 list
pm2 logs folio
cd /root/bookstore-infra/bookstore/backend
pm2 start server.js --name folio
```

### 502 Bad Gateway

```bash
# Check Node is running on port 3000
curl http://localhost:3000

# Check Nginx config
nginx -t
systemctl status nginx
```

### Cannot connect to RDS

```bash
# Test RDS connection
mysql -h your-rds-endpoint -u admin -p -e "SHOW DATABASES;"

# Check EC2 security group allows outbound
# Check RDS security group allows port 3306 from EC2 security group
```

### App not starting after reboot

```bash
export HOME=/root
pm2 resurrect
# or
cd /root/bookstore-infra/bookstore/backend
pm2 start server.js --name folio
pm2 save
```

---

## Security Notes

- Never commit `.env` to GitHub — add it to `.gitignore`
- RDS is in a private subnet with no public access
- EC2 SSH access is restricted to your IP only
- For production, consider AWS Parameter Store instead of hardcoded `.env` credentials
- For production, add SSL/HTTPS using AWS Certificate Manager + a domain name

---

## Author

**devops-timi** — Built and deployed as a full-stack cloud project on AWS.