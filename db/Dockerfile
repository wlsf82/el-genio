# Use the official PostgreSQL image
FROM postgres:latest

# Set environment variables (without password authentication)
ENV POSTGRES_USER=dbuser
ENV POSTGRES_DB=demo
ENV POSTGRES_HOST_AUTH_METHOD=trust

# Copy initialization SQL script
COPY init.sql /docker-entrypoint-initdb.d/

# Expose PostgreSQL port
EXPOSE 5432