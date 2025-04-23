export enum StoneColor {
  BLACK = 'BLACK',
  WHITE = 'WHITE',
}

export interface IIntersection {
  stone?: StoneColor
  hoshi?: boolean
  pendingKo?: boolean
  ko?: boolean
  forbidden?: StoneColor
  wasForbidden?: StoneColor
}

export class Board {
  intersections: IIntersection[]
  playingColor: StoneColor = StoneColor.BLACK
  lastPlayedIndex: number = -1
  prisoners: { [StoneColor.BLACK]: number; [StoneColor.WHITE]: number } = {
    [StoneColor.BLACK]: 0,
    [StoneColor.WHITE]: 0,
  }
  history: number[] = []

  constructor(public size: number) {
    this.intersections = this.createInitialBoard()
  }

  private createInitialBoard(): IIntersection[] {
    const hoshiGap = this.size < 10 ? 2 : 3
    const result: IIntersection[] = []

    for (let i = 0; i < this.size * this.size; i++) {
      const { x, y } = this.getCoordinatesFromIndex(i)
      const intersection: IIntersection = {}

      if (
        (x === hoshiGap && y === hoshiGap) || // bottom left
        (x === this.size - hoshiGap - 1 && y === hoshiGap) || // bottom left
        (x === hoshiGap && y === this.size - hoshiGap - 1) || // top left
        (x === this.size - hoshiGap - 1 && y === this.size - hoshiGap - 1) || // top right
        (this.size % 2 === 1 && x === hoshiGap && y === Math.floor(this.size / 2)) || // middle left
        (this.size % 2 === 1 && x === this.size - hoshiGap - 1 && y === Math.floor(this.size / 2)) || // middle right
        (this.size % 2 === 1 && x === Math.floor(this.size / 2) && y === this.size - hoshiGap - 1) || // bottom middle
        (this.size % 2 === 1 && x === Math.floor(this.size / 2) && y === hoshiGap) || // bottom middle
        (this.size % 2 === 1 && x === Math.floor(this.size / 2) && y === Math.floor(this.size / 2)) // middle middle
      ) {
        intersection.hoshi = true
      }

      result.push(intersection)
    }

    return result
  }

  private getCoordinatesFromIndex(index: number): { x: number; y: number } {
    if (index < 0 || index >= this.size * this.size) {
      throw new Error('[addStone]: invalid index value.')
    }

    return { x: index % this.size, y: Math.floor(index / this.size) }
  }

  public getIntersection(x: number, y: number): IIntersection {
    if (x < 0 || x >= this.size) {
      throw new Error('[getIntersection]: invalid x value.')
    }

    if (y < 0 || y >= this.size) {
      throw new Error('[getIntersection]: invalid y value.')
    }

    return this.intersections[y * this.size + x]
  }

  public addStone(index: number) {
    if (index < 0 || index >= this.size * this.size) {
      throw new Error('[addStone]: invalid index value.')
    }

    if (this.intersections[index].stone) {
      throw new Error('[addStone]: this intersection is already filled.')
    }

    if (this.intersections[index].forbidden === this.playingColor) {
      throw new Error('[addStone]: this move is forbidden.')
    }

    this.intersections[index].stone = this.playingColor
    this.intersections[index].ko = false
    this.intersections[index].pendingKo = false
    this.intersections[index].forbidden = undefined

    this.playingColor = this.playingColor === StoneColor.BLACK ? StoneColor.WHITE : StoneColor.BLACK
    this.lastPlayedIndex = index
    this.history.push(index)
    this.updateBoard()
  }

  private updateBoard() {
    if (this.lastPlayedIndex === -1) return

    const { x, y } = this.getCoordinatesFromIndex(this.lastPlayedIndex)
    const neighbors = this.getStoneNeighbors(x, y)
    const notEmptyNeighbors = neighbors.filter((neighbor) => neighbor.color && neighbor.color === this.playingColor)
    const oppositeColor = this.playingColor === StoneColor.BLACK ? StoneColor.WHITE : StoneColor.BLACK

    let allToCapture: Array<{ x: number; y: number }> = []
    let allForbidden: Array<{ x: number; y: number }> = []

    for (const neighbor of notEmptyNeighbors) {
      const toCapture = this.checkCapture(neighbor.x, neighbor.y, this.playingColor, [])

      allToCapture = [...allToCapture, ...toCapture]
    }

    if (allToCapture.length > 0) {
      this.prisoners[oppositeColor] = this.prisoners[oppositeColor] + allToCapture.length
    }

    for (const neighbor of neighbors) {
      const forbidden = this.checkForbidden(neighbor.x, neighbor.y, neighbor.color, this.playingColor, [])

      allForbidden = forbidden ? [...allForbidden, forbidden] : allForbidden
    }

    for (const elem of allToCapture) {
      this.intersections[elem.y * this.size + elem.x].stone = undefined

      if (allToCapture.length === 1) {
        this.intersections[elem.y * this.size + elem.x].forbidden = this.playingColor
        this.intersections[elem.y * this.size + elem.x].wasForbidden = this.playingColor
      }
    }

    for (const elem of allForbidden) {
      this.intersections[elem.y * this.size + elem.x].forbidden = this.playingColor
      this.intersections[elem.y * this.size + elem.x].wasForbidden = this.playingColor
    }

    this.removeUnforbidden()
  }

  private checkCapture(
    x: number,
    y: number,
    color: StoneColor,
    checked: Array<{ x: number; y: number }>,
    ignored?: Array<{ x: number; y: number }>,
  ): Array<{ x: number; y: number }> {
    if (!color) return []

    const neighbors = this.getStoneNeighbors(x, y)

    if (
      neighbors.some(
        (neighbor) =>
          neighbor.color === undefined &&
          !checked.some(({ x, y }) => x === neighbor.x && y === neighbor.y) &&
          !ignored?.some(({ x, y }) => x === neighbor.x && y === neighbor.y),
      )
    ) {
      return []
    }

    const alliedNeighbors = neighbors.filter(
      (neighbor) =>
        neighbor.color === color &&
        !checked.some(({ x, y }) => x === neighbor.x && y === neighbor.y) &&
        !ignored?.some(({ x, y }) => x === neighbor.x && y === neighbor.y),
    )

    if (alliedNeighbors.length === 0) {
      return [...checked, { x, y }]
    }

    let toCapture = [...checked, { x, y }]

    for (const neighbor of alliedNeighbors) {
      toCapture = this.checkCapture(neighbor.x, neighbor.y, color, toCapture, ignored)

      if (toCapture.length === 0) break
    }

    return toCapture
  }

  private checkForbidden(
    x: number,
    y: number,
    color: StoneColor | undefined,
    currentColor: StoneColor,
    checked: Array<{ x: number; y: number }>,
  ): { x: number; y: number } | undefined {
    const neighbors = this.getStoneNeighbors(x, y)
    const emptyNeighbors = neighbors.filter((neighbor) => !neighbor.color)
    const alliedNeighbors = neighbors.filter(
      (neighbor) =>
        neighbor.color === this.playingColor && !checked.some(({ x, y }) => x === neighbor.x && y === neighbor.y),
    )

    if (!color && emptyNeighbors.length === 0 && alliedNeighbors.length === 0) {
      return { x, y }
    }

    if (!color) {
      const canCapture = this.checkCapture(x, y, currentColor, [])

      if (canCapture.length) {
        return { x, y }
      }
    }

    if (color && emptyNeighbors.length === 1) {
      const canCapture = this.checkCapture(emptyNeighbors[0].x, emptyNeighbors[0].y, currentColor, checked)

      if (canCapture.length) {
        return { x: emptyNeighbors[0].x, y: emptyNeighbors[0].y }
      }
    }

    let forbidden = undefined
    let checkedStones = [...checked, { x, y }]

    if (color && emptyNeighbors.length === 0 && alliedNeighbors.length > 0) {
      for (const neighbor of alliedNeighbors) {
        forbidden = this.checkForbidden(neighbor.x, neighbor.y, currentColor, currentColor, checkedStones)

        checkedStones = [...checkedStones, { x: neighbor.x, y: neighbor.y }]

        if (forbidden) break
      }
    }

    return forbidden
  }

  private removeUnforbidden() {
    for (let i = 0; i < this.intersections.length; i++) {
      const { x, y } = this.getCoordinatesFromIndex(i)
      const color = this.intersections[i].forbidden || this.intersections[i].wasForbidden
      const oppositeColor = color === StoneColor.BLACK ? StoneColor.WHITE : StoneColor.BLACK

      if (color === undefined) continue

      const neighbors = this.getStoneNeighbors(x, y).filter((neighbor) => neighbor.color === oppositeColor)
      const captureColor = this.checkCapture(x, y, color, [])
      let captureOppositeColor: Array<{ x: number; y: number }> = []

      for (const neighbor of neighbors) {
        const capture = this.checkCapture(neighbor.x, neighbor.y, oppositeColor, [...captureOppositeColor, { x, y }])

        captureOppositeColor = [...captureOppositeColor, ...capture]
      }

      if (captureColor.length === 0 || captureOppositeColor.length > 0) {
        if (captureColor.length === 1 && captureOppositeColor.length === 2) {
          const intersection = this.getIntersection(captureOppositeColor[1].x, captureOppositeColor[1].y)

          if (this.intersections[i].pendingKo) {
            for (let j = 0; j < this.intersections.length; j++) {
              this.intersections[j].ko = false
            }
            this.intersections[i].ko = true
            this.intersections[i].pendingKo = false
            this.intersections[i].forbidden = color
            this.intersections[i].wasForbidden = color
          } else {
            this.intersections[i].ko = undefined
            this.intersections[i].forbidden = undefined
            intersection.pendingKo = true
          }
        } else {
          this.intersections[i].forbidden = undefined
        }
      } else if (
        this.intersections[i].wasForbidden &&
        !this.intersections[i].forbidden &&
        captureColor.length > 0 &&
        captureOppositeColor.length === 0
      ) {
        this.intersections[i].forbidden = color
      }
    }
  }

  private getStoneNeighbors(x: number, y: number): Array<{ x: number; y: number; color?: StoneColor }> {
    if (x < 0 || x >= this.size) {
      throw new Error('[checkStoneNeighbors]: invalid x value.')
    }

    if (y < 0 || y >= this.size) {
      throw new Error('[checkStoneNeighbors]: invalid y value.')
    }

    const result = []

    const topNeighbor = y === this.size - 1 ? undefined : this.getIntersection(x, y + 1)
    const rightNeighbor = x === this.size - 1 ? undefined : this.getIntersection(x + 1, y)
    const bottomNeighbor = y === 0 ? undefined : this.getIntersection(x, y - 1)
    const leftNeighbor = x === 0 ? undefined : this.getIntersection(x - 1, y)

    if (topNeighbor) result.push({ x, y: y + 1, color: topNeighbor.stone })
    if (rightNeighbor) result.push({ x: x + 1, y, color: rightNeighbor.stone })
    if (bottomNeighbor) result.push({ x, y: y - 1, color: bottomNeighbor.stone })
    if (leftNeighbor) result.push({ x: x - 1, y, color: leftNeighbor.stone })

    return result
  }

  public undo() {
    this.history.pop()
    this.intersections = this.createInitialBoard()
    this.playingColor = StoneColor.BLACK
    this.lastPlayedIndex = -1
    this.prisoners = { [StoneColor.BLACK]: 0, [StoneColor.WHITE]: 0 }

    const copy = [...this.history]
    this.history = []

    for (const index of copy) {
      this.addStone(index)
    }
  }
}
