import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import {
  DataGrid,
  GridColDef,
  GridColumnVisibilityModel,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarExport,
  GridToolbarFilterButton,
} from "@mui/x-data-grid";
import { Device } from "@backend/types/device";
import { Icon } from "@iconify/react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";

const columns: GridColDef[] = [
  { field: "id", headerName: "ID" },
  { field: "clientId", headerName: "Client ID" },
  { field: "manufacturer", headerName: "Manufacturer", flex: 0.3 },
  { field: "model", headerName: "Model" },
  { field: "serialNumber", headerName: "Serial Number", flex: 0.5 },
  { field: "cpu", headerName: "CPU" },
  { field: "ram", headerName: "RAM" },
  { field: "storage", headerName: "Storage" },
  { field: "user", headerName: "User" },
  { field: "lastCheckInDate", headerName: "Last Check In Date", flex: 0.3 },
];

function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarColumnsButton />
      <GridToolbarFilterButton />
      <GridToolbarDensitySelector />
      <GridToolbarExport />
    </GridToolbarContainer>
  );
}

interface TableDevicesProps {
  devices: Device[];
  clientId: string;
}

export default function TableDevices({ devices, clientId }: TableDevicesProps) {
  const [filteredDevices, setFilteredDevices] = useState<Device[]>([]);

  const [columnVisibilityModel, setColumnVisibilityModel] =
    useState<GridColumnVisibilityModel>({
      id: false,
      clientId: false,
      manufacturer: false,
      model: false,
      serialNumber: true,
      cpu: false,
      ram: false,
      storage: false,
      user: false,
      lastCheckInDate: false,
    });

  useEffect(() => {
    if (clientId) {
      const filtered = devices.filter((device) => device.clientId === clientId);
      setFilteredDevices(filtered);
    } else {
      setFilteredDevices(devices);
    }
  }, [clientId, devices]);

  const renderSecurityStatusIcon = (row: Device) => {
    const { firewall, antivirus, encryption } = row.security;
    const now = new Date().getTime();
    const lastCheckInDateTimestamp = new Date(
      row.lastCheckInDate * 1000
    ).getTime();
    const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;
    if (lastCheckInDateTimestamp < thirtyDaysAgo) {
      return <Icon icon="mdi:clock" color="grey" width={"20px"} />;
    }

    if (!firewall || !antivirus || !encryption) {
      return (
        <>
          {!firewall && <Icon icon={"mdi:wall"} color="red" width={"20px"} />}
          {!antivirus && (
            <Icon icon={"mdi:shield-check"} color="red" width={"20px"} />
          )}
          {!encryption && (
            <Icon icon={"mdi:lock-off"} color="red" width={"20px"} />
          )}
        </>
      );
    }

    return <Icon icon={"mdi:shield-check"} color="green" width={"20px"} />;
  };

  return (
    <Box style={{ height: 500, width: "500px" }}>
      <DataGrid
        rows={filteredDevices}
        columns={[
          ...columns,
          {
            field: "security",
            headerName: "Security Status",
            width: 200,
            headerClassName: "custom-header",
            flex: 0.5,
            type: "singleSelect",
            valueGetter: (params: any) => {
              if (!params.firewall) {
                return "Missing Firewall";
              }
              if (!params.encryption) {
                return "Missing Antivirus";
              }
              if (!params.antivirus) {
                return "Missing Antivirus";
              }
              if (params.encryption && params.antivirus && params.firewall) {
                return "Healthy";
              }
            },
            valueOptions: [
              "Healthy",
              "Missing Antivirus",
              "Missing Encryption",
              "Outdated",
              "Missing Firewall",
            ],
            renderCell: (params) => (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  height: "100%",
                }}
              >
                {renderSecurityStatusIcon(params.row as Device)}
              </div>
            ),
          },
        ]}
        sx={{
          ".MuiDataGrid-columnHeader": {
            backgroundColor: "#333",
            color: "white",
            borderBottom: "#333",
          },
          ".MuiDataGrid-cell": {
            borderBottom: "#333",
          },
          ".odd": {
            backgroundColor: "#333",
          },
        }}
        slots={{
          toolbar: CustomToolbar,
        }}
        disableRowSelectionOnClick
        initialState={{
          pagination: { paginationModel: { pageSize: 7 } },
          columns: {
            columnVisibilityModel,
          },
        }}
      />
    </Box>
  );
}
