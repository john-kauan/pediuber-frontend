# PediUber Frontend

Frontend web do sistema **PediUber**, desenvolvido em Angular, com interface para passageiros, motoristas, acompanhamento de corridas e histórico.

Este repositório faz parte do trabalho da disciplina **SIN142** e se integra ao backend PediUber e ao RideFleet Core.

---

## Repositórios relacionados

Backend PediUber:

    https://github.com/john-kauan/pediuber-backend

Frontend PediUber:

    https://github.com/john-kauan/pediuber-frontend

RideFleet Core:

    https://github.com/Matt1211/ridefleet-core-sin142

---

## Tecnologias utilizadas

- Angular
- TypeScript
- SCSS
- Docker
- Nginx
- GitHub Actions

---

## Funcionalidades implementadas

O frontend possui as seguintes telas principais:

### Tela inicial

Rota:

    /

Tela inicial do PediUber, com painel de navegação e visão geral do sistema.

### Solicitação de corrida

Rota:

    /passenger/request

Tela para solicitação de corrida pelo passageiro.

O usuário informa:

- nome do passageiro;
- origem;
- destino;
- latitude da origem;
- longitude da origem;
- latitude do destino;
- longitude do destino.

### Acompanhamento de corrida

Rota:

    /rides/:id/tracking

Tela de acompanhamento da corrida.

Permite visualizar:

- status da corrida;
- motorista atribuído;
- veículo;
- origem;
- destino;
- progresso;
- serviço responsável;
- se a corrida foi delegada;
- ações de iniciar e finalizar corrida.

### Área de motoristas

Rota:

    /drivers

Tela de gerenciamento de motoristas.

Permite:

- cadastrar motoristas;
- listar motoristas cadastrados;
- alterar disponibilidade;
- consultar corrida atual do motorista.

### Histórico de corridas

Rota:

    /history

Tela de histórico de corridas registradas no sistema.

Mostra:

- id da corrida;
- status;
- origem;
- destino;
- motorista;
- veículo;
- serviço responsável;
- se foi delegada;
- link para acompanhamento.

---

## Arquitetura do frontend

O frontend pode rodar de duas formas:

1. Em desenvolvimento local, usando `npm start`.
2. Em container Docker, usando Nginx.

Em desenvolvimento, o Angular usa o arquivo:

    proxy.conf.json

Esse arquivo encaminha chamadas `/api` para o backend.

Em Docker, o Nginx serve o Angular e encaminha chamadas `/api` para o load balancer do backend.

Arquitetura em Docker:

    Navegador
       ↓
    Frontend Angular em Nginx
       ↓
    /api
       ↓
    pediuber-load-balancer
       ↓
    pediuber-backend-1
    pediuber-backend-2
    pediuber-backend-3

---

## Estrutura principal do projeto

    pediuber-frontend/
    ├── Dockerfile
    ├── .dockerignore
    ├── nginx/
    │   └── default.conf
    ├── proxy.conf.json
    ├── package.json
    ├── angular.json
    ├── src/
    │   └── app/
    │       ├── core/
    │       │   ├── models/
    │       │   └── services/
    │       └── pages/
    │           ├── home/
    │           ├── passenger-request/
    │           ├── ride-tracking/
    │           ├── drivers/
    │           └── history/
    └── .github/
        └── workflows/
            └── frontend-ci-cd.yml

---

## Como rodar em desenvolvimento

Entre na pasta do frontend:

    cd ~/pediuber-sin142/pediuber-frontend

Instale as dependências:

    npm install

Rode o projeto:

    npm start

Acesse no navegador:

    http://localhost:4200

---

## Proxy em desenvolvimento

O arquivo `proxy.conf.json` redireciona as chamadas `/api` para o backend.

Configuração utilizada:

    {
      "/api": {
        "target": "http://localhost:8082",
        "secure": false,
        "changeOrigin": true,
        "pathRewrite": {
          "^/api": ""
        }
      }
    }

Assim, no frontend, os serviços Angular chamam:

    /api/rides
    /api/drivers

E o proxy encaminha para:

    http://localhost:8082/rides
    http://localhost:8082/drivers

---

## Backend esperado

Para o frontend funcionar corretamente, o backend PediUber deve estar rodando em:

    http://localhost:8082

No ambiente atual, essa porta é usada pelo load balancer do backend:

    pediuber-load-balancer

O load balancer distribui as requisições entre:

    pediuber-backend-1
    pediuber-backend-2
    pediuber-backend-3

---

## Como rodar com Docker

Primeiro, garanta que o backend esteja rodando com Docker Compose.

Na pasta do backend:

    cd ~/pediuber-sin142/pediuber-backend
    docker compose up -d --build

Depois, entre na pasta do frontend:

    cd ~/pediuber-sin142/pediuber-frontend

Construa a imagem Docker do frontend:

    docker build -t pediuber-frontend:local .

Rode o container do frontend na mesma rede Docker do backend:

    docker run -d \
      --name pediuber-frontend \
      --network pediuber-backend_pediuber-net \
      -p 4200:80 \
      pediuber-frontend:local

Acesse no navegador:

    http://localhost:4200

---

## Parar o container do frontend

Para parar e remover o container:

    docker rm -f pediuber-frontend

---

## Rebuildar o frontend Docker

Caso altere algum arquivo e queira reconstruir a imagem:

    docker build -t pediuber-frontend:local .

Depois remova o container antigo:

    docker rm -f pediuber-frontend

E rode novamente:

    docker run -d \
      --name pediuber-frontend \
      --network pediuber-backend_pediuber-net \
      -p 4200:80 \
      pediuber-frontend:local

---

## Configuração do Nginx

O frontend em Docker usa Nginx.

O arquivo de configuração está em:

    nginx/default.conf

Ele faz duas funções principais:

1. Serve os arquivos estáticos do Angular.
2. Encaminha chamadas `/api` para o load balancer do backend.

Trecho principal:

    location /api/ {
        proxy_pass http://pediuber-load-balancer/;
    }

Isso significa que uma chamada do frontend para:

    /api/drivers

será encaminhada para o backend através do load balancer.

---

## Build local do Angular

Para verificar se o projeto Angular compila:

    npm run build

A saída esperada deve indicar que a geração do bundle foi concluída com sucesso.

---

## Pipeline CI/CD

O frontend possui pipeline no GitHub Actions em:

    .github/workflows/frontend-ci-cd.yml

O pipeline executa:

1. Instalação de dependências.
2. Build do Angular.
3. Build da imagem Docker.
4. Subida temporária do container.
5. Teste HTTP do frontend.
6. Deploy automatizado simulado.

---

## Funcionamento do pipeline

O pipeline roda automaticamente em:

- push na branch `main`;
- push na branch `dockeriza-frontend`;
- pull request para `main`.

Também pode ser executado manualmente pelo GitHub Actions usando:

    workflow_dispatch

---

## Teste de validação Docker no pipeline

Durante o pipeline, é criado um container temporário do frontend.

Como o Nginx do frontend espera encontrar o backend pelo nome:

    pediuber-load-balancer

o pipeline cria um container temporário com esse nome apenas para validar que o Nginx sobe corretamente.

Isso permite testar a imagem Docker do frontend sem precisar subir todo o backend no pipeline do frontend.

---

## Comandos úteis

Ver containers rodando:

    docker ps

Ver logs do frontend:

    docker logs pediuber-frontend

Parar frontend:

    docker rm -f pediuber-frontend

Build Angular:

    npm run build

Build Docker:

    docker build -t pediuber-frontend:local .

Rodar localmente em desenvolvimento:

    npm start

---

## Fluxo recomendado para apresentação

Antes de apresentar, rode primeiro o backend:

    cd ~/pediuber-sin142/pediuber-backend
    docker compose up -d --build

Depois rode o frontend:

    cd ~/pediuber-sin142/pediuber-frontend

    docker rm -f pediuber-frontend || true

    docker build -t pediuber-frontend:local .

    docker run -d \
      --name pediuber-frontend \
      --network pediuber-backend_pediuber-net \
      -p 4200:80 \
      pediuber-frontend:local

Acesse:

    http://localhost:4200

Teste as telas:

1. Início.
2. Nova corrida.
3. Acompanhamento da corrida.
4. Motoristas.
5. Histórico.

---

## Observação importante

O frontend depende do backend PediUber para carregar dados de motoristas, corridas e histórico.

Portanto, se alguma tela não carregar informações, confira primeiro se o backend está ativo:

    curl -s http://localhost:8082/actuator/health

E se o load balancer está rodando:

    docker ps | grep pediuber-load-balancer
