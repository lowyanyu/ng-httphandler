export class HandleContext {
  constructor(init?: Partial<HandleContext>) {
    Object.assign(this, init);
  }
  time: number | any;
  name: string | any;
  url: string | any;
  status: number | any;
  errorCode: number | any;
  errorMessage: string | any;
  targetId?: number;
  targetName?: string;
  data?: {[key: string]: any};
}
