@echo off
echo ========================================
echo    INICIANDO SISTEMA ERP
echo ========================================
echo.

echo Verificando se o Docker esta rodando...
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo ERRO: Docker nao esta rodando!
    echo Por favor, inicie o Docker Desktop primeiro.
    pause
    exit /b 1
)

echo Docker OK! Iniciando containers...
docker-compose up -d

echo.
echo Aguardando inicializacao...
timeout /t 10 /nobreak >nul

echo.
echo ========================================
echo    SISTEMA PRONTO!
echo ========================================
echo.
echo Frontend: http://localhost
echo Backend:  http://localhost:8080
echo.
echo Login: admin / admin123
echo.
echo Pressione qualquer tecla para abrir o sistema...
pause >nul

start http://localhost

echo.
echo Sistema iniciado com sucesso!
echo Para parar, execute: docker-compose down 