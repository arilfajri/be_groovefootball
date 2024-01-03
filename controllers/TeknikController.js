import Teknik from "../models/TeknikModel.js";

export const getAllTeknik = async (req, res) => {
  try {
    const response = await Teknik.findAll();
    res.json(response);
  } catch (error) {
    console.log(error.message);
  }
};

export const getTeknikById = async (req, res) => {
  try {
    const response = await Teknik.findOne({
      where: {
        id: req.params.id,
      },
    });
    res.json(response);
  } catch (error) {
    console.log(error.message);
  }
};
