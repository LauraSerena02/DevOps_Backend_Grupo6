CREATE DATABASE  dbMisLuquitas;
USE dbMisLuquitas;


-- Tabla tipo de identificacion
CREATE TABLE tblIdentificationType (
    typeId INT PRIMARY KEY,
    idDescription VARCHAR(50) NOT NULL
);

-- Tabla paises
CREATE TABLE tblCountry (
    countryId INT PRIMARY KEY,
    countryName VARCHAR(100) NOT NULL
);


-- Tabla categoria gastos
CREATE TABLE tblExpenseCategory (
    expenseCategoryId INT PRIMARY KEY,
    categoryName VARCHAR(50) NOT NULL
);

-- Tabla categoria ingresos
CREATE TABLE tblIncomeCategory (
    incomeCategoryId INT PRIMARY KEY,
    incomeName VARCHAR(50) NOT NULL
);

-- Tabla consejos 
CREATE TABLE tblTip (
    tipID INT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    photo VARCHAR(255)
);

-- Tabla formas de pago ingreso 
CREATE TABLE tblIncomeMethodPayment (
    incomeMethodPaymentId INT PRIMARY KEY,
    incomeMethodPaymentName VARCHAR(50) NOT NULL
);

-- Tabla formas de pago gasto
CREATE TABLE tblExpenseMethodPayment (
    expenseMethodPaymentId INT PRIMARY KEY,
    expenseMethodPaymentName VARCHAR(50) NOT NULL
);

-- Tabla usuarios

CREATE TABLE tblUser (
    userId INT AUTO_INCREMENT PRIMARY KEY,
    userName VARCHAR(100),
    UserLastName VARCHAR (100),
    typeId INT,
	idNumber VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    countryId INT,
    password VARCHAR(100) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    photoUser VARCHAR(255),
	FOREIGN KEY (typeId) REFERENCES tblIdentificationType(typeId),
    FOREIGN KEY (countryId) REFERENCES tblCountry(countryId)
    
);


CREATE TABLE tblExpense(
	expenseId INT AUTO_INCREMENT PRIMARY KEY,
    expenseDate DATETIME NOT NULL,
    expenseAmount DOUBLE, -- Número de digitos a reconocer, decimales.
    expenseMethodPaymentId INT,
    expenseCategoryId INT,
    expenseDescription TEXT NOT NULL,
    userId INT,
    FOREIGN KEY (userId) REFERENCES tblUser(userId),
    FOREIGN KEY (expenseCategoryId) REFERENCES tblExpenseCategory(expenseCategoryId),
	FOREIGN KEY (expenseMethodPaymentId) REFERENCES tblExpenseMethodPayment(expenseMethodPaymentId)
);



CREATE TABLE tblIncome (
	incomeId INT AUTO_INCREMENT PRIMARY KEY,
    incomeDate DATETIME NOT NULL,
    incomeAmount DOUBLE, -- Número de digitos a reconocer, decimales.
	incomeMethodPaymentId INT,
    incomeCategoryId INT,
    incomeDescription TEXT NOT NULL,
    userId INT,
    FOREIGN KEY (userId) REFERENCES tblUser(userId),
    FOREIGN KEY (incomeCategoryId) REFERENCES tblIncomeCategory(incomeCategoryId),
	FOREIGN KEY (incomeMethodPaymentId) REFERENCES tblIncomeMethodPayment(incomeMethodPaymentId)
);

CREATE TABLE tblToken(
	tokenId INT AUTO_INCREMENT PRIMARY KEY,
	email VARCHAR(100) NOT NULL UNIQUE,
    tokenInfo TEXT NOT NULL,
    tokenExpirationDate DATETIME NOT NULL,
    FOREIGN KEY (email) REFERENCES tblUser(email)
);


INSERT INTO tblCountry (countryId, countryName) VALUES
(1, 'Afganistán'),
(2, 'Albania'),
(3, 'Alemania'),
(4, 'Andorra'),
(5, 'Angola'),
(6, 'Antigua y Barbuda'),
(7, 'Arabia Saudita'),
(8, 'Argelia'),
(9, 'Argentina'),
(10, 'Armenia'),
(11, 'Australia'),
(12, 'Austria'),
(13, 'Azerbaiyán'),
(14, 'Bahamas'),
(15, 'Bangladés'),
(16, 'Barbados'),
(17, 'Baréin'),
(18, 'Bélgica'),
(19, 'Belice'),
(20, 'Benín'),
(21, 'Bielorrusia'),
(22, 'Birmania'),
(23, 'Bolivia'),
(24, 'Bosnia y Herzegovina'),
(25, 'Botsuana'),
(26, 'Brasil'),
(27, 'Brunéi'),
(28, 'Bulgaria'),
(29, 'Burkina Faso'),
(30, 'Burundi'),
(31, 'Bután'),
(32, 'Cabo Verde'),
(33, 'Camboya'),
(34, 'Camerún'),
(35, 'Canadá'),
(36, 'Catar'),
(37, 'Chad'),
(38, 'Chile'),
(39, 'China'),
(40, 'Chipre'),
(41, 'Ciudad del Vaticano'),
(42, 'Colombia'),
(43, 'Comoras'),
(44, 'Corea del Norte'),
(45, 'Corea del Sur'),
(46, 'Costa de Marfil'),
(47, 'Costa Rica'),
(48, 'Croacia'),
(49, 'Cuba'),
(50, 'Dinamarca'),
(51, 'Dominica'),
(52, 'Ecuador'),
(53, 'Egipto'),
(54, 'El Salvador'),
(55, 'Emiratos Árabes Unidos'),
(56, 'Eritrea'),
(57, 'Eslovaquia'),
(58, 'Eslovenia'),
(59, 'España'),
(60, 'Estados Unidos'),
(61, 'Estonia'),
(62, 'Esuatini'),
(63, 'Etiopía'),
(64, 'Filipinas'),
(65, 'Finlandia'),
(66, 'Fiyi'),
(67, 'Francia'),
(68, 'Gabón'),
(69, 'Gambia'),
(70, 'Georgia'),
(71, 'Ghana'),
(72, 'Granada'),
(73, 'Grecia'),
(74, 'Guatemala'),
(75, 'Guyana'),
(76, 'Guinea'),
(77, 'Guinea-Bisáu'),
(78, 'Guinea Ecuatorial'),
(79, 'Haití'),
(80, 'Honduras'),
(81, 'Hungría'),
(82, 'India'),
(83, 'Indonesia'),
(84, 'Irak'),
(85, 'Irán'),
(86, 'Irlanda'),
(87, 'Islandia'),
(88, 'Islas Marshall'),
(89, 'Islas Salomón'),
(90, 'Israel'),
(91, 'Italia'),
(92, 'Jamaica'),
(93, 'Japón'),
(94, 'Jordania'),
(95, 'Kazajistán'),
(96, 'Kenia'),
(97, 'Kirguistán'),
(98, 'Kiribati'),
(99, 'Kuwait'),
(100, 'Laos'),
(101, 'Lesoto'),
(102, 'Letonia'),
(103, 'Líbano'),
(104, 'Liberia'),
(105, 'Libia'),
(106, 'Liechtenstein'),
(107, 'Lituania'),
(108, 'Luxemburgo'),
(109, 'Madagascar'),
(110, 'Malasia'),
(111, 'Malaui'),
(112, 'Maldivas'),
(113, 'Malí'),
(114, 'Malta'),
(115, 'Marruecos'),
(116, 'Mauricio'),
(117, 'Mauritania'),
(118, 'México'),
(119, 'Micronesia'),
(120, 'Moldavia'),
(121, 'Mónaco'),
(122, 'Mongolia'),
(123, 'Montenegro'),
(124, 'Mozambique'),
(125, 'Namibia'),
(126, 'Nauru'),
(127, 'Nepal'),
(128, 'Nicaragua'),
(129, 'Níger'),
(130, 'Nigeria'),
(131, 'Noruega'),
(132, 'Nueva Zelanda'),
(133, 'Omán'),
(134, 'Países Bajos'),
(135, 'Pakistán'),
(136, 'Palaos'),
(137, 'Panamá'),
(138, 'Papúa Nueva Guinea'),
(139, 'Paraguay'),
(140, 'Perú'),
(141, 'Polonia'),
(142, 'Portugal'),
(143, 'Reino Unido'),
(144, 'República Centroafricana'),
(145, 'República Checa'),
(146, 'República Democrática del Congo'),
(147, 'República Dominicana'),
(148, 'Ruanda'),
(149, 'Rumania'),
(150, 'Rusia'),
(151, 'Samoa'),
(152, 'San Cristóbal y Nieves'),
(153, 'San Marino'),
(154, 'San Vicente y las Granadinas'),
(155, 'Santa Lucía'),
(156, 'Santo Tomé y Príncipe'),
(157, 'Senegal'),
(158, 'Serbia'),
(159, 'Seychelles'),
(160, 'Sierra Leona'),
(161, 'Singapur'),
(162, 'Siria'),
(163, 'Somalia'),
(164, 'Sri Lanka'),
(165, 'Suazilandia'),
(166, 'Sudáfrica'),
(167, 'Sudán'),
(168, 'Sudán del Sur'),
(169, 'Suecia'),
(170, 'Suiza'),
(171, 'Surinam'),
(172, 'Tailandia'),
(173, 'Tanzania'),
(174, 'Tayikistán'),
(175, 'Timor Oriental'),
(176, 'Togo'),
(177, 'Tonga'),
(178, 'Trinidad y Tobago'),
(179, 'Túnez'),
(180, 'Turkmenistán'),
(181, 'Turquía'),
(182, 'Tuvalu'),
(183, 'Ucrania'),
(184, 'Uganda'),
(185, 'Uruguay'),
(186, 'Uzbekistán'),
(187, 'Vanuatu'),
(188, 'Venezuela'),
(189, 'Vietnam'),
(190, 'Yemen'),
(191, 'Yibuti'),
(192, 'Zambia'),
(193, 'Zimbabue');


INSERT INTO tblIdentificationType (typeId,  idDescription) VALUES
(1, "Cédula de Ciudadanía (CC)"),
(2, "Tarjeta de Identidad (TI)"),
(3, "Registro Civil (RC)"),
(4, "Cédula de Extranjería (CE)"),
(5, "Carné de Identidad (CI)"),
(6, "Documento Nacional de Identidad (DNI)");

INSERT INTO tblTip (tipID, title, content, photo) 
VALUES (1, 'Ahorrar es la berraquera', 'Guarde plata mes a mes, asi sea poquito.', 'https://res.cloudinary.com/dzv9wocfd/image/upload/v1728788627/Imagen_2_ngogeq.jpg');

INSERT INTO tblTip (tipID, title, content, photo) 
VALUES (2, 'Tenga un colchoncito', 'Tenga un colchoncito pa cualquier eventualidad. ¡Eso es clave!', 'https://res.cloudinary.com/dzv9wocfd/image/upload/v1728789364/Imagen_1_wucyxf.jpg');

INSERT INTO tblTip (tipID, title, content, photo) 
VALUES (3, 'No coma cuento de la prima', 'Cuando llegue la platica extra, no la gaste de una.', 'https://res.cloudinary.com/dzv9wocfd/image/upload/v1728789013/Imagen_4_gpt5wd.jpg');

INSERT INTO tblTip (tipID, title, content, photo) 
VALUES (4, 'Piensa en invertir', 'Mejor piensa en invertir o guardar para un proyecto más grande.', 'https://res.cloudinary.com/dzv9wocfd/image/upload/v1728788803/Imagen_3_zo5jen.jpg');

INSERT INTO tblTip (tipID, title, content, photo) 
VALUES (5, 'Pa ser cucho, mas vale ahorrar', 'Si quiere llegar a la vejez tranquilo.', 'https://res.cloudinary.com/dzv9wocfd/image/upload/v1728789259/Imagen_5_bykxbf.jpg');

INSERT INTO tblIncomeCategory (incomeCategoryId, incomeName) VALUES
(1, "Sueldo o salario"),
(2, "Honorarios"),
(3, "Comisiones"),
(4, "Alquiler de propiedades"),
(5, "Intereses"),
(6, "Dividendos"),
(7, "Ventas de productos"),
(8, "Servicios prestados"),
(9, "Venta de activos"),
(10, "Premios/loterías"),
(11, "Bonos"),
(12, "Herencias"),
(13, "Reembolsos"),
(14, "Regalías"),
(15, "Seguros"),
(16, "Criptomonedas"),
(17, "Inversiones");

INSERT INTO tblIncomeMethodPayment (incomeMethodPaymentId, incomeMethodPaymentName) VALUES
(1, "Transferencia bancaria"),
(2, "Cheque"),
(3, "Efectivo"),
(4, "Transaccion electronica");

INSERT INTO tblExpenseCategory (expenseCategoryId, categoryName) VALUES
(1, "Servicios"),
(2, "Hogar"),
(3, "Hijos"),
(4, "Entretenimiento"),
(5, "Transporte"),
(6, "Mascota"),
(7, "Cuidado personal"),
(8, "Salud"),
(9, "Alimentacion"),
(10, "Finanzas"),
(11, "Otros");

INSERT INTO tblExpenseMethodPayment (expenseMethodPaymentId, expenseMethodPaymentName) VALUES
(1, "Transferencia bancaria"),
(2, "Cheque"),
(3, "Efectivo"),
(4, "Transaccion electronica");


