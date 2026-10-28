# Checkpoint 3 — Formulário Dinâmico

Aplicativo React Native com Expo SDK 55 e TypeScript que gera campos de formulário a partir de uma configuração tipada, valida os dados, apresenta os resultados e persiste os envios localmente usando AsyncStorage.

## Tecnologias

- React Native
- Expo SDK 55
- TypeScript com `strict: true`
- `@react-native-async-storage/async-storage`
- Flexbox e `StyleSheet`
- Hooks: `useState`, `useEffect`, `useMemo` e `useCallback`

## Requisitos

- Node.js LTS instalado
- npm
- Expo Go em dispositivo móvel, ou emulador Android/iOS
- Navegador para executar a versão Web

## Como executar

1. Extraia a pasta do projeto e abra um terminal dentro dela.
2. Instale as dependências:

   ```bash
   npm install
   ```

3. Inicie o Expo:

   ```bash
   npx expo start
   ```

4. Para abrir a versão Web:

   ```bash
   npx expo start --web
   ```

5. Para verificar os tipos TypeScript:

   ```bash
   npm run typecheck
   ```

No terminal do Expo, use o QR Code com o Expo Go para testar em um dispositivo compatível ou escolha um emulador configurado.

## Como o formulário é gerado

A configuração fica em `src/config/formConfig.ts`. O componente `FormScreen.tsx` percorre `formConfig.fields` com `map`, e `DynamicField.tsx` escolhe o controle com base no campo `type`. Para adicionar ou remover campos, altere a configuração, sem criar JSX individual para cada campo.

Tipos incluídos: `text`, `email`, `password`, `number`, `multiline`, `select`, `radio`, `checkbox`, `switch` e `date`.

Os campos de data usam entrada de texto no formato `AAAA-MM-DD`, uma abordagem multiplataforma que funciona em Android, iOS e Web sem depender de um seletor nativo diferente em cada plataforma.

## Persistência

Os envios são guardados na chave `@Checkpoint3:submissions` do AsyncStorage. Ao abrir a aplicação, os dados são recuperados; o botão de limpeza remove os envios persistidos. Na Web, o AsyncStorage usa o armazenamento local do navegador.

## Estrutura de pastas

```text
Checkpoint3_Formulario_Dinamico/
├── App.tsx
├── app.json
├── package.json
├── tsconfig.json
├── README.md
└── src/
    ├── components/
    │   └── DynamicField.tsx
    ├── config/
    │   └── formConfig.ts
    ├── screens/
    │   └── FormScreen.tsx
    ├── services/
    │   └── submissionStorage.ts
    ├── types/
    │   └── form.ts
    └── utils/
        └── validation.ts
```

## Integrantes


- Matheus Ikeda — RM559483
- Davis Junior — RM560723

