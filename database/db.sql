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

INSERT INTO tblCountry (countryId, countryName) VALUES
(1, "Colombia"),
(2, "México"),
(3, "Argentina"),
(4, "Chile"),
(5, "Venezuela"),
(6, "Cuba");


INSERT INTO tblIdentificationType (typeId,  idDescription) VALUES
(1, "Cédula de Ciudadanía (CC)"),
(2, "Tarjeta de Identidad (TI)"),
(3, "Registro Civil (RC)"),
(4, "Cédula de Extranjería (CE)"),
(5, "Carné de Identidad (CI)"),
(6, "Documento Nacional de Identidad (DNI)");
