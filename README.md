# Mi PPT

Sitio web de Mi PPT: presentaciones PowerPoint con estrategia y visual impactante para empresas y ejecutivos. "Comunicar bien es vender bien."

## Qué hay

Sitio estático, sin build ni dependencias:

- `index.html` — la página completa (una sola).
- `styles.css` — estilos.
- `script.js` — comparador antes/después, puntero láser, matriz de valor y **datos de contacto**.
- `PRODUCT.md` — brief del producto para el plugin de diseño Impeccable.

## Antes de publicar: datos de contacto

Edita el bloque `CONTACTO` al inicio de `script.js`:

```js
const CONTACTO = {
  whatsapp: "56900000000",      // solo dígitos, con código de país, sin "+"
  email: "hola@ejemplo.com",
  mensaje: "Hola, quiero conversar sobre una presentación.",
};
```

Todos los botones de WhatsApp y correo se arman desde ahí.

## Ver en local

```bash
python3 -m http.server 8765 --directory .
```

Luego abre http://localhost:8765.

## Publicar

Cualquier hosting estático sirve. Con GitHub Pages: Settings → Pages → Branch `main`, carpeta `/ (root)`.
