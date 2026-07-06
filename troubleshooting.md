# Troubleshooting Guide

## VM Cannot Ping Its pfSense Gateway

Check these first:

- The VM adapter is attached to the correct VirtualBox Internal Network.
- The Internal Network name matches exactly, for example `dmz_net`.
- The VM IP address is in the correct subnet.
- The VM gateway points to the pfSense interface IP for that zone.
- The pfSense interface is enabled.

Useful Linux commands:

```bash
ip a
ip route
ping -c 4 192.168.10.1
```

## pfSense Interface Shows as Down

Common causes:

- The VirtualBox adapter is not enabled.
- Cable connected is unchecked in VirtualBox advanced network settings.
- The interface was assigned to the wrong pfSense port.

Fix:

1. Power off the VM.
2. Confirm all four pfSense adapters are enabled.
3. Confirm Cable Connected is checked.
4. Boot pfSense and re-check Interfaces > Assignments.

## Internal Cannot Reach DMZ Web Server

Check:

- Apache is running on the DMZ server.
- DMZ server IP is `192.168.10.10`.
- Internal firewall rule exists on the INTERNAL interface.
- Rule source is INTERNAL net.
- Rule destination is `192.168.10.10`.
- Rule protocol is TCP.
- Rule port includes HTTP `80`.

Commands:

```bash
sudo systemctl status apache2
curl http://127.0.0.1
curl -I http://192.168.10.10
```

## Blocked Traffic Is Not Appearing in Logs

Check:

- Default block logging is enabled under Status > System Logs > Settings.
- If using explicit deny rules, the Log option is checked on those rules.
- You triggered the test after enabling logging.
- You are viewing Status > System Logs > Firewall, not the general system log.

Tip: use ping or curl with a short timeout to generate clear denied traffic.

## WAN to DMZ Does Not Work in VirtualBox NAT

This is normal unless inbound NAT/port forwarding is configured.

Options:

- Use pfSense Firewall > NAT > Port Forward to forward WAN TCP `80` and `443` to `192.168.10.10`.
- Use VirtualBox NAT port forwarding on the pfSense WAN adapter.
- Add an outside test VM on a separate host-only or internal network instead of relying on host NAT.

For the assignment, the Internal-to-DMZ and zone-blocking tests are usually enough to prove segmentation.

## SSH Test Fails

Check:

- SSH server is installed on the Restricted VM.
- SSH service is running.
- The Internal firewall rule allows TCP `22` from INTERNAL net to RESTRICTED net.
- The username exists on the Restricted VM.

Commands on Restricted:

```bash
sudo apt install -y openssh-server
sudo systemctl enable --now ssh
sudo systemctl status ssh
```

Command from Internal:

```bash
ssh user@192.168.30.10
```

## Rules Look Correct but Traffic Still Fails

Remember:

- pfSense rules apply on the interface where traffic enters pfSense.
- Internal-to-DMZ rules go on INTERNAL, not DMZ.
- DMZ-to-Internal rules would go on DMZ.
- Restricted-to-WAN rules would go on RESTRICTED.
- Rules are evaluated top to bottom.

After changes, always click Apply Changes.
