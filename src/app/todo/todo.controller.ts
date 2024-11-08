import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Post, Put } from '@nestjs/common';
import { TodoService } from './todo.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { IndexTodoSwagger } from './swagger/index-todo.swagger';
import { CreateTodoSwagger } from './swagger/create-todo-swagger';
import { ShowTodoSwagger } from './swagger/show-todo-swagger';
import { UpdateTodoSwagger } from './swagger/update-todo-swagger';
import { BadRequestSwagger } from '../helper/swagger/bad-request.swagger';
import { NotFoundSwagger } from '../helper/swagger/not-found-swagger';

@Controller('api/v1/todos')
@ApiTags('todos')
export class TodoController {
    constructor(private readonly todoService: TodoService) { }

    @Get()
    @ApiOperation({ summary: 'Listar todas as tarefas' })
    @ApiResponse({
        status: 200,
        description: 'Tasks listadas',
        type: IndexTodoSwagger,
        isArray: true,
    })
    async index() {
        return await this.todoService.findAll();
    }

    @Post()
    @ApiOperation({ summary: 'Criar tarefas' })
    @ApiResponse({
        status: 201,
        description: 'Nova task adicionada com sucesso',
        type: CreateTodoSwagger
    })
    @ApiResponse({
        status: 400,
        description: 'Parâmetros inválidos',
        type: BadRequestSwagger
    })
    async create(@Body() body: CreateTodoDto) {
        return await this.todoService.create(body);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Retornar tarefa pelo ID ou falha se o id é inexistente' })
    @ApiResponse({
        status: 200,
        description: 'Retorno da task realizado com sucesso',
        type: ShowTodoSwagger
    })
    @ApiResponse({ 
        status: 404, 
        description: 'Task inexistente',
        type: NotFoundSwagger 
    })
    async show(@Param('id', new ParseUUIDPipe()) id: string) {
        return await this.todoService.findOneorFail(id);
    }

    @Put(':id')
    @ApiResponse({
        status: 200,
        description: 'Task atualizada com sucesso',
        type: UpdateTodoSwagger
    })
    @ApiResponse({ 
        status: 404, 
        description: 'Task inexistente',
        type: NotFoundSwagger 
    })
    @ApiResponse({
        status: 400,
        description: 'Parâmetros inválidos',
        type: BadRequestSwagger
    })
    @ApiOperation({ summary: 'Atualizar os dados de uma tarefa utilizando id existente' })
    async update(@Param('id', new ParseUUIDPipe()) id: string, @Body() body: UpdateTodoDto) {
        return await this.todoService.update(id, body);
    }


    @Delete(':id')
    @ApiOperation({ summary: 'Deletar tarefas por id existente' })
    @ApiResponse({ 
        status: 200, 
        description: 'Task deletada com sucesso' 
    })
    @ApiResponse({ 
        status: 404, 
        description: 'Task inexistente',
        type: NotFoundSwagger 
    })
    @HttpCode(HttpStatus.NO_CONTENT)
    async destroy(@Param('id', new ParseUUIDPipe()) id: string) {
        await this.todoService.deleteById(id);
    }
}
