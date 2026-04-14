# Encontre Saúde - Integração com Supabase

Este projeto é uma aplicação de saúde ("Encontre Saúde") construída puramente em **HTML, CSS e Vanilla JS** utilizando módulos modernos do Javascript (ES Modules - ESM).
Recentemente, a arquitetura do projeto foi expandida para suportar Autenticação e Banco de Dados (BaaS) através do servidor **Supabase**, adotando uma importação unificada via CDN JSDelivr para não ferir o design sem empacotadores (Node.js/NPM) do projeto original.

Abaixo documentamos as novas adições e os serviços de backend que estão agora presentes neste repositório.

## Arquitetura de Serviços

O back-end no Frontend do projeto foi modularizado em 3 frentes para organização:

### 1. `config/env.js` e Segurança (`.gitignore`)
As chaves do projeto (API Keys, URL do Banco, Chave Pública, etc) foram centralizadas num único arquivo com objetivo de referenciamento rápido. 
Esse arquivo `env.js` foi explicitamente isolado através do arquivo `.gitignore` logo na base do projeto. 
> ⚠ **Isso garante que ao enviar o projeto para o Github, pessoas mal intencionadas não roubarão sua conexão livre e keys secretas do Supabase.**

### 2. `config/supabaseClient.js` (O Singleton)
Através deste arquivo importamos ativamente toda a robusta lógica do banco de dados (da CDN oficial do site JSDelivr `https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm`) pra dentro do front-end.
Ele serve para gerar uma conexão única (Chamada de ***Singleton*** na programação) e disponibilizar a variável de client `supabase` onde precisarmos, poupando a memória e a rede dos dispositivos móveis do usuário final.

### 3. As Interfaces Lógicas (`/shared`)

Essas APIs servem para processar e blindar (com funções Try/Catch do JS) o que as suas telas e inputs HTML entregam, enviando para o banco os dados de forma correta e mastigadas:

- **`shared/authService.js`**: Única responsável pela Autenticação do sistema. Em uma tela de Login ela pode ser chamada por: `authService.signUp()`, `authService.signIn()` ou `authService.signOut()`. Há também a fundamental função de `getUserSession()` para ser validada durante as transições de rota (Toda nova tela no projeto deve confirmar `getUserSession()` antes de liberar conteúdo sigiloso).
- **`shared/profileService.js`**: Essa API atinge uma tabela sua customizada no painel do Supabase com o nome `perfis_saude`. Essa tabela guarda a sua ficha médica privada contendo os campos cruciais solicitados nos seus relatórios de métrica. Através da função `profileService.saveProfile()` os dados chegam e usam a dinâmica **Upsert** (Atualiza algo que o sistema entende já existir para aquele usuário, ou cria do absoluto zero se o banco achar que aquele ID era novo, diminuindo 50% dos códigos repetidos de lógicas backend).

## Como rodar o sistema localmente (Avisos Finais)
Se clonou este repositório, atente-se aos próximos passos:
1. Abra ou crie seu arquivo `/config/env.js`, que devido à privacidade ignorada no Git, não desceu do repositório.
2. Formate-o listando os placeholders para as strings `SUPABASE_URL` e `SUPABASE_ANON_KEY`.
3. Garanta que o Dashboard do Supabase conta com uma tabela (Table) nomeada exatamente: `perfis_saude` em formato Postgres, contendo os schemas de saúde listados pela UI.
