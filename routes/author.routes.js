const express = require("express");
const fs = require("fs");
const multer = require("multer");
const upload = multer({ dest: "public" });
const bcrypt = require("bcrypt");
const { generateToken } = require("../utils/token");
const { isAuth } = require("../middlewares/auth.middleware.js");

// Modelos
const { Author } = require("../models/Author.js");
const { Book } = require("../models/Book.js");

// Router propio de authors
const router = express.Router();

// CRUD: READ
router.get("/", (req, res, next) => {
  try {
    console.log("Estamos en el middleware /author que comprueba parámetros");

    const page = req.query.page ? parseInt(req.query.page) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;

    if (!isNaN(page) && !isNaN(limit) && page > 0 && limit > 0) {
      req.query.page = page;
      req.query.limit = limit;
      next();
    } else {
      console.log("Parámetros no válidos:");
      console.log(JSON.stringify(req.query));
      res.status(400).json({ error: "Params page or limit are not valid" });
    }
  } catch (error) {
    next(error);
  }
});

router.get("/", async (req, res, next) => {
  try {
    // Asi leemos query params
    const { page, limit } = req.query;
    const authors = await Author.find()
      .limit(limit)
      .skip((page - 1) * limit);

    // Num total de elementos
    const totalElements = await Author.countDocuments();

    const response = {
      totalItems: totalElements,
      totalPages: Math.ceil(totalElements / limit),
      currentPage: page,
      data: authors,
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
});

// CRUD: READ
router.get("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const author = await Author.findById(id);

    if (author) {
      const temporalAuthor = author.toObject();
      const includeBooks = req.query.includeBooks === "true";
      if (includeBooks) {
        const books = await Book.find({ author: id });
        temporalAuthor.books = books;
      }

      res.json(temporalAuthor);
    } else {
      res.status(404).json({});
    }
  } catch (error) {
    next(error);
  }
});

// CRUD: CREATE
router.post("/", async (req, res, next) => {
  try {
    const author = new Author(req.body);
    const createdAuthor = await author.save();
    return res.status(201).json(createdAuthor);
  } catch (error) {
    next(error);
  }
});

// CRUD: DELETE
router.delete("/:id", isAuth, async (req, res, next) => {
  try {
    const id = req.params.id;

    if (req.user.id !== id && req.user.email !== "admin@gmail.com") {
      return res.status(401).json({ error: "No tienes autorización para realizar esta operación" });
    }

    const authorDeleted = await Author.findByIdAndDelete(id);
    if (authorDeleted) {
      res.json(authorDeleted);
    } else {
      res.status(404).json({});
    }
  } catch (error) {
    next(error);
  }
});

// CRUD: UPDATE
router.put("/:id", isAuth, async (req, res, next) => {
  try {
    const id = req.params.id;

    if (req.user.id !== id && req.user.email !== "admin@gmail.com") {
      return res.status(401).json({ error: "No tienes autorización para realizar esta operación" });
    }

    const authorUpdated = await Author.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (authorUpdated) {
      res.json(authorUpdated);
    } else {
      res.status(404).json({});
    }
  } catch (error) {
    next(error);
  }
});

router.post("/image-upload", upload.single("image"), async (req, res, next) => {
  try {
    // Renombrado de la imagen
    const originalname = req.file.originalname;
    const path = req.file.path;
    const newPath = path + "_" + originalname;
    fs.renameSync(path, newPath);

    // Busqueda de la marca
    const authorId = req.body.authorId;
    const author = await Author.findById(authorId);

    if (author) {
      author.logoImage = newPath;
      await author.save();
      res.json(author);

      console.log("Autor modificado correctamente!");
    } else {
      fs.unlinkSync(newPath);
      res.status(404).send("Autor no encontrado");
    }
  } catch (error) {
    next(error);
  }
});

// LOGIN DE USUARIOS
router.post("/login", async (req, res, next) => {
  try {
    // const email = req.body.email;
    // const password = req.body.password;
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Se deben especificar los campos email y password" });
    }

    const author = await Author.findOne({ email }).select("+password");
    if (!author) {
      // return res.status(404).json({ error: "No existe un usuario con ese email" });
      // Por seguridad mejor no indicar qué usuarios no existen
      return res.status(401).json({ error: "Email y/o contraseña incorrectos" });
    }

    // Comprueba la pass
    const match = await bcrypt.compare(password, author.password);
    if (match) {
      // Quitamos password de la respuesta
      const authorWithoutPass = author.toObject();
      delete authorWithoutPass.password;

      // Generamos token JWT
      const jwtToken = generateToken(author._id, author.email);

      return res.status(200).json({ token: jwtToken });
    } else {
      return res.status(401).json({ error: "Email y/o contraseña incorrectos" });
    }
  } catch (error) {
    next(error);
  }
});

module.exports = { authorRouter: router };
