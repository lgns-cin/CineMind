import axios from "axios";

/*
Instância centralizada do Axios para chamadas à API CineMind
O docker-compose.yml nos diz que o backend roda na porta 8000
É uma boa prática definir a URL base em um único lugar
*/
const api = axios.create({
  baseURL: "http://localhost:8000/"
});

// Futuramente, quando tivermos o JWT, podemos configurar ele aqui
// para ser enviado em todas as requisições

export default api;
