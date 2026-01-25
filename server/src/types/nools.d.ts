declare module "nools" {

  interface Flow {
    getDefined(name: string): any;
    getSession(...facts: any[]): Session;
  }

  interface Session {
    assert(fact: any): Session;
    retract(fact: any): Session;
    modify(fact: any): Session;
    match(): Promise<void>;
    dispose(): void;
  }

  function compile(path: string, options?: { name?: string; scope?: Record<string, any> }): Flow;
  function deleteFlow(name: string): void;
  function deleteFlows(): void;

  export default {
    compile,
    deleteFlow,
    deleteFlows,
  };
}
