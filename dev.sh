# Variables set up by this script:
# SERVER_PORT            Port exposed by this component.
# DB_HOST                Hostname for rethinkdb
# DB_PORT                Port used by rethinkdb
# DATABASE_NAME          name used on rethinkdb
# SERVER_ALLOWED_ORIGIN  Allowed adress for contacting this server.

SERVER_PORT=8889 SERVER_ALLOWED_ORIGIN="http://localhost:8000" DB_HOST="localhost" DB_PORT="28015" DATABASE_NAME="perspective" nodemon index.js
