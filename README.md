# Cardápio IFRS

Este projeto é um sistema de cardápio digital desenvolvido para o IFRS. Ele permite a visualização das refeições diárias e a gestão do cardápio de forma simples e rápida, contando com uma estrutura dividida entre Frontend e Backend.

## Pré-requisitos

Certifique-se de ter o [Node.js](https://nodejs.org/) instalado em sua máquina.

## Como Instalar e Rodar o Projeto

Para que o sistema funcione completamente, é necessário rodar o Frontend e o Backend simultaneamente em terminais separados.

### 1. Iniciando o Backend

Abra um terminal, acesse a pasta do backend, instale as dependências (caso seja o primeiro uso) e inicie o servidor:

```bash
cd backend
npm install
npm run start
```

### 2. Iniciando o Frontend

Abra um **novo terminal** (mantendo o do backend rodando), acesse a pasta do frontend, instale as dependências e inicie a aplicação web:

```bash
cd frontend
npm install
npm run web
```

## Credenciais de Acesso (Login Padrão)

O sistema possui diferentes tipos de acesso. Você pode utilizar as credenciais abaixo para entrar na plataforma:

### Acesso Administrador (Servidor)
*Tem permissão para editar e gerenciar o cardápio.*
- **Usuário:** `servidor`
- **Senha:** `123`

### Acesso Aluno
*Visualização do cardápio.*
- **Usuário:** `aluno`
- **Senha:** `123`
