import * as jsondiffpatch from 'jsondiffpatch'
import DiffMatchPatch from 'diff-match-patch'

// const jsondiffpatch = jdf.create({
//   // objectHash: function(obj, index) {
//   //   // try to find an id property, otherwise just use the index in the array
//   //   return JSON.stringify(obj)
//   // },
//   // textDiff: {
//   //   minLength: 20
//   // }
// })
// console.log(jsondiffpatch)
const redColor = 'rgba(255, 79, 79, 0.3)'
const greenColor = 'rgba(26, 225, 91, 0.3)'

const textDiffType = Object.freeze({
  CONTEXT: 0,
  NEW: 1,
  OLD: 2
})

const deltaType = Object.freeze({
  ADD: 0,
  MOD: 1,
  DEL: 2,
  TEXT: 3,
  MOV: 4
})

function HighlightFactory(_new = true) {
  const obj = {
    type: 'highlight',
    attrs: {
      color: _new ? greenColor : redColor
    }
  }

  return obj
}

function TextFactory(text, textType) {
  const obj = {
    type: 'text',
    text: text,
    marks: []
  }

  switch (textType) {
    case textDiffType.NEW:
      obj.marks.push(new HighlightFactory(true))
      break
    case textDiffType.OLD:
      obj.marks.push(new HighlightFactory(false))
      break
    default:
      break
  }

  return obj
}

function getDeltaType(delta) {
  if (!Array.isArray(delta)) throw TypeError('delta must be array')

  if (delta.length === 1) {
    return deltaType.ADD
  }
  if (delta.length === 2) {
    return deltaType.MOD
  }
  if (delta.length === 3 && delta[2] === 0) {
    return deltaType.DEL
  }
  if (delta.length === 3 && delta[2] === 2) {
    return deltaType.TEXT
  }
  if (delta.length === 3 && delta[2] === 3) {
    return deltaType.MOV
  }
}

// eslint-disable-next-line no-unused-vars
function createText(doc, text, textDiffType) {
  doc.push(new TextFactory(text, textDiffType))
}

function insertMark(doc, key, _new = true) {
  // if doc is on the left, key start with '_'
  console.warn('insertMark:', JSON.parse(JSON.stringify(doc)), key, _new)
  if (_new === false) {
    // why slice?
    // key = key.slice(1)
  }
  if (Array.isArray(doc)) {
    if (_new === false) {
      // why slice?
      key = key.slice(1)
    }
    console.warn('ISARRAY! doc key:', key, doc[key])
    if (!doc[key]?.content?.[0]?.text) {
      if (doc[key].marks === undefined) doc[key].marks = []
      doc[key].marks.push(new HighlightFactory(_new))
    } else {
      const paragraph = doc[key].content[0]
      if (paragraph.marks === undefined) paragraph.marks = []
      paragraph.marks.push(new HighlightFactory(_new))
    }
  } else {
    console.warn('doc key:', key, doc)
    if (doc.marks === undefined) doc.marks = []
    doc.marks.push(new HighlightFactory(_new))
  }

  console.warn('mark result:', JSON.parse(JSON.stringify(doc)))
}

/**
  unidiff parser from benjamine/jsondiffpatch
  https://github.com/benjamine/jsondiffpatch/blob/master/src/formatters/base.js#L220

  [unidiff](https://github.com/google/diff-match-patch/wiki/Unidiff)
*/
// eslint-disable-next-line no-unused-vars
function parseTextDiff(value) {
  const output = []
  const lines = value.split('\n@@ ')
  console.log('PARSETEXTDIFF:', lines)

  for (let i = 0, l = lines.length; i < l; i++) {
    const line = lines[i]
    const lineOutput = {
      pieces: []
    }

    const location = /^(?:@@ )?[-+]?(\d+),(\d+)/.exec(line).slice(1)

    lineOutput.location = {
      line: location[0],
      chr: location[1]
    }

    const pieces = line.split('\n').slice(1)

    for (
      let pieceIndex = 0, piecesLength = pieces.length;
      pieceIndex < piecesLength;
      pieceIndex++
    ) {
      const piece = pieces[pieceIndex]

      if (!piece.length) {
        continue
      }

      const pieceOutput = {
        type: 'context'
      }

      if (piece.substr(0, 1) === '+') {
        pieceOutput.type = 'added'
      } else if (piece.substr(0, 1) === '-') {
        pieceOutput.type = 'deleted'
      }

      pieceOutput.text = piece.slice(1)
      lineOutput.pieces.push(pieceOutput)
    }

    output.push(lineOutput)
  }

  console.log('PARSETEXTDIFF output:', output)
  return output
}

function StackPayload(l, r, d) {
  return {
    left: l,
    right: r,
    delta: d
  }
}

// eslint-disable-next-line no-unused-vars
function countWord(doc) {
  if (doc.content === undefined) {
    console.warn('content is undefined', doc)
    return doc.length
  }
  let len = 0

  // BFS traverse
  const queue = [doc]
  while (queue.length) {
    const node = queue.shift()

    if (node.content) {
      queue.push(...node.content)
    } else {
      len += node.text.length
    }
  }

  return len
}

/**
 * @example:
 * const diff = new VersionDiff(prev, next)
 * const { leftDoc, rightDoc } = diff.markedDoc()
 * console.log(diff.wordCount)
 */
class VersionDiff {
  /**
   * find the diff from left to right
   * @param {[TipTapEditor]} left left blocks of TipTap Editor
   * @param {[TipTapEditor]} right right blocks of TipTap Editor
   */
  constructor(left, right) {
    this.left = left
    this.right = right
    this.marked = false
    this._delta = undefined
    this._wordCount = {
      new: 0,
      old: 0
    }
  }

  /**
   * return marked TipTap document
   * @returns { left: Object, right: Object }: marked TipTap doc
   */
  markedDoc() {
    if (!this.marked) this.mark()
    console.log('inVDiff:', this.left, this.right)
    return { leftDoc: this.left, rightDoc: this.right }
  }

  /**
   * basically what it does is:
   *  - BFS through the delta tree
   *  - mark the diff on left TipTap doc and right TipTap doc
   */
  mark() {
    const queue = []

    let leftParent
    let rightParent

    queue.unshift(new StackPayload(this.left, this.right, this.delta))
    if (queue[0].delta === undefined) return
    // eslint-disable-next-line no-constant-condition
    while (queue.length !== 0) {
      const { left: leftCur, right: rightCur, delta: deltaCur } = queue.shift()
      console.log('current queue payload:', JSON.parse(JSON.stringify(leftCur)), JSON.parse(JSON.stringify(rightCur)), JSON.parse(JSON.stringify(deltaCur)))
      for (const key of Object.keys(deltaCur)) {
        // skip type descriptor
        // skip changes on marks
        if (key === '_t' || key === 'marks') continue
        // console.warn('key, delta:', key, JSON.parse(JSON.stringify(deltaCur[key])))
        if (Array.isArray(deltaCur[key])) {
          switch (getDeltaType(deltaCur[key])) {
            case deltaType.ADD:
              // console.warn('mark, deltaType.ADD left right:', JSON.parse(key), JSON.parse(JSON.stringify(rightCur)))
              insertMark(rightCur, key, true)
              // this._wordCount.new += countWord(rightCur[key])
              break
            case deltaType.MOD:
              // TODO: generate MOD delta to test
              console.warn('mark, deltaType.MOD left right:', JSON.parse(JSON.stringify(leftCur)), JSON.parse(JSON.stringify(rightCur)))
              insertMark(leftCur, key, false)
              insertMark(rightCur, key, true)
              // this._wordCount.new += countWord(rightCur[key])
              // this._wordCount.old += countWord(leftCur[key])
              break
            case deltaType.DEL:
              console.warn('mark, deltaType.DEL left right:', leftCur, rightCur)
              insertMark(leftCur, key, false)
              // this._wordCount.old += countWord(leftCur[key.slice(1)])
              break
            case deltaType.TEXT:
              // clear content array
              console.warn('mark, deltaType.TEXT left right:', JSON.parse(JSON.stringify(leftCur)), JSON.parse(JSON.stringify(rightCur)))
              console.warn('mark, deltaType.TEXT before leftPar rightPar:', JSON.parse(JSON.stringify(leftParent)), JSON.parse(JSON.stringify(rightParent)))
              // eslint-disable-next-line no-case-declarations
              const leftCurIdx = Array.isArray(leftParent) ? leftParent.indexOf(leftCur) : 0
              // eslint-disable-next-line no-case-declarations
              const rightCurIdx = Array.isArray(leftParent) ? rightParent.indexOf(rightCur) : 0
              // leftParent.splice(0, leftParent.length)
              // rightParent.splice(0, rightParent.length)
              console.warn('mark, deltaType.TEXT leftPar rightPar:', JSON.parse(JSON.stringify(leftParent)), JSON.parse(JSON.stringify(rightParent)))
              // eslint-disable-next-line no-case-declarations
              const dmp = new DiffMatchPatch()
              // eslint-disable-next-line no-case-declarations
              const content = dmp.diff_main(leftCur.text, rightCur.text)
              dmp.diff_cleanupSemantic(content)
              console.log('diff content:', content)
              // eslint-disable-next-line no-case-declarations
              const leftParentMod = []
              // eslint-disable-next-line no-case-declarations
              const rightParentMod = []
              for (const piece of content) {
                // deleted
                const text = piece[1]
                if (piece[0] === -1) {
                  createText(leftParentMod, text, textDiffType.OLD)
                  // createText(rightParent, text, textDiffType.OLD)
                  // context
                } else if (piece[0] === 0) {
                  createText(leftParentMod, text, textDiffType.CONTEXT)
                  createText(rightParentMod, text, textDiffType.CONTEXT)
                } else if (piece[0] === 1) {
                  createText(rightParentMod, text, textDiffType.NEW)
                }
              }
              leftParent.splice(leftCurIdx, 1, ...leftParentMod)
              rightParent.splice(rightCurIdx, 1, ...rightParentMod)

              break
            case deltaType.MOV:
              // TODO: generate move delta to test
              // NOTE: may never happen
              console.log('move: ', deltaCur[key])
              break
          }

          // after handle delta, continue to next key.
          // no iterate on child needed
          continue
        } else {
          console.warn('not array')
        }
        console.log('KEY!!')
        // if (deltaCur[key] === undefined) break
        // if (leftCur[key] === undefined && rightCur[key] === undefined) break
        console.warn('ADD NEW PAYLOAD:', key, JSON.parse(JSON.stringify(leftCur[key])), JSON.parse(JSON.stringify(rightCur[key])), JSON.parse(JSON.stringify(deltaCur[key])))
        queue.unshift(new StackPayload(leftCur[key], rightCur[key], deltaCur[key]))

        // objIter(delta[key], prevParent, nextParent)
      }

      leftParent = leftCur
      rightParent = rightCur
      console.log('Update parents:', JSON.parse(JSON.stringify(leftParent)), JSON.parse(JSON.stringify(rightParent)))
      if (queue.length === 0) {
        break
      }
    }
  }

  /**
   * return a delta generated by jsondiffpatch
   */
  get delta() {
    // if not generated, generate delta
    if (!this._delta) {
      this._delta = jsondiffpatch.diff(this.left, this.right)
    }
    const a = this._delta
    console.log('GET DELTA!', a)
    return this._delta
  }

  get wordCount() {
    return this._wordCount
  }
}

export default VersionDiff
