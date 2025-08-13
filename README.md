
# Laravel 12 + React Management App

Este é um projeto full-stack que usa Laravel 12 para o backend e React para o frontend.

## Requisitos

- PHP >= 8.2
- Composer
- Node.js & npm
- Um banco de dados (ex: MySQL, PostgreSQL)

## Guia de Instalação e Setup

1.  **Clone o repositório:**
    ```bash
    git clone <your-repo-url>
    cd your-project-name
    ```

2.  **Instale as dependências do PHP:**
    ```bash
    composer install
    ```

3.  **Copie o arquivo de ambiente:**
    ```bash
    cp .env.example .env
    ```

4.  **Gere a chave da aplicação:**
    ```bash
    php artisan key:generate
    ```

5.  **Configure o Banco de Dados:**
    Abra o arquivo `.env` e configure suas credenciais de banco de dados (DB_DATABASE, DB_USERNAME, DB_PASSWORD).

6.  **Execute as Migrations:**
    Isso criará todas as tabelas necessárias no seu banco de dados.
    ```bash
    php artisan migrate
    ```

7.  **(Opcional) Seed o banco com um usuário Admin:**
    Para criar o usuário administrador inicial (`admin@example.com` / `password`).
    ```bash
    php artisan db:seed --class=AdminUserSeeder
    ```

8.  **Instale as dependências do JavaScript:**
    ```bash
    npm install
    ```

## Executando a Aplicação

Você precisará de dois terminais abertos.

1.  **Inicie o servidor de desenvolvimento do Laravel:**
    ```bash
    php artisan serve
    ```

2.  **Compile e observe os assets do frontend (React):**
    ```bash
    npm run dev
    ```

Agora, acesse a aplicação em `http://127.0.0.1:8000` no seu navegador.

