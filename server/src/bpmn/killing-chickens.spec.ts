import { Test, TestingModule } from '@nestjs/testing';
import { ProcessService, TaskService, WorkflowModule } from '@customation/workflow';
import { ConfigModule } from '@nestjs/config';

describe('Killing Chickens BPMN Process', () => {

  let processService: ProcessService;
  let taskService: TaskService;
  let processInstanceId: string;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        await ConfigModule.forRoot({
          isGlobal: true,
        }),
        WorkflowModule.forRoot({
          flowableUrl: process.env.FLOWABLE_BASE_URL || 'http://localhost:8080/flowable-rest/service',
          username: process.env.FLOWABLE_USERNAME || 'admin',
          password: process.env.FLOWABLE_PASSWORD || 'test',
        }),
      ],
    }).compile();

    processService = module.get<ProcessService>(ProcessService);
    taskService = module.get<TaskService>(TaskService);
  });

  afterAll(async () => {
    // Cleanup: If the process is still running, you might want to delete it
    // This is optional depending on your Flowable configuration
  });

  it('should complete the full killing chickens process workflow', async () => {

    // Step 1: Start a new process instance
    const processInstance = await processService.startProcess({
      processDefinitionKey: 'killingChickens',
    });
    processInstanceId = processInstance.id;

    expect(processInstance).toBeDefined();
    expect(processInstance.id).toBeDefined();
    expect(processInstance.processDefinitionId).toBeDefined();
    expect(processInstance.suspended).toBe(false);
    expect(processInstance.endTime).toBeUndefined();

    // Step 2: Verify we're at the first task (doMyWork)
    const tasks = await taskService.getTasks({ processInstanceId });
    expect(tasks.length).toBe(1);

    const firstTask = tasks.find(t => t.taskDefinitionKey === 'doMyWork');
    expect(firstTask).toBeDefined();
    expect(firstTask!.taskDefinitionKey).toBe('doMyWork');
    expect(firstTask!.name).toBe('Do my work');

    // Step 3: Complete the first task
    await taskService.completeTask({ taskId: firstTask!.id });

    // Step 4: Verify we're now at the second task (killChickens)
    const tasksAfterFirst = await taskService.getTasks({ processInstanceId });
    expect(tasksAfterFirst.length).toBe(1);

    const secondTask = tasksAfterFirst.find(t => t.taskDefinitionKey === 'killChickens');
    expect(secondTask).toBeDefined();
    expect(secondTask!.taskDefinitionKey).toBe('killChickens');
    expect(secondTask!.name).toBe('Kill chickens');

    // Verify the first task is no longer active
    const firstTaskAfterCompletion = tasksAfterFirst.find(t => t.taskDefinitionKey === 'doMyWork');
    expect(firstTaskAfterCompletion).toBeUndefined();

    // Step 5: Complete the second task
    await taskService.completeTask({ taskId: secondTask!.id });

    // Step 6: Verify the process has ended by checking that no tasks remain
    const remainingTasks = await taskService.getTasks({ processInstanceId });
    expect(remainingTasks.length).toBe(0);

    // Note: getProcessInstance may return 404 for completed processes that have been archived
    // The absence of tasks confirms the process is complete
  });

  it('should handle process with business key', async () => {
    const businessKey = 'test-business-key-123';

    // Start process with business key
    const processInstance = await processService.startProcess({
      processDefinitionKey: 'killingChickens',
      businessKey,
    });
    processInstanceId = processInstance.id;

    expect(processInstance.businessKey).toBe(businessKey);

    // Complete first task
    const firstTasks = await taskService.getTasks({ processInstanceId });
    const firstTask = firstTasks.find(t => t.taskDefinitionKey === 'doMyWork');
    await taskService.completeTask({ taskId: firstTask!.id });

    // Complete second task
    const secondTasks = await taskService.getTasks({ processInstanceId });
    const secondTask = secondTasks.find(t => t.taskDefinitionKey === 'killChickens');
    await taskService.completeTask({ taskId: secondTask!.id });

    // Verify process ended by checking no tasks remain
    const remainingTasks = await taskService.getTasks({ processInstanceId });
    expect(remainingTasks.length).toBe(0);
  });
});
