export enum TaskPriority {
    BAJA = 'Baja',
    MEDIA = 'Media',
    ALTA = 'Alta'
}

export class TaskDomain { 
    constructor(
        public id: number,
        public title: string,
        public description: string,
        public isCompleted: boolean,
        public priority: TaskPriority
    ) { }
}
