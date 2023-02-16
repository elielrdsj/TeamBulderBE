import express, { Request, Response } from 'express';
import sql from 'mssql';

interface PokeTeam {
  teamId: number;
  pokeIds: number[];
}

const router = express.Router();

router.get('/', async (req: Request, res : Response) => {
  try {
    const pool = await sql.connect('mssql://@DESKTOP-F80O0GA\SQLEXPRESS/poketeams-db');
    const result = await pool.request().query('SELECT * FROM PokeTeam');
    res.json(result.recordset);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/', async (req: Request, res : Response) => {
  const pokeTeam: PokeTeam = req.body;
  if (!pokeTeam.teamId || !pokeTeam.pokeIds) {
    res.status(400).json({ message: 'Invalid PokeTeam' });
  } else {
    try {
      const pool = await sql.connect('mssql://@DESKTOP-F80O0GA\SQLEXPRESS/poketeams-db');
      const result = await pool.request()
        .input('teamId', sql.Int, pokeTeam.teamId)
        .input('pokeIds', sql.VarChar, JSON.stringify(pokeTeam.pokeIds))
        .query('INSERT INTO PokeTeam (teamId, pokeIds) VALUES (@teamId, @pokeIds)');
      res.status(201).json(pokeTeam);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
});

router.delete('/poketeam/:teamId', async (req: Request, res : Response) => {
  try {
    const pokeTeam: PokeTeam = req.body;
    const pool = await sql.connect('mssql://@DESKTOP-F80O0GA\SQLEXPRESS/poketeams-db');

    const result = await pool.request()
      .input('teamId', sql.Int, pokeTeam.teamId)
      .query('DELETE FROM PokeTeam WHERE teamId = @teamId');

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ message: `PokeTeam with teamId ${pokeTeam.teamId} not found` });
    }

    return res.status(200).json({ message: `PokeTeam with teamId ${pokeTeam.teamId} deleted successfully` });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'An error occurred while deleting the PokeTeam' });
  }
});

module.exports = router;