import bcryptjs from "bcryptjs";
import Admin from "../models/AdminModel.js";
import jwt from "jsonwebtoken";

export const getAllAdmin = async (req, res) => {
  try {
    const response = await Admin.findAll({
      attributes: ["id", "name", "email"],
    });
    res.json(response);
  } catch (error) {
    console.log(error.message);
  }
};

export const Register = async (req, res) => {
  const { name, email, password, confPassword } = req.body;
  if (password !== confPassword)
    return res
      .status(400)
      .json({ msg: "passwword &confirm password tidak cocok!" });
  const salt = await bcryptjs.genSalt();
  const hashPassword = await bcryptjs.hash(password, salt);
  try {
    await Admin.create({
      name: name,
      email: email,
      password: hashPassword,
    });
    res.json({ msg: "Register Berhasil" });
  } catch (error) {
    console.log(error);
  }
};

export const Login = async (req, res) => {
  try {
    const admin = await Admin.findAll({
      where: {
        email: req.body.email,
      },
    });
    const match = await bcryptjs.compare(req.body.password, admin[0].password);
    if (!match) return res.status(400).json({ msg: "Wrong Password" });
    const adminId = admin[0].id;
    const name = admin[0].name;
    const email = admin[0].email;
    const accessToken = jwt.sign(
      { adminId, name, email },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "20s",
      }
    );
    const refreshToken = jwt.sign(
      { adminId, name, email },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: "1d",
      }
    );
    await Admin.update(
      { refresh_token: refreshToken },
      {
        where: {
          id: adminId,
        },
      }
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      domain: ".vercel.app",
    });
    res.json({ accessToken });
  } catch (error) {
    res.status(404).json({ msg: "Email tidak ditemukan" });
  }
};

export const Logout = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.sendStatus(204);
  const admin = await Admin.findAll({
    where: {
      refresh_token: refreshToken,
    },
  });
  if (!admin[0]) return res.sendStatus(204);
  const adminId = admin[0].id;
  await Admin.update(
    { refresh_token: null },
    {
      where: {
        id: adminId,
      },
    }
  );
  res.clearCookie("refreshToken");
  return res.sendStatus(200);
};
