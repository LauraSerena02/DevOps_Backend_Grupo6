
const { showRandomTip } = require('../../controllers/controllerTip'); 
const { dataSource } = require('../../database');
const Tip = require('../../entities/entityTip');


jest.mock('../../database', () => ({
    dataSource: {
        getRepository: jest.fn()
    }
}));

describe('showRandomTip controller', () => {
    let req, res;

    beforeEach(() => {
        req = {}; 
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    });

    it('debería devolver un consejo aleatorio cuando hay consejos disponibles', async () => {
        // Simula el repositorio
        const mockTipRepository = {
            count: jest.fn().mockResolvedValue(5), // Simula que hay 5 consejos
            find: jest.fn().mockResolvedValue([{ id: 1, text: 'Consejo aleatorio' }]) // Simula el consejo encontrado
        };
        dataSource.getRepository.mockReturnValue(mockTipRepository);

        // Llama a la función
        await showRandomTip(req, res);

        // Verifica que la respuesta sea la esperada
        expect(mockTipRepository.count).toHaveBeenCalled();
        expect(mockTipRepository.find).toHaveBeenCalledWith({ skip: expect.any(Number), take: 1 });
        expect(res.status).not.toHaveBeenCalled(); // No debe haber llamado a status si hay consejo
        expect(res.json).toHaveBeenCalledWith({ id: 1, text: 'Consejo aleatorio' });
    });

    it('debería devolver 404 si no hay consejos disponibles', async () => {
        const mockTipRepository = {
            count: jest.fn().mockResolvedValue(0), // Simula que no hay consejos
            find: jest.fn() // No se llamará
        };
        dataSource.getRepository.mockReturnValue(mockTipRepository);

        // Llama a la función
        await showRandomTip(req, res);

        // Verifica que la respuesta sea la esperada
        expect(mockTipRepository.count).toHaveBeenCalled();
        expect(mockTipRepository.find).not.toHaveBeenCalled(); // No se debe llamar a find
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: 'No hay consejos disponibles' });
    });

    it('debería devolver 404 si no se encuentra el consejo', async () => {
        const mockTipRepository = {
            count: jest.fn().mockResolvedValue(5), // Simula que hay consejos
            find: jest.fn().mockResolvedValue([]) // Simula que no se encontró el consejo
        };
        dataSource.getRepository.mockReturnValue(mockTipRepository);

        // Llama a la función
        await showRandomTip(req, res);

        // Verifica que la respuesta sea la esperada
        expect(mockTipRepository.count).toHaveBeenCalled();
        expect(mockTipRepository.find).toHaveBeenCalledWith({ skip: expect.any(Number), take: 1 });
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: 'Consejo no encontrado' });
    });

    it('debería devolver 500 si ocurre un error en la consulta', async () => {
        const mockTipRepository = {
            count: jest.fn().mockRejectedValue(new Error('Database error')), // Simula un error
            find: jest.fn() // No se llamará
        };
        dataSource.getRepository.mockReturnValue(mockTipRepository);

        // Llama a la función
        await showRandomTip(req, res);

        // Verifica que la respuesta sea la esperada
        expect(mockTipRepository.count).toHaveBeenCalled();
        expect(mockTipRepository.find).not.toHaveBeenCalled(); // No se debe llamar a find
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Error al obtener el consejo', details: 'Database error' });
    });
});
