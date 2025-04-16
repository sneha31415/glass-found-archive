# Glass Found Archive

A modern lost and found system for educational institutions.

## Features

- **User Authentication**
  - Secure login and registration
  - Role-based access control (Admin/User)
  - JWT-based authentication

- **Item Management**
  - Report found items with detailed information
  - Report lost items
  - Upload item images
  - Add verification questions for claiming
  - Categorize items for easy searching

- **Privacy & Security**
  - Contact details are only visible after a claim is accepted
  - Verification questions to prevent false claims
  - Secure data handling and storage

- **Item Status Tracking**
  - Found: Item is available for claiming
  - Claimed: Item has been claimed and awaiting verification
  - Returned: Item has been successfully returned to owner
  - Lost: Item has been reported as lost

- **Search & Filter**
  - Search items by name, description, category, or location
  - Filter items by status and category
  - View recently reported items

- **Dashboard**
  - Overview of system statistics
  - Visual representation of item statuses
  - Category-wise distribution of items

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/glass-found-archive.git
cd glass-found-archive
```

2. Install dependencies
```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

3. Set up environment variables
```bash
# Server (.env)
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
PORT=5000

# Client (.env)
VITE_API_URL=http://localhost:5000
```

4. Start the development servers
```bash
# Start server
cd server
npm run dev

# Start client
cd ../client
npm run dev
```

## Security Features

- **Contact Privacy**: Contact information of item reporters is only revealed after a claim has been accepted
- **Verification Questions**: Custom questions to verify rightful ownership
- **Secure Authentication**: JWT-based authentication with role-based access
- **Data Protection**: Secure handling of sensitive user information

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [React](https://reactjs.org/)
- [Express](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Tailwind CSS](https://tailwindcss.com/)
