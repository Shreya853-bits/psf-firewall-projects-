# Submission Checklist

## Build Evidence

- [ ] Open `index.html` and confirm the project overview page displays correctly.
- [ ] Open `topology.html` and capture a clean topology screenshot.
- [ ] VirtualBox pfSense VM with four adapters.
- [ ] Adapter 1 set to NAT.
- [ ] Adapter 2 set to Internal Network `dmz_net`.
- [ ] Adapter 3 set to Internal Network `lan_net`.
- [ ] Adapter 4 set to Internal Network `restricted_net`.
- [ ] pfSense interface assignments showing WAN, DMZ/OPT1, Internal/OPT2, Restricted/OPT3.
- [ ] DMZ interface configured as `192.168.10.1/24`.
- [ ] Internal interface configured as `192.168.20.1/24`.
- [ ] Restricted interface configured as `192.168.30.1/24`.

## VM Evidence

- [ ] DMZ Ubuntu Server IP: `192.168.10.10/24`, gateway `192.168.10.1`.
- [ ] Internal PC IP: `192.168.20.10/24`, gateway `192.168.20.1`.
- [ ] Restricted PC IP: `192.168.30.10/24`, gateway `192.168.30.1`.
- [ ] Apache installed and running on DMZ server.

## Firewall Evidence

- [ ] WAN allow rule for TCP `80,443` to DMZ web server.
- [ ] Internal allow rule for TCP `80,443` to DMZ web server.
- [ ] Internal allow rule for TCP `22` to Restricted network.
- [ ] DMZ has no allow rules to Internal or Restricted, or explicit logged deny rules.
- [ ] Restricted has no allow rules to WAN, Internal, or DMZ, or explicit logged deny rules.

## Test Evidence

- [ ] Gateway ping succeeds from each VM to its pfSense zone gateway.
- [ ] Internal to DMZ web test succeeds: `curl -I http://192.168.10.10`.
- [ ] DMZ to Internal ping fails: `ping -c 4 192.168.20.10`.
- [ ] Restricted to WAN fails: `ping -c 4 8.8.8.8`.
- [ ] Internal to Restricted SSH succeeds, if SSH server is enabled.
- [ ] pfSense firewall logs show at least one allowed packet.
- [ ] pfSense firewall logs show at least one blocked packet.

## Report Evidence

- [ ] Copy final screenshots into `screenshots/`.
- [ ] Fill out `final-report-template.md`.
- [ ] Include the resume bullet from `resume-interview-notes.md` if using this as a portfolio project.

## Short Conclusion

The pfSense VM successfully segments WAN, DMZ, Internal, and Restricted zones. Only approved traffic is allowed: web access to the DMZ server and SSH from Internal to Restricted. All other traffic is blocked by pfSense default deny behavior or explicit deny rules.
