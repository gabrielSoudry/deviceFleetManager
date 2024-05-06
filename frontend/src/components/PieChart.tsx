import * as React from "react";
import { PieChart } from "@mui/x-charts/PieChart";
import { Box } from "@mui/material";
import { Device } from "@backend/types/device";

interface PieDevicesProps {
  devices: Device[];
  clientId: string;
}

export default function BasicPie({ devices, clientId }: PieDevicesProps) {
  const filteredDevices = clientId
    ? devices.filter((device) => device.clientId === clientId)
    : devices;

  const statusCounts = filteredDevices.reduce(
    (acc, device) => {
      const { firewall, antivirus, encryption } = device.security;
      if (firewall && antivirus && encryption) {
        acc.healthy++;
      }
      if (!firewall) {
        acc.firewallMissing++;
      }
      if (!antivirus) {
        acc.antivirusMissing++;
      }
      if (!encryption) {
        acc.encryptionMissing++;
      }
      const now = new Date().getTime();
      const lastCheckInDateTimestamp = new Date(
        device.lastCheckInDate * 1000
      ).getTime();
      const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;
      if (lastCheckInDateTimestamp < thirtyDaysAgo) {
        acc.outdated++;
      }
      return acc;
    },
    {
      healthy: 0,
      firewallMissing: 0,
      antivirusMissing: 0,
      encryptionMissing: 0,
      outdated: 0,
    }
  );

  const pieChartData = [
    { id: 0, value: statusCounts.healthy, label: "Healthy Device" },
    { id: 1, value: statusCounts.firewallMissing, label: "Firewall missing" },
    { id: 2, value: statusCounts.antivirusMissing, label: "Antivirus missing" },
    {
      id: 3,
      value: statusCounts.encryptionMissing,
      label: "Encryption missing",
    },
    { id: 4, value: statusCounts.outdated, label: "Outdated" },
  ];

  return (
    <Box style={{ height: 200, width: "500px" }}>
      Chart Security Status
      <PieChart series={[{ data: pieChartData }]} width={500} height={200} />
    </Box>
  );
}
