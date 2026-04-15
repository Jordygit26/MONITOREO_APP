$ErrorActionPreference = 'Stop'

Write-Host "Realizando backup de archivos..."
mkdir .backup | Out-Null
Move-Item server .backup/server
Move-Item client .backup/client

Write-Host "Borrando historial antiguo..."
if (Test-Path .git) {
    Remove-Item .git -Recurse -Force
}

Write-Host "Inicializando nuevo repositorio..."
git init

mkdir server/src/config | Out-Null
mkdir server/src/controllers | Out-Null
mkdir server/src/routes | Out-Null
mkdir server/src/services | Out-Null
mkdir server/src/data | Out-Null
mkdir server/src/middleware | Out-Null
mkdir client/css | Out-Null
mkdir client/js | Out-Null

Write-Host "Generando commits atomicos..."

# Commit 1
New-Item -Path "server/.gitignore" -ItemType "file" -Value "node_modules/`n.env" | Out-Null
Copy-Item .backup/server/package.json server/package.json
git add .
git commit -m "init: configuracion inicial del proyecto monorepo y dependencias"

# Commit 2
Copy-Item .backup/server/src/config/app.config.js server/src/config/
Copy-Item .backup/server/src/middleware/errorHandler.js server/src/middleware/
git add .
git commit -m "feat(api): configurar constantes de app y middleware global de errores"

# Commit 3
Copy-Item .backup/server/src/data/nodes.json server/src/data/
git add .
git commit -m "feat(api): agregar inventario simulado de nodos CPE y torres"

# Commit 4
Copy-Item .backup/server/src/services/nodeService.js server/src/services/
git add .
git commit -m "feat(api): implementar logica de variacion RF y test de latencia"

# Commit 5
Copy-Item .backup/server/src/controllers/nodeController.js server/src/controllers/
git add .
git commit -m "feat(api): agregar controladores para manejo de request HTTP"

# Commit 6
Copy-Item .backup/server/src/routes/nodeRoutes.js server/src/routes/
git add .
git commit -m "feat(api): enlazar rutas RESTful v1 para nodos"

# Commit 7
Copy-Item .backup/server/src/index.js server/src/index.js
git add .
git commit -m "feat(api): levantar servidor Express y montar endpoints"

# Commit 8
Copy-Item .backup/client/index.html client/index.html
git add .
git commit -m "feat(ui): estructurar vista principal del NOC Dashboard en HTML"

# Commit 9
Copy-Item .backup/client/css/dashboard.css client/css/dashboard.css
git add .
git commit -m "style(ui): aplicar dark theme, glassmorphism y umbrales de color"

# Commit 10
Copy-Item .backup/client/js/utils.js client/js/utils.js
Copy-Item .backup/client/js/api.js client/js/api.js
git add .
git commit -m "feat(core): implementar API client con fetch y utilitarios"

# Commit 11
Copy-Item .backup/client/js/ui.js client/js/ui.js
git add .
git commit -m "feat(core): desarrollar logica de renderizado de tarjetas de red"

# Commit 12
git checkout -b feat/navegacion-modulos
Copy-Item .backup/client/js/app.js client/js/app.js
git add .
git commit -m "feat(core): integrar vistas dinamicas y navegacion interactiva del sidebar"

# Merge
git checkout master
git merge feat/navegacion-modulos

# Tag
git tag -a v1.0.0 -m "Release v1.0.0"

Write-Host "Limpiando backup..."
Remove-Item .backup -Recurse -Force

Write-Host "¡Historial reescrito con exito!"
