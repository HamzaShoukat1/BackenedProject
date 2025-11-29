// import path from "path";
import dotenv from "dotenv";
// dotenv.config({ path: path.resolve(process.cwd(), ".env") });
dotenv.config({
  path: './.env'
})


import { app } from "./app.js";
import connectDB from "./db/db.js";

const startServer = async ():Promise<void> => {
  try {
    await connectDB();

    const PORT:number = Number(process.env.PORT) || 8003;
    const server = app.listen(PORT, () => {
      console.log(`server is running on port,${PORT}`);
    });
    server.on("error", (error:Error) => {
      console.error(" Server error:", error);
      process.exit(1);
    });
  } catch (error) {
    console.error(" Failed to start server:", error);
    process.exit(1);
  }
};
startServer()
