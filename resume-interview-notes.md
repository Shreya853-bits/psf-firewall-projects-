# Resume and Interview Notes

## Resume Bullet

Built a segmented enterprise-style network in VirtualBox using pfSense firewall zones for WAN, DMZ, Internal, and Restricted networks; configured least-privilege firewall rules, DMZ web access, SSH-only restricted access, default-deny segmentation, and firewall logging for blocked traffic validation.

## Short Project Pitch

I built a virtual enterprise firewall lab using pfSense and VirtualBox. The network was divided into separate WAN, DMZ, Internal, and Restricted zones, each with its own subnet and firewall interface. I configured rules so only required traffic was allowed, such as web access to the DMZ server and SSH from Internal to Restricted. Everything else was blocked by default, and I validated the design using curl, ping, SSH, and pfSense firewall logs.

## Interview Talking Points

- The project demonstrates network segmentation, not just routing.
- pfSense acts as the firewall/router between all security zones.
- The DMZ hosts the public-facing web server.
- Internal users can access the DMZ web service.
- Restricted systems are isolated because they represent sensitive HR/Finance assets.
- DMZ cannot initiate connections into Internal or Restricted zones.
- The design follows least privilege and default deny.
- Firewall logs provide proof that unauthorized traffic was blocked.

## Possible Interview Questions

### Why use a DMZ?

A DMZ isolates public-facing services from the internal network. If the web server is compromised, firewall rules prevent the attacker from directly pivoting into employee or restricted systems.

### Why is default deny important?

Default deny means traffic is blocked unless there is a specific business reason to allow it. This reduces accidental exposure and follows the principle of least privilege.

### Why restrict the Restricted zone from the Internet?

Sensitive systems such as HR or finance machines should not have unrestricted outbound access. Blocking unnecessary Internet access reduces malware command-and-control risk and data exfiltration paths.

### Where do pfSense rules apply?

Rules apply on the interface where traffic enters pfSense. For example, Internal-to-DMZ traffic enters pfSense through the Internal interface, so the allow rule belongs on the Internal rules tab.

### What did you test?

I tested both allowed and blocked flows. Internal-to-DMZ web traffic succeeded, Internal-to-Restricted SSH succeeded, DMZ-to-Internal failed, and Restricted-to-WAN failed. I also captured pfSense firewall logs to prove enforcement.
