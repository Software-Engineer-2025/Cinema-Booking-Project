#!/bin/bash

# A script to start all development services
# Run from Cinema-Booking-Project
# Usage: 
#   ./run.sh           - View frontend logs (default)
#   ./run.sh backend   - View backend logs
#   ./run.sh frontend  - View frontend logs

BACKEND_LOG="backend/backend-dev.log"
FRONTEND_LOG="frontend/frontend-dev.log"
VIEW_LOGS="${1:-frontend}"

cleanup() {
    echo ""
    echo "Shutting down all services..."
    
    # Kill all child processes
    jobs -p | xargs -r kill 2>/dev/null
    
    # Clean up log files
    rm -f "$BACKEND_LOG" "$FRONTEND_LOG"
    
    echo "Cleanup complete."
}

trap cleanup EXIT INT TERM

# Clean old logs
rm -f "$BACKEND_LOG" "$FRONTEND_LOG"

# Supabase
echo "Starting Supabase..."
(cd supabase && npx supabase start)
echo "--- Supabase services are up. ---"
echo ""

# Backend
echo "Starting Backend (logs: $BACKEND_LOG)..."
(cd backend/src && uvicorn main:app --reload >"../../$BACKEND_LOG" 2>&1) &
BACKEND_PID=$!
echo "Backend PID: $BACKEND_PID"
echo ""

# Frontend
echo "Starting Frontend (logs: $FRONTEND_LOG)..."
(cd frontend && npm run dev >"../$FRONTEND_LOG" 2>&1) &
FRONTEND_PID=$!
echo "Frontend PID: $FRONTEND_PID"
echo ""

# Wait for services to start
sleep 3

# Display logs based on flag
if [ "$VIEW_LOGS" = "backend" ]; then
    echo "=== Viewing Backend Logs (Ctrl+C to exit) ==="
    echo ""
    tail -f "$BACKEND_LOG"
else
    echo "=== Viewing Frontend Logs (Ctrl+C to exit) ==="
    echo ""
    tail -f "$FRONTEND_LOG"
fi
