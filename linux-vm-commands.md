# Linux VM Commands

These commands help configure and verify the Ubuntu/Kali VMs.

## Identify Interface Name

```bash
ip link
```

Common interface names:

- `enp0s3`
- `ens33`
- `eth0`

Use the actual interface name in your Netplan file.

## Ubuntu Netplan: DMZ Server

Example file: `/etc/netplan/01-lab.yaml`

```yaml
network:
  version: 2
  renderer: networkd
  ethernets:
    enp0s3:
      dhcp4: no
      addresses:
        - 192.168.10.10/24
      routes:
        - to: default
          via: 192.168.10.1
      nameservers:
        addresses:
          - 8.8.8.8
```

Apply:

```bash
sudo netplan apply
```

## Ubuntu Netplan: Internal PC

```yaml
network:
  version: 2
  renderer: networkd
  ethernets:
    enp0s3:
      dhcp4: no
      addresses:
        - 192.168.20.10/24
      routes:
        - to: default
          via: 192.168.20.1
      nameservers:
        addresses:
          - 8.8.8.8
```

## Ubuntu Netplan: Restricted PC

```yaml
network:
  version: 2
  renderer: networkd
  ethernets:
    enp0s3:
      dhcp4: no
      addresses:
        - 192.168.30.10/24
      routes:
        - to: default
          via: 192.168.30.1
      nameservers:
        addresses:
          - 8.8.8.8
```

## Verify IP and Route

```bash
ip a
ip route
```

## Test Gateway Reachability

DMZ:

```bash
ping -c 2 192.168.10.1
```

Internal:

```bash
ping -c 2 192.168.20.1
```

Restricted:

```bash
ping -c 2 192.168.30.1
```

## Install Apache on DMZ

```bash
sudo apt update
sudo apt install -y apache2
sudo systemctl enable --now apache2
echo "DMZ Web Server - pfSense Lab" | sudo tee /var/www/html/index.html
curl http://127.0.0.1
```

## Install SSH on Restricted

```bash
sudo apt update
sudo apt install -y openssh-server
sudo systemctl enable --now ssh
sudo systemctl status ssh
```

## Useful Test Commands

```bash
curl -I http://192.168.10.10
ping -c 4 192.168.20.10
ping -c 4 192.168.30.10
ping -c 4 8.8.8.8
ssh user@192.168.30.10
```
