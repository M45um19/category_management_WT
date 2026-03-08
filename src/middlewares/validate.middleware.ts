import { Request, Response, NextFunction } from "express";
import { ZodTypeAny } from "zod";


export const validateBody = (schema: ZodTypeAny) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
  
      const formattedErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        formattedErrors[issue.path[0] as string] = issue.message;
      });

      res.status(400).json({ errors: formattedErrors });
      return; 
    }


    req.body = result.data;
    next();
  };
};