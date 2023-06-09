const { bookRouter } = require("./routes/book.routes.js");
const { authorRouter } = require("./routes/author.routes.js");
const { fileUploadRouter } = require("./routes/file-upload.routes.js");
const { connect } = require("./db.js");
const cors = require("cors");
const express = require("express");

import { type Request, type Response, type NextFunction, type ErrorRequestHandler } from "express";

const main = async () => {
  // Conexión a la BBDD
  //const database = await connect();
  const database: any = {};
  // Configuración del server
  const PORT = 3000;
  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(
    cors({
      origin: "http://localhost:3000",
    })
  );

  // Middleware de log de peticiones
  app.use((req: Request, res: Response, next: NextFunction) => {
    const date = new Date();
    console.log(`Petición de tipo ${req.method} a la url ${req.originalUrl} el ${date.toString()}`);
    console.log(res)
    next();
  });

  // Rutas
  const router = express.Router();
  router.get("/", (req: Request, res: Response) => {
  
    res.send(`Esta es la home de nuestra API. Conectados a la BBDD ${database.connection.name as string}`); //override."trust me bro: it's a string."
  });
  router.get("*", (req: Request, res: Response) => {
    res.status(404).send("Lo sentimos :( No hemos encontrado la página solicitada.");
  });

  // Usamos las rutas
  app.use("/book", bookRouter);
  app.use("/author", authorRouter);
  app.use("/public", express.static("public"));
  app.use("/file-upload", fileUploadRouter);
  app.use("/", router);

  // Middleware de registro de errores
  // Middleware de gestión de errores
  app.use((err: ErrorRequestHandler, req: Request, res: Response, next: NextFunction) => {
    console.log("*** INICIO DE ERROR ***");
    console.log(`PETICIÓN FALLIDA: ${req.method} a la url ${req.originalUrl}`);
    console.log(err);
    console.log("*** FIN DE ERROR ***");

    const errorAsAny any = err as unknown as any;

    if (err?.name === "ValidationError") {
      res.status(400).json(err);
    } else if (errorAsAny.errmsg?.indexOf("duplicate key") !== -1) {
      res.status(500).json({ error: errorAsAny.errmsg });
    }
  });

  app.listen(PORT, () => {
    console.log(`Server levantado en el puerto ${PORT}`);
  });
};

void main();


