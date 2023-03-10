  import request from 'supertest';
  import express from 'express';
  import Animal from '../app/models/animal.js';
  import dbClient from '../app/service/dbClient.js';
  import dotenv from 'dotenv';

  dotenv.config();
  // Création de l'application Express
  const app = express();
  // Définition de la route pour le endpoint /animals
  app.get('/animals', async (req, res, next) => {
    try {
      const animals = await Animal.findAll();
      res.json(animals);
    } catch (error) {
      next(error);
    }
  });
  // Définit un groupe de tests pour la méthode `findAll` du Model animal
  describe('findAll', () => {
    // Teste si la méthode `findAll` renvoie tous les animaux existants de la base de données, si elle est exécutée correctement
    it('devrait retourner tous les animals', async () => {
      // Test de la requête HTTP GET '/a animals'
      const res = await request(app).get('/animals');
      // Vérifie que le code de statut de la réponse est 200
      expect(res.status).toBe(200);
      // Vérifie que la réponse contient au moins un animal
      expect(res.body.length).toBeGreaterThan(0);
    });
    // Teste si la méthode `findAll` affiche une erreur quand il y a un problème avec la base de données
    it('devrait afficher une erreur quand il y a un problème avec la BDD', async () => {
      // Sauvegarde la méthode `query` originale
      const originalQuery = dbClient.query;
      // Espionne la méthode `query` et la configure pour qu'elle renvoie une erreur
      dbClient.query = jest.fn().mockRejectedValue(new Error('Erreur BDD'));
      // Test de la requête HTTP GET '/users'
      const res = await request(app).get('/animals');
      // Vérifie que le code de statut de la réponse est 500
      expect(res.status).toBe(500);
      // Rétablit la méthode `query` originale
      dbClient.query = originalQuery;
    });
  });