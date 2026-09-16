# 🔐 Sistema de Autenticación y Redirecciones - Middleware

Sistema automático de protección de rutas y redirecciones basado en el estado de autenticación del usuario.

## 🎯 Funcionalidad

### **Redirecciones Automáticas**

#### 1. **Usuario NO autenticado intenta acceder a ruta protegida**
```
Usuario visita: /dashboard
Estado: No autenticado
Acción: Redirige a /signin?redirect=/dashboard
```

#### 2. **Usuario autenticado intenta acceder a páginas de login/signup**
```
Usuario visita: /signin
Estado: Autenticado
Acción: Redirige a /dashboard
```

#### 3. **Usuario se autentica desde /signin con redirect**
```
Usuario visita: /signin?redirect=/dashboard
Inicia sesión exitosamente
Acción: Redirige a /dashboard (la ruta guardada)
```

## 📁 Estructura de Archivos

```
fradap-appointments/
├── middleware.js                    # Configuración principal del middleware
└── libs/supabase/
    └── middleware.js                # Lógica de autenticación y redirecciones
```

## 🔧 Configuración

### **Rutas Protegidas**
Rutas que requieren autenticación:
```javascript
const protectedRoutes = ['/dashboard'];
```

### **Rutas de Autenticación**
Rutas a las que usuarios autenticados NO deben acceder:
```javascript
const authRoutes = ['/signin', '/signup'];
```

### **Rutas Excluidas del Auth Check**
Rutas que no necesitan verificación de autenticación:
```javascript
const skipAuthRoutes = ['/api/webhook', '/api/lead'];
```

## 🚀 Flujos de Usuario

### **Flujo 1: Usuario No Autenticado → Ruta Protegida**
1. Usuario visita `/dashboard` sin estar autenticado
2. Middleware detecta que no hay sesión
3. Redirige a `/signin?redirect=/dashboard`
4. Usuario inicia sesión
5. Automáticamente redirige a `/dashboard`

### **Flujo 2: Usuario Autenticado → Ruta de Auth**
1. Usuario ya autenticado intenta ir a `/signin`
2. Middleware detecta sesión activa
3. Redirige automáticamente a `/dashboard`
4. Usuario no puede ver la página de login si ya está autenticado

### **Flujo 3: Acceso Directo al Dashboard**
1. Usuario autenticado visita `/dashboard`
2. Middleware verifica sesión
3. Permite acceso sin redirección
4. Usuario ve su dashboard

### **Flujo 4: Cierre de Sesión**
1. Usuario hace logout
2. Intenta acceder a `/dashboard`
3. Middleware detecta que no hay sesión
4. Redirige a `/signin?redirect=/dashboard`

## 🛠️ Implementación Técnica

### **Middleware Principal** (`middleware.js`)
```javascript
import { updateSession } from "@/libs/supabase/middleware";

export async function middleware(request) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
```

### **Lógica de Redirección** (`libs/supabase/middleware.js`)
```javascript
const { data: { user } } = await supabase.auth.getUser();

// Protección de rutas
if (!user && isProtectedRoute) {
  redirectUrl.pathname = '/signin';
  redirectUrl.searchParams.set('redirect', pathname);
  return NextResponse.redirect(redirectUrl);
}

// Prevenir acceso a auth si ya está autenticado
if (user && isAuthRoute) {
  const redirectTo = request.nextUrl.searchParams.get('redirect');
  redirectUrl.pathname = redirectTo || '/dashboard';
  return NextResponse.redirect(redirectUrl);
}
```

## 📋 Casos de Uso

### **Caso 1: Proteger Nueva Ruta**
Para proteger una nueva ruta, agrégala al array:
```javascript
const protectedRoutes = ['/dashboard', '/settings', '/profile'];
```

### **Caso 2: Agregar Ruta de Auth**
Para una nueva página de autenticación:
```javascript
const authRoutes = ['/signin', '/signup', '/forgot-password'];
```

### **Caso 3: Excluir API del Auth Check**
Para APIs públicas o webhooks:
```javascript
const skipAuthRoutes = ['/api/webhook', '/api/lead', '/api/public'];
```

## 🎨 UX/UI Integración

### **Header Dinámico**
El `Header.js` detecta el estado de autenticación:
- **No autenticado**: Muestra "Agendar Consultoría" → `/signin`
- **Autenticado**: Muestra "Dashboard" → `/dashboard`

### **Sincronización en Tiempo Real**
```javascript
// Header.js escucha cambios de autenticación
supabase.auth.onAuthStateChange((_event, session) => {
  setUser(session?.user ?? null);
});
```

## 🔒 Seguridad

### **Nivel 1: Middleware (Server-Side)**
- ✅ Verifica autenticación en cada request
- ✅ Previene acceso no autorizado a rutas protegidas
- ✅ Redirige automáticamente según estado de sesión

### **Nivel 2: Componente (Client-Side)**
- ✅ Dashboard verifica sesión antes de renderizar
- ✅ Redirige a `/signin` si no hay usuario
- ✅ Previene renderizado de contenido protegido

### **Nivel 3: Row Level Security (Database)**
- ✅ Políticas RLS en Supabase
- ✅ Usuarios solo ven sus propios datos
- ✅ Admins tienen permisos especiales

## 🚨 Troubleshooting

### **"Redirección infinita"**
- Verifica que las rutas en `protectedRoutes` y `authRoutes` no se solapen
- Asegúrate de que `/signin` no esté en `protectedRoutes`

### **"No redirige después del login"**
- Verifica que el parámetro `?redirect=` se esté pasando correctamente
- Revisa que la ruta de destino esté en `protectedRoutes`

### **"Puedo acceder a /dashboard sin autenticación"**
- Verifica que `/dashboard` esté en el array `protectedRoutes`
- Revisa la configuración del middleware en `middleware.js`

## 📝 Notas Importantes

1. **Middleware se ejecuta en TODAS las rutas** excepto las del `matcher`
2. **Redirecciones son automáticas** - no requieren código en componentes
3. **Estado de sesión se refresca** en cada request
4. **Query params se preservan** durante redirecciones cuando es necesario

## 🎯 Testing

### **Test 1: Protección de Rutas**
```bash
# Sin autenticación
curl http://localhost:3000/dashboard
# Debe redirigir a /signin?redirect=/dashboard
```

### **Test 2: Prevención de Auth Duplicado**
```bash
# Con autenticación válida
curl -b "cookies.txt" http://localhost:3000/signin
# Debe redirigir a /dashboard
```

### **Test 3: Flujo Completo**
1. Visitar `/dashboard` sin auth → redirige a `/signin?redirect=/dashboard`
2. Hacer login → redirige a `/dashboard`
3. Intentar ir a `/signin` → redirige a `/dashboard`
4. Hacer logout → visitar `/dashboard` → redirige a `/signin`

---

**Sistema implementado en Daniel Tamayo** 🚀
*Next.js 15 + Supabase SSR*

