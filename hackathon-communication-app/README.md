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

## 🍴 Como Contribuir (Passo a Passo)

Para participar do hackathon, vocês precisam fazer um **Fork** do repositório e depois abrir um **Pull Request** com suas mudanças. Não se preocupe se nunca fez isso antes - vamos explicar tudo em detalhes!

### 📖 Glossário (Termos Importantes)

| Termo | O que significa |
|-------|-----------------|
| **Fork** | Uma cópia do repositório para sua conta do GitHub |
| **Clone** | Baixar o código para seu computador |
| **Branch** | Uma "ramificação" do código onde você faz suas mudanças |
| **Commit** | Salvar suas mudanças com uma mensagem descritiva |
| **Push** | Enviar suas mudanças do seu computador para o GitHub |
| **Pull Request (PR)** | Pedido para incluir suas mudanças no projeto original |

---

### 🔀 Passo 1: Fazer o Fork do Repositório

1. Acesse o repositório original: **https://github.com/ypedroo/next-coders-hackathon**

2. No canto superior direito da página, clique no botão **"Fork"**
   
   ![Fork Button](https://docs.github.com/assets/images/help/repository/fork_button.png)

3. O GitHub vai criar uma cópia do repositório na **sua conta**
   - O novo endereço será: `https://github.com/SEU-USUARIO/next-coders-hackathon`

4. Aguarde o GitHub terminar de criar o Fork (geralmente leva alguns segundos)

✅ **Pronto!** Agora você tem sua própria cópia do projeto!

---

### 💻 Passo 2: Clonar o SEU Fork para o Computador

Agora você precisa baixar o código do **seu Fork** (não do repositório original):

```bash
# Substitua SEU-USUARIO pelo seu nome de usuário do GitHub
git clone https://github.com/SEU-USUARIO/next-coders-hackathon.git
```

**Exemplo:** Se seu usuário é `joaosilva`, o comando seria:
```bash
git clone https://github.com/joaosilva/next-coders-hackathon.git
```

Entre na pasta do projeto:
```bash
cd next-coders-hackathon
```

---

### 🌿 Passo 3: Criar uma Branch para sua Equipe

Uma **branch** é como uma "área de trabalho separada" onde vocês fazem as mudanças sem afetar o código original.

```bash
# Crie uma branch com o nome da sua equipe
git checkout -b nome-da-sua-equipe
```

**Exemplo:** Se sua equipe chama "Inovadores":
```bash
git checkout -b equipe-inovadores
```

**Dica:** Use nomes descritivos como:
- `equipe-inovadores`
- `time-rocket`
- `squad-alpha`

Para verificar em qual branch você está:
```bash
git branch
```
A branch atual terá um `*` na frente.

---

### ✏️ Passo 4: Fazer suas Mudanças

Agora é hora de codar! 🎉

1. Abra o projeto no VS Code:
```bash
code .
```

2. Faça as melhorias que planejaram

3. Teste se está funcionando rodando o projeto

---

### 💾 Passo 5: Salvar suas Mudanças (Commit)

Depois de fazer mudanças, você precisa **salvar** elas no Git:

#### 5.1 Ver quais arquivos foram modificados:
```bash
git status
```
Os arquivos modificados aparecerão em vermelho.

#### 5.2 Adicionar os arquivos para o commit:
```bash
# Adicionar TODOS os arquivos modificados
git add .

# OU adicionar arquivos específicos
git add src/App.tsx
git add src/components/MeuComponente.tsx
```

#### 5.3 Fazer o commit com uma mensagem:
```bash
git commit -m "Descrição do que você fez"
```

**Exemplos de boas mensagens de commit:**
```bash
git commit -m "Adiciona modo escuro na interface"
git commit -m "Corrige bug no filtro de contatos"
git commit -m "Melhora layout da página de envio"
git commit -m "Adiciona campo de assunto no email"
```

**💡 Dica:** Faça commits pequenos e frequentes! É melhor ter vários commits pequenos do que um commit gigante.

---

### ⬆️ Passo 6: Enviar para o GitHub (Push)

Agora envie suas mudanças para o seu Fork no GitHub:

```bash
git push origin nome-da-sua-equipe
```

**Exemplo:**
```bash
git push origin equipe-inovadores
```

Se for a primeira vez que você faz push dessa branch, o Git pode pedir para configurar o upstream:
```bash
git push --set-upstream origin nome-da-sua-equipe
```

---

### 🔃 Passo 7: Abrir o Pull Request (PR)

O **Pull Request** é como você "entrega" seu código para avaliação!

#### 7.1 Acesse seu Fork no GitHub
Vá para: `https://github.com/SEU-USUARIO/next-coders-hackathon`

#### 7.2 Clique em "Compare & pull request"
Após o push, o GitHub mostrará um botão verde **"Compare & pull request"**. Clique nele!

Se não aparecer, vá em **"Pull requests"** → **"New pull request"**

#### 7.3 Preencha as informações do PR:

**Título:** Nome da equipe + descrição breve
```
[Equipe Inovadores] Implementação de modo escuro e melhorias na UI
```

**Descrição:** Explique o que vocês fizeram usando este template:

```markdown
## 👥 Equipe
- Nome do membro 1
- Nome do membro 2
- Nome do membro 3

## 📝 O que fizemos
- [ ] Implementamos modo escuro
- [ ] Melhoramos os filtros de busca
- [ ] Adicionamos animações
- [ ] Criamos novo componente de header

## 📸 Screenshots
(Cole aqui prints das suas mudanças)

## 🎯 Dificuldades encontradas
(Opcional: conte o que foi difícil)

## 💡 O que aprendemos
(Opcional: compartilhe o que vocês aprenderam!)
```

#### 7.4 Clique em "Create pull request"

🎉 **Parabéns!** Seu código foi enviado para avaliação!

---

### 🔄 Passo 8: Continuar Trabalhando (Opcional)

Se quiserem continuar fazendo mudanças depois de abrir o PR, é só repetir os passos 4-6:

```bash
# Faça mais mudanças nos arquivos...

# Adicione as mudanças
git add .

# Faça o commit
git commit -m "Mais melhorias na interface"

# Envie para o GitHub
git push origin nome-da-sua-equipe
```

O Pull Request será **atualizado automaticamente** com as novas mudanças!

---

### ⚠️ Problemas Comuns e Soluções

#### "Permission denied" ao fazer push
```bash
# Configure suas credenciais do Git
git config --global user.name "Seu Nome"
git config --global user.email "seu@email.com"
```

#### "Não estou na branch certa"
```bash
# Veja todas as branches
git branch

# Mude para sua branch
git checkout nome-da-sua-equipe
```

#### "Esqueci de criar uma branch e fiz commits na main"
Não se preocupe! Peça ajuda a um mentor.

#### "Conflito no merge"
Acontece quando duas pessoas mexem no mesmo arquivo. Peça ajuda a um mentor para resolver.

---

### 📋 Checklist Final

Antes de finalizar, verifiquem:

- [ ] ✅ O projeto roda sem erros?
- [ ] ✅ Testamos todas as funcionalidades?
- [ ] ✅ Fizemos commit de todos os arquivos?
- [ ] ✅ O Push foi feito com sucesso?
- [ ] ✅ O Pull Request foi aberto?
- [ ] ✅ Preenchemos a descrição do PR?

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