import { TaskModel } from '../../core/infrastructure/task.model';
import { TaskDomain } from '../../core/domain/task.domain';

export class TaskService {
  async create(taskData: Omit<TaskDomain, 'id'>) {
    return await TaskModel.create(taskData);
  }

  async findAll() {
    return await TaskModel.find();
  }

  async findById(id: string) {
    return await TaskModel.findById(id);
  }

  async deleteById(id: string) {
    return await TaskModel.findByIdAndDelete(id);
  }

  async updateById(
    id: string,
    processData: Partial<Omit<TaskDomain, 'id'>>,
  ) {
    return await TaskModel.findByIdAndUpdate(id, processData, { new: true });
  }
}