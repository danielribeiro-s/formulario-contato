
const express = require("express");
const { body, validationResult } = require("express-validator");
const nodemailer = require("nodemailer");

const router = express.Router();


const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});


router.get("/", (req, res) => {
    res.render("pages/contato");
});


router.post("/enviar", [

    body("nome").trim().notEmpty(),
    body("email").isEmail(),
    body("telefone").trim().notEmpty(),
    body("assunto").trim().notEmpty(),
    body("mensagem").trim().notEmpty()

], (req, res) => {

    
    const erros = validationResult(req);

    if (!erros.isEmpty()) {
        console.log(erros.array());
        return res.status(400).send("Campos inválidos.");
    }

 
    const { nome, email, telefone, assunto, mensagem } = req.body;

    
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER,
        replyTo: email,
        subject: `Contato: ${assunto}`,
        text: `
     Nome: ${nome}
     E-mail: ${email}
     Telefone: ${telefone}
     Assunto: ${assunto}

     Mensagem:
     ${mensagem}
        `
    };

    
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            return res.status(500).send("Erro ao enviar o e-mail.");
        } else {
            console.log(info);
            res.send("E-mail enviado com sucesso!");
        }
    });

});


module.exports = router;
