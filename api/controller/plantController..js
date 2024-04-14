const fs = require("fs");
const path = require("path");
const __parentDir = path.join(__dirname, "../../");

const { celebrate, Joi } = require("celebrate");
const moment = require("moment-timezone");
const rawData = fs.readFileSync(__parentDir + "api/assets/json/plants.json");

const validateData = () =>
  celebrate({
    body: Joi.array()
      .items(
        Joi.object().keys({
          id_plant: Joi.number().integer().required(),
          name: Joi.string().default("selada"),
          weight: Joi.number().integer().required(),
          pixel: Joi.number().integer().required(),
        })
      )
      .min(20)
      .max(20),
  });

const getPlants = async (req, res) => {
  try {
    const generateResponse = [];
    const plants = JSON.parse(rawData);

    // Mengurutkan data berdasarkan id_plant secara descending
    const sortedPlants = plants
      .sort((a, b) => b.id_plant - a.id_plant)
      .slice(0, 20);

    sortedPlants.forEach((plant) => {
      generateResponse.push({
        id: plant.id,
        attributes: {
          id_plant: plant.id_plant,
          name: plant.name,
          weight: plant.weight,
          pixel: plant.pixel,
          updated: generateTime(plant.updatedAt),
        },
      });
    });

    if (generateResponse.length > 0) {
      res.status(201).json({ success: true, data: generateResponse });
    } else {
      res
        .status(404)
        .json({ success: false, message: "No latest plant found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error retrieving latest plant" });
  }
};

const getPlantsById = async (req, res) => {
  try {
    const plants = JSON.parse(rawData);

    // Mencari tanaman berdasarkan ID yang diminta
    const requestedPlant = plants.find(
      (plant) => plant.id === parseInt(req.params.id)
    );

    if (requestedPlant) {
      const generateRespone = {
        id: requestedPlant.id,
        attributes: {
          id_plant: requestedPlant.id_plant,
          name: requestedPlant.name,
          weight: requestedPlant.weight,
          pixel: requestedPlant.pixel,
          updated: generateTime(requestedPlant.updatedAt),
        },
      };

      res.status(200).json({ success: true, data: generateRespone });
    } else {
      res.status(404).json({ success: false, message: "Plant not found" });
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Error fetching plant data" });
  }
};

const getHistoryPlant = async (req, res) => {
  try {
    const plants = JSON.parse(rawData);

    // Mencari semua entri yang sesuai dengan id_plant yang diminta
    const filteredPlants = plants.filter(
      (plant) => plant.id_plant === parseInt(req.params.id_plant)
    );

    if (filteredPlants.length > 0) {
      const generateResponse = filteredPlants.map((plant) => ({
        id: plant.id,
        attributes: {
          id_plant: plant.id_plant,
          name: plant.name,
          weight: plant.weight,
          pixel: plant.pixel,
          updated: generateTime(plant.updatedAt),
        },
      }));

      res.status(200).json({ success: true, data: generateResponse });
    } else {
      res.status(404).json({
        success: false,
        message: "No plant history found for the given id_plant",
      });
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Error retrieving plant history" });
  }
};

const getImage = async (req, res) => {
  const nameImage = req.params.nameImage;
  try {
    const imagePath = path.join(__dirname, "public", nameImage);
    if (fs.existsSync(imagePath)) {
      // Mengirim file gambar sebagai respons
      res.sendFile(imagePath);
    } else {
      // Jika file gambar tidak ditemukan, kirim respons error
      res.status(404).json({ success: false, message: "Image not found" });
    }
  } catch (error) {
    // Jika terjadi kesalahan lain, kirim respons error
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const landingPage = (req, res) => {
  const response = {
    endpoints: [
      {
        method: "GET",
        path: "/",
        handler: "landingPage",
        description: "Endpoint for landing page",
      },
      {
        method: "GET",
        path: "/img/:nameImage",
        handler: "getImage",
        middleware: "verifyToken",
        description: "Endpoint to get image by name",
        authorization: true,
      },
      {
        method: "GET",
        path: "/plants",
        handler: "getPlants",
        middleware: "verifyToken",
        description: "Endpoint to get list of plants",
        authorization: true,
      },
      {
        method: "GET",
        path: "/history/:id_plant",
        handler: "getHistoryPlant",
        middleware: "verifyToken",
        description: "Endpoint to get history of a plant by id",
        authorization: true,
      },
      {
        method: "GET",
        path: "/plants/:id",
        handler: "getPlantsById",
        middleware: "verifyToken",
        description: "Endpoint to get a plant by id",
        authorization: true,
      },
    ],
  };
  res.end(JSON.stringify(response));
};

const generateTime = (time) => {
  const jakartaTime = moment.tz(new Date(time), "Asia/Jakarta");
  const dd = jakartaTime.format("DD");
  const mm = jakartaTime.format("MM");
  const yyyy = jakartaTime.format("YYYY");
  const result = `${dd}/${mm}/${yyyy}`;
  return result;
};

module.exports = {
  getPlants,
  getPlantsById,
  validateData,
  getHistoryPlant,
  getImage,
  landingPage,
};
