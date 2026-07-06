# Validation Plan

This file gives you a clean testing sequence for the final submission.

## Test Matrix

| Test ID | Source VM | Command | Expected Result | Evidence |
|---|---|---|---|---|
| T1 | Internal PC | `curl -I http://192.168.10.10` | HTTP `200 OK` or Apache response headers | Screenshot terminal/browser |
| T2 | Internal PC | `ssh user@192.168.30.10` | SSH login prompt | Screenshot terminal |
| T3 | DMZ Server | `ping -c 4 192.168.20.10` | Timeout or packet loss | Screenshot terminal and blocked log |
| T4 | DMZ Server | `curl -I http://192.168.30.10` | Timeout/refused/blocked | Screenshot terminal and blocked log |
| T5 | Restricted PC | `ping -c 4 8.8.8.8` | Timeout or unreachable | Screenshot terminal and blocked log |
| T6 | Restricted PC | `curl -I http://192.168.10.10` | Timeout/blocked | Screenshot terminal and blocked log |
| T7 | pfSense | Status > System Logs > Firewall | Allowed and blocked events visible | Screenshot logs |

## Pre-Test Checks

Run on each Linux VM:

```bash
ip a
ip route
ping -c 2 <zone-gateway-ip>
```

Expected gateway pings:

| VM | Gateway Ping |
|---|---|
| DMZ Server | `ping -c 2 192.168.10.1` succeeds |
| Internal PC | `ping -c 2 192.168.20.1` succeeds |
| Restricted PC | `ping -c 2 192.168.30.1` succeeds |

## Allow Test Commands

From Internal PC to DMZ:

```bash
curl -I http://192.168.10.10
```

From Internal PC to Restricted SSH:

```bash
ssh user@192.168.30.10
```

If SSH is missing on Restricted:

```bash
sudo apt update
sudo apt install -y openssh-server
sudo systemctl enable --now ssh
```

## Block Test Commands

From DMZ to Internal:

```bash
ping -c 4 192.168.20.10
```

From DMZ to Restricted:

```bash
ping -c 4 192.168.30.10
```

From Restricted to Internet:

```bash
ping -c 4 8.8.8.8
curl -I http://example.com
```

From Restricted to DMZ:

```bash
curl -I --connect-timeout 5 http://192.168.10.10
```

## Evidence Log Template

| Test ID | Date/Time | Result | Screenshot Filename | Notes |
|---|---|---|---|---|
| T1 |  | Pass/Fail |  |  |
| T2 |  | Pass/Fail |  |  |
| T3 |  | Pass/Fail |  |  |
| T4 |  | Pass/Fail |  |  |
| T5 |  | Pass/Fail |  |  |
| T6 |  | Pass/Fail |  |  |
| T7 |  | Pass/Fail |  |  |

## Pass Criteria

The lab is complete when:

- Internal can reach the DMZ web server.
- Internal can SSH to Restricted if the SSH allow rule is included.
- DMZ cannot reach Internal or Restricted.
- Restricted cannot reach WAN, Internal, or DMZ.
- pfSense logs show at least one allowed and one blocked packet.
