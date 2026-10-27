# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

### Other setup steps

- To set up ESLint for linting, run `npx expo lint`, or follow our guide on ["Using ESLint and Prettier"](https://docs.expo.dev/guides/using-eslint/)
- If you'd like to set up unit testing, follow our guide on ["Unit Testing with Jest"](https://docs.expo.dev/develop/unit-testing/)
- Learn more about the TypeScript setup in this template in our guide on ["Using TypeScript"](https://docs.expo.dev/guides/typescript/)

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.

## Autenticación y registro

El backend usa las tablas existentes `estudiantes` y `administradores`. Expone `POST /api/auth/register` para registrar estudiantes y `POST /api/auth/login` para iniciar sesión con matrícula/correo de estudiante o correo administrativo. Las contraseñas se guardan con hash; el registro público no permite crear administradores.

1. Conserva los datos de MySQL que ya tengas en `Backend/.env` y agrega `JWT_SECRET` desde `Backend/.env.example`.
2. Configura `JWT_SECRET` con una cadena aleatoria de al menos 32 bytes. Puedes generarla con `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`.
3. Inserta tus administradores directamente en `administradores`, tal como está definido en el esquema. El valor de `contrasena` debe ser un hash bcrypt compatible con `bcryptjs`.
4. En una terminal, inicia el backend con `npm run backend` (o `cd Backend && npm run dev`). En otra terminal, inicia el frontend con `npm run frontend` (o `cd Frontend && npm start`).

Comprueba que el backend responda abriendo `http://localhost:3000/api/test` en la computadora. La app usa `localhost` en web y simuladores, `10.0.2.2` en el emulador Android y detecta la dirección del equipo que ejecuta Expo en un teléfono físico. Si el teléfono no logra conectarse, ambos deben estar en la misma red Wi-Fi; permite conexiones entrantes al puerto 3000 en el firewall o configura `EXPO_PUBLIC_API_URL` en el `.env` de la raíz con la IP LAN de la computadora, por ejemplo `http://192.168.1.10:3000` (no uses `localhost` en el teléfono).
