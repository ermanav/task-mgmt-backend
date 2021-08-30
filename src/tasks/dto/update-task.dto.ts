import { IsEnum } from 'class-validator';
import { TaskStatus } from '../task.taskstatus-enum';

export class UpdateTaskDto {
  @IsEnum(TaskStatus)
  status: TaskStatus;
}
