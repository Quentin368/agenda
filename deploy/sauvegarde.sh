#!/bin/sh
# Sauvegarde des données Radicale (calendriers + configuration) — lancée chaque nuit par la crontab de quentin.
# Radicale reste l'unique source de vérité : ceci n'est qu'une copie de sécurité. Rien n'est modifié chez Radicale.
# Restaurer : voir le README (section « Sauvegarde et restauration »).
set -eu
SOURCE=/home/quentin/docker/radicale          # pile Radicale (lue seulement)
DEST=/home/quentin/docker/agenda/sauvegardes  # archives
GARDER=14                                     # nombre d'archives conservées

umask 077                                      # archives lisibles par quentin seulement (contient les comptes)
mkdir -p "$DEST"
chmod 700 "$DEST"
NOM="radicale-$(date +%Y%m%d-%H%M%S).tar.gz"
tar -czf "$DEST/$NOM.part" -C "$SOURCE" data config
mv "$DEST/$NOM.part" "$DEST/$NOM"
# On ne garde que les $GARDER plus récentes
ls -1t "$DEST"/radicale-*.tar.gz | tail -n +$((GARDER + 1)) | while read -r vieux; do rm -f "$vieux"; done
echo "$(date '+%Y-%m-%d %H:%M:%S') sauvegarde $NOM ($(du -h "$DEST/$NOM" | cut -f1))"
