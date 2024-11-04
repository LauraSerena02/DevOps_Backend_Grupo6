const { login, createUser, getUserProfile, updateUser } = require('../../controllers/controllerAuthentication');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { dataSource } = require('../../database');
const { generateToken, decodeToken } = require('../../utils/jwt');
const cloudinary = require("../../utils/cloudinary");

jest.mock('../../database.js');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');
jest.mock('../../utils/jwt.js');
jest.mock('../../utils/cloudinary.js');



describe('User Controller', () => {
  
  describe('login', () => {
    let mockRequest, mockResponse;

    beforeEach(() => {
      mockRequest = { body: { email: 'test@example.com', password: 'password123' }};
      mockResponse = { 
        status: jest.fn().mockReturnThis(), 
        json: jest.fn() 
      };
    });

    it('should return error if email or password is missing', async () => {
      mockRequest.body = {};
      await login(mockRequest, mockResponse);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Se requiere el email del usuario y la contraseña.' });
    });

    it('should return error if user is not found', async () => {
      dataSource.getRepository = jest.fn().mockReturnValue({ findOne: jest.fn().mockResolvedValue(null) });
      await login(mockRequest, mockResponse);
      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Usuario incorrecto' });
    });

    it('should return error if password does not match', async () => {
      const mockUser = { password: 'hashedPassword' };
      dataSource.getRepository = jest.fn().mockReturnValue({ findOne: jest.fn().mockResolvedValue(mockUser) });
      bcrypt.compare = jest.fn().mockResolvedValue(false);
      await login(mockRequest, mockResponse);
      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Contraseña incorrecta' });
    });

    it('should return token if login is successful', async () => {
      const mockUser = { userId: 1, password: 'hashedPassword' };
      dataSource.getRepository = jest.fn().mockReturnValue({ findOne: jest.fn().mockResolvedValue(mockUser) });
      bcrypt.compare = jest.fn().mockResolvedValue(true);
      generateToken.mockReturnValue('fakeToken');
      await login(mockRequest, mockResponse);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Login exitoso', userToken: 'fakeToken' });
    });
  });

  describe('createUser', () => {
    let mockRequest, mockResponse;

    beforeEach(() => {
      mockRequest = { body: { userName: 'John', userLastName: 'Doe', typeId: 1, idNumber: '123', email: 'test@example.com', countryId: 1, password: 'password', phone: '123456789' } };
      mockResponse = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    });

    it('should return error if required fields are missing', async () => {
      mockRequest.body = {};
      await createUser(mockRequest, mockResponse);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'El contenido no está completo' });
    });

    it('should create user successfully', async () => {
      dataSource.getRepository = jest.fn().mockReturnValue({
        findOne: jest.fn().mockResolvedValueOnce({}).mockResolvedValueOnce({}),
        save: jest.fn().mockResolvedValue({ userId: 1 })
      });
      bcrypt.hash = jest.fn().mockResolvedValue('hashedPassword');
      await createUser(mockRequest, mockResponse);
      expect(mockResponse.json).toHaveBeenCalledWith({ msg: "usuario agregado" });
    });
  });

  describe('getUserProfile', () => {
    let mockRequest, mockResponse;

    beforeEach(() => {
      mockRequest = { params: { token: 'fakeToken' } };
      mockResponse = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      decodeToken.mockReturnValue({ userId: 1 });
    });

    it('should return user profile if user is found', async () => {
      dataSource.getRepository = jest.fn().mockReturnValue({
        findOneBy: jest.fn().mockResolvedValueOnce({
          photoUser: 'user.jpg', userName: 'John', userLastName: 'Doe', idNumber: '123', phone: '123456789', email: 'test@example.com', typeId: 1, countryId: 1
        })
      });
      await getUserProfile(mockRequest, mockResponse);
      expect(mockResponse.json).toHaveBeenCalledWith(expect.objectContaining({ userName: 'John', userLastName: 'Doe' }));
    });

    it('should return error if user is not found', async () => {
      dataSource.getRepository = jest.fn().mockReturnValue({ findOneBy: jest.fn().mockResolvedValue(null) });
      await getUserProfile(mockRequest, mockResponse);
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Usuario no encontrado' });
    });
  });

  describe('updateUser', () => {
    let mockRequest, mockResponse;

    beforeEach(() => {
      mockRequest = { headers: { authorization: 'fakeToken' }, body: { userName: 'John', userLastName: 'Doe', typeId: 1, idNumber: '123', email: 'test@example.com', countryId: 1, phone: '123456789' } };
      mockResponse = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      jwt.decode = jest.fn().mockReturnValue({ userId: 1 });
    });

    it('should return error if required fields are missing', async () => {
      mockRequest.body = {};
      await updateUser(mockRequest, mockResponse);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'El contenido no está completo' });
    });

    it('should return error if user is not found', async () => {
      dataSource.getRepository = jest.fn().mockReturnValue({ findOneBy: jest.fn().mockResolvedValue(null) });
      await updateUser(mockRequest, mockResponse);
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Usuario no encontrado' });
    });

    it('should update user successfully', async () => {
      const mockUser = { userId: 1, photoUser: 'oldPhoto.jpg' };
      dataSource.getRepository = jest.fn().mockReturnValue({
        findOneBy: jest.fn().mockResolvedValue(mockUser),
        save: jest.fn().mockResolvedValue({})
      });
      bcrypt.hash = jest.fn().mockResolvedValue('hashedPassword');
      cloudinary.uploader.destroy = jest.fn().mockResolvedValue({});
      cloudinary.uploader.upload_stream = jest.fn().mockImplementation((cb) => cb(null, { secure_url: 'newPhoto.jpg' }));
      await updateUser(mockRequest, mockResponse);
      expect(mockResponse.json).toHaveBeenCalledWith({ msg: "Usuario actualizado" });
    });
  });

})