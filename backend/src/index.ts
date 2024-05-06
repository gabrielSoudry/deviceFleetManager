import Koa from "koa";
import cors from "@koa/cors";
import { router } from "./router";

const app = new Koa();
app.use(cors());
app.use(router.routes());

app.listen(process.env.PORT, () => {
  console.log(`Server ready http://localhost:${process.env.PORT}`);
});
