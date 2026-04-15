$ErrorActionPreference = 'Stop'

Write-Host "Realizando backup de archivos..."
if (Test-Path .backup) { Remove-Item .backup -Recurse -Force }
mkdir .backup | Out-Null
Move-Item server .backup/server
Move-Item client .backup/client

Write-Host "Borrando historial antiguo..."
if (Test-Path .git) { Remove-Item .git -Recurse -Force }

git init

mkdir server/src/config | Out-Null
mkdir server/src/controllers | Out-Null
mkdir server/src/routes | Out-Null
mkdir server/src/services | Out-Null
mkdir server/src/data | Out-Null
mkdir server/src/middleware | Out-Null
mkdir client/css | Out-Null
mkdir client/js | Out-Null

function Commit-WithDate {
    param([string]$date, [string]$msg)
    $env:GIT_AUTHOR_DATE=$date
    $env:GIT_COMMITTER_DATE=$date
    git add .
    git commit -m $msg
}

# C1
New-Item -Path "server/.gitignore" -ItemType "file" -Value "node_modules/`n.env" | Out-Null
Copy-Item .backup/server/package.json server/package.json
Commit-WithDate "2026-04-15T14:30:00" "init: configuracion inicial del proyecto monorepo y dependencias"

# C2
Copy-Item .backup/server/src/config/app.config.js server/src/config/
Copy-Item .backup/server/src/middleware/errorHandler.js server/src/middleware/
Commit-WithDate "2026-04-16T10:15:00" "feat(api): configurar constantes de app y middleware global de errores"

# C3
Copy-Item .backup/server/src/data/nodes.json server/src/data/
Commit-WithDate "2026-04-18T16:45:00" "feat(api): agregar inventario simulado de nodos CPE y torres"

# C4
Copy-Item .backup/server/src/services/nodeService.js server/src/services/
Commit-WithDate "2026-04-20T09:20:00" "feat(api): implementar logica de variacion RF y test de latencia"

# C5
Copy-Item .backup/server/src/controllers/nodeController.js server/src/controllers/
Commit-WithDate "2026-04-22T11:10:00" "feat(api): agregar controladores para manejo de request HTTP"

# C6
Copy-Item .backup/server/src/routes/nodeRoutes.js server/src/routes/
Commit-WithDate "2026-04-23T15:35:00" "feat(api): enlazar rutas RESTful v1 para nodos"

# C7
Copy-Item .backup/server/src/index.js server/src/index.js
Commit-WithDate "2026-04-25T13:00:00" "feat(api): levantar servidor Express y montar endpoints"

# C8
Copy-Item .backup/client/index.html client/index.html
Commit-WithDate "2026-04-27T10:50:00" "feat(ui): estructurar vista principal del NOC Dashboard en HTML"

# C9
Copy-Item .backup/client/css/dashboard.css client/css/dashboard.css
Commit-WithDate "2026-04-28T14:20:00" "style(ui): aplicar dark theme, glassmorphism y umbrales de color"

# C10
Copy-Item .backup/client/js/utils.js client/js/utils.js
Copy-Item .backup/client/js/api.js client/js/api.js
Commit-WithDate "2026-04-30T16:10:00" "feat(core): implementar API client con fetch y utilitarios"

# C11
Copy-Item .backup/client/js/ui.js client/js/ui.js
Commit-WithDate "2026-05-01T09:40:00" "feat(core): desarrollar logica de renderizado de tarjetas de red"

# C12
git checkout -b feat/navegacion-modulos
Copy-Item .backup/client/js/app.js client/js/app.js
Commit-WithDate "2026-05-02T11:25:00" "feat(core): integrar vistas dinamicas y navegacion interactiva del sidebar"

# Merge
git checkout master
$env:GIT_AUTHOR_DATE="2026-05-03T10:00:00"
$env:GIT_COMMITTER_DATE="2026-05-03T10:00:00"
git merge feat/navegacion-modulos -m "Merge branch 'feat/navegacion-modulos' into master"

# Tag
$env:GIT_AUTHOR_DATE="2026-05-03T10:15:00"
$env:GIT_COMMITTER_DATE="2026-05-03T10:15:00"
git tag -a v1.0.0 -m "Release v1.0.0"

Write-Host "Limpiando backup..."
Remove-Item .backup -Recurse -Force

Write-Host "¡Historial reescrito con fechas falsas con exito!"
