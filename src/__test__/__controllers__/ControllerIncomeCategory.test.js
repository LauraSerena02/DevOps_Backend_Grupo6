// Importa la función que quieres probar
const incomeCategories = require('../../controllers/controllerIncomeCategory');
const { dataSource } = require('../../database');
const IncomeCategory = require('../../entities/entityIncomeCategory');

jest.mock('../../database', () => ({
    dataSource: {
        getRepository: jest.fn()
    }
}));

describe('incomeCategories controller', () => {
    let req, res;

    beforeEach(() => {
        req = {};
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    });

    it('debería responder con una lista de categorías de ingresos cuando la consulta es exitosa', async () => {
        // Crea datos de ejemplo para simular una respuesta exitosa
        const mockIncomeCategories = [
            { id: 1, name: 'Salario' },
            { id: 2, name: 'Inversiones' }
        ];

        // Mockea el repositorio para que devuelva los datos de ejemplo
        const mockRepository = { find: jest.fn().mockResolvedValue(mockIncomeCategories) };
        dataSource.getRepository.mockReturnValue(mockRepository);

        // Llama a la función
        await incomeCategories(req, res);

        // Verifica que la respuesta sea la esperada
        expect(dataSource.getRepository).toHaveBeenCalledWith(IncomeCategory);
        expect(mockRepository.find).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockIncomeCategories);
    });

    it('debería responder con error 500 si ocurre un error durante la consulta', async () => {
        // Mockea el repositorio para simular un error
        const mockRepository = { find: jest.fn().mockRejectedValue(new Error('Database error')) };
        dataSource.getRepository.mockReturnValue(mockRepository);

        // Llama a la función
        await incomeCategories(req, res);

        // Verifica que la respuesta sea la esperada en caso de error
        expect(dataSource.getRepository).toHaveBeenCalledWith(IncomeCategory);
        expect(mockRepository.find).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Error al recuperar las categorias de ingresos' });
    });
});
