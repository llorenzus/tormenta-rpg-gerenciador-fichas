# 🎲 TRPG Gerenciador de Fichas (React Native + Expo Go + Electron)

> [!IMPORTANT]
> **Aviso Legal / Disclaimer**:
> Este é um projeto de código aberto desenvolvido por fãs, de forma independente e sem fins lucrativos. Não é um produto oficial da Jambô Editora e não possui qualquer vínculo com a mesma. Todos os direitos sobre o universo, termos e marcas de Tormenta pertencem à Jambô Editora e seus respectivos autores.

Aplicativo multiplataforma para criação, cálculo dinâmico e gerenciamento de fichas de personagem do sistema **Tormenta RPG (TRPG)**. O projeto foi construído utilizando **React Native + Expo (TypeScript)** com suporte nativo para **Android** (via APK e Expo Go) e **Windows Desktop** (via Electron).

> [!NOTE]  
> **Sobre o Projeto**: Este é um **projeto pessoal desenvolvido primariamente para uso próprio e de amigos** durante nossas sessões de RPG de mesa. Como o sistema Tormenta RPG possui um volume expressivo de regras, suplementos e exceções, algumas regras ou cálculos de situações muito específicas podem não estar 100% calibrados ou contemplados. **Feedbacks, relatos de bugs e sugestões de melhorias são extremamente bem-vindos!** Sinta-se à vontade para abrir uma [Issue](https://github.com/llorenzus/tormenta-rpg-gerenciador-fichas/issues) ou enviar um Pull Request.

Repositório Oficial: [https://github.com/llorenzus/tormenta-rpg-gerenciador-fichas](https://github.com/llorenzus/tormenta-rpg-gerenciador-fichas)

---

## 🏗️ Arquitetura e Tecnologias

- **Core & UI**: [React Native](https://reactnative.dev/) (v0.88) & [React](https://react.dev/) (v19) em **TypeScript**.
- **Plataforma Mobile**: [Expo SDK 58](https://expo.dev/) com suporte a execução instantânea via aplicativo **Expo Go** e compilação nativa via Prebuild/Gradle.
- **Plataforma Desktop**: [Electron](https://www.electronjs.org/) (v45) integrado via script local (`electron/run.js`) e empacotamento com [electron-builder](https://www.electron.build/) para gerar instaladores e binários portáteis `.exe` de 64 bits.
- **Persistência de Dados**: `@react-native-async-storage/async-storage` com armazenamento local seguro sem necessidade de conexão externa ou banco de dados em nuvem.
- **Geração de Documentos**: `expo-print` e `expo-sharing` para renderização e compartilhamento de fichas vetoriais em PDF.
- **Suíte de Testes**: Test Runner nativo do Node.js executado com [tsx](https://github.com/privatenumber/tsx), garantindo a fidelidade dos cálculos matemáticos de TRPG e integridade estrutural das abas.
- **CI/CD Automatizado**: GitHub Actions (`.github/workflows/build.yml`) que compila e disponibiliza automaticamente o APK Android e os executáveis Windows nos artifacts a cada commit na `main`.

---

## 📋 Funcionalidades Principais

### 1. Ficha Completa de Personagem (9 Abas Customizáveis)
1. **📋 Dados Cadastrais**: Nome do Personagem, Jogador, Campanha / Mesa, Raça, Multiclasse dinâmica (múltiplas classes com nível individual e cálculo do Nível Total), Tendência, Divindade, Tamanho e Deslocamento.
2. **🛡️ Atributos & Combate**:
   - Força, Destreza, Constituição, Inteligência, Sabedoria e Carisma com cálculo automático de modificadores oficiais.
   - Recursos vitais: PV (Pontos de Vida), PM (Pontos de Magia), PE (Pontos de Energia) e PA (Pontos de Ação).
   - Botão de **Descanso Pleno** que restaura recursos instantaneamente conforme as regras.
   - BBA (Bônus Base de Ataque), CA detalhada (10 + 1/2 nível + Mod. Des + Armadura + Escudo + Outros) e Testes de Resistência (Fortitude, Reflexos, Vontade).
3. **🎯 Perícias**: Lista oficial das perícias do TRPG com cálculo automático de graduação (Nível + 3 se treinada, 1/2 nível se não-treinada) somado ao atributo-chave e bônus customizados.
4. **🧬 Habilidades de Raça**: Registro de características e traços raciais com importação direta do compêndio.
5. **📜 Habilidades de Classe**: Poderes, características e benefícios de classe com progressão de nível.
6. **⚔️ Manobras de Combate**: Gerenciamento de Posturas e Golpes Marciais (Manual do Combate) com custo de PE.
7. **⭐ Talentos**: Busca de centenas de talentos com **verificador inteligente de pré-requisitos**, alertando se o personagem cumpre requisitos de Atributos, BBA, Classes, Níveis, Perícias ou Talentos anteriores.
8. **✨ Magias (Grimório)**: Organização clara por círculos/níveis de magia (**0 ao 9º nível**), identificação de escola, tipo (Arcana/Divina), tempo de execução, alcance, duração e custo em PM.
9. **🎒 Equipamentos**: Armas com cálculo dinâmico de Acerto Total e dano, armaduras e escudos com aplicação direta na CA, itens gerais e controle financeiro em Tibares (**TO, TP, TC**).

### 2. Sincronização em Nuvem e Compartilhamento de Fichas (v1.3.0)
- **Autenticação e Nuvem**: Login com e-mail/senha integrado ao Firebase com sincronização em nuvem e resolução de conflitos offline/online.
- **Compartilhamento de Fichas**: Compartilhe suas fichas diretamente com outros jogadores através do nome de usuário ou e-mail cadastrado.
- **Abas Separadas na Home**:
  - **Meus Personagens**: Gerenciamento e edição completa dos personagens da sua conta.
  - **Personagens Compartilhados**: Acesso às fichas compartilhadas por outros jogadores da sua mesa.
- **Modo Somente Leitura Dinâmico**: Fichas compartilhadas sincronizam alterações feitas pelo dono (como dano, perda de PV/PM ou novos itens) mantendo a edição desabilitada para os demais jogadores.
- **Filtro Avançado de Fichas**: Filtre personagens compartilhados por nome do personagem, jogador/dono ou nome da campanha em tempo real.

### 3. Compêndio Oficial Integrado
Consulta rápida e adição com 1 clique de itens dos manuais oficiais:
- 📕 **Tormenta RPG – Edição Básica Revisada**
- 🔮 **Manual do Arcano**
- 🗡️ **Manual do Malandro**
- ⚖️ **Manual do Devoto**
- 🐉 **Guia da Trilogia**

### 4. Recursos de Usabilidade
- **Reordenação Livre de Abas**: Alterne a sequência das abas da ficha para priorizar o que você mais consulta na sua classe (ex: Magias na frente para conjuradores ou Manobras para combatentes).
- **Exportação para PDF e Backup**: Geração de arquivo PDF estilizado para impressão e compartilhamento, além de exportação/importação de arquivos JSON para backup das fichas.

---

## 🚀 Como Executar o Projeto

### Pré-requisitos
- [Node.js](https://nodejs.org/) (versão LTS recomendada: 20+ ou 22+)
- [Git](https://git-scm.com/)

Clone o repositório e instale as dependências:
```bash
git clone https://github.com/llorenzus/tormenta-rpg-gerenciador-fichas.git
cd tormenta-rpg-gerenciador-fichas
npm install
```

---

### 📱 1. Executando no Celular com Expo Go (Android / iOS)

O **Expo Go** permite testar e usar o aplicativo instantaneamente no seu celular físico sem precisar compilar um APK:

1. Instale o aplicativo **Expo Go** pela [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent) (Android) ou [App Store](https://apps.apple.com/app/expo-go/id982107779) (iOS).
2. No terminal do projeto, inicie o servidor Metro:
   ```bash
   npx expo start
   ```
   *(Ou `npm start`)*
3. Certifique-se de que o computador e o celular estão conectados na **mesma rede Wi-Fi**.
4. Abra o Expo Go no celular e:
   - No **Android**: Escaneie o QR Code exibido no terminal ou digite a URL local (ex: `exp://192.168.0.X:8081`).
   - No **iOS**: Escaneie o QR Code usando o aplicativo nativo da Câmera.

---

### 💻 2. Executando no Computador com Electron (Windows)

#### Modo de Desenvolvimento:
Para iniciar a aplicação em uma janela desktop local:
```bash
npm run electron
```
*O script compila a interface web via Expo e abre a janela do Electron com recarregamento integrado.*

#### Compilar Executável Windows (.exe):
Para gerar o executável final standalone (instalador e versão portátil):
```bash
npm run build:windows
```
Os arquivos gerados estarão disponíveis no diretório **`dist-electron/`**:
- Instalador NSIS (`TRPG-Gerenciador-Fichas-Setup-*.exe`)
- Executável Portátil (`TRPG-Gerenciador-Fichas-*.exe`)

---

### 🧪 3. Executando os Testes Unitários

O projeto conta com uma suíte de testes unitários que valida a matemática das regras de Tormenta RPG, consistência da interface e conversões:

```bash
npm test
```

Os testes cobrem:
- **`regras_calculos_ficha.test.ts`**: Modificadores de atributo, BBA, CA, PV/PM e multiclasse.
- **`regras_prerequisitos_talentos.test.ts`**: Validador de requisitos de talentos (atributos mínimos, perícias, BBA e pré-requisitos encadeados).
- **`regras_compendio_conversao.test.ts`**: Integridade e conversão dos dados do compêndio em itens da ficha.
- **`layout_consistencia_plataformas.test.ts`**: Preservação e ordenação de abas, paleta de cores e compatibilidade Android/Desktop.

---

## 📦 Builds Automatizados (GitHub Actions)

Toda alteração enviada para a branch `main` dispara um fluxo automatizado de CI no GitHub Actions que:
1. Instala dependências e roda toda a suíte de testes.
2. Gera o **APK Android de Release**.
3. Compila os executáveis **Windows Desktop (.exe)** via Electron Builder.
4. Disponibiliza ambos para download nos **Artifacts** e na aba de **Releases**.

---

## 🤝 Feedbacks e Contribuições

Por ser um projeto voltado para nossa comunidade de mesa, qualquer ajuda ou sugestão para refinar as fórmulas, adicionar conteúdos de novos suplementos ou corrigir comportamentos é muito bem-vinda:
- Abra uma **[Issue](https://github.com/llorenzus/tormenta-rpg-gerenciador-fichas/issues)** para relatar regras que não estejam funcionando como você esperava ou solicitar novas funcionalidades.
- Envie um **Pull Request** caso queira implementar melhorias no código.

---

## ⚖️ Licença e Direitos Autorais

Este é um projeto sem fins lucrativos, desenvolvido por fãs para entusiastas do RPG. O universo de **Tormenta**, o sistema **Tormenta RPG (TRPG)** e todos os termos, manuais e marcas registradas pertencem exclusivamente à **Editora Jambô**.
