import assert from 'assert'
import {factorySpace} from 'micromark-factory-space'
import {
  markdownSpace,
  markdownLineEndingOrSpace
} from 'micromark-util-character'
import {codes} from 'micromark-util-symbol/codes.js'
import {types} from 'micromark-util-symbol/types.js'

var tasklistCheck = {tokenize: tokenizeTasklistCheck}

export const gfmTaskListItem = {
  text: {[codes.leftSquareBracket]: tasklistCheck}
}

function tokenizeTasklistCheck(effects, ok, nok) {
  var self = this

  return open

  function open(code) {
    assert(code === codes.leftSquareBracket, 'expected `[`')

    if (
      // Exit if there’s stuff before.
      self.previous !== codes.eof ||
      // Exit if not in the first content that is the first child of a list
      // item.
      !self._gfmTasklistFirstContentOfListItem
    ) {
      return nok(code)
    }

    effects.enter('taskListCheck')
    effects.enter('taskListCheckMarker')
    effects.consume(code)
    effects.exit('taskListCheckMarker')
    return inside
  }

  function inside(code) {
    if (markdownSpace(code)) {
      effects.enter('taskListCheckValueUnchecked')
      effects.consume(code)
      effects.exit('taskListCheckValueUnchecked')
      return close
    }

    if (code === codes.uppercaseX || code === codes.lowercaseX) {
      effects.enter('taskListCheckValueChecked')
      effects.consume(code)
      effects.exit('taskListCheckValueChecked')
      return close
    }

    return nok(code)
  }

  function close(code) {
    if (code === codes.rightSquareBracket) {
      effects.enter('taskListCheckMarker')
      effects.consume(code)
      effects.exit('taskListCheckMarker')
      effects.exit('taskListCheck')
      return effects.check({tokenize: spaceThenNonSpace}, ok, nok)
    }

    return nok(code)
  }
}

function spaceThenNonSpace(effects, ok, nok) {
  var self = this

  return factorySpace(effects, after, types.whitespace)

  function after(code) {
    const tail = self.events[self.events.length - 1]

    return tail &&
      tail[1].type === types.whitespace &&
      code !== codes.eof &&
      !markdownLineEndingOrSpace(code)
      ? ok(code)
      : nok(code)
  }
}
