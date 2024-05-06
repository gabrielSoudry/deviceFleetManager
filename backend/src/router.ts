import Router from "@koa/router";
import devicesData from "../fixtures/devices.json";
import { Device } from "./types/device";

const devices: Device[] = devicesData as Device[];
const router = new Router();

async function simulateDatabaseCall() {
  await new Promise((resolve) => setTimeout(resolve, 10));
}

router.get("/:id", async (ctx) => {
  await simulateDatabaseCall();
  const idDevice = ctx.params.id;
  const device = devices.find((device) => device.id === idDevice);
  if (device) {
    ctx.body = device;
  } else {
    ctx.status = 404;
    ctx.body = { error: "Device not found" };
  }
});

router.get("/", async (ctx) => {
  await simulateDatabaseCall(); // Simulate database call
  ctx.body = devices;
});

export { router };
