const incomeMethodPayments = require('../../controllers/controllerIncomeMethodPayment');
const { dataSource } = require('../../database');
const IncomeMethodPayment = require('../../entities/entityincomeMethodPayment');

jest.mock('../../database', () => ({
    dataSource: {
        getRepository: jest.fn()
    }
}));

describe('incomeMethodPayments controller', () => {
    let req, res;

    beforeEach(() => {
        req = {};
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    });

    it('debería responder con una lista de métodos de pago de ingresos cuando la consulta es exitosa', async () => {
        // Crea datos de ejemplo para simular una respuesta exitosa
        const mockIncomeMethodPayments = [
            { id: 1, name: 'Transferencia' },
            { id: 2, name: 'Efectivo' }
        ];

        // Mockea el repositorio para que devuelva los datos de ejemplo
        const mockRepository = { find: jest.fn().mockResolvedValue(mockIncomeMethodPayments) };
        dataSource.getRepository.mockReturnValue(mockRepository);

        // Llama a la función
        await incomeMethodPayments(req, res);

        // Verifica que la respuesta sea la esperada
        expect(dataSource.getRepository).toHaveBeenCalledWith(IncomeMethodPayment);
        expect(mockRepository.find).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockIncomeMethodPayments);
    });

    it('debería responder con error 500 si ocurre un error durante la consulta', async () => {
        // Mockea el repositorio para simular un error
        const mockRepository = { find: jest.fn().mockRejectedValue(new Error('Database error')) };
        dataSource.getRepository.mockReturnValue(mockRepository);

        // Llama a la función
        await incomeMethodPayments(req, res);

        // Verifica que la respuesta sea la esperada en caso de error
        expect(dataSource.getRepository).toHaveBeenCalledWith(IncomeMethodPayment);
        expect(mockRepository.find).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Error al recuperar los metodos de pago de ingresos' });
    });
});
