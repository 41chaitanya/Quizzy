#!/bin/bash

# Auth API Complete Testing Script
# Tests all endpoints, validation, authentication, and authorization

BASE_URL="http://localhost:5001"
COOKIE_FILE="/tmp/auth_cookies.txt"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo "================================================"
echo "🧪 Auth Service Complete API Testing"
echo "================================================"
echo ""

# Clean up old cookies
rm -f $COOKIE_FILE

# Test counter
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

# Helper function to test endpoint
test_endpoint() {
    local test_name="$1"
    local method="$2"
    local endpoint="$3"
    local data="$4"
    local expected_status="$5"
    local use_cookies="$6"
    
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    echo -e "${BLUE}Test $TOTAL_TESTS: $test_name${NC}"
    
    if [ "$use_cookies" = "true" ]; then
        RESPONSE=$(curl -s -w "\n%{http_code}" -X $method \
            -H "Content-Type: application/json" \
            -b $COOKIE_FILE -c $COOKIE_FILE \
            -d "$data" \
            "$BASE_URL$endpoint")
    else
        RESPONSE=$(curl -s -w "\n%{http_code}" -X $method \
            -H "Content-Type: application/json" \
            -c $COOKIE_FILE \
            -d "$data" \
            "$BASE_URL$endpoint")
    fi
    
    HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
    BODY=$(echo "$RESPONSE" | sed '$d')
    
    if [ "$HTTP_CODE" = "$expected_status" ]; then
        echo -e "  ${GREEN}✅ PASSED${NC} - Status: $HTTP_CODE"
        echo "  Response: $BODY" | head -c 100
        echo ""
        PASSED_TESTS=$((PASSED_TESTS + 1))
    else
        echo -e "  ${RED}❌ FAILED${NC} - Expected: $expected_status, Got: $HTTP_CODE"
        echo "  Response: $BODY"
        FAILED_TESTS=$((FAILED_TESTS + 1))
    fi
    echo ""
    sleep 0.5
}

echo "================================================"
echo "📋 Test Suite 1: Health & Basic Endpoints"
echo "================================================"
echo ""

# Test 1: Health Check
test_endpoint "Health Check" "GET" "/health" "" "200" "false"

# Test 2: Root Endpoint
test_endpoint "Root Endpoint" "GET" "/" "" "200" "false"

echo "================================================"
echo "📋 Test Suite 2: Registration Validation"
echo "================================================"
echo ""

# Test 3: Register without data
test_endpoint "Register - No Data" "POST" "/api/auth/register" "" "400" "false"

# Test 4: Register with invalid email
test_endpoint "Register - Invalid Email" "POST" "/api/auth/register" \
    '{"fullname":"Test User","email":"invalid-email","password":"Test@123"}' \
    "400" "false"

# Test 5: Register with weak password (no uppercase)
test_endpoint "Register - Weak Password (no uppercase)" "POST" "/api/auth/register" \
    '{"fullname":"Test User","email":"test@example.com","password":"test@123"}' \
    "400" "false"

# Test 6: Register with weak password (no special char)
test_endpoint "Register - Weak Password (no special)" "POST" "/api/auth/register" \
    '{"fullname":"Test User","email":"test@example.com","password":"Test1234"}' \
    "400" "false"

# Test 7: Register with short password
test_endpoint "Register - Short Password" "POST" "/api/auth/register" \
    '{"fullname":"Test User","email":"test@example.com","password":"Test@1"}' \
    "400" "false"

echo "================================================"
echo "📋 Test Suite 3: Successful Registration"
echo "================================================"
echo ""

# Test 8: Valid Registration
RANDOM_EMAIL="testuser$(date +%s)@example.com"
test_endpoint "Register - Valid User" "POST" "/api/auth/register" \
    "{\"fullname\":\"Test User\",\"email\":\"$RANDOM_EMAIL\",\"password\":\"Test@123456\"}" \
    "201" "false"

# Test 9: Duplicate Registration
test_endpoint "Register - Duplicate Email" "POST" "/api/auth/register" \
    "{\"fullname\":\"Test User\",\"email\":\"$RANDOM_EMAIL\",\"password\":\"Test@123456\"}" \
    "400" "false"

echo "================================================"
echo "📋 Test Suite 4: Login Validation"
echo "================================================"
echo ""

# Test 10: Login without data
test_endpoint "Login - No Data" "POST" "/api/auth/login" "" "400" "false"

# Test 11: Login with invalid email
test_endpoint "Login - Invalid Email" "POST" "/api/auth/login" \
    '{"email":"invalid-email","password":"Test@123456"}' \
    "400" "false"

# Test 12: Login with wrong password
test_endpoint "Login - Wrong Password" "POST" "/api/auth/login" \
    "{\"email\":\"$RANDOM_EMAIL\",\"password\":\"WrongPassword@123\"}" \
    "401" "false"

# Test 13: Login with non-existent user
test_endpoint "Login - Non-existent User" "POST" "/api/auth/login" \
    '{"email":"nonexistent@example.com","password":"Test@123456"}' \
    "401" "false"

echo "================================================"
echo "📋 Test Suite 5: Successful Login"
echo "================================================"
echo ""

# Test 14: Valid Login
test_endpoint "Login - Valid Credentials" "POST" "/api/auth/login" \
    "{\"email\":\"$RANDOM_EMAIL\",\"password\":\"Test@123456\"}" \
    "200" "false"

echo "================================================"
echo "📋 Test Suite 6: Protected Routes (Authentication)"
echo "================================================"
echo ""

# Test 15: Access /me without token
rm -f $COOKIE_FILE
test_endpoint "Get Profile - No Token" "GET" "/api/auth/me" "" "401" "false"

# Test 16: Login again to get token
test_endpoint "Login - Get Token for Protected Routes" "POST" "/api/auth/login" \
    "{\"email\":\"$RANDOM_EMAIL\",\"password\":\"Test@123456\"}" \
    "200" "false"

# Test 17: Access /me with valid token
test_endpoint "Get Profile - With Valid Token" "GET" "/api/auth/me" "" "200" "true"

echo "================================================"
echo "📋 Test Suite 7: Logout"
echo "================================================"
echo ""

# Test 18: Logout
test_endpoint "Logout - Valid Session" "POST" "/api/auth/logout" "" "200" "true"

# Test 19: Access /me after logout
test_endpoint "Get Profile - After Logout" "GET" "/api/auth/me" "" "401" "true"

# Test 20: Logout without token
rm -f $COOKIE_FILE
test_endpoint "Logout - No Token" "POST" "/api/auth/logout" "" "401" "false"

echo "================================================"
echo "📋 Test Suite 8: Edge Cases"
echo "================================================"
echo ""

# Test 21: Register with extra long password
test_endpoint "Register - Very Long Password" "POST" "/api/auth/register" \
    '{"fullname":"Test User","email":"longpass@example.com","password":"Test@123456789012345678901234567890123"}' \
    "400" "false"

# Test 22: Register with SQL injection attempt
test_endpoint "Register - SQL Injection Attempt" "POST" "/api/auth/register" \
    '{"fullname":"Test User","email":"test@example.com","password":"Test@123; DROP TABLE users;--"}' \
    "400" "false"

# Test 23: Register with XSS attempt
test_endpoint "Register - XSS Attempt" "POST" "/api/auth/register" \
    '{"fullname":"<script>alert(1)</script>","email":"xss@example.com","password":"Test@123456"}' \
    "201" "false"

# Test 24: Invalid HTTP Method
TOTAL_TESTS=$((TOTAL_TESTS + 1))
echo -e "${BLUE}Test $TOTAL_TESTS: Invalid HTTP Method${NC}"
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -X DELETE "$BASE_URL/api/auth/register")
if [ "$HTTP_CODE" = "404" ] || [ "$HTTP_CODE" = "405" ]; then
    echo -e "  ${GREEN}✅ PASSED${NC} - Status: $HTTP_CODE"
    PASSED_TESTS=$((PASSED_TESTS + 1))
else
    echo -e "  ${RED}❌ FAILED${NC} - Expected: 404/405, Got: $HTTP_CODE"
    FAILED_TESTS=$((FAILED_TESTS + 1))
fi
echo ""

# Test 25: Invalid Endpoint
test_endpoint "Invalid Endpoint" "GET" "/api/auth/invalid" "" "404" "false"

echo "================================================"
echo "📊 Test Results Summary"
echo "================================================"
echo ""
echo "Total Tests: $TOTAL_TESTS"
echo -e "${GREEN}Passed: $PASSED_TESTS${NC}"
echo -e "${RED}Failed: $FAILED_TESTS${NC}"
echo ""

if [ $FAILED_TESTS -eq 0 ]; then
    echo -e "${GREEN}🎉 All tests passed!${NC}"
    exit 0
else
    echo -e "${RED}❌ Some tests failed!${NC}"
    exit 1
fi
