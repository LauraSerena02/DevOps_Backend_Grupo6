const countries = require('../../controllers/controllerCountry');
const { dataSource } = require('../../database');
const Country = require('../../entities/entityCountry');

jest.mock('../../database', () => ({
    dataSource: {
        getRepository: jest.fn()
    }
}));

describe('countries controller', () => {
    let req, res;

    beforeEach(() => {
        req = {};
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    });

    it('debería responder con una lista de países cuando la consulta es exitosa', async () => {
        // Crea datos de ejemplo para simular una respuesta exitosa
        const mockCountries = [
            { id: 1, name: 'Country1' },
            { id: 2, name: 'Country2' }
        ];

        // Mockea el repositorio para que devuelva los datos de ejemplo
        const mockRepository = { find: jest.fn().mockResolvedValue(mockCountries) };
        dataSource.getRepository.mockReturnValue(mockRepository);

        // Llama a la función
        await countries(req, res);

        // Verifica que la respuesta sea la esperada
        expect(dataSource.getRepository).toHaveBeenCalledWith(Country);
        expect(mockRepository.find).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockCountries);
    });

    it('debería responder con un error 500 si ocurre un error durante la consulta', async () => {
        // Mockea el repositorio para simular un error
        const mockRepository = { find: jest.fn().mockRejectedValue(new Error('Database error')) };
        dataSource.getRepository.mockReturnValue(mockRepository);

        // Llama a la función
        await countries(req, res);

        // Verifica que la respuesta sea la esperada en caso de error
        expect(dataSource.getRepository).toHaveBeenCalledWith(Country);
        expect(mockRepository.find).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Error al recuperar los paises' });
    });
});
