import assert from 'assert';
import { describe, it } from 'mocha';
import { Game, Move, Player } from '..';
import { gameToSGF } from '../SGF';

class NamedPlayer extends Player
{
    constructor(private name: string)
    {
        super();
    }

    getName(): string
    {
        return this.name;
    }
}

describe('SGF', () => {
    it('Generates SGF string for a Game', () => {
        const game = new Game(4);

        game.setPlayers([
            new NamedPlayer('Player A'),
            new NamedPlayer('Player B'),
        ]);

        game.start();

        game.move(new Move(0, 0), 0);
        game.move(new Move(0, 1), 1);
        game.move(new Move(2, 2), 0);

        game.setStartedAt(new Date('2023-12-08 12:00:00'));

        assert.strictEqual(
            gameToSGF(game),
            '(;FF[4]GM[11]AP[Alcalyn_SGF:0.0.0]PL[B]SZ[4]DT[2023-12-08]PB[Player A]PW[Player B];B[a1];W[b1];B[c3])',
        );
    });

    it('Generates SGF string for a Game won by resignation', () => {
        const game = new Game(4);

        game.setPlayers([
            new NamedPlayer('Player A'),
            new NamedPlayer('Player B'),
        ]);

        game.start();

        game.move(new Move(0, 0), 0);
        game.move(new Move(0, 1), 1);
        game.move(new Move(2, 2), 0);

        game.declareWinner(0, 'resign');

        game.setStartedAt(new Date('2023-12-08 12:00:00'));

        assert.strictEqual(
            gameToSGF(game),
            '(;FF[4]GM[11]AP[Alcalyn_SGF:0.0.0]PL[B]SZ[4]DT[2023-12-08]PB[Player A]PW[Player B]RE[B+Resign];B[a1];W[b1];B[c3])',
        );
    });

    it('Generates SGF string for a canceled Game', () => {
        const game = new Game(4);

        game.setPlayers([
            new NamedPlayer('Player A'),
            new NamedPlayer('Player B'),
        ]);

        game.start();

        game.cancel();

        game.setStartedAt(new Date('2023-12-08 12:00:00'));

        assert.strictEqual(
            gameToSGF(game),
            '(;FF[4]GM[11]AP[Alcalyn_SGF:0.0.0]PL[B]SZ[4]DT[2023-12-08]PB[Player A]PW[Player B]RE[Void];)',
        );
    });

    it('Generates SGF string for a game with a swap move', () => {
        const game = new Game(4);

        game.setPlayers([
            new NamedPlayer('Player A'),
            new NamedPlayer('Player B'),
        ]);

        game.start();

        game.move(new Move(1, 2), 0);
        game.move(new Move(1, 2), 1);
        game.move(new Move(0, 3), 0);

        game.setStartedAt(new Date('2023-12-08 12:00:00'));

        assert.strictEqual(
            gameToSGF(game),
            '(;FF[4]GM[11]AP[Alcalyn_SGF:0.0.0]PL[B]SZ[4]DT[2023-12-08]PB[Player A]PW[Player B];B[c2];W[swap-pieces];B[d1])',
        );
    });
});
