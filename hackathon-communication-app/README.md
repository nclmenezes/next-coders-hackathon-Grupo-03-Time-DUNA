# 🚀 Next Coders/ Qualifica.ai Hackathon - Sistema de Comunicação

![Next Coders](https://img.shields.io/badge/Next%20Coders-Hackathon%202026-blue)
![React](https://img.shields.io/badge/React-18-61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-3178C6)
![.NET](https://img.shields.io/badge/.NET-8.0-512BD4)

## 📋 Sobre o Desafio

Bem-vindo ao **Next Coders/ Qualifica.ai Hackathon**! 🎉

Este é um aplicativo de comunicação/email simplificado que permite selecionar destinatários e enviar mensagens. O projeto já está funcionando, mas **precisa de melhorias**!

Sua missão é **deixar este projeto mais incrível**! Use sua criatividade para adicionar novas funcionalidades, melhorar a interface, corrigir bugs ou implementar suas próprias ideias.

---

## 🎯 Objetivos

### O que vocês devem fazer:
1. **Explorar o código** - Entenda como o projeto funciona
2. **Identificar melhorias** - O que pode ser melhor?
3. **Implementar mudanças** - Coloque a mão na massa!
4. **Apresentar sua solução** - Mostre o que vocês criaram

### Critérios de Avaliação:
- ✨ **Criatividade** - Ideias inovadoras
- 💻 **Qualidade do código** - Código limpo e organizado
- 🎨 **Interface do usuário** - Visual bonito e fácil de usar
- 🚀 **Funcionalidades** - Features que agregam valor
- 👥 **Trabalho em equipe** - Colaboração do time

---

## 🛠️ Tecnologias Utilizadas

### Frontend (React)
- ⚛️ **React 18** - Biblioteca para interfaces
- 📘 **TypeScript** - JavaScript com tipos
- ⚡ **Vite** - Build tool super rápido
- 🎨 **Material-UI** - Componentes visuais prontos
- 🔀 **React Router** - Navegação entre páginas
- 🍞 **React Toastify** - Notificações bonitas

### Backend (.NET)
- 🔷 **.NET 8** - Framework da Microsoft
- 📡 **Web API** - Endpoints REST
- 📚 **Swagger** - Documentação da API

---

## 🚀 Como Rodar o Projeto

### Pré-requisitos
- [Node.js](https://nodejs.org/) (versão 18 ou superior)
- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- Um editor de código (recomendamos [VS Code](https://code.visualstudio.com/))

### Passo 1: Clonar o Repositório
\`\`\`bash
git clone https://github.com/ypedroo/next-coders-hackathon.git
cd next-coders-hackathon
\`\`\`

### Passo 2: Rodar o Backend
\`\`\`bash
cd backend/NextCoders.Email
dotnet restore
dotnet run
\`\`\`
✅ O backend vai rodar em: **https://localhost:7071**
📚 Swagger disponível em: **https://localhost:7071/swagger**

### Passo 3: Rodar o Frontend
\`\`\`bash
# Abra outro terminal
cd hackathon-communication-app
npm install
npm run dev
\`\`\`
✅ O frontend vai rodar em: **http://localhost:3000**

---

## 📁 Estrutura do Projeto

\`\`\`
next-coders-hackathon/
├── 📂 backend/
│   └── 📂 NextCoders.Email/
│       ├── 📂 Controllers/
│       │   └── EmailController.cs      # Endpoints da API
│       ├── 📂 Models/
│       │   ├── EmailRequest.cs         # Modelo de requisição
│       │   └── EmailResponse.cs        # Modelo de resposta
│       ├── 📂 Services/
│       │   ├── IEmailService.cs        # Interface do serviço
│       │   └── MockEmailService.cs     # Serviço de mock
│       └── Program.cs                  # Configuração da API
│
└── 📂 hackathon-communication-app/
    └── 📂 src/
        ├── 📂 components/
        │   ├── CommunicationList.tsx   # Lista de contatos
        │   ├── CommunicationSender.tsx # Tela de envio
        │   └── Loading.tsx             # Componente de loading
        ├── 📂 services/
        │   ├── mailService.ts          # Serviço de email
        │   └── mockData.ts             # Dados de mock
        ├── 📂 types/
        │   └── index.ts                # Tipos TypeScript
        ├── 📂 utils/
        │   └── toast.ts                # Utilitários de toast
        └── App.tsx                     # Componente principal
\`\`\`

---

## 📚 Arquivos Importantes para Editar

### Frontend (React/TypeScript)

| Arquivo | O que faz | Dificuldade |
|---------|-----------|-------------|
| \`src/App.tsx\` | Configuração de tema e rotas | 🟢 Fácil |
| \`src/components/CommunicationList.tsx\` | Lista de contatos com filtros | 🟡 Médio |
| \`src/components/CommunicationSender.tsx\` | Tela de envio de email | 🟡 Médio |
| \`src/services/mockData.ts\` | Dados de mock (contatos) | 🟢 Fácil |
| \`src/services/mailService.ts\` | Serviço de comunicação | 🟡 Médio |

### Backend (.NET)

| Arquivo | O que faz | Dificuldade |
|---------|-----------|-------------|
| \`Services/MockEmailService.cs\` | Dados e lógica de mock | 🟢 Fácil |
| \`Models/EmailRequest.cs\` | Estrutura do email | 🟢 Fácil |
| \`Controllers/EmailController.cs\` | Endpoints da API | 🟡 Médio |
| \`Program.cs\` | Configuração da API | 🔴 Difícil |

---

## 🔧 Comandos Úteis

### Frontend
\`\`\`bash
npm run dev      # Rodar em desenvolvimento
npm run build    # Gerar build de produção
npm run preview  # Visualizar build
\`\`\`

### Backend
\`\`\`bash
dotnet run       # Rodar a API
dotnet build     # Compilar
dotnet watch     # Rodar com hot reload
\`\`\`

---

## 📖 Recursos de Aprendizado

### React & TypeScript
- 📚 [Documentação do React](https://react.dev/)
- 📘 [TypeScript para Iniciantes](https://www.typescriptlang.org/docs/handbook/typescript-from-scratch.html)
- 🎨 [Material-UI Components](https://mui.com/material-ui/all-components/)

### .NET
- 📚 [Documentação .NET](https://learn.microsoft.com/pt-br/dotnet/)
- 🔷 [ASP.NET Core Tutorial](https://learn.microsoft.com/pt-br/aspnet/core/tutorials/first-web-api)

### Git & GitHub
- 📚 [Git Básico](https://git-scm.com/book/pt-br/v2)
- 🐙 [GitHub Tutorial](https://docs.github.com/pt/get-started)

---

## ❓ Dicas para o Hackathon

1. **Comecem simples** - Não tentem fazer tudo de uma vez
2. **Testem sempre** - Verifiquem se o código funciona antes de continuar
3. **Dividam as tarefas** - Cada um pode trabalhar em uma parte
4. **Peçam ajuda** - Os mentores estão aqui para ajudar!
5. **Divirtam-se!** - O mais importante é aprender e se divertir

---

## 🤝 Regras do Hackathon

1. ⏰ Atentem-se ao tempo para desenvolver
2. 👥 Trabalhem em **equipe**
3. 💾 Façam **commits** frequentes
4. 📝 **Documentem** o que fizeram
5. 🎤 **Apresentem** sua solução no final

---

## 📞 Precisa de Ajuda?

- 🙋 Afende momento um **mentor**
- 💬 Pergunte no **chat do evento**
- 🔍 Pesquise no **Google/Stack Overflow**
- 🤖 Use o **GitHub Copilot** ou outra IA para ajudar com código

---

## 🏆 Boa Sorte!

Que vença a melhor equipe! Lembrem-se: o importante não é só ganhar, mas **aprender** e **se divertir** no processo.

**Let's code! 🚀**

---

*Desenvolvido com ❤️ para o Next Coders/ Qualifica.ai Hackathon 2026*   