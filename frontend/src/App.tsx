import React, { useState, useEffect } from "react";
import TableDevices from "./components/TableDevices";
import "./style.css";
import BasicPie from "./components/PieChart";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { Device } from "@backend/types/device";

export default function App() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [clientId, setClientId] = React.useState("");

  const handleChange = (event: SelectChangeEvent) => {
    setClientId(event.target.value as string);
  };

  useEffect(() => {
    const fetchDeviceData = async () => {
      try {
        const response = await fetch(import.meta.env.VITE_API_URL);
        if (!response.ok) {
          throw new Error("Failed to fetch devices");
        }
        const data = await response.json();
        setDevices(data);
      } catch (error) {
        console.error("Error fetching devices:", error);
        setDevices([]);
      }
    };

    fetchDeviceData();
  }, []);

  return (
    <div className="app-container">
      <div className="name">Device Fleet Manager Dashboard</div>
      <div className="component-container">
        <div className="table">
          <FormControl fullWidth>
            <InputLabel id="label">Client Id</InputLabel>
            <Select
              labelId="label"
              id="selectClient"
              value={clientId}
              label="Client Id"
              onChange={handleChange}
            >
              {Array.from(
                new Set(devices.map((device) => device.clientId))
              ).map((clientId, index) => (
                <MenuItem key={index} value={clientId}>
                  {clientId}
                </MenuItem>
              ))}
              <MenuItem value="">
                <em>All</em>
              </MenuItem>
            </Select>
          </FormControl>
          <TableDevices devices={devices} clientId={clientId} />
        </div>
        <div className="pie">
          <BasicPie devices={devices} clientId={clientId} />
        </div>
      </div>
    </div>
  );
}
