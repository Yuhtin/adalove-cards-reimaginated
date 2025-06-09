#!/bin/bash

echo "🧪 Testando APIs do AdaLove 2..."

# Registrar usuário
echo "📝 Registrando usuário..."
REGISTER_RESPONSE=$(curl -s -X POST -H "Content-Type: application/json" \
  -d '{"username":"testuser2","email":"testuser2@test.com","password":"testpass"}' \
  http://localhost:3000/api/auth/register)
echo "✅ Registro: $REGISTER_RESPONSE"

# Fazer login
echo "🔐 Fazendo login..."
LOGIN_RESPONSE=$(curl -s -X POST -H "Content-Type: application/json" \
  -d '{"email":"testuser2@test.com","password":"testpass"}' \
  http://localhost:3000/api/auth/login)
echo "✅ Login: $LOGIN_RESPONSE"

# Extrair token
TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
echo "🎫 Token: $TOKEN"

# Testar student activities stats
echo "📊 Testando stats..."
STATS_RESPONSE=$(curl -s -H "Authorization: Bearer $TOKEN" \
  http://localhost:3000/api/student-activities/stats)
echo "✅ Stats: $STATS_RESPONSE"

# Testar activity types
echo "🏷️ Testando activity types..."
TYPES_RESPONSE=$(curl -s -H "Authorization: Bearer $TOKEN" \
  http://localhost:3000/api/student-activities/activity-types)
echo "✅ Activity Types: $TYPES_RESPONSE"

# Testar status types
echo "📋 Testando status types..."
STATUS_RESPONSE=$(curl -s -H "Authorization: Bearer $TOKEN" \
  http://localhost:3000/api/student-activities/status-types)
echo "✅ Status Types: $STATUS_RESPONSE"

# Testar student activities
echo "📚 Testando student activities..."
ACTIVITIES_RESPONSE=$(curl -s -H "Authorization: Bearer $TOKEN" \
  http://localhost:3000/api/student-activities)
echo "✅ Student Activities: $ACTIVITIES_RESPONSE"

echo "🎉 Testes concluídos!"
