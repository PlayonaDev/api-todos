import { Test, TestingModule } from '@nestjs/testing';
import { TodoController } from './todo.controller';
import { TodoService } from './todo.service';
import { TodoEntity } from './entity/todo.entity';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';

const TodoEntityList: TodoEntity[] = [
  new TodoEntity({ id: '1', task: 'task-1', isDone: 1}),
  new TodoEntity({ id: '2', task: 'task-2', isDone: 2}),
  new TodoEntity({ id: '3', task: 'task-3', isDone: 3}),
];

const newTodoEntity = new TodoEntity({ task: 'new-task', isDone: 0});

const updatedTodoEntity = new TodoEntity({ task: 'task-1', isDone: 1 });


describe('TodoController', () => {
  let todoController: TodoController;
  let todoService: TodoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TodoController],
      providers: [
        {
          provide: TodoService,
          useValue: {
            findAll: jest.fn().mockResolvedValue(TodoEntityList),
            create: jest.fn().mockResolvedValue(newTodoEntity),
            findOneorFail: jest.fn().mockResolvedValue(TodoEntityList[0]),
            update: jest.fn().mockResolvedValue(updatedTodoEntity),
            deleteById: jest.fn().mockReturnValue(undefined),
          },
        },
      ],
    }).compile();

  todoController = module.get<TodoController>(TodoController);
  todoService = module.get<TodoService>(TodoService);
});

it('should be defined', () => {
  expect(todoController).toBeDefined();
  expect(todoService).toBeDefined();
});

describe('index', () =>{
  it('should return a todo list entity sucessfully', async () => {
    //Act
    const result = await todoController.index();
    //Asset
    expect(result).toEqual(TodoEntityList);
    expect(typeof result).toEqual('object');
    expect(todoService.findAll).toHaveBeenCalledTimes(1);
  });

  it('should throw an expection', () => {
    // Arrange
    jest.spyOn(todoService, 'findAll').mockRejectedValueOnce(new Error());

    //Assert
    expect(todoController.index()).rejects.toThrowError();
  })
});

describe('store', () => {
  it('should create a new todo item sucessfully', async () =>{
    //Arrage
    const body: CreateTodoDto = {
      task: 'new-task',
      isDone: 0,
    }
    //Act
    const result = await todoController.create(body);

    //Asset
    expect(result).toEqual(newTodoEntity);
    expect(todoService.create).toHaveBeenCalledTimes(1);
    expect(todoService.create).toHaveBeenCalledWith(body);
  });

  it('should throw an expection', () => {
    //Arrage
    const body: CreateTodoDto = {
      task: 'new-task',
      isDone: 0,
    }

    jest.spyOn(todoService, 'create').mockRejectedValueOnce(new Error());

    expect(todoController.create(body)).rejects.toThrowError();
  })
});

describe('show', () => {
  it('should get a todo item sucessfully', async () => {
    const result = await todoController.show('1');

    expect(result).toEqual(TodoEntityList[0]);
    expect(todoService.findOneorFail).toHaveBeenCalledTimes(1);
    expect(todoService.findOneorFail).toHaveBeenCalledWith('1');
  });

  it('should throw an expection', () => {
    jest.spyOn(todoService, 'findOneorFail').mockRejectedValueOnce(new Error());

    expect(todoController.show('1')).rejects.toThrowError();
  });
});

describe('update', () => {
  it('should update a todo item sucessfully', async () => {
    //Arrange
    const body: UpdateTodoDto = {
      task: 'task-1',
      isDone: 1,
    } 
    //Act 
    const result = await todoController.update('1', body)

    //Assert
    expect(result).toEqual(updatedTodoEntity);
    expect(todoService.update).toHaveBeenCalledTimes(1);
    expect(todoService.update).toHaveBeenCalledWith('1', body);
  });

  it('should throw an expection', () => {
    const body: UpdateTodoDto = {
      task: 'task-1',
      isDone: 1,
    } 

    jest.spyOn(todoService, 'update').mockRejectedValueOnce(new Error());

    expect(todoController.update('1', body)).rejects.toThrowError();
  });
});

describe('destroy', () => {
  it('should remove a todo item sucessfully', async () => {
    //Act
    const result = await todoController.destroy('1')

    expect(result).toBeUndefined();
  });

  it('should throw an expection', () => {
    jest.spyOn(todoService, 'deleteById').mockRejectedValueOnce(new Error());

    expect(todoController.destroy('1')).rejects.toThrowError();
  })
} )
});
