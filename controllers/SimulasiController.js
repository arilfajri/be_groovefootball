import Simulasi from "../models/SimulasiModel.js";

export const getAllSimulasi = async (req, res) => {
  try {
    const response = await Simulasi.findAll();
    res.json(response);
  } catch (error) {
    console.log(error.message);
  }
};

export const getSimulasiById = async (req, res) => {
  try {
    const response = await Simulasi.findOne({
      where: {
        id: req.params.id,
      },
    });
    res.json(response);
  } catch (error) {
    console.log(error.message);
  }
};
