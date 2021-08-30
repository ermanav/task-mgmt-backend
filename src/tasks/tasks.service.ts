import { Injectable, NotFoundException } from '@nestjs/common';
import { Task } from './task.entity';
import { TaskStatus } from './task.taskstatus-enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { TasksRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { User } from 'src/auth/user.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TasksRepository)
    private tasksRepository: TasksRepository,
  ) {}

  getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
    return this.tasksRepository.getTasks(filterDto, user);
  }

  createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    return this.tasksRepository.createTask(createTaskDto, user);
  }
  async getTaskById(id: string, user: User): Promise<Task> {
    const found = await this.tasksRepository.findOne({ where: { id, user } });

    if (!found) {
      throw new NotFoundException(`Task with id "${id}" not found`);
    }
    return found;
  }
  async deleteTaskById(id: string, user: User): Promise<void> {
    const deleted = await this.tasksRepository.delete({ id, user });
    if (deleted.affected === 0) {
      throw new NotFoundException(`The given id "${id}" not found`);
    }
  }
  async updateTaskById(
    id: string,
    status: TaskStatus,
    user: User,
  ): Promise<Task> {
    const element = await this.getTaskById(id, user);
    element.status = status;
    this.tasksRepository.save(element);
    return element;
  }
}
