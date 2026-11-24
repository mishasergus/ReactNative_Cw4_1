import { useEffect, useMemo, useRef, useState } from 'react';
import {
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useDifficulty, type Difficulty } from '../context/DifficultyContent';
import { useTheme } from '../context/ThemeContent';

export type Point = {
  x: number;
  y: number;
};

export type Direction = 'top' | 'bottom' | 'left' | 'right';

export class Snake {
  #limit = 15;
  isAlife: boolean;
  hasEaten: boolean;
  headX: number;
  headY: number;
  direction: Direction;
  snake: Point[] = [];
  food: Point;
  tail: Point;


  constructor() {
    this.direction = 'top';
    this.headX = Math.floor(this.#limit / 2);
    this.headY = Math.floor(this.#limit / 2);
    this.isAlife = true;
    this.hasEaten = false;

    this.snake = [{ x: this.headX, y: this.headY }];
    this.food = { x: 0, y: 0 };
    this.tail = this.snake[0];
    this.generateNewFood()
  }

  get limit(): number {
    return this.#limit;
  }

  get corm(): Point {
    return this.food;
  }

  get foodPosition(): Point {
    return this.food;
  }

  private randomCoord(): number {
    return Math.floor(Math.random() * this.#limit);
  }

  generateNewFood(): Point {
    if (this.snake.length >= this.#limit * this.#limit) {
      return this.food;
    }
    const freeCells: Point[] = [];
    for (let y = 0; y < this.#limit; y++) {
      for (let x = 0; x < this.#limit; x++) {
        if (!this.snake.some((segment) => segment.x === x && segment.y === y)) {
          freeCells.push({ x, y });
        }
      }
    }

    if (freeCells.length === 0) {
      return this.food;
    }

    this.food = freeCells[Math.floor(Math.random() * freeCells.length)];
    return this.food;
  }

  setDirection(nextDirection: Direction) {
    const opposite: Record<Direction, Direction> = {
      top: 'bottom',
      bottom: 'top',
      left: 'right',
      right: 'left',
    };

    if (opposite[this.direction] === nextDirection) {
      return;
    }

    this.direction = nextDirection;
  }

  move() {
    if (!this.isAlife) {
      return;
    }
    this.tail = { ...this.snake[this.snake.length - 1] };
    for (let i = this.snake.length - 1; i > 0; i--) {
      this.snake[i] = { ...this.snake[i - 1] };
    }
    if(this.hasEaten){
      this.hasEaten = false
      this.snake.push({ ...this.tail });
    }
    if (this.direction === 'top') {
      this.headY -= 1;
    } else if (this.direction === 'bottom') {
      this.headY += 1;
    } else if (this.direction === 'left') {
      this.headX -= 1;
    } else if (this.direction === 'right') {
      this.headX += 1;
    }
    if (
      this.headX < 0 ||
      this.headX >= this.#limit ||
      this.headY < 0 ||
      this.headY >= this.#limit
    ) {
      this.isAlife = false;
      return;
    }
    this.snake[0] = { x: this.headX, y: this.headY };
    this.snakeColissionCheck();
    this.foodColissionCheck();
    return this.snake;
  }

  snakeColissionCheck() {
    for (let i = this.snake.length - 1; i > 0; i--) {
      if (this.isColission(this.snake[i], this.snake[0])) {
        this.isAlife = false;
        return;
      }
    }
  }

  foodColissionCheck() {
    for (let i = 0; i < this.snake.length; i++) {
      if (this.isColission(this.snake[i], this.food)) {
        this.hasEaten = true;
        this.generateNewFood();
        return;
      }
    }
  }

  isColission(p1: Point, p2: Point) {
    return p1.x === p2.x && p1.y === p2.y;
  }
}

const CELL_SIZE = 20;

export type GameComponentProps = {
  difficulty?: Difficulty;
};

const TICK_MS: Record<Difficulty, number> = {
  light: 650,
  medium: 500,
  hard: 350,
};

export default function GameComponent() {
  const [game] = useState(() => new Snake());
  const snakeRef = useRef<Snake>(game);
  const recordedRunRef = useRef(false);
  const {difficulty, addRecord} = useDifficulty()!;
  const {theme} = useTheme()!;
  const isDark = theme === 'dark';
  const palette = isDark
    ? {
        background: '#101512',
        surface: '#1B241E',
        text: '#F4FFF7',
        muted: '#AAB8AD',
        border: '#344A39',
        boardBorder: '#344A39',
        boardCell: '#1B241E',
        boardLine: '#101512',
        control: '#253128',
        controlText: '#F4FFF7',
        snakeHead: '#79D25B',
        snakeBody: '#55B43D',
        food: '#FF6B6B',
      }
    : {
        background: '#EDF7E8',
        surface: '#FFFFFF',
        text: '#17331D',
        muted: '#607565',
        border: '#D9E8D4',
        boardBorder: '#B7CBB0',
        boardCell: '#EDF4E9',
        boardLine: '#D9E8D4',
        control: '#FFFFFF',
        controlText: '#17331D',
        snakeHead: '#16a34a',
        snakeBody: '#4ade80',
        food: '#ef4444',
      };
  const styles = createStyles(palette);

  const limit = game.limit;
  const [segments, setSegments] = useState<Point[]>(() => [...game.snake]);
  const [isAlive, setIsAlive] = useState<boolean>(game.isAlife);
  const [food, setFood] = useState<Point>(() => ({ ...game.foodPosition }));

  const gridCells = useMemo<Point[]>(() => {
    const cells: Point[] = [];
    for (let y = 0; y < limit; y++) {
      for (let x = 0; x < limit; x++) {
        cells.push({ x, y });
      }
    }
    return cells;
  }, [limit]);

  useEffect(() => {
    if (!isAlive) {
      if (!recordedRunRef.current) {
        recordedRunRef.current = true;
        addRecord({
          score: Math.max(0, segments.length - 1),
          difficulty,
        });
      }
      return;
    }

    const intervalId = setInterval(() => {
        const game = snakeRef.current;
        if (!game) return;

        const next = game.move();
        if (next) {
        setSegments([...next]);
        }
        setFood({ ...game.foodPosition });
        setIsAlive(game.isAlife);
    }, TICK_MS[difficulty]);

    return () => clearInterval(intervalId);
    }, [isAlive, difficulty, addRecord, segments.length]);

  const handleStep = (dir?: Direction) => {
    const game = snakeRef.current;
    if (!game) return;

    if (dir) {
      game.setDirection(dir);
    }
  };

  const getCellColor = (x: number, y: number): string => {
    if (segments[0]?.x === x && segments[0]?.y === y) {
      return palette.snakeHead;
    }
    if (segments.some((part) => part.x === x && part.y === y)) {
      return palette.snakeBody;
    }
    if (food.x === x && food.y === y) {
      return palette.food;
    }
    return palette.boardCell;
  };

  const restartGame = () => {
    snakeRef.current = new Snake();
    recordedRunRef.current = false;
    setSegments([...snakeRef.current.snake]);
    setFood({ ...snakeRef.current.foodPosition });
    setIsAlive(snakeRef.current.isAlife);
  };

  return (
    <View style={styles.container}>
      <View style={styles.statusCard}>
        <Text style={styles.statusLabel}>{isAlive ? 'Current score' : 'Run ended'}</Text>
        <Text style={styles.title}>
          {isAlive ? String(segments.length - 1) : 'Game Over'}
        </Text>
      </View>

      <FlatList
        data={gridCells}
        extraData={[segments, food, isAlive]}
        keyExtractor={(item) => `${item.x}-${item.y}`}
        numColumns={limit}
        scrollEnabled={false}
        contentContainerStyle={styles.board}
        renderItem={({ item }) => (
          <View
            style={[
              styles.cell,
              {
                backgroundColor: getCellColor(item.x, item.y),
                borderColor: palette.boardLine,
              },
            ]}
          />
        )}
      />

      {!isAlive && (
        <TouchableOpacity
          style={styles.restartBtn}
          onPress={restartGame}
          activeOpacity={0.7}
        >
          <Text style={styles.restartText}>Restart</Text>
        </TouchableOpacity>
      )}

      <View style={styles.dpad}>
        <TouchableOpacity
          style={styles.dpadBtn}
          onPress={() => handleStep('top')}
          activeOpacity={0.7}
        >
          <Text style={styles.dpadText}>↑</Text>
        </TouchableOpacity>

        <View style={styles.dpadRow}>
          <TouchableOpacity
            style={styles.dpadBtn}
            onPress={() => handleStep('left')}
            activeOpacity={0.7}
          >
            <Text style={styles.dpadText}>←</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.dpadBtn}
            onPress={() => handleStep('bottom')}
            activeOpacity={0.7}
          >
            <Text style={styles.dpadText}>↓</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.dpadBtn}
            onPress={() => handleStep('right')}
            activeOpacity={0.7}
          >
            <Text style={styles.dpadText}>→</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const createStyles = (palette: {
  background: string;
  surface: string;
  text: string;
  muted: string;
  border: string;
  boardBorder: string;
  boardCell: string;
  boardLine: string;
  control: string;
  controlText: string;
  snakeHead: string;
  snakeBody: string;
  food: string;
}) => StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingBottom: 96,
    backgroundColor: palette.background,
  },
  statusCard: {
    minWidth: 136,
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: palette.surface,
    paddingHorizontal: 18,
    paddingVertical: 8,
  },
  statusLabel: {
    color: palette.muted,
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: palette.text,
    marginTop: 2,
  },
  board: {
    borderWidth: 1,
    borderColor: palette.boardBorder,
    backgroundColor: palette.boardCell,
    borderRadius: 8,
    overflow: 'hidden',
  },
  cell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    borderWidth: 0.5,
  },
  dpad: {
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
    marginBottom: 8,
  },
  dpadRow: {
    flexDirection: 'row',
    gap: 6,
  },
  dpadBtn: {
    width: 48,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: palette.control,
  },
  dpadText: {
    fontSize: 20,
    fontWeight: '700',
    color: palette.controlText,
  },
  restartBtn: {
    minWidth: 112,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    backgroundColor: palette.snakeHead,
  },
  restartText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});