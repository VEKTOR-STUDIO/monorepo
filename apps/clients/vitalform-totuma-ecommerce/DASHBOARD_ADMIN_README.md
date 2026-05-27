# 🎮 Dashboard de Administrador - Francesca D'Apuzzo

Sistema dual de dashboards con diseño inspirado en videojuegos modernos para gestión de citas.

## 🚀 Características

### Dashboard de Usuario (`role: 'user'`)
- ✅ Formulario para agendar nueva cita
- ✅ Vista de cita activa (si existe)
- ✅ Opción para cancelar cita
- ✅ Historial de citas pasadas
- ✅ Un usuario solo puede tener una cita activa a la vez

### Dashboard de Administrador (`role: 'admin'`)
- 🎯 Vista completa de todas las citas del sistema
- 📊 Estadísticas en tiempo real (pendientes/confirmadas)
- ⚡ Gestión rápida con botones de acción
- 🎨 Diseño gaming con efectos visuales avanzados

## 📁 Estructura de Archivos

```
fradap-appointments/
├── app/dashboard/page.js          # Dashboard principal (detecta rol)
├── components/
│   ├── AdminDashboard.js          # Vista admin (gestión de citas)
│   ├── AppointmentForm.js         # Formulario para usuarios
│   └── ActiveAppointment.js       # Vista de cita activa
├── set_admin_role.sql             # Script para crear admin
└── DASHBOARD_ADMIN_README.md      # Esta guía
```

## 🔧 Configuración Inicial

### 1. Crear la Tabla de Appointments

Ejecuta en el SQL Editor de Supabase el script que ya fue proporcionado anteriormente para crear la tabla `appointments`.

### 2. Configurar Políticas RLS para Admins

**IMPORTANTE**: Para que los admins puedan ver todas las citas, necesitas ejecutar:

```sql
-- Ejecuta el archivo: fix_admin_rls.sql
-- O copia y pega estas políticas:

-- Los admins pueden ver TODAS las citas
CREATE POLICY "Admins can view all appointments"
  ON public.appointments
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 
      FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Los admins pueden actualizar cualquier cita
CREATE POLICY "Admins can update all appointments"
  ON public.appointments
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 
      FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );
```

### 3. Configurar un Usuario como Admin

**Opción A: Por Email**
```sql
UPDATE public.profiles
SET role = 'admin'
WHERE email = 'hola@francescadapuzzo.com';
```

**Opción B: Por ID**
```sql
UPDATE public.profiles
SET role = 'admin'
WHERE id = 'uuid-del-usuario';
```

**Verificar:**
```sql
SELECT id, email, role, name
FROM public.profiles
WHERE role = 'admin';
```

## 🎯 Estados de Citas

| Estado | Color | Descripción |
|--------|-------|-------------|
| `pending` | 🟡 Warning | Cita solicitada, pendiente de confirmación |
| `confirmed` | 🟢 Success | Cita confirmada por admin |
| `cancelled` | 🔴 Error | Cita cancelada (por usuario o admin) |
| `completed` | 🔵 Info | Cita ya realizada |

## 🎮 Funcionalidades del Admin Dashboard

### Sección 1: Citas Pendientes
- Lista todas las citas con status `pending`
- **Acciones disponibles:**
  - ✅ **Confirmar**: Cambia status a `confirmed`
  - ❌ **Cancelar**: Cambia status a `cancelled`

### Sección 2: Citas Confirmadas
- Lista todas las citas con status `confirmed`
- **Acciones disponibles:**
  - ✔️ **Completar**: Cambia status a `completed`

### Características Visuales
- 🎨 Gradientes animados en hover
- 💫 Efectos de glow al pasar el mouse
- 📱 Totalmente responsive (grid 2 columnas en desktop)
- 🎯 Líneas decorativas con gradientes de color
- 🔄 Loading states en cada acción
- 🎲 Diseño inspirado en UI de videojuegos (VALORANT, League of Legends)

## 🔐 Seguridad y Permisos

### Row Level Security (RLS)
- ✅ Usuarios regulares: Solo ven sus propias citas
- ✅ Admins: Ven todas las citas (verificado en código)
- ✅ Políticas RLS activas en la tabla `appointments`

### Verificación de Roles
```javascript
// En app/dashboard/page.js
const isAdmin = profile?.role === "admin";

if (isAdmin) {
  // Obtener todas las citas
  const { data: allAppointments } = await supabase
    .from("appointments")
    .select("*")
    .order("appointment_date", { ascending: true });
} else {
  // Solo citas del usuario
  const { data: userAppointments } = await supabase
    .from("appointments")
    .select("*")
    .eq("user_id", user.id);
}
```

## 🎨 Guía de Diseño

### Paleta de Colores
- **Primary**: Azul vibrante (`#0f7edd`)
- **Secondary**: Púrpura (`#784dd6`)
- **Warning**: Amarillo (citas pendientes)
- **Success**: Verde (citas confirmadas)
- **Error**: Rojo (cancelaciones)
- **Info**: Azul claro (completadas)

### Componentes Clave
```jsx
// Card con efecto hover gaming
<div className="group relative bg-gradient-to-br from-base-100 to-base-200 
                border-2 border-base-content/10 rounded-2xl p-6 
                hover:border-primary/50 transition-all duration-300 
                hover:shadow-[0_0_40px_rgba(var(--color-primary),0.3)]">
```

## 📊 Flujo de Trabajo

### Usuario Regular
1. Accede al dashboard → Ve formulario
2. Completa y envía cita → Status `pending`
3. Dashboard muestra cita activa en lugar del formulario
4. Puede cancelar la cita
5. Después de cancelar/completar → Vuelve a ver el formulario

### Administrador
1. Accede al dashboard → Ve AdminDashboard
2. Sección superior: Citas pendientes de confirmación
3. Click en "Confirmar" → Mueve a sección confirmadas
4. Sección inferior: Citas confirmadas
5. Click en "Completar" → Marca como finalizada

## 🔄 Auto-Refresh
Todas las acciones (confirmar, cancelar, completar) refrescan automáticamente la página usando:
```javascript
router.refresh();
```

## 🎯 Tips de Uso

### Para Desarrolladores
- El componente `AdminDashboard` es client-side (`"use client"`)
- Usa `useRouter` de Next.js para refrescar datos
- Loading states previenen doble-click accidental
- Todas las consultas usan las reglas de `sql-database-rules.mdc`

### Para Administradores
- Las citas se ordenan por fecha (más próximas primero)
- Contador de citas en tiempo real en el header
- ID corto visible en cada card para referencia rápida
- Información de contacto visible (teléfono, empresa)

## 🚨 Troubleshooting

### "No veo el AdminDashboard"
- Verifica que tu usuario tenga `role = 'admin'` en la tabla `profiles`
- Cierra sesión y vuelve a iniciar
- Revisa la consola del navegador por errores

### "Error al actualizar cita"
- Verifica que RLS esté configurado correctamente
- Confirma que el admin tenga permisos adecuados
- Revisa que el appointmentId sea válido

### "Las citas no se refrescan"
- El sistema usa `router.refresh()` automático
- Si no funciona, recarga la página manualmente
- Verifica la conexión a Supabase

## 📝 Próximas Mejoras

- [ ] Notificaciones por email al confirmar citas
- [ ] Calendario visual para ver disponibilidad
- [ ] Filtros por fecha/estado
- [ ] Exportar listado de citas a CSV
- [ ] Chat directo con el usuario desde el admin
- [ ] Integración con Google Calendar

## 🎉 ¡Listo!

Tu sistema de gestión de citas con dashboard dual está completamente funcional. El diseño gaming y las animaciones modernas hacen que la experiencia sea única y profesional.

---

**Desarrollado para Francesca D'Apuzzo** 🚀
*No solo diseño cejas, diseño confianza.*

