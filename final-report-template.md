# Final Report: pfSense Segmented Firewall Lab

## 1. Project Overview

This project implements a segmented enterprise-style network using pfSense in VirtualBox. The design separates systems into WAN, DMZ, Internal, and Restricted zones. Firewall rules follow the principle of least privilege by allowing only required traffic and blocking all other cross-zone communication.

## 2. Tools Used

- VirtualBox
- pfSense
- Ubuntu Server
- Kali Linux or Ubuntu Desktop
- Apache2
- Linux command-line tools: `ip`, `ping`, `curl`, `ssh`

## 3. Topology

Insert topology screenshot here.

| Zone | Subnet | Gateway | Host |
|---|---:|---:|---|
| WAN | NAT | NAT-assigned | pfSense WAN |
| DMZ | `192.168.10.0/24` | `192.168.10.1` | Web server `192.168.10.10` |
| Internal | `192.168.20.0/24` | `192.168.20.1` | Employee PC `192.168.20.10` |
| Restricted | `192.168.30.0/24` | `192.168.30.1` | HR/Finance PC `192.168.30.10` |

## 4. Firewall Policy

| Source | Destination | Port | Action | Reason |
|---|---|---|---|---|
| WAN | DMZ web server | TCP 80, 443 | Allow | Public web access |
| Internal | DMZ web server | TCP 80, 443 | Allow | Employee access to public service |
| Internal | Restricted | TCP 22 | Allow | Controlled administrative SSH |
| DMZ | Internal | Any | Deny | Prevent compromised public server from reaching internal hosts |
| DMZ | Restricted | Any | Deny | Protect sensitive systems |
| Restricted | WAN | Any | Deny | Prevent sensitive hosts from freely reaching the Internet |
| Restricted | Internal/DMZ | Any | Deny | Preserve restricted-zone isolation |

## 5. Configuration Evidence

Insert screenshots:

- pfSense interface assignments.
- pfSense WAN, DMZ, Internal, and Restricted interface pages.
- WAN firewall rules.
- Internal firewall rules.
- DMZ and Restricted rules/default deny evidence.

## 6. Test Results

| Test | Expected Result | Actual Result | Pass/Fail |
|---|---|---|---|
| Internal to DMZ HTTP | Allowed |  |  |
| Internal to Restricted SSH | Allowed |  |  |
| DMZ to Internal ping | Blocked |  |  |
| DMZ to Restricted ping | Blocked |  |  |
| Restricted to WAN ping/curl | Blocked |  |  |
| Restricted to DMZ HTTP | Blocked |  |  |

## 7. Firewall Logging Evidence

Insert screenshot of allowed log entry.

Insert screenshot of blocked log entry.

Example explanation:

The firewall logs prove that pfSense is enforcing the segmentation policy. Allowed traffic appears only for approved services, while denied traffic confirms that unauthorized cross-zone communication is blocked.

## 8. Security Analysis

This design reduces risk by isolating public-facing services from internal and restricted systems. If the DMZ web server is compromised, the attacker cannot freely pivot into the Internal or Restricted networks. Restricted systems are also prevented from initiating unnecessary outbound traffic, reducing data exfiltration risk.

The firewall policy follows least privilege: each rule allows only a specific source, destination, protocol, and port required for the business purpose.

## 9. Conclusion

The pfSense lab successfully demonstrates enterprise firewall segmentation, DMZ design, default-deny access control, and firewall logging. The final tests confirm that approved traffic is allowed and unauthorized traffic is blocked.
