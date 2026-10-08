# DayReady Móvil

Aplicación móvil del proyecto **DayReady** (sistema de pedidos anticipados
para el comedor del instituto), hecha con **Expo / React Native**. Permite a
los estudiantes explorar el catálogo de comida, apartar productos, pagar,
llevar el registro de sus pedidos y valorar lo que compraron desde el
celular, conectándose al mismo backend que usa la versión web del proyecto.

## Integrantes

- Fernando Javier Guerrero Iraheta
- David Eduardo Guardado Castro
- Ivanya Nolazco Cabrera

**Institución:** Instituto Técnico Ricaldone — 3.° año de Desarrollo de Software
**Módulo:** 5 — Desarrollo de componentes para dispositivos móviles
**Docente:** Daniel Wilfredo Granados Hernández

## Funcionalidades

| Funcionalidad | Dónde está |
|---|---|
| Inicio de sesión (la sesión queda guardada al cerrar la app) | `LoginScreen`, `AuthContext` |
| Registro de usuarios en 4 pasos con verificación por correo | `RegisterScreen` |
| Edición del perfil (nombre, apellido, teléfono, edad) | `ProfileScreen` |
| Recuperación y cambio de contraseña con código por correo | `ForgotPasswordScreen` |
| Splash screen personalizado + pantalla de carga | `app.json` (`expo-splash-screen`), `LoadingScreen` |
| Home con el nombre real del usuario, catálogo y menú del día | `HomeScreen` |
| Catálogo con valoraciones (estrellas) y stock de cada producto | `ProductCard`, `ProductDetailScreen` |
| Valoraciones y comentarios, sólo de productos ya comprados | `ReviewForm`, `ReviewCard`, `reviewsService` |
| Carrito: agregar, cambiar cantidades, eliminar y finalizar pedido | `CartContext`, `CartModal`, `CheckoutScreen`, `PaymentScreen` |
| No se puede comprar más de lo que hay en stock ni pedir con el carrito vacío | `CartContext`, backend `orderController` |
| Historial y detalle de pedidos; cancelar un pedido pendiente devuelve el stock | `OrderHistoryScreen`, `OrderDetailScreen` |
| Menú de navegación inferior (Inicio / Pedidos / Perfil) | `navigation/MainTabs` |

### Validaciones

Todas las reglas están en `src/utils/validators.js` y el backend las vuelve a
validar:

- Correos con formato válido y campos obligatorios sin valores vacíos.
- Contraseña segura (8+ caracteres, mayúscula, número y símbolo) y confirmación.
- Nombres sólo con letras; teléfono y carnet con formato válido.
- Edad entera entre 12 y 99 años.
- Cantidades enteras mayores que 0 y nunca mayores que el stock disponible.
- Tarjeta de 16 dígitos, vencimiento MM/AA no vencido y CVC de 3 dígitos.
- Valoración de 1 a 5 estrellas y comentario de 3 a 500 caracteres.

## Tecnologías y dependencias

| Paquete | Para qué se usa |
|---|---|
| `expo` | Entorno base (managed workflow) de la app |
| `react-native` | Framework de UI para móvil |
| `@react-navigation/native`, `native-stack`, `bottom-tabs` | Navegación entre pantallas y menú inferior |
| `react-native-screens`, `react-native-safe-area-context` | Dependencias nativas que exige React Navigation |
| `react-native-svg` | Dibuja el logo y las cabeceras "de ola" del diseño |
| `@react-native-async-storage/async-storage` | Guarda la sesión del cliente en el dispositivo |
| `expo-splash-screen` | Splash screen nativo personalizado con el logo de la marca |
| `expo-font`, `@expo-google-fonts/poppins`, `@expo-google-fonts/nunito` | Tipografías del diseño |
| `expo-build-properties` | Permite tráfico HTTP en el APK para conectarse al backend local |
| `@expo/vector-icons` | Íconos (incluido con Expo) |

Las peticiones HTTP se hacen con la función nativa **`fetch`** (ver
`src/config/api.js`); no se usa axios. No se usa Redux: la sesión y el
carrito se manejan con Context API (`src/context`).

## Estructura del proyecto

```
App.js                  Punto de entrada: providers + navegación (sin lógica de pantallas)
app.json                Configuración de Expo (nombre, íconos, splash, permisos)
eas.json                Perfiles de compilación del APK
assets/                 Íconos y splash generados a partir del logo de la marca
src/
  config/api.js         URL base del backend + helper de fetch con cookies
  context/              Sesión (AuthContext) y carrito (CartContext)
  navigation/           Stack raíz (RootNavigator) + Tab menú principal (MainTabs)
  screens/              Una pantalla por archivo
  components/           Componentes reutilizables (botones, tarjetas, estrellas...)
  services/             Una función por endpoint del backend
  utils/validators.js   Validaciones de formularios
  theme/colors.js       Paleta, radios, sombras y fuentes compartidas
```

## Configuración adicional

### Backend

El backend (carpeta `../../backend`) debe estar corriendo en el puerto `4000`:

```bash
cd backend
npm install
npm run dev
```

Para la demostración se agregó un script que carga **datos de prueba** sin
borrar nada de lo que ya existe: productos (uno agotado), un cliente con
pedidos hechos (uno entregado y otro pendiente que se puede cancelar) y
una reseña.

```bash
npm run seed
```

Usuario de prueba: `demo@dayready.com` / `Demo1234!`

Cambios hechos al backend para la app móvil:

- `Order` guarda `customerId` y el `productId` de cada item. Al crear una
  orden se descuenta el stock (sin permitir vender más de lo disponible) y al
  cancelarla se devuelve.
- Rutas nuevas: `GET /api/orders/customer/:customerId`,
  `PATCH /api/orders/:id/cancel` y `/api/reviews` (valoraciones).
- Edad (`age`) en el registro y la edición de clientes, con validación.

### URL del backend

`src/config/api.js` resuelve la URL así:

1. Si existe la variable `EXPO_PUBLIC_API_URL`, se usa esa (es la que se
   define en `eas.json` para el APK).
2. Si no: emulador de Android → `http://10.0.2.2:4000/api`; web/iOS →
   `http://localhost:4000/api`.

Para un **celular físico** hay que usar la IP de la PC dentro de la red
local (se ve con `ipconfig`, "Dirección IPv4" del Wi‑Fi). El celular y la PC
deben estar en la misma red.

### Correr en desarrollo

```bash
cd frontEnd/dayReadyMobile
npm install
npx expo start
```

### Generar el APK

1. Instalar EAS CLI e iniciar sesión: `npm install -g eas-cli` y `eas login`.
2. Poner la URL del backend en `EXPO_PUBLIC_API_URL` dentro de `eas.json`
   (por ejemplo `http://192.168.1.10:4000/api` o la URL del backend desplegado).
3. Compilar: `eas build -p android --profile preview`.
4. Al terminar, EAS da el enlace de descarga del `.apk` para instalarlo en el
   celular Android.

## Notas de alcance

- El login con Google y el pago con tarjeta son simulaciones visuales,
  porque el backend todavía no tiene esas integraciones. Al "pagar" sí se
  crea una orden real, se descuenta el stock y se limpia el carrito.
