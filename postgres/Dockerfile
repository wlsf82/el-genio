FROM postgres:15

# Environment variables with defaults
ENV POSTGRES_USER=postgres
ENV POSTGRES_PASSWORD=postgres
ENV POSTGRES_DB=elgenio

# Create directory for initialization scripts
RUN mkdir -p /docker-entrypoint-initdb.d

# Add initialization script
COPY init/ /docker-entrypoint-initdb.d/

# Expose PostgreSQL port
EXPOSE 5432

# The postgres image already has a suitable entrypoint
