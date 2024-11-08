import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CreateTodoDto {
    @IsNotEmpty()
    @ApiProperty()
    task: string;
    
    @IsNotEmpty()
    @ApiProperty()
    isDone: number;
}