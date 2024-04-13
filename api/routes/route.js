const express = require("express");
const router = express.Router();

const { login, verifyToken } = require("../controller/authController");

const {
  landingPage,
  getPlants,
  getPlantsById,
  getHistoryPlant,
  getImage,
} = require("../controller/plantController.");

router.get("/", landingPage);
router.get("/plants", verifyToken, getPlants);
router.get("/plants/:id", verifyToken, getPlantsById);
router.get("/history/:id_plant", verifyToken, getHistoryPlant);
router.get("/img/:nameImage", verifyToken, getImage);
router.post("/login", login);

module.exports = router;
