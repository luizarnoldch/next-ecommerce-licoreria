
# Repositorio DB

Vamos a diseñar el esquema de base de datos para tu ecommerce basado en tus respuestas. Aquí está la estructura detallada:

---

## **Esquema de Base de Datos**

### **1. Tablas Principales**

| Tabla                   | Descripción                                                                 |
| ----------------------- | --------------------------------------------------------------------------- |
| **users**               | Usuarios registrados (clientes, admins).                                    |
| **user_roles**          | Roles (cliente, admin).                                                     |
| **user_addresses**      | Historial de direcciones de envío/facturación por usuario.                  |
| **user_activities**     | Comportamiento del usuario (productos vistos, búsquedas, timestamps).       |
| **guest_orders**        | Ordenes de compra como invitado (email temporal, dirección).                |
| **products**            | Productos físicos con atributos básicos (nombre, descripción, precio).      |
| **product_variants**    | Variantes de productos (tallas, colores, SKU único).                        |
| **product_attributes**  | Atributos personalizados (ej: material, peso).                              |
| **categories**          | Categorías de productos (con `parent_id` para jerarquías futuras).          |
| **reviews**             | Reseñas y valoraciones de clientes (con aprobación previa si es necesario). |
| **inventory_locations** | Ubicaciones de almacenes (ej: Lima, Arequipa).                              |
| **stock**               | Stock por variante y ubicación + alerta de stock bajo.                      |
| **orders**              | Pedidos (enlace a usuarios o guest_orders).                                 |
| **order_items**         | Productos/variantes en cada pedido.                                         |
| **order_status**        | Estados del pedido (pendiente, enviado, cancelado).                         |
| **refunds**             | Solicitudes de reembolso (motivo, monto, estado).                           |
| **shipping_rules**      | Reglas de cálculo de envío (por peso, ubicación).                           |
| **payment_methods**     | Métodos de pago (MercadoPago, futuros métodos).                             |
| **transactions**        | Transacciones de pago (éxito/fallo, monto, ID externo).                     |
| **coupons**             | Cupones de descuento (porcentaje/monto fijo, validez, usos).                |
| **tax_rates**           | Impuestos por ubicación (ej: IGV en Perú por región).                       |
| **logs**                | Registros de auditoría (cambios, accesos, eventos).                         |
| **posts**               | Contenido integrado (blog, FAQs).                                           |
| **recommendations**     | Recomendaciones basadas en historial de compras/vistas.                     |

---

## **2. Relaciones Clave**

### **Usuarios y Autenticación**

- `users` → `user_roles` (un usuario puede tener múltiples roles).
- `users` → `user_addresses` (un usuario puede tener varias direcciones).
- `users` → `user_activities` (registro de vistas y búsquedas).
- `users` → `user_social_logins` (Google/Facebook vinculados).

### **Productos**

- `products` → `product_variants` (un producto puede tener múltiples variantes).
- `products` → `product_attributes` (atributos personalizados).
- `products` → `categories` (un producto puede estar en múltiples categorías).

### **Inventario**

- `product_variants` → `stock` (stock por variante y ubicación).
- `stock` → `inventory_locations` (relación con almacenes).

### **Pedidos**

- `orders` → `users` (pedidos de usuarios registrados) o `guest_orders`.
- `orders` → `order_items` (productos en el pedido).
- `orders` → `order_status` (historial de estados: pendiente → enviado).
- `orders` → `shipping_rules` (cálculo de costo de envío).

### **Pagos y Descuentos**

- `orders` → `transactions` (relación con intentos de pago).
- `orders` → `coupons` (cupones aplicados al pedido).

---

## **3. Diagrama Entidad-Relación (Simplificado)**

```mermeid
┌─────────────┐       ┌─────────────────┐       ┌──────────────┐
│   users     │───────│ user_addresses  │       │  guest_orders│
└─────────────┘       └─────────────────┘       └──────────────┘
     │                      │                           │
     │                      ▼                           ▼
     ├─────────────────┐  ┌─────────────────┐       ┌──────────────┐
     │ user_activities │  │    orders       │───────│ order_items  │
     └─────────────────┘  └─────────────────┘       └──────────────┘
          │                   │        ▲                   │
          ▼                   ▼        └───────────────────┘
┌─────────────────┐  ┌──────────────┐       ┌──────────────┐
│ product_variants│◄─┤   products   │───────│  categories  │
└─────────────────┘  └──────────────┘       └──────────────┘
     │                      ▲                   ▲
     ▼                      │                   │
┌──────────────┐       ┌──────────────┐       ┌──────────────┐
│    stock     │───────│ inventory    │       │ product_attr │
└──────────────┘       │ _locations   │       └──────────────┘
                       └──────────────┘
```

---
