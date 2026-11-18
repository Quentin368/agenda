"""Adresse réelle du client derrière Tailscale Serve (HTTPS).

Tailscale Serve tourne sur le Pi et relaie vers localhost:8090 : dans le conteneur, ces requêtes semblent toutes venir
de la passerelle Docker (ex. 172.23.0.1), quel que soit l'appareil. Le proxy indique la vraie adresse dans
X-Forwarded-For. On ne la croit QUE si la connexion vient d'un proxy de confiance (sinon n'importe qui pourrait
inventer son adresse pour échapper à la limitation des essais) ; on prend la DERNIÈRE adresse de la liste, celle
qu'a ajoutée notre proxy (les précédentes ont pu être fournies par le client lui-même).
"""
from __future__ import annotations

import ipaddress
import os
import socket
import struct


def default_gateway(route_file: str = '/proc/net/route') -> str | None:
    """Passerelle par défaut du conteneur (= l'hôte, d'où arrive Tailscale Serve)."""
    try:
        with open(route_file) as f:
            next(f)
            for line in f:
                parts = line.split()
                if len(parts) > 2 and parts[1] == '00000000' and int(parts[3], 16) & 2:
                    return socket.inet_ntoa(struct.pack('<L', int(parts[2], 16)))
    except (OSError, ValueError, StopIteration):
        pass
    return None


def trusted_networks(setting: str | None = None, route_file: str = '/proc/net/route') -> list:
    """TRUSTED_PROXIES : « auto » (par défaut : la passerelle Docker), « none », ou une liste d'adresses / réseaux."""
    setting = (os.environ.get('TRUSTED_PROXIES', 'auto') if setting is None else setting).strip()
    if setting.lower() in ('', 'none', 'aucun'):
        return []
    out = []
    for item in setting.split(','):
        item = item.strip()
        if item.lower() == 'auto':
            gw = default_gateway(route_file)
            if gw:
                out.append(ipaddress.ip_network(gw))
        elif item:
            out.append(ipaddress.ip_network(item, strict=False))
    return out


def client_ip(peer: str | None, forwarded_for: str | None, trusted: list) -> str:
    if not peer:
        return '?'
    try:
        p = ipaddress.ip_address(peer)
    except ValueError:
        return peer
    if forwarded_for and any(p in n for n in trusted):
        last = forwarded_for.split(',')[-1].strip()
        try:
            return str(ipaddress.ip_address(last))
        except ValueError:
            pass
    return peer
