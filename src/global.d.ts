import type { Response } from 'express';

declare namespace Express {
    interface Response {
      locals: {
        user: string;
      };
    }
  }
