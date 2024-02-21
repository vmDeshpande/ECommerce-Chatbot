# ECommerce Chatbot

## About The Project

The ECommerce Chatbot is designed to enhance online shopping experiences, offering users the ability to query products, get recommendations, and resolve common issues through an intuitive chat interface. Built with HTML, CSS, JavaScript, Node.js, and MongoDB, this project aims to demonstrate how chatbots can improve customer service and engagement in an eCommerce setting.

### Built With

- [HTML](https://developer.mozilla.org/en-US/docs/Web/HTML)
- [CSS](https://developer.mozilla.org/en-US/docs/Web/CSS)
- [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
- [Node.js](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/)

## Getting Started

To get a local copy up and running follow these simple steps.

### Prerequisites

Before you begin, ensure you have met the following requirements:
- Node.js installed on your machine
- MongoDB set up locally or remotely

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/vmDeshpande/ECommerce-Chatbot
   ```
2. Navigate to the project directory
   ```sh
   cd ECommerce-Chatbot
   ```
3. Install NPM packages
   ```sh
   npm install
   ```
4. Change MongoDB connection String in `server.js`
   ```sh
   mongoose.connect("<Your String Here>", { useNewUrlParser: true, useUnifiedTopology: true,})
   ```
5. Start the server
   ```sh
   node .
   ```

### Usage

After starting the server, you can access the chatbot interface by navigating to `http://localhost:3000` in your web browser. 
Here's how you can interact with the chatbot:
- Type your queries in the chat input to ask about products, services, or support.
- Use the provided commands for specific actions.
