# Quick Start

Use this as the shortest path through the lab.

## 1. pfSense VM Adapters

| Adapter | VirtualBox Mode | Name |
|---|---|---|
| Adapter 1 | NAT | Default |
| Adapter 2 | Internal Network | `dmz_net` |
| Adapter 3 | Internal Network | `lan_net` |
| Adapter 4 | Internal Network | `restricted_net` |

## 2. pfSense Interface IPs

| Interface | IP |
|---|---:|
| DMZ / OPT1 | `192.168.10.1/24` |
| INTERNAL / OPT2 | `192.168.20.1/24` |
| RESTRICTED / OPT3 | `192.168.30.1/24` |

## 3. Linux VM IPs

| VM | IP | Gateway |
|---|---:|---:|
| DMZ Web Server | `192.168.10.10/24` | `192.168.10.1` |
| Internal PC | `192.168.20.10/24` | `192.168.20.1` |
| Restricted PC | `192.168.30.10/24` | `192.168.30.1` |

## 4. Install DMZ Web Server

Run on the DMZ VM:

```bash
sudo apt update
sudo apt install -y apache2
sudo systemctl enable --now apache2
echo "DMZ Web Server - pfSense Lab" | sudo tee /var/www/html/index.html
```

## 5. Add pfSense Allow Rules

Add these rules:

| Interface | Source | Destination | Port |
|---|---|---|---|
| WAN | Any | `192.168.10.10` | TCP `80,443` |
| INTERNAL | INTERNAL net | `192.168.10.10` | TCP `80,443` |
| INTERNAL | INTERNAL net | RESTRICTED net | TCP `22` |

Leave the rest blocked by default.

## 6. Test

Internal to DMZ should work:

```bash
curl -I http://192.168.10.10
```

DMZ to Internal should fail:

```bash
ping -c 4 192.168.20.10
```

Restricted to Internet should fail:

```bash
ping -c 4 8.8.8.8
```

## 7. Screenshot

Capture:

- Topology page from `topology.html`
- pfSense interfaces
- pfSense firewall rules
- One successful test
- One blocked test
- One allowed firewall log
- One blocked firewall log
