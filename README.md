DayReady - Sistema de Pedidos Anticipados
DayReady es una plataforma digital diseñada para modernizar el consumo de alimentos dentro del instituto. El sistema permite a los estudiantes apartar su comida con antelación, eliminando las esperas en filas y fomentando una cultura de manejo de dinero digital a través de una billetera electrónica integrada.

Proposito del Proyecto
Optimizacion del tiempo: Reduccion drastica de las filas en la cafeteria durante los periodos de receso.

Inclusion financiera digital: Familiarizar a los estudiantes con el uso de saldos digitales y presupuestos mediante la DayWallet.

Eficiencia operativa: Facilitar al personal de cocina la preparacion anticipada de pedidos basada en la demanda real.

Caracteristicas Tecnicas
Storefront Inteligente: Catalogo de productos donde los estudiantes pueden reservar sus alimentos.

DayWallet: Visualizacion y gestion de saldo disponible para compras instantaneas.

Gestion de Usuario: Interfaz centralizada para modificar informacion personal, consultar el historial de pedidos y gestionar metodos de pago.

Interfaz de Alto Rendimiento: Navegacion interna optimizada para dispositivos moviles y escritorio, evitando recargas innecesarias del navegador.

Tecnologias Utilizadas
React.js: Biblioteca principal para la construccion de la interfaz.

React Router DOM: Gestion de rutas y navegacion del sistema.

Tailwind CSS: Framework de estilos para un diseño moderno y responsivo.

JavaScript ES6+: Logica de programacion moderna.

Dependencias Principales
El proyecto requiere las siguientes librerias instaladas:

react-router-dom

tailwindcss

lucide-react (opcional para iconos)

Configuracion e Instalacion
Clonar el repositorio.

Instalar las dependencias con el comando: npm install

Iniciar el proyecto en modo desarrollo: npm start

Para generar la version de produccion: npm run build

Detalles del Sistema
El sistema implementa una arquitectura de componentes modulares. El perfil de usuario funciona como un contenedor de estados que permite cambiar entre diferentes secciones (Mis Pedidos, Tarjetas, Ayuda) de manera fluida sin cerrar la ventana principal, mejorando la experiencia de usuario.
