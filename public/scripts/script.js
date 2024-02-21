toggleAuthLinks();

window.addEventListener('load', async () => {
  try {
    const response = await fetch('/products');
    const products = await response.json();
    
    const productListDiv = document.getElementById('productList');
    
    products.forEach((product, index) => {
      const indexString = String(index);
      const productDiv = document.createElement('div');
      productDiv.className = 'col-md-5';
            productDiv.innerHTML = `
                <div class="card mb-4">
                  <div class="card-img" style="background-image: url(${product.imageUrl});">
                    <img src="${product.imageUrl}" alt="${product.name}" style="width: 100%; height: 100%; object-fit: cover;">
                  </div>
                <div class="card-info">
                    <p id="productName-${indexString}" class="text-title product-name">${product.name}</p>
                    <p class="text-body">${product.description}</p>
                </div>
                <div class="card-footer">
                    <span class="text-title">${product.price}₹</span>
                    <div class="card-button" id="buybutton-${indexString}">
                        <svg class="svg-icon" viewBox="0 0 20 20">
                            <path
                                d="M17.72,5.011H8.026c-0.271,0-0.49,0.219-0.49,0.489c0,0.271,0.219,0.489,0.49,0.489h8.962l-1.979,4.773H6.763L4.935,5.343C4.926,5.316,4.897,5.309,4.884,5.286c-0.011-0.024,0-0.051-0.017-0.074C4.833,5.166,4.025,4.081,2.33,3.908C2.068,3.883,1.822,4.075,1.795,4.344C1.767,4.612,1.962,4.853,2.231,4.88c1.143,0.118,1.703,0.738,1.808,0.866l1.91,5.661c0.066,0.199,0.252,0.333,0.463,0.333h8.924c0.116,0,0.22-0.053,0.308-0.128c0.027-0.023,0.042-0.048,0.063-0.076c0.026-0.034,0.063-0.058,0.08-0.099l2.384-5.75c0.062-0.151,0.046-0.323-0.045-0.458C18.036,5.092,17.883,5.011,17.72,5.011z">
                            </path>
                            <path
                                d="M8.251,12.386c-1.023,0-1.856,0.834-1.856,1.856s0.833,1.853,1.856,1.853c1.021,0,1.853-0.83,1.853-1.853S9.273,12.386,8.251,12.386z M8.251,15.116c-0.484,0-0.877-0.393-0.877-0.874c0-0.484,0.394-0.878,0.877-0.878c0.482,0,0.875,0.394,0.875,0.878C9.126,14.724,8.733,15.116,8.251,15.116z">
                            </path>
                            <path
                                d="M13.972,12.386c-1.022,0-1.855,0.834-1.855,1.856s0.833,1.853,1.855,1.853s1.854-0.83,1.854-1.853S14.994,12.386,13.972,12.386z M13.972,15.116c-0.484,0-0.878-0.393-0.878-0.874c0-0.484,0.394-0.878,0.878-0.878c0.482,0,0.875,0.394,0.875,0.878C14.847,14.724,14.454,15.116,13.972,15.116z">
                            </path>
                        </svg>
                    </div>
                </div>
            </div>
            `;
            productListDiv.appendChild(productDiv);
        
          });
         products.forEach((product, index) => {
              const buyButton = document.getElementById(`buybutton-${index}`);
              if (buyButton) {
                  console.log('Buy button found:', buyButton.id);                  
                  buyButton.addEventListener('click', async  () => {                  
                  if(await isUser()){    
                    handleBuyButtonClick(product.name)  
                  } else {                                
                    alert("You need to login first!");
                    window.location.href = "/login.html";
                  }
                });                  
              } else {
                  console.log('No buy button found for index:', index);
              }
          });
    } catch (error) {
        console.error('Error fetching products:', error);
    }
});

async function handleBuyButtonClick(productName) {
  try {
      const response = await fetch(`/product?name=${productName}`);
      const productDetails = await response.json();

      const productId = productDetails._id;

      console.log('Product added to user orders:', productDetails);
      console.log('Product ID:', productId);

  } catch (error) {
      console.error('Error fetching product details:', error);
  }
}

const registerBtn = document.getElementById("registerBtn");
const loginBtn = document.getElementById("loginBtn");
const logoutButton = document.getElementById("logoutButton");

if (logoutButton) {
  logoutButton.addEventListener("click", () => {
    fetch("/logout")
      .then((response) => response.json())
      .then((data) => {
        console.log(data.message);
        window.location.href = "/login.html";
      })
      .catch((error) => console.error("Error:", error));
  });
}
if (registerBtn) {
  registerBtn.addEventListener("click", async () => {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const email = document.getElementById("email").value;

    try {
      const response = await fetch("/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password, email }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("User registered successfully:", data.user);
        alert('User registered successfully!')
        window.location.href = "/login.html";
      } else {
        alert(data.error)
        console.error("Error registering user:", data.error);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  });
}
if (loginBtn) {
  loginBtn.addEventListener("click", async () => {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    try {
      const response = await fetch("/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("User logged in successfully:", data.user);
        window.location.href = "/";
      } else {
        console.error("Error logging in:", data.error);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  });
}

async function isUser() {
  try {
    const response = await fetch("/check-auth-status");
    const data = await response.json();

    return data.isUser || false;
  } catch (error) {
    console.error("Error checking user status:", error);
    return false;
  }
}

async function toggleAuthLinks() {
  const loginLink = document.getElementById("loginLink");
  const registerLink = document.getElementById("registerLink");
  const logoutButton = document.getElementById("logoutButton");

  console.log("waiting for login...");
  if (await isUser()) {
    console.log("User logged in");
    loginLink.style.display = "none";
    registerLink.style.display = "none";
    logoutButton.style.display = "inline";
  } else {
    console.log("no one logged in");
    loginLink.style.display = "inline";
    registerLink.style.display = "inline";
    logoutButton.style.display = "none";
  }
}

function addMessage(message, sender) {
  const messageList = document.getElementById('messageList');
  const li = document.createElement('li');
  li.innerHTML = message;

  if (sender === 'user') {
    li.className = 'user-message';
    li.style.textAlign = 'right';
  } else {
    li.className = 'bot-message';
    li.style.textAlign = 'left';
  }

  messageList.appendChild(li);
}

async function handleUserMessage() {
  const messageInput = document.getElementById('messageInput');
  const userMessage = messageInput.value.trim();

  if (userMessage !== '') {
    addMessage(userMessage, 'user');
    const botResponse = await generateBotResponse(userMessage);
    addMessage(botResponse, 'bot');

    messageInput.value = '';
  }
}
async function generateBotResponse(userMessage) {
  if (userMessage.toLowerCase().includes('hello')) {
    return 'Hello! How can I help you today?';
  } else if (userMessage.toLowerCase().includes('bye')) {
    return 'Goodbye! Have a great day!';
  } else if (userMessage.toLowerCase().includes('cancel order')) {
    try {
      const userLoggedIn = await isUser();

      if (userLoggedIn) {
      const orderName = prompt('Which order do you want to cancel? Enter Product Name');
      if(orderName) {
        const response = await fetch('/cancel-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
          body: JSON.stringify({ orderName }),
      });
      const result = await response.json();
      console.log(result)
      if(result.error) {
        return(result.error);
      } else if(result.message) {
        return(result.message);
      }
    } else {
      return 'Request aborted by user'
    }
    } else {
      return 'You need to log in first to cancel your orders. Click <a href="../login.html">here</a> to log in.';
    }
    } catch (error) {
      console.error('Error canceling order:', error);
      addMessage('An error occurred while canceling the order.', 'bot');
    }
  } else if (userMessage.toLowerCase().includes('my orders')) {
    try {
      const userLoggedIn = await isUser();

      if (userLoggedIn) {
        const response = await fetch('/user-orders');
        const orders = await response.json();

        if (orders.length > 0) {
          const orderList = orders.map(order => {
            const product = order.product;
            return `<div>
                      <img src="${order.imageUrl}" alt="${order.product}" style="max-width: 200px; max-height: 200px;">
                      <p>Product: ${order.product},<br> Quantity: ${order.quantity},<br> Price: ${order.price}₹</p>
                    </div>`;
          }).join('');

          return `Your orders:<br>${orderList}`;
        } else {
          return 'You have no orders yet.';
        }
      } else {
        return 'You need to log in first to view your orders. Click <a href="../login.html">here</a> to log in.';
      }
    } catch (error) {
      console.error('Error checking user status:', error);
      return 'An error occurred while checking user status.';
    }
  } else if (userMessage.toLowerCase().includes('track order')) {
    try {
      const userLoggedIn = await isUser();

      if (userLoggedIn) {
        const response = await fetch('/user-orders');
        const orders = await response.json();

        if (orders.length > 0) {
          const orderList = orders.map(order => {
            return `<div>
                      <img src="${order.imageUrl}" alt="${order.product}" style="max-width: 200px; max-height: 200px;">
                      <p>Product: ${order.product} <br> Status: ${order.status}</p>
                    </div>`;
          }).join('');

          return `Your orders:<br>${orderList}`;
        } else {
          return 'You have no orders yet.';
        }
      } else {
        return 'You need to log in first to track your orders. Click <a href="../login.html">here</a> to log in.';
      }
    } catch (error) {
      console.error('Error checking user status:', error);
      return 'An error occurred while checking user status.';
    }
  } else {
    return "I'm sorry, I didn't understand. Can you please clarify?";
  }
}

async function sendMessage() {
  await handleUserMessage();
}

async function sendCommand(command) {
  addMessage(command, 'user');

  const botResponse = await generateBotResponse(command);
  addMessage(botResponse, 'bot');
}

function addCommandButtons(buttons) {
  const commandButtonsDiv = document.getElementById('commandButtons');

  buttons.forEach((buttonText) => {
    const button = document.createElement('button');
    button.innerHTML = buttonText;
    button.onclick = () => sendCommand(buttonText);
    commandButtonsDiv.appendChild(button);
  });
}

const dynamicButtons = ['Track Order', 'Cancel Order', 'Hello', 'My Orders'];
addCommandButtons(dynamicButtons);

setTimeout(() => {
  const welcomeMessage = 'Welcome! How can I assist you today?';
  addMessage(welcomeMessage, 'bot');
}, 1000);
