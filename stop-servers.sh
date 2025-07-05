#!/bin/bash

echo "========================================"
echo "    PARANDO SISTEMA ERP"
echo "========================================"
echo

echo "Parando containers..."
docker-compose down

echo
echo "========================================"
echo "    SISTEMA PARADO!"
echo "========================================"
echo
echo "Todos os containers foram parados."
echo "Para iniciar novamente, execute: ./start-servers.sh" 