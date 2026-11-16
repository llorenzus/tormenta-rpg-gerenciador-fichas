# TRPG Gerenciador de Fichas (React Native + Expo Go + Electron)

Aplicativo para gerenciamento completo de fichas de personagem do sistema **Tormenta RPG (TRPG)**, desenvolvido em **React Native + Expo (TypeScript)** com suporte multiplataforma para **Android** (via APK ou Expo Go) e **Windows Desktop** (via Electron).

Repositório: [https://github.com/llorenzus/tormenta-rpg-gerenciador-fichas](https://github.com/llorenzus/tormenta-rpg-gerenciador-fichas)

## Funcionalidades Principais

- **Ficha Completa de Personagem**:
  1. **📋 Dados Cadastrais**: Nome, Jogador, Raça, Multiclasse dinâmica com Nível Total, Tendência, Divindade, Tamanho e Deslocamento.
  2. **🛡️ Atributos & Combate**: Força, Destreza, Constituição, Inteligência, Sabedoria e Carisma com cálculo automático de modificadores; PV, PM, Pontos de Ação (PA), PE, BBA, CA detalhada e Testes de Resistência (Fortitude, Reflexos, Vontade). Botão de **Descanso Pleno**.
  3. **🎯 Perícias**: Lista completa oficial das 21 perícias do Tormenta RPG com cálculo automático de graduações, modificadores e complementos (*Ofício, Conhecimento, Atuação*).
  4. **🧬 Habilidades de Raça**: Traços e habilidades raciais importáveis direto do Compêndio.
  5. **📜 Habilidades de Classe**: Poderes e características com cálculo de níveis e pré-requisitos.
  6. **⚔️ Manobras de Combate**: Posturas e Golpes Marciais com gerenciamento de Pontos de Energia (PE).
  7. **⭐ Talentos**: Busca de centenas de talentos oficiais com verificador inteligente de pré-requisitos (atributos, BBA, classes, perícias e talentos anteriores).
  8. **✨ Magias**: Grimório organizado por **Níveis de Magia (0 ao 9º nível)** com custo em Pontos de Magia (PM).
  9. **🎒 Equipamentos**: Armas com cálculo dinâmico de Acerto Total, armaduras e escudos com aplicação na CA, itens gerais e **Tibares (TO, TP, TC)**.
- **📖 Compêndio Integrado**: Consulta e aplicação em um clique de Raças, Classes, Talentos, Magias, Manobras e Equipamentos de todos os manuais oficiais do Tormenta RPG.
- **⚙️ Organização de Abas**: Reordenação livre da sequência das abas na ficha com persistência local.
- **📄 Exportação PDF e JSON**: Compartilhamento, backup e impressão direta da ficha em PDF estilizado.

## Como Executar

### No Celular com Expo Go (Android / iOS)
1. Instale o **Expo Go** no celular.
2. No terminal do projeto:
   ```bash
   npm install
   npx expo start
   ```
3. Escaneie o **QR Code** no terminal com o aplicativo Expo Go!

### No Computador (Desktop Windows)
- Para rodar em modo desenvolvimento:
  ```bash
  npm run electron
  ```
- Para compilar o executável `.exe` (portátil e instalador):
  ```bash
  npm run build:windows
  ```
  Os executáveis serão gerados na pasta `dist-electron/`.
