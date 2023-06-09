  import request from 'supertest';
  import express from 'express';
  import User from '../app/models/user.js';
  import dbClient from '../app/service/dbClient.js';
  import dotenv from 'dotenv';

  dotenv.config();
  // Création de l'application Express
  const app = express();
  // Définition de la route pour le endpoint /users
  app.get('/users', async (req, res, next) => {
    try {
      const users = await User.findAll();
      res.json(users);
    } catch (error) {
      next(error);
    }
  });
  // Définit un groupe de tests pour la méthode `findAll` du Model user
  describe('findAll', () => {
    // Teste si la méthode `findAll` renvoie tous les utilisateurs existants de la base de données, si elle est exécutée correctement
    it('devrait retourner tous les users', async () => {
      // Test de la requête HTTP GET '/users'
      const res = await request(app).get('/users');
      // Vérifie que le code de statut de la réponse est 200
      expect(res.status).toBe(200);
      // Vérifie que la réponse contient au moins un utilisateur
      expect(res.body.length).toBeGreaterThan(0);
    });
    // Teste si la méthode `findAll` affiche une erreur quand il y a un problème avec la base de données
    it('devrait afficher une erreur quand il y a un problème avec la BDD', async () => {
      // Sauvegarde la méthode `query` originale
      const originalQuery = dbClient.query;
      // Espionne la méthode `query` et la configure pour qu'elle renvoie une erreur
      dbClient.query = jest.fn().mockRejectedValue(new Error('Erreur BDD'));
      // Test de la requête HTTP GET '/users'
      const res = await request(app).get('/users');
      // Vérifie que le code de statut de la réponse est 500
      expect(res.status).toBe(500);
      // Rétablit la méthode `query` originale
      dbClient.query = originalQuery;
    });
  });