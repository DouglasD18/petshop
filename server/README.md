# Pet Shop

Esta é uma API de estudos para gerenciamento de um petshop fictício. Essa API possibilita CRUD (Create, Read, Update e Delete) de pets em Banco de Dados MongoDB.

## Rodando a Aplicação

### Instalando dependências

```bash
npm install 
``` 

### Executando a Aplicação

* Para rodar a API:

  ```
  npm start
  ```

* Para rodar os testes da API:

  ```
  npm run test
  ```


## Rotas Disponíveis

A API possui as seguintes rotas para manipulação de pets:

### 1. Listar todos os pets

```
Endpoint: GET /api/pet
```

Retorna uma lista de todos os pets existentes.

### 2. Obter um pet

```
Endpoint: GET /api/pet/:name
```

Retorna os detalhes de um pet específico com base no nome fornecido.

### 3. Criar um novo pet

```
Endpoint: POST /api/pet
```

Cria um novo pet. Os dados do pet devem ser fornecidos no corpo da requisição.

### 4. Atualizar um pet

```
Endpoint: PUT /api/pet/:name
```

Atualiza os dados de um pet existente com base no nome fornecido. Os novos dados devem ser fornecidos no corpo da requisição.

### 5. Excluir um pet

```
Endpoint: DELETE /api/pet/:name
```

Exclui um pet específico com base no nome fornecido.

API rodando no endereço http://localhost:3001/
