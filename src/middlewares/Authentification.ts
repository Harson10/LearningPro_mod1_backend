import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { JWT_SECRET } from '../config/env';

export const Authentification = 
  (
    req: Request, 
    res: Response, 
    next: NextFunction
  ): void | Response<any, Record<string, any>> => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Aucun Token touvé' });
    }

    jwt.verify(token, JWT_SECRET, (err) => {
      if (err) {
        return res.status(403).json({ message: 'Token invalide' });
      }

      next();
    });
};



// import jwt from 'jsonwebtoken';
// import { Request, Response, NextFunction } from 'express';
// import { JWT_SECRET } from '../config/env';

// const Authentification = (req: Request, res: Response, next: NextFunction) => {
//   const token = req.header('x-auth-token');
  
//   if (!token) {
//     return res.status(401).json({ message: 'Authentification requise' });
//   }

//   try {
//     const decoded = jwt.verify(token, JWT_SECRET);
//     (req as any).user = decoded; 
//     next();
//   } catch (error) {
//     return res.status(401).json({ message: 'Token invalide' });
//   }
// };

// export default Authentification;

