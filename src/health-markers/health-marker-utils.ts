type FunctionMap = {
    [key: string]: (...args: any[]) => any;
};

export class HealthMarkerUtil<T extends FunctionMap> {

    private static instance: HealthMarkerUtil<any> | null = null;

    private functions: T;

    private constructor(functions: T) {
        this.functions = functions;
    }

    static register<T extends FunctionMap>(functions: T): void {
        this.instance = new HealthMarkerUtil(functions);
    }

    static calculateScore(functionName: string, ...args: any[]): number {

        if (!this.instance) {
            throw new Error('No functions registered. Call register() first.');
        }

        const func = this.instance.functions[functionName];
        if (!func) {
            throw new Error(`Function '${functionName}' not found`);
        }

        return func(...args);
    }

    static getFunctions<T extends FunctionMap>(): T | null {
        return this.instance?.functions ?? null;
    }
}