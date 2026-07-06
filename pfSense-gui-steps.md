# pfSense GUI Configuration Steps

Use this after pfSense is installed and the web UI is reachable.

## 1. Assign Interfaces

1. Open pfSense Web UI.
2. Go to Interfaces > Assignments.
3. Confirm interfaces:
   - WAN = `em0`
   - OPT1 = `em1`
   - OPT2 = `em2`
   - OPT3 = `em3`
4. Rename interfaces:
   - OPT1 to `DMZ`
   - OPT2 to `INTERNAL`
   - OPT3 to `RESTRICTED`
5. Save and apply.

## 2. Configure DMZ Interface

1. Go to Interfaces > DMZ.
2. Check Enable interface.
3. Set IPv4 Configuration Type to Static IPv4.
4. Set IPv4 Address to `192.168.10.1`.
5. Set prefix length to `24`.
6. Leave IPv4 Upstream gateway as None.
7. Save and apply.

## 3. Configure Internal Interface

1. Go to Interfaces > INTERNAL.
2. Check Enable interface.
3. Set IPv4 Configuration Type to Static IPv4.
4. Set IPv4 Address to `192.168.20.1`.
5. Set prefix length to `24`.
6. Leave IPv4 Upstream gateway as None.
7. Save and apply.

## 4. Configure Restricted Interface

1. Go to Interfaces > RESTRICTED.
2. Check Enable interface.
3. Set IPv4 Configuration Type to Static IPv4.
4. Set IPv4 Address to `192.168.30.1`.
5. Set prefix length to `24`.
6. Leave IPv4 Upstream gateway as None.
7. Save and apply.

## 5. Optional DHCP Services

Static IPs are simpler for screenshots, but DHCP can be enabled if desired.

1. Go to Services > DHCP Server.
2. Select DMZ, INTERNAL, or RESTRICTED.
3. Enable DHCP only if you want pfSense to assign addresses automatically.
4. Use ranges that do not conflict with static VM IPs:
   - DMZ: `192.168.10.100` to `192.168.10.150`
   - INTERNAL: `192.168.20.100` to `192.168.20.150`
   - RESTRICTED: `192.168.30.100` to `192.168.30.150`

## 6. Create WAN to DMZ Web Rule

If you are using a true outside test network, add the firewall rule:

1. Go to Firewall > Rules > WAN.
2. Click Add.
3. Action: Pass.
4. Interface: WAN.
5. Address Family: IPv4.
6. Protocol: TCP.
7. Source: Any.
8. Destination: Single host or alias, `192.168.10.10`.
9. Destination Port Range: HTTP to HTTPS, or create separate rules for `80` and `443`.
10. Description: `Allow WAN web traffic to DMZ server`.
11. Check Log packets that are handled by this rule if you need allow-log evidence.
12. Save and apply.

For most VirtualBox NAT labs, use Firewall > NAT > Port Forward instead:

1. Go to Firewall > NAT > Port Forward.
2. Add a rule for TCP `80` from WAN address to `192.168.10.10:80`.
3. Add a rule for TCP `443` from WAN address to `192.168.10.10:443`.
4. Select Add associated filter rule.
5. Save and apply.

## 7. Create Internal to DMZ Web Rule

1. Go to Firewall > Rules > INTERNAL.
2. Click Add.
3. Action: Pass.
4. Protocol: TCP.
5. Source: INTERNAL net.
6. Destination: Single host or alias, `192.168.10.10`.
7. Destination Port Range: HTTP to HTTPS, or separate `80` and `443` rules.
8. Description: `Allow Internal web access to DMZ`.
9. Check logging if allow-log evidence is required.
10. Save and apply.

## 8. Create Internal to Restricted SSH Rule

1. Go to Firewall > Rules > INTERNAL.
2. Click Add.
3. Action: Pass.
4. Protocol: TCP.
5. Source: INTERNAL net.
6. Destination: RESTRICTED net.
7. Destination Port Range: SSH `22`.
8. Description: `Allow Internal SSH to Restricted`.
9. Check logging if allow-log evidence is required.
10. Save and apply.

## 9. Confirm Default Deny Behavior

On DMZ and RESTRICTED, do not add broad allow rules.

Expected state:

- DMZ has no pass rule to INTERNAL.
- DMZ has no pass rule to RESTRICTED.
- RESTRICTED has no pass rule to WAN.
- RESTRICTED has no pass rule to INTERNAL.
- RESTRICTED has no pass rule to DMZ.

## 10. Enable Logging for Blocked Packets

1. Go to Status > System Logs > Settings.
2. Enable logging for default block rules if available in your pfSense version.
3. For explicit deny rules, edit the deny rule and check Log packets that are handled by this rule.
4. Go to Status > System Logs > Firewall.
5. Trigger a blocked test, then screenshot the resulting log entry.
