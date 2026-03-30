
#!/usr/bin/env pwsh

# Script para iniciar desenvolvimento completo do projeto

Write-Host "╔════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  Sistema de Monitoramento - Start Script  ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Cores
$Green = @{ ForegroundColor = 'Green' }
$Yellow = @{ ForegroundColor = 'Yellow' }
$Cyan = @{ ForegroundColor = 'Cyan' }

# Verificar Node.js
Write-Host "🔍 Verificando dependências..." @Cyan
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js $nodeVersion" @Green
} catch {
    Write-Host "❌ Node.js não encontrado! Instale em https://nodejs.org/" -ForegroundColor Red
    exit 1
}

# Verificar npm
try {
    $npmVersion = npm --version
    Write-Host "✅ npm $npmVersion" @Green
} catch {
    Write-Host "❌ npm não encontrado!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "📦 Instalando dependências..." @Cyan

# Instalar dependências frontend
Write-Host "   • Instalando pacotes React/Vite..." @Yellow
npm install | Out-Null

# Instalar dependências backend
Write-Host "   • Instalando Express e CORS..." @Yellow
npm install express cors | Out-Null

Write-Host "✅ Dependências instaladas!" @Green
Write-Host ""

# Menu de opções
Write-Host "Escolha uma opção:" @Cyan
Write-Host ""
Write-Host "1️⃣  - Iniciar Desenvolvimento (Frontend + Backend)"
Write-Host "2️⃣  - Build para Produção"
Write-Host "3️⃣  - Apenas Backend (http://localhost:3001)"
Write-Host "4️⃣  - Apenas Frontend (http://localhost:5173)"
Write-Host "5️⃣  - Teste Backend com curl"
Write-Host "6️⃣  - Sair"
Write-Host ""

$choice = Read-Host "Digite o número da opção"

switch ($choice) {
    "1" {
        Write-Host ""
        Write-Host "🚀 Iniciando DESENVOLVIMENTO completo..." @Green
        Write-Host ""
        Write-Host "Backend:  http://localhost:3001" @Cyan
        Write-Host "Frontend: http://localhost:5173" @Cyan
        Write-Host ""
        Write-Host "Ctrl+C para parar" @Yellow
        Write-Host ""
        
        # Iniciar backend em background
        Write-Host "▶️  Iniciando Backend..." @Yellow
        Start-Process -NoNewWindow -FilePath "node" -ArgumentList "servidor.js"
        Start-Sleep -Seconds 2
        
        # Iniciar frontend
        Write-Host "▶️  Iniciando Frontend..." @Yellow
        npm run dev
    }
    
    "2" {
        Write-Host ""
        Write-Host "🔨 Build para Produção..." @Yellow
        npm run build
        Write-Host ""
        Write-Host "✅ Build concluído!" @Green
        Write-Host "📁 Arquivos em: dist/" @Cyan
    }
    
    "3" {
        Write-Host ""
        Write-Host "▶️  Iniciando Backend..." @Yellow
        Write-Host "📍 http://localhost:3001" @Cyan
        Write-Host ""
        Write-Host "Ctrl+C para parar" @Yellow
        Write-Host ""
        node servidor.js
    }
    
    "4" {
        Write-Host ""
        Write-Host "▶️  Iniciando Frontend..." @Yellow
        Write-Host "📍 http://localhost:5173" @Cyan
        Write-Host ""
        Write-Host "Ctrl+C para parar" @Yellow
        Write-Host ""
        npm run dev
    }
    
    "5" {
        Write-Host ""
        Write-Host "🧪 Teste Backend com curl" @Yellow
        Write-Host ""
        
        # Verificar se backend está rodando
        try {
            $response = curl -s http://localhost:3001/health
            Write-Host "✅ Backend respondendo!" @Green
            Write-Host ""
            
            Write-Host "1. Consultar estado de alerta:" @Cyan
            Write-Host "   curl http://localhost:3001/alerta" @Yellow
            Write-Host ""
            
            Write-Host "2. Criar alerta de trovoada:" @Cyan
            Write-Host "   curl -X POST http://localhost:3001/alerta \" @Yellow
            Write-Host "     -H ""Content-Type: application/json"" \" @Yellow
            Write-Host "     -d '{""level"": 2, ""weathercode"": 95, ""cape"": 2500, ""temperature"": 20, ""location"": ""Luanda"", ""duration"": 10000}'" @Yellow
            Write-Host ""
            
            Write-Host "3. Cancelar alerta:" @Cyan
            Write-Host "   curl -X DELETE http://localhost:3001/alerta" @Yellow
            Write-Host ""
            
            Write-Host "4. Ver status:" @Cyan
            Write-Host "   curl http://localhost:3001/alerta/status" @Yellow
        } catch {
            Write-Host "❌ Backend não está rodando!" -ForegroundColor Red
            Write-Host "   Inicie com: node servidor.js" @Yellow
        }
    }
    
    "6" {
        Write-Host "👋 Até logo!" @Green
        exit 0
    }
    
    default {
        Write-Host "❌ Opção inválida!" -ForegroundColor Red
        exit 1
    }
}
