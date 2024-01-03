import Simulasi from "../models/SimulasiModel.js";
import Teknik from "../models/TeknikModel.js";
import path from "path";

export const getAllTeknikWithSimulasi = async (req, res) => {
  try {
    const response = await Teknik.findAll({
      include: {
        model: Simulasi,
      },
    });
    res.json(response);
  } catch (error) {
    console.log(error.message);
  }
};

export const getAllTeknikWithSimulasiById = async (req, res) => {
  try {
    const teknikId = req.params.id;

    const teknikWithSimulasi = await Teknik.findByPk(teknikId, {
      include: {
        model: Simulasi, // Kolom kategori yang ingin ditampilkan
      },
    });

    if (!teknikWithSimulasi) {
      return res.status(404).json({ msg: "Teknik with simulasi not found" });
    }

    res.json(teknikWithSimulasi);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

export const addTeknikWithSimulasi = async (req, res) => {
  if (req.files === null)
    return res.status(400).json({ msg: "No File Uploaded" });

  const file = req.files.file;
  const video_teknik = req.body.video_teknik;
  const deskripsi_video = req.body.deskripsi_video;
  const fileSize = file.data.length;
  const ext = path.extname(file.name);
  const fileName = file.md5 + ext;
  const url = `${req.protocol}://${req.get("host")}/images/${fileName}`;
  const allowedType = [".png", ".jpg", ".jpeg"];

  if (!allowedType.includes(ext.toLowerCase()))
    return res.status(422).json({ msg: "Invalid Images" });
  if (fileSize > 5000000)
    return res.status(422).json({ msg: "Image must be less than 5 MB" });

  file.mv(`./public/images/${fileName}`, async (err) => {
    if (err) return res.status(500).json({ msg: err.message });

    const teknikId = req.body.teknikId;

    if (!teknikId) {
      try {
        const { nama_teknik } = req.body;
        const { deskripsi_teknik } = req.body;
        const { tingkat_kesulitan } = req.body;

        const existingTeknik = await Teknik.findOne({
          where: {
            nama_teknik: nama_teknik,
          },
        });

        if (existingTeknik) {
          return res.status(422).json({ msg: "Nama teknik already exists" });
        }

        const newTeknik = await Teknik.create({
          nama_teknik,
          deskripsi_teknik,
          tingkat_kesulitan,
        });

        await Simulasi.create({
          foto_teknik: fileName,
          video_teknik,
          deskripsi_video,
          url: url,
          teknikId: newTeknik.id,
        });

        res.status(201).json({ msg: "Product Created Successfully" });
      } catch (error) {
        console.log(error.message);
        res.status(500).json({ msg: "Internal Server Error" });
      }
    } else {
      try {
        await Teknik.create({
          foto_teknik: fileName,
          video_teknik,
          deskripsi_video,
          url: url,
          teknikId,
        });
        res.status(201).json({ msg: "Product Created Successfully" });
      } catch (error) {
        console.log(error.message);
        res.status(500).json({ msg: "Internal Server Error" });
      }
    }
  });
};

export const updateTeknikWithSimulasi = async (req, res) => {
  // Check if a file is uploaded
  if (!req.files || Object.keys(req.files).length === 0) {
    try {
      const teknikId = req.body.teknikId;

      const existingTeknik = await Teknik.findByPk(teknikId);

      if (!existingTeknik) {
        return res.status(404).json({ msg: "Teknik not found" });
      }

      // Update data Teknik
      existingTeknik.nama_teknik =
        req.body.nama_teknik || existingTeknik.nama_teknik;
      existingTeknik.deskripsi_teknik =
        req.body.deskripsi_teknik || existingTeknik.deskripsi_teknik;
      existingTeknik.tingkat_kesulitan =
        req.body.tingkat_kesulitan || existingTeknik.tingkat_kesulitan;

      await existingTeknik.save(); // Simpan perubahan pada data Teknik

      // Update data Simulasi
      await Simulasi.update(
        {
          video_teknik: req.body.video_teknik,
          deskripsi_video: req.body.deskripsi_video,
        },
        {
          where: { teknikId: existingTeknik.id },
        }
      );

      res.status(200).json({ msg: "Teknik and Simulasi updated successfully" });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ msg: "Internal Server Error" });
    }
  } else {
    // If a file is uploaded
    const file = req.files.file;
    const video_teknik = req.body.video_teknik;
    const deskripsi_video = req.body.deskripsi_video;
    const fileSize = file.data.length;
    const ext = path.extname(file.name);
    const fileName = file.md5 + ext;
    const url = `${req.protocol}://${req.get("host")}/images/${fileName}`;
    const allowedType = [".png", ".jpg", ".jpeg"];

    if (!allowedType.includes(ext.toLowerCase())) {
      return res.status(422).json({ msg: "Invalid Images" });
    }

    if (fileSize > 5000000) {
      return res.status(422).json({ msg: "Image must be less than 5 MB" });
    }

    file.mv(`./public/images/${fileName}`, async (err) => {
      if (err) {
        return res.status(500).json({ msg: err.message });
      }

      try {
        const teknikId = req.body.teknikId;

        const existingTeknik = await Teknik.findByPk(teknikId);

        if (!existingTeknik) {
          return res.status(404).json({ msg: "Teknik not found" });
        }

        // Update data Teknik
        existingTeknik.nama_teknik =
          req.body.nama_teknik || existingTeknik.nama_teknik;
        existingTeknik.deskripsi_teknik =
          req.body.deskripsi_teknik || existingTeknik.deskripsi_teknik;
        existingTeknik.tingkat_kesulitan =
          req.body.tingkat_kesulitan || existingTeknik.tingkat_kesulitan;

        await existingTeknik.save(); // Simpan perubahan pada data Teknik

        // Update data Simulasi
        await Simulasi.update(
          {
            foto_teknik: fileName,
            video_teknik,
            deskripsi_video,
            url: url,
          },
          {
            where: { teknikId: existingTeknik.id },
          }
        );

        res
          .status(200)
          .json({ msg: "Teknik and Simulasi updated successfully" });
      } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: "Internal Server Error" });
      }
    });
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
