# Mi PPT

Sitio estático de Mi PPT (presentaciones con estrategia). Servido con nginx en Docker.

## Coolify
- Build pack: Dockerfile
- Puerto: 80
- Dominio: https://myppt.aktivgroup.cl

## Local
docker build -t myppt . && docker run -p 8080:80 myppt
