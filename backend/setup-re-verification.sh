#!/bin/bash

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  TrustVault Re-verification Setup        ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════╝${NC}\n"

echo -e "${YELLOW}This script will:${NC}"
echo "1. Create the re_verification_requests table"
echo "2. Create necessary indexes"
echo ""

echo -e "${YELLOW}IMPORTANT: You must have PSQL installed and configured${NC}"
echo "To manually run this SQL, go to:"
echo "  Supabase Dashboard → SQL Editor → New Query → Run SQL\n"

# Check if .env.local exists
if [ ! -f "../.env.local" ] && [ ! -f "../.env" ]; then
    echo -e "${RED}❌ Error: Could not find .env or .env.local file${NC}"
    echo "Make sure you're running this from the backend directory"
    exit 1
fi

# Try to read DATABASE_URL
if [ -f "../.env.local" ]; then
    source "../.env.local"
elif [ -f "../.env" ]; then
    source "../.env"
fi

if [ -z "$DATABASE_URL" ]; then
    echo -e "${RED}❌ Error: DATABASE_URL not found in .env files${NC}"
    echo ""
    echo -e "${YELLOW}If you can't use this script, manually run this SQL in Supabase:${NC}"
    cat ./sql/re-verification-requests-schema.sql
    exit 1
fi

echo -e "${YELLOW}Connecting to database...${NC}\n"

# Run the SQL file
psql "$DATABASE_URL" -f ./sql/re-verification-requests-schema.sql

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}✅ Success! Re-verification tables created${NC}"
    echo -e "${GREEN}✅ The re-verification feature is now ready to use${NC}"
else
    echo ""
    echo -e "${RED}❌ Error running setup${NC}"
    echo ""
    echo -e "${YELLOW}If PSQL is not available, manually run this SQL:${NC}"
    cat ./sql/re-verification-requests-schema.sql
    exit 1
fi
