import express, { Request, Response } from "express";
import next from "next";
import bodyParser from "body-parser";
import cors from "cors";

//   --- Connect prisma ---
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();
const port = process.env.PORT || 3000;

(async () => {
  try {
    await app.prepare();

    const server = express();

    server.use(bodyParser.json());
    server.use(bodyParser.urlencoded({ extended: true }));
    server.use(cors());

    //   --- ENDPOINTS ---
    //   --- GET ALL TASK ---
    server.get("/list", async (req: Request, res: Response) => {
      const users = await prisma.task.findMany();
      return res.json(users);
    });
    //   --- POST ADD NEW TASK ---
    server.post("/list", async (req: Request, res: Response) => {
      const saveData = await prisma.task.create({
        data: {
          task: req.body.task,
          done: false,
        },
      });
      return res.send(saveData);
    });

    //   --- PUT UPTADE STATUS ---
    server.put("/list", async (req: Request, res: Response) => {
      const uptade = JSON.stringify(req.body.done);
      let boolValue;
      if (uptade == "true") {
        boolValue = true;
      } else {
        boolValue = false;
      }
      const updateTask = await prisma.task.update({
        where: {
          id: req.body.id,
        },
        data: {
          done: boolValue,
        },
      });
      return res.send(updateTask);
    });

    //   --- DELETE TASK ---
    server.delete("/list", async (req: Request, res: Response) => {
      const deleteData = await prisma.task.delete({
        where: {
          id: req.body.id,
        },
      });
      return res.send(deleteData);
    });

    server.all("*", (req: Request, res: Response) => {
      return handle(req, res);
    });

    //   --- SERVER START ---
    server.listen(port, (err?: any) => {
      if (err) throw err;
      console.log(`> Ready on localhost:${port}`);
    });
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
