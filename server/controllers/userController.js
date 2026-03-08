import User from "../models/User.js";
import bcrypt from "bcrypt";

export const createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Generarmos la "sal" (un costo computacional para hacer el hash más seguro)
    const salt = await bcrypt.genSalt(10);

    //Creamos el hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, salt);

    // Guardamos el usuario con la contraseña ENCRIPTADA
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "Usuario creado con éxito",
      user: { id: newUser.id, name: newUser.name, email: newUser.email }, // No devolvemos el hash por seguridad
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al crear el usuario", error: error.message });
  }
};

export const getUsers = async (req, res) => {
  try {
    const user = await User.findAll();
    res.status(200).json(user);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener el usuario", error: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Buscamos al usuario por su email
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Comparamos la contraseña que envía el usuario con el hash de la DB
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    //sabemos si todo esta bien
    res.status(200).json({
      message: "Login exitoso",
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error en el servidor", error: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, profilePic, jobTitle, certifications } = req.body;

    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

    // Actualizamos los campos dinámicos
    await user.update({
      name,
      email,
      profilePic,
      jobTitle,
      certifications
    });

    res.json({ message: "Perfil actualizado con éxito", user });
  } catch (error) {
    res.status(500).json({ message: "Error interno del servidor" });
  }
};