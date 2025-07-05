#!/bin/bash

echo "========================================"
echo "    INICIANDO SISTEMA ERP"
echo "========================================"
echo

echo "Verificando se o Docker está rodando..."
if ! docker info > /dev/null 2>&1; then
    echo "ERRO: Docker não está rodando!"
    echo "Por favor, inicie o Docker primeiro."
    exit 1
fi

echo "Docker OK! Iniciando containers..."
docker-compose up -d

echo
echo "Aguardando inicialização..."
sleep 10

echo
echo "========================================"
echo "    SISTEMA PRONTO!"
echo "========================================"
echo
echo "Frontend: http://localhost"
echo "Backend:  http://localhost:8080"
echo
echo "Login: admin / admin123"
echo
echo "Pressione Enter para abrir o sistema..."
read

# Abrir no navegador padrão
if command -v xdg-open > /dev/null; then
    xdg-open http://localhost
elif command -v open > /dev/null; then
    open http://localhost
else
    echo "Não foi possível abrir o navegador automaticamente."
    echo "Acesse: http://localhost"
fi

echo
echo "Sistema iniciado com sucesso!"
echo "Para parar, execute: ./stop-servers.sh" 