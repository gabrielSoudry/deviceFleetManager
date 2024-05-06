export interface Device {
  id: string;
  clientId: string;
  manufacturer: string;
  model: string;
  serialNumber: string;
  cpu: string;
  ram: number;
  storage: number;
  hardwareId: string;
  security: {
    firewall: boolean;
    antivirus: boolean;
    encryption: boolean;
  };
  user: string;
  lastCheckInDate: number;
}
