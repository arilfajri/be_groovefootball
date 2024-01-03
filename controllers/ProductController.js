import Product from "../models/ProductModel.js";
import path from "path";
import fs from "fs";
import Category from "../models/CategoryModel.js";

export const getProducts = async (req, res) => {
  try {
    const response = await Product.findAll();
    res.json(response);
  } catch (error) {
    console.log(error.message);
  }
};

export const getAllData = async (req, res) => {
  try {
    const productsWithCategories = await Product.findAll({
      include: {
        model: Category,
        attributes: ["categoryName"], // Kolom kategori yang ingin ditampilkan
      }, // Kolom produk yang ingin ditampilkan
    });

    res.json(productsWithCategories);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

export const getAllDataById = async (req, res) => {
  try {
    const productId = req.params.id;

    const productWithCategory = await Product.findByPk(productId, {
      include: {
        model: Category,
        attributes: ["categoryName"], // Kolom kategori yang ingin ditampilkan
      },
      attributes: ["name", "image", "url"], // Kolom produk yang ingin ditampilkan
    });

    if (!productWithCategory) {
      return res.status(404).json({ msg: "Product not found" });
    }

    res.json(productWithCategory);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

export const getProductById = async (req, res) => {
  try {
    const response = await Product.findOne({
      where: {
        id: req.params.id,
      },
    });
    res.json(response);
  } catch (error) {
    console.log(error.message);
  }
};

export const getCategories = async (req, res) => {
  try {
    const response = await Category.findAll();
    res.json(response);
  } catch (error) {
    console.log(error.message);
  }
};

// Fungsi untuk menambahkan kategori baru
export const addCategory = async (req, res) => {
  try {
    const { categoryName } = req.body;

    // Periksa apakah kategori dengan nama yang sama sudah ada
    const existingCategory = await Category.findOne({
      where: {
        categoryName: categoryName,
      },
    });

    if (existingCategory) {
      return res.status(422).json({ msg: "Category already exists" });
    }

    // Tambahkan kategori baru
    const newCategory = await Category.create({
      categoryName,
    });

    res
      .status(201)
      .json({ msg: "Category Created Successfully", category: newCategory });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

// Fungsi untuk menyimpan produk dengan kategori
export const saveProduct = async (req, res) => {
  if (req.files === null)
    return res.status(400).json({ msg: "No File Uploaded" });

  const name = req.body.title;
  const file = req.files.file;
  const fileSize = file.data.length;
  const ext = path.extname(file.name);
  const fileName = file.md5 + ext;
  const url = `${req.protocol}://${req.get("host")}/images/${fileName}`;
  const allowedType = [".png", ".jpg", ".jpeg"];

  if (!allowedType.includes(ext.toLowerCase()))
    return res.status(422).json({ msg: "Invalid Images" });
  if (fileSize > 5000000)
    return res.status(422).json({ msg: "Image must be less than 5 MB" });

  // Ambil categoryId dari request body atau sesuaikan sumber datanya
  const categoryId = req.body.categoryId; // Sesuaikan dengan field di form atau request

  // Jika categoryId tidak diberikan, tambahkan kategori baru
  if (!categoryId) {
    try {
      const { categoryName } = req.body;

      const existingCategory = await Category.findOne({
        where: {
          categoryName: categoryName,
        },
      });

      if (existingCategory) {
        return res.status(422).json({ msg: "Category already exists" });
      }

      const newCategory = await Category.create({
        categoryName,
      });

      // Gunakan id dari kategori yang baru ditambahkan
      await Product.create({
        name,
        image: fileName,
        url,
        categoryId: newCategory.id,
      });

      res.status(201).json({ msg: "Product Created Successfully" });
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ msg: "Internal Server Error" });
    }
  } else {
    // Jika categoryId sudah diberikan, langsung tambahkan produk
    try {
      await Product.create({ name, image: fileName, url, categoryId });
      res.status(201).json({ msg: "Product Created Successfully" });
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ msg: "Internal Server Error" });
    }
  }
};

// export const saveProduct = (req, res) => {
//   if (req.files === null)
//     return res.status(400).json({ msg: "No File Uploaded" });
//   const name = req.body.title;
//   const file = req.files.file;
//   const fileSize = file.data.length;
//   const ext = path.extname(file.name);
//   const fileName = file.md5 + ext;
//   const url = `${req.protocol}://${req.get("host")}/images/${fileName}`;
//   const allowedType = [".png", ".jpg", ".jpeg"];

//   if (!allowedType.includes(ext.toLowerCase()))
//     return res.status(422).json({ msg: "Invalid Images" });
//   if (fileSize > 5000000)
//     return res.status(422).json({ msg: "Image must be less than 5 MB" });

//   file.mv(`./public/images/${fileName}`, async (err) => {
//     if (err) return res.status(500).json({ msg: err.message });
//     try {
//       await Product.create({ name: name, image: fileName, url: url });
//       res.status(201).json({ msg: "Product Created Successfuly" });
//     } catch (error) {
//       console.log(error.message);
//     }
//   });
// };

export const updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findOne({
      where: {
        id: productId,
      },
      include: Category, // Mengambil informasi kategori terkait
    });

    if (!product) {
      return res.status(404).json({ msg: "No Data Found" });
    }

    let fileName = product.image;

    if (req.files !== null) {
      const file = req.files.file;

      // Validasi tipe dan ukuran gambar (jika diunggah)
      const fileSize = file.data.length;
      const ext = path.extname(file.name);
      const allowedType = [".png", ".jpg", ".jpeg"];

      if (!allowedType.includes(ext.toLowerCase())) {
        return res.status(422).json({ msg: "Invalid Images" });
      }

      if (fileSize > 5000000) {
        return res.status(422).json({ msg: "Image must be less than 5 MB" });
      }

      // Hapus gambar lama jika ada dan simpan gambar baru
      const filepath = `../public/images/${product.image}`;
      fs.unlinkSync(filepath);

      fileName = file.md5 + ext;

      file.mv(`./public/images/${fileName}`, (err) => {
        if (err) {
          return res.status(500).json({ msg: err.message });
        }
      });
    }

    // Mengambil atau membuat kategori baru
    let categoryId = null;
    const categoryName = req.body.categoryName;
    if (categoryName) {
      let category = await Category.findOne({
        where: {
          categoryName: categoryName,
        },
      });

      if (!category) {
        category = await Category.create({
          categoryName: categoryName,
        });
      }

      categoryId = category.id;
    }

    const name = req.body.title || product.name; // Jika title tidak tersedia, gunakan nama lama
    const url = `${req.protocol}://${req.get("host")}/images/${fileName}`;

    await Product.update(
      { name: name, image: fileName, url: url, categoryId: categoryId },
      {
        where: {
          id: productId,
        },
      }
    );

    res.status(200).json({ msg: "Product Updated Successfully" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

// export const updateProduct = async (req, res) => {
//   const product = await Product.findOne({
//     where: {
//       id: req.params.id,
//     },
//     include: Category,
//   });
//   if (!product) return res.status(404).json({ msg: "No Data Found" });

//   let fileName = "";
//   if (req.files === null) {
//     fileName = product.image;
//   } else {
//     const file = req.files.file;
//     const fileSize = file.data.length;
//     const ext = path.extname(file.name);
//     fileName = file.md5 + ext;
//     const allowedType = [".png", ".jpg", ".jpeg"];

//     if (!allowedType.includes(ext.toLowerCase()))
//       return res.status(422).json({ msg: "Invalid Images" });
//     if (fileSize > 5000000)
//       return res.status(422).json({ msg: "Image must be less than 5 MB" });

//     const filepath = `./public/images/${product.image}`;
//     fs.unlinkSync(filepath);

//     file.mv(`./public/images/${fileName}`, (err) => {
//       if (err) return res.status(500).json({ msg: err.message });
//     });
//   }

//   // Mengambil atau membuat kategori baru
//   let categoryId = null;
//   const categoryName = req.body.categoryName;
//   if (categoryName) {
//     let category = await Category.findOne({
//       where: {
//         categoryName: categoryName,
//       },
//     });

//     if (!category) {
//       category = await Category.create({
//         categoryName: categoryName,
//       });
//     }

//     categoryId = category.id;
//   }

//   const name = req.body.title || product.name; // Jika title tidak tersedia, gunakan nama lama
//   const url = `${req.protocol}://${req.get("host")}/images/${fileName}`;

//   try {
//     await Product.update(
//       { name: name, image: fileName, url: url },
//       {
//         where: {
//           id: req.params.id,
//         },
//       }
//     );
//     res.status(200).json({ msg: "Product Updated Successfuly" });
//   } catch (error) {
//     console.log(error.message);
//   }
// };

export const deleteProduct = async (req, res) => {
  const product = await Product.findOne({
    where: {
      id: req.params.id,
    },
  });
  if (!product) return res.status(404).json({ msg: "No Data Found" });

  try {
    const filepath = `./public/images/${product.image}`;
    fs.unlinkSync(filepath);
    await Product.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json({ msg: "Product Deleted Successfuly" });
  } catch (error) {
    console.log(error.message);
  }
};
