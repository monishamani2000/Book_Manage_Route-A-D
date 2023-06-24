import express, { Request, Response, NextFunction } from 'express';
const router = express.Router();
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();


router.post('/createbooks',async (req : Request,res :Response)=>{
    try {
        const payload = req.body;
    
        const newBook = await prisma.book.create({
          data: payload,
        });
    
        res.status(201).send({
          bookId: newBook.id,
          message: 'Book has been added successfully.',
        });
      } catch (error) {
        res.status(500).send({
          message: 'Internal Server Error',
        });
      }
});


//get the books
router.get('/books', async (req : Request, res  : Response) => {
    try {
      const books = await prisma.book.findMany();
      res.status(200).send({
        books,
        message:'Got the book names',
    });
    } catch (error) {
      res.status(500).send({
        message: 'Internal Server Error',
      });
    }
  });


  //get the particular id books
  router.get('/books/:id', async (req :Request, res :Response) => {
    const { id } = req.params;
  
    try {
      const book = await prisma.book.findUnique({
        where: { id: parseInt(id) },
      });
  
      if (book) {
        res.status(200).send({
            book,
            message:'Got the particular book'
        });
      } else {
        res.status(404).send({
          message: 'Book not found',
        });
      }
    } catch (error) {
      res.status(500).send({
        message: 'Internal Server Error',
      });
    }
  });


  //update the particular book 
  router.put('/books/:id', async (req :Request, res :Response) => {
    const { id } = req.params;
    const payload = req.body;
  
    try {
      const updatedBook = await prisma.book.update({
        where: { id: parseInt(id) },
        data: payload,
      });
  
      res.status(200).send({
        updatedBook,
        message:"Book updated"
    });
    } catch (error) {
      res.status(500).send({
        message: 'Internal Server Error',
      });
    }
  });


  // delete the particular book use id
  router.delete('/books/:id', async (req: Request, res : Response) => {
    const { id } = req.params;
  
    try {
      await prisma.book.delete({
        where: { id: parseInt(id) },
      });
  
      res.status(204).send({message:'Book has been deleted successfully'});
    } catch (error) {
      res.status(500).send({
        message: 'Internal Server Error',
      });
    }
  });


export default router; 



// books libaray page