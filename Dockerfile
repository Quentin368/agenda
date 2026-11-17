# Agenda — interface web pour Radicale. Image légère, utilisateur non-root (uid 1000 = quentin).
# 1) Installation des dépendances à part, pour ne garder que le résultat
FROM python:3.13-alpine AS deps
COPY requirements.txt /tmp/requirements.txt
RUN pip install --no-cache-dir --no-compile --prefix=/install -r /tmp/requirements.txt

# 2) Image finale
FROM python:3.13-alpine
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PYTHONPATH=/app/backend \
    STATIC_DIR=/app/static \
    TZ=Europe/Paris
COPY --from=deps /install /usr/local
WORKDIR /app
COPY backend/agenda /app/backend/agenda
COPY static /app/static
USER 1000:1000
EXPOSE 8090
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD ["python", "-c", "import urllib.request; urllib.request.urlopen('http://127.0.0.1:8090/healthz', timeout=3)"]
# Pas de --proxy-headers : pas de reverse proxy, l'adresse IP vue est la vraie (limitation des tentatives)
CMD ["uvicorn", "agenda.main:app", "--host", "0.0.0.0", "--port", "8090", "--no-server-header"]
