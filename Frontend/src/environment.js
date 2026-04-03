let Is_prod = true;

const server = Is_prod ?
    "https://vkonnect-1.onrender.com" :

      "http://localhost:5000"

export default server;