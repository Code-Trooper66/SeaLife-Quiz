import { validationResult } from "express-validator";
import User from "../models/User.js";
import Admin from "../models/Admin.js";
import dotenv from "dotenv";
import Session from "../models/Session.js";
dotenv.config();

const authController = {
  userLogin: async (req, res) => {
    const __ = req.__;

    const inputs = [
      {
        name: "firstname",
        label: __("first_name_label"),
        type: "text",
        value: req.body?.firstname || "",
        err: req.formErrorFields?.firstname
          ? __(req.formErrorFields.firstname)
          : "",
      },
      {
        name: "lastname",
        label: __("last_name_label"),
        type: "text",
        value: req.body?.lastname || "",
        err: req.formErrorFields?.lastname
          ? __(req.formErrorFields.lastname)
          : "",
      },
      {
        name: "birthday",
        label: __("dob_label"),
        type: "date",
        value: req.body?.birthday || "",
        err: req.formErrorFields?.birthday
          ? __(req.formErrorFields.birthday)
          : "",
      },
      {
        name: "pincode",
        label: __("pincode_label"),
        type: "password",
        value: req.body?.pincode || "",
        err: req.formErrorFields?.pincode
          ? __(req.formErrorFields.pincode)
          : "",
        pattern: "\\d{4}",
        maxlength: 4,
        minlength: 4,
        autocomplete: "off",
      },
    ];

    res.render("login", {
      layout: "layouts/authentication",
      inputs,
      flash: req.flash,
    });
  },

  postLogin: async (req, res) => {
    const errors = validationResult(req);

    if (!/^\d{4}$/.test(req.body.pincode)) {
      errors.errors.push({
        value: req.body.pincode,
        msg: "Pincode must be exactly 4 digits.",
        param: "pincode",
        location: "body",
      });
    }

    if (!errors.isEmpty()) {
      const formErrorFields = {};
      errors.array().forEach((error) => {
        formErrorFields[error.path] = error.msg;
      });

      const inputs = [
        {
          name: "firstname",
          label: "Voornaam",
          type: "text",
          value: req.body?.firstname || "",
          err: formErrorFields.firstname || "",
        },
        {
          name: "lastname",
          label: "Achternaam",
          type: "text",
          value: req.body?.lastname || "",
          err: formErrorFields.lastname || "",
        },
        {
          name: "birthday",
          label: "Geboortedatum",
          type: "date",
          value: req.body?.birthday || "",
          err: formErrorFields.birthday || "",
        },
        {
          name: "pincode",
          label: "Pincode",
          type: "password",
          value: req.body?.pincode || "",
          err: formErrorFields.pincode || "",
          pattern: "\\d{4}",
          maxlength: 4,
          minlength: 4,
          autocomplete: "off",
        },
      ];

      return res.render("login", {
        layout: "layouts/authentication",
        inputs,
        flash: { type: "danger", message: "Er zijn fouten opgetreden" },
      });
    }

    let user = await User.query().findOne({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      birthday: req.body.birthday,
    });

    if (!user) {
      user = await User.query().insert({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        birthday: req.body.birthday,
        pincode: req.body.pincode,
      });
    } else {
      if (user.pincode !== req.body.pincode) {
        const inputs = [
          {
            name: "firstname",
            label: "Voornaam",
            type: "text",
            value: req.body?.firstname || "",
            err: "",
          },
          {
            name: "lastname",
            label: "Achternaam",
            type: "text",
            value: req.body?.lastname || "",
            err: "",
          },
          {
            name: "birthday",
            label: "Geboortedatum",
            type: "date",
            value: req.body?.birthday || "",
            err: "",
          },
          {
            name: "pincode",
            label: "Pincode",
            type: "password",
            value: "",
            err: "Pincode is incorrect.",
            pattern: "\\d{4}",
            maxlength: 4,
            minlength: 4,
            autocomplete: "off",
          },
        ];
        return res.render("login", {
          layout: "layouts/authentication",
          inputs,
          flash: { type: "danger", message: "Pincode is incorrect." },
        });
      }
    }

    let age = null;
    if (req.body.birthday) {
      const birthDate = new Date(req.body.birthday);
      const today = new Date();
      age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
    }
    res.cookie("authenticated", "true", { httpOnly: true });
    res.redirect(`/quiz/1?user_id=${user.id}`);
  },

  adminLogin: async (req, res) => {
    const inputs = [
      {
        name: "name",
        label: "Naam",
        type: "text",
        value: req.body?.name || "",
        err: req.formErrorFields?.name || "",
      },
      {
        name: "email",
        label: "E-Mail",
        type: "email",
        value: req.body?.email || "",
        err: req.formErrorFields?.email || "",
      },
      {
        name: "password",
        label: "Wachtwoord",
        type: "password",
        value: req.body?.password || "",
        err: req.formErrorFields?.password || "",
      },
    ];

    res.render("admin/adminLogin", {
      layout: "layouts/authentication",
      inputs,
      flash: req.flash,
    });
  },

  postAdminLogin: async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const formErrorFields = {};
      errors.array().forEach((error) => {
        formErrorFields[error.path] = error.msg;
      });

      const inputs = [
        {
          name: "name",
          label: "Naam",
          type: "text",
          value: req.body?.name || "",
          err: formErrorFields.name || "",
        },
        {
          name: "email",
          label: "E-Mail",
          type: "email",
          value: req.body?.email || "",
          err: formErrorFields.email || "",
        },
        {
          name: "password",
          label: "Wachtwoord",
          type: "password",
          value: req.body?.password || "",
          err: formErrorFields.password || "",
        },
      ];

      return res.render("admin/adminLogin", {
        layout: "layouts/authentication",
        inputs,
        flash: { type: "danger", message: "Er zijn fouten opgetreden" },
      });
    }
    const { name, email, password } = req.body;
    const admin = await Admin.query().findOne({ name, email });

    if (!admin || admin.password !== password) {
      const inputs = [
        {
          name: "name",
          label: "Naam",
          type: "text",
          value: req.body?.name || "",
          err: "",
        },
        {
          name: "email",
          label: "E-Mail",
          type: "email",
          value: req.body?.email || "",
          err: "",
        },
        {
          name: "password",
          label: "Wachtwoord",
          type: "password",
          value: "",
          err: "Ongeldige inloggegevens.",
        },
      ];

      return res.render("admin/adminLogin", {
        layout: "layouts/authentication",
        inputs,
        flash: { type: "danger", message: "Er zijn fouten opgetreden" },
      });
    }

    res.cookie("adminLoggedIn", true, { httpOnly: true });
    return res.redirect("/admin");
  },

  adminRegister: (req, res) => {
    const inputs = [
      {
        name: "name",
        label: "Naam",
        type: "text",
        value: req.body?.name || "",
        err: "",
      },
      {
        name: "email",
        label: "E-Mail",
        type: "email",
        value: req.body?.email || "",
        err: "",
      },
      {
        name: "token",
        label: "Registratie Token",
        type: "text",
        value: req.body?.token || "",
        err: "",
      },
      {
        name: "password",
        label: "Wachtwoord",
        type: "password",
        value: req.body?.password,
        err: "",
      },
      {
        name: "confirm-password",
        label: "Confirm wachtwoord",
        type: "password",
        value: req.body?.["confirm-password"],
        err: "",
      },
    ];

    res.render("admin/adminRegister", {
      layout: "layouts/authentication",
      inputs,
      flash: req.flash,
    });
  },

  postAdminRegister: async (req, res) => {
    const errors = validationResult(req);

    const formErrorFields = {};
    errors.array().forEach((error) => {
      formErrorFields[error.path] = error.msg;
    });

    const inputs = [
      {
        name: "name",
        label: "Naam",
        type: "text",
        value: req.body?.name || "",
        err: formErrorFields.name || "",
      },
      {
        name: "email",
        label: "E-Mail",
        type: "email",
        value: req.body?.email || "",
        err: formErrorFields.email || "",
      },
      {
        name: "token",
        label: "Registratie Token",
        type: "text",
        value: req.body?.token || "",
        err: formErrorFields.token || "",
      },
      {
        name: "password",
        label: "Wachtwoord",
        type: "password",
        value: req.body?.password,
        err: formErrorFields.password || "",
      },
      {
        name: "confirm-password",
        label: "Confirm wachtwoord",
        type: "password",
        value: req.body?.["confirm-password"],
        err: formErrorFields["confirm-password"] || "",
      },
    ];

    if (!errors.isEmpty()) {
      return res.render("admin/adminRegister", {
        layout: "layouts/authentication",
        inputs,
        flash: { type: "danger", message: "Er zijn fouten opgetreden" },
      });
    }

    const { name, email, password, token } = req.body;
    if (token !== process.env.TOKEN_SALT) {
      inputs.find((i) => i.name === "token").err =
        "Ongeldige registratie token.";
      return res.render("admin/adminRegister", {
        layout: "layouts/authentication",
        inputs,
        flash: { type: "danger", message: "Ongeldige registratie token." },
      });
    }

    const existingAdmin = await Admin.query().findOne({ email });
    if (existingAdmin) {
      inputs.find((i) => i.name === "email").err = "E-mail bestaat al.";
      return res.render("admin/adminRegister", {
        layout: "layouts/authentication",
        inputs,
        flash: { type: "danger", message: "E-mail bestaat al." },
      });
    }

    try {
      await Admin.query().insert({ name, email, password });
      res.redirect("/adminLogin");
    } catch (err) {
      console.error("Admin registration error:", err);
      return res.render("admin/adminRegister", {
        layout: "layouts/authentication",
        inputs,
        flash: { type: "danger", message: "Database fout: " + err.message },
      });
    }
  },
};

export default authController;
